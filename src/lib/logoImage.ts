/**
 * Logo clean-up done in the browser before upload:
 *   1. rasterise (SVG included) so only PNGs are ever served,
 *   2. make a plain light background transparent,
 *   3. trim empty margins so the logo fills its tile,
 *   4. cap the size at 800×400.
 */

const WORK_MAX_EDGE = 1200; // processing resolution cap; keeps the pixel loops fast
const OUT_MAX_W = 800;
const OUT_MAX_H = 400;

/** Within this RGB distance of the background colour → fully transparent, and the fill spreads. */
const HARD_TOLERANCE = 32;
/** Up to this distance → partly transparent anti-aliased edge (the fill stops there). */
const SOFT_TOLERANCE = 96;
/** Only light backgrounds are removed; a dark or coloured backdrop is usually part of a badge logo. */
const MIN_BACKGROUND_CHANNEL = 190;

export interface ProcessedLogo {
  blob: Blob;
  /** True when a plain light background was found and made transparent. */
  backgroundRemoved: boolean;
}

const loadImage = (file: Blob) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(src);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error('Could not read that image. Try a PNG or JPG instead.'));
    };
    img.src = src;
  });

/** Indices of every pixel on the image border. */
const borderPixels = (w: number, h: number) => {
  const out: number[] = [];
  for (let x = 0; x < w; x++) {
    out.push(x);
    if (h > 1) out.push((h - 1) * w + x);
  }
  for (let y = 1; y < h - 1; y++) {
    out.push(y * w);
    if (w > 1) out.push(y * w + w - 1);
  }
  return out;
};

/**
 * If the border is mostly one light colour, flood-fill it from the edges and
 * make it transparent. Only background connected to the edge is removed, so
 * white shapes inside the logo survive. Returns a new ImageData, or null when
 * there is no plain light background to remove.
 */
const removeLightBackground = (src: ImageData): ImageData | null => {
  const { width: w, height: h } = src;
  const data = new Uint8ClampedArray(src.data);
  const border = borderPixels(w, h);

  // Already transparent around the edges? Nothing to remove.
  const clearEdge = border.filter((p) => data[p * 4 + 3] < 128).length;
  if (clearEdge > border.length * 0.1) return null;

  // Dominant border colour, bucketed to absorb JPEG noise.
  const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
  for (const p of border) {
    const o = p * 4;
    const key = ((data[o] >> 4) << 8) | ((data[o + 1] >> 4) << 4) | (data[o + 2] >> 4);
    const s = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    s.n++;
    s.r += data[o];
    s.g += data[o + 1];
    s.b += data[o + 2];
    buckets.set(key, s);
  }
  let top = { n: 0, r: 0, g: 0, b: 0 };
  for (const s of buckets.values()) if (s.n > top.n) top = s;
  if (top.n < border.length * 0.5) return null; // busy edges: a photo, not a plain backdrop
  const bg = { r: top.r / top.n, g: top.g / top.n, b: top.b / top.n };
  if (Math.min(bg.r, bg.g, bg.b) < MIN_BACKGROUND_CHANNEL) return null;

  const dist = (p: number) => {
    const o = p * 4;
    const dr = data[o] - bg.r;
    const dg = data[o + 1] - bg.g;
    const db = data[o + 2] - bg.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  // 0 = unvisited, 1 = background (spreads), 2 = soft edge (doesn't spread)
  const state = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  let sp = 0;
  for (const p of border) {
    if (state[p] === 0 && dist(p) <= HARD_TOLERANCE) {
      state[p] = 1;
      stack[sp++] = p;
    }
  }

  let removed = 0;
  const visit = (n: number) => {
    if (state[n] !== 0) return;
    const d = dist(n);
    if (d <= HARD_TOLERANCE) {
      state[n] = 1;
      stack[sp++] = n;
    } else if (d <= SOFT_TOLERANCE) {
      // Anti-aliased edge: partial alpha, and "un-mix" the background out of
      // the colour so no white halo is left around the logo.
      state[n] = 2;
      const o = n * 4;
      const a = (d - HARD_TOLERANCE) / (SOFT_TOLERANCE - HARD_TOLERANCE);
      data[o] = (data[o] - (1 - a) * bg.r) / a;
      data[o + 1] = (data[o + 1] - (1 - a) * bg.g) / a;
      data[o + 2] = (data[o + 2] - (1 - a) * bg.b) / a;
      data[o + 3] = Math.round(data[o + 3] * a);
    }
  };

  while (sp > 0) {
    const p = stack[--sp];
    data[p * 4 + 3] = 0;
    removed++;
    const x = p % w;
    if (x > 0) visit(p - 1);
    if (x < w - 1) visit(p + 1);
    if (p >= w) visit(p - w);
    if (p < w * (h - 1)) visit(p + w);
  }

  // If (almost) everything vanished, the "background" was the logo itself.
  if (removed > w * h * 0.98) return null;
  return new ImageData(data, w, h);
};

/** Bounding box of pixels that aren't (nearly) transparent. */
const opaqueBounds = (img: ImageData) => {
  const { width: w, height: h, data } = img;
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 12) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return maxX < 0 ? null : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
};

export const processLogo = async (file: Blob, opts: { removeBackground: boolean }): Promise<ProcessedLogo> => {
  const img = await loadImage(file);
  // SVGs without width/height report 0×0; give them a sensible canvas.
  const w0 = img.naturalWidth || 800;
  const h0 = img.naturalHeight || 400;
  const s = Math.min(1, WORK_MAX_EDGE / Math.max(w0, h0));
  const w = Math.max(1, Math.round(w0 * s));
  const h = Math.max(1, Math.round(h0 * s));

  const work = document.createElement('canvas');
  work.width = w;
  work.height = h;
  const ctx = work.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not process the logo.');
  ctx.drawImage(img, 0, 0, w, h);

  let pixels = ctx.getImageData(0, 0, w, h);
  let backgroundRemoved = false;
  if (opts.removeBackground) {
    const cleaned = removeLightBackground(pixels);
    if (cleaned) {
      pixels = cleaned;
      ctx.putImageData(cleaned, 0, 0);
      backgroundRemoved = true;
    }
  }

  // Trim empty margins (from the removed background or an already-transparent PNG).
  const box = opaqueBounds(pixels) ?? { x: 0, y: 0, w, h };
  const scale = Math.min(1, OUT_MAX_W / box.w, OUT_MAX_H / box.h);
  const out = document.createElement('canvas');
  out.width = Math.max(1, Math.round(box.w * scale));
  out.height = Math.max(1, Math.round(box.h * scale));
  const octx = out.getContext('2d');
  if (!octx) throw new Error('Could not process the logo.');
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(work, box.x, box.y, box.w, box.h, 0, 0, out.width, out.height);

  const blob = await new Promise<Blob>((resolve, reject) =>
    out.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process the logo.'))), 'image/png')
  );
  return { blob, backgroundRemoved };
};
