/**
 * Crew roster helpers shared by the public Crew page (/members) and the
 * admin dashboard: which sub-team a member belongs to, and member photos.
 */
import { supabase } from '@/lib/supabase';
import { SUBSYSTEMS, type SubsystemId } from '@/data/club';

export type CrewCategory = 'leadership' | 'technical' | 'operations';

export interface CrewMember {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user';
  designation?: string | null;
  year?: string | null;
  major?: string | null;
  bio?: string | null;
  category?: CrewCategory | null;
  domain?: SubsystemId | null;
  photo_url?: string | null;
}

/** Public profile columns. Never select `*` on users: it includes passwords. */
export const CREW_COLUMNS = 'id, name, email, role, designation, year, major, bio, category, domain, photo_url';
/** Columns that exist before ADD_MEMBER_DOMAIN_AND_PHOTOS.sql has been run. */
export const CREW_COLUMNS_LEGACY = 'id, name, email, role, designation, year, major, bio, category';

/**
 * Load members, falling back to the older column set if the migration hasn't run.
 *
 * - 'crew' (public Crew page): every role='user' member, plus admin accounts
 *   that have been given a domain. Admins without a domain are logins like a
 *   shared "Admin User" account, not crew, so they stay off the public page.
 * - 'all' (admin Manage Team): every account, admins included.
 */
export const fetchCrew = async (
  scope: 'crew' | 'all' = 'crew'
): Promise<{ data: CrewMember[]; error: Error | null; hasPhotoColumns: boolean }> => {
  let full = supabase.from('users').select(CREW_COLUMNS).order('name');
  if (scope === 'crew') full = full.or('role.eq.user,domain.not.is.null');
  const fullRes = await full;
  if (!fullRes.error) return { data: (fullRes.data ?? []) as CrewMember[], error: null, hasPhotoColumns: true };

  console.warn('Crew: domain/photo columns unavailable, run ADD_MEMBER_DOMAIN_AND_PHOTOS.sql.', fullRes.error);
  let legacyQuery = supabase.from('users').select(CREW_COLUMNS_LEGACY).order('name');
  if (scope === 'crew') legacyQuery = legacyQuery.eq('role', 'user');
  const legacy = await legacyQuery;
  return {
    data: (legacy.data ?? []) as CrewMember[],
    error: legacy.error ? new Error(legacy.error.message) : null,
    hasPhotoColumns: false,
  };
};

export const DOMAIN_OPTIONS = SUBSYSTEMS.map((s) => ({ id: s.id, label: s.team }));

export const domainLabel = (id?: string | null) => SUBSYSTEMS.find((s) => s.id === id)?.team;

/** Older rows have no `domain` column value, so infer it from the designation text. */
const DESIGNATION_PATTERNS: [SubsystemId, RegExp][] = [
  ['chassis', /chassis|\bcae\b/i],
  ['suspension', /suspension/i],
  ['steering', /steering/i],
  ['brakes', /brake/i],
  ['transmission', /transmission/i],
  ['operations', /operation/i],
];

export const resolveDomain = (m: {
  domain?: string | null;
  designation?: string | null;
  category?: string | null;
}): SubsystemId | null => {
  if (m.domain && SUBSYSTEMS.some((s) => s.id === m.domain)) return m.domain as SubsystemId;
  const text = m.designation ?? '';
  for (const [id, re] of DESIGNATION_PATTERNS) if (re.test(text)) return id;
  if (m.category === 'operations') return 'operations';
  return null;
};

/** Category follows from domain + leadership flag, so the two never disagree. */
export const categoryFor = (domain: SubsystemId | null, isLeadership: boolean): CrewCategory =>
  isLeadership ? 'leadership' : domain === 'operations' ? 'operations' : 'technical';

/* ── Photos ─────────────────────────────────────────────────────────── */

export const PHOTO_BUCKET = 'member-photos';
const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
const MAX_EDGE = 640;

/**
 * Downscale to at most 640px on the long edge and re-encode as JPEG so a
 * phone photo (often 4-8 MB) becomes ~100-200 KB before upload.
 */
const resizeImage = async (file: File): Promise<Blob> => {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process the image.');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process the image.'))), 'image/jpeg', 0.85)
  );
};

/** Returns an error message for an unusable file, or null if it's fine. */
export const validatePhoto = (file: File): string | null => {
  if (!file.type.startsWith('image/')) return 'Please choose an image file (JPG, PNG or WebP).';
  if (file.size > MAX_SOURCE_BYTES) return 'That image is too large. Maximum size is 15 MB.';
  return null;
};

/** Storage path of a photo, extracted from its public URL. */
const pathFromUrl = (url: string) => {
  const marker = `/object/public/${PHOTO_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length).split('?')[0]);
};

/** Upload a member photo and return its public URL. A fresh filename each time avoids stale CDN caches. */
export const uploadMemberPhoto = async (memberId: string, file: File): Promise<string> => {
  const blob = await resizeImage(file);
  const path = `${memberId}/${Date.now()}.jpg`;
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000', upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
};

/** Best-effort delete of a previously uploaded photo. */
export const deleteMemberPhoto = async (url?: string | null) => {
  const path = url ? pathFromUrl(url) : null;
  if (!path) return;
  const { error } = await supabase.storage.from(PHOTO_BUCKET).remove([path]);
  if (error) console.warn('Could not delete old member photo:', error);
};

/** Best-effort delete of every photo a member has, used when the member is removed. */
export const deleteAllMemberPhotos = async (memberId: string) => {
  const { data, error } = await supabase.storage.from(PHOTO_BUCKET).list(memberId);
  if (error || !data?.length) return;
  await supabase.storage.from(PHOTO_BUCKET).remove(data.map((f) => `${memberId}/${f.name}`));
};

export const initials = (name: string) =>
  name
    .replace(/\./g, ' ')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
