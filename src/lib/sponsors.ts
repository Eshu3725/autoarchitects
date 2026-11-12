/**
 * Sponsors shown on the public Sponsors page and managed from the admin
 * dashboard (/admin/partners). Backed by the `sponsors` table and the
 * `sponsor-logos` storage bucket (see CREATE_SPONSORS_TABLE.sql).
 */
import { supabase } from '@/lib/supabase';
import { deleteStoredFile, deleteStoredFolder } from '@/lib/storage';
import { PARTNERS } from '@/data/club';

export type SponsorTier =
  | 'title'
  | 'major'
  | 'associate'
  | 'manufacturing'
  | 'technical'
  | 'media'
  | 'workshop'
  | 'co-sponsor';

/** Display order of tiers; `group` is the heading used on the Sponsors page. */
export const SPONSOR_TIERS: { id: SponsorTier; label: string; group: string }[] = [
  { id: 'title', label: 'Title', group: 'Title' },
  { id: 'major', label: 'Major', group: 'Major' },
  { id: 'associate', label: 'Associate', group: 'Associate' },
  { id: 'manufacturing', label: 'Manufacturing', group: 'Manufacturing' },
  { id: 'technical', label: 'Technical', group: 'Technical' },
  { id: 'media', label: 'Media partner', group: 'Media partners' },
  { id: 'workshop', label: 'Workshop', group: 'Workshop' },
  { id: 'co-sponsor', label: 'Co-sponsor', group: 'Co-sponsors' },
];

export const tierLabel = (t: SponsorTier) => SPONSOR_TIERS.find((x) => x.id === t)?.label ?? t;

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  logo_url: string | null;
  website: string | null;
  since: string | null;
  is_visible: boolean;
  display_order: number;
}

const tierIndex = (t: SponsorTier) => {
  const i = SPONSOR_TIERS.findIndex((x) => x.id === t);
  return i === -1 ? SPONSOR_TIERS.length : i;
};

/** Tier order first, then the admin's manual order, then name. */
export const sortSponsors = (list: Sponsor[]) =>
  [...list].sort(
    (a, b) => tierIndex(a.tier) - tierIndex(b.tier) || a.display_order - b.display_order || a.name.localeCompare(b.name)
  );

/** Group sorted sponsors under their tier headings, skipping empty tiers. */
export const groupByTier = (list: Sponsor[]) =>
  SPONSOR_TIERS.map((t) => ({ tier: t, sponsors: list.filter((s) => s.tier === t.id) })).filter(
    (g) => g.sponsors.length > 0
  );

/** The hard-coded partner list, used until the sponsors table exists or if it can't be reached. */
const STATIC_TIER_MAP: Record<string, SponsorTier> = {
  Title: 'title',
  Major: 'major',
  Manufacturing: 'manufacturing',
  Technical: 'technical',
  'Co-sponsors': 'co-sponsor',
};
export const STATIC_SPONSORS: Sponsor[] = PARTNERS.flatMap((group) =>
  group.names.map((name) => ({ name, tier: STATIC_TIER_MAP[group.tier] ?? 'associate' }))
).map((s, i) => ({
  id: `static-${i}`,
  ...s,
  logo_url: null,
  website: null,
  since: null,
  is_visible: true,
  display_order: i,
}));

const SPONSOR_COLUMNS = 'id, name, tier, logo_url, website, since, is_visible, display_order';

/** True when Supabase says the table hasn't been created yet. */
export const isMissingTable = (error: { code?: string; message: string }) =>
  error.code === '42P01' || error.code === 'PGRST205' || /does not exist|schema cache/i.test(error.message);

export const fetchSponsors = async (opts: { visibleOnly: boolean }) => {
  let query = supabase.from('sponsors').select(SPONSOR_COLUMNS);
  if (opts.visibleOnly) query = query.eq('is_visible', true);
  const { data, error } = await query;
  return { data: sortSponsors((data ?? []) as Sponsor[]), error };
};

/** Accepts "acme.com" or a full URL; returns a normalised https URL, null for blank, or throws. */
export const normalizeWebsite = (raw: string): string | null => {
  const v = raw.trim();
  if (!v) return null;
  const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    throw new Error('That website address doesn’t look right.');
  }
  if (!url.hostname.includes('.')) throw new Error('That website address doesn’t look right.');
  return url.toString();
};

/* ── Logos ──────────────────────────────────────────────────────────── */

export const LOGO_BUCKET = 'sponsor-logos';
const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'];
const MAX_SOURCE_BYTES = 10 * 1024 * 1024;

export const validateLogo = (file: File): string | null => {
  if (!LOGO_TYPES.includes(file.type)) return 'Please choose a PNG, JPG, WebP, GIF or SVG logo.';
  if (file.size > MAX_SOURCE_BYTES) return 'That file is too large. Maximum size is 10 MB.';
  return null;
};

/**
 * Upload an already-processed logo PNG (see analyseLogo in logoImage.ts) and
 * return its public URL. The pixel size goes in the filename so pages can
 * size the logo by its shape before the image has loaded; the timestamp
 * avoids stale CDN caches.
 */
export const uploadSponsorLogo = async (
  sponsorId: string,
  logo: { blob: Blob; width: number; height: number }
): Promise<string> => {
  const path = `${sponsorId}/${Date.now()}-${logo.width}x${logo.height}.png`;
  const { error } = await supabase.storage
    .from(LOGO_BUCKET)
    .upload(path, logo.blob, { contentType: 'image/png', cacheControl: '31536000', upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from(LOGO_BUCKET).getPublicUrl(path).data.publicUrl;
};

/** Pixel size of a logo, read back from its filename (null for logos uploaded before sizes were recorded). */
export const logoDimensions = (url: string): { width: number; height: number } | null => {
  const m = /-(\d+)x(\d+)\.png(?:\?|$)/.exec(url);
  if (!m) return null;
  const width = Number(m[1]);
  const height = Number(m[2]);
  return width > 0 && height > 0 ? { width, height } : null;
};

/**
 * Display size that gives every logo roughly the same visual weight: equal
 * area rather than equal height, so a square emblem isn't dwarfed by a long
 * wordmark (or the other way round), within height and width limits.
 */
export const balancedLogoSize = (aspect: number, area = 9600, maxHeight = 76, maxWidth = 250) => {
  let height = Math.sqrt(area / aspect);
  if (height > maxHeight) height = maxHeight;
  let width = height * aspect;
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspect;
  }
  return { width: Math.round(width), height: Math.round(height) };
};

export const deleteSponsorLogo = (url?: string | null) => deleteStoredFile(LOGO_BUCKET, url);
export const deleteAllSponsorLogos = (sponsorId: string) => deleteStoredFolder(LOGO_BUCKET, sponsorId);
