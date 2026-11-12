import { supabase } from '@/lib/supabase';

/** Object path inside `bucket`, extracted from one of its public URLs. */
export const storagePathFromUrl = (bucket: string, url: string) => {
  const marker = `/object/public/${bucket}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length).split('?')[0]);
};

/** Best-effort delete of one file, given its public URL. */
export const deleteStoredFile = async (bucket: string, url?: string | null) => {
  const path = url ? storagePathFromUrl(bucket, url) : null;
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.warn(`Could not delete ${bucket}/${path}:`, error);
};

/** Best-effort delete of every file in a folder (one folder per record). */
export const deleteStoredFolder = async (bucket: string, folder: string) => {
  const { data, error } = await supabase.storage.from(bucket).list(folder);
  if (error || !data?.length) return;
  await supabase.storage.from(bucket).remove(data.map((f) => `${folder}/${f.name}`));
};
