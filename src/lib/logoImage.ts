/**
 * Logo analysis and clean-up, done in the browser before upload.
 *
 * The site is dark and logos sit directly on the page (no plate), so a raw
 * logo file rarely works: it usually has a white box behind it and dark ink
 * that would vanish. For each upload this module:
 *
 *   1. finds a plain light or dark backdrop and removes it (soft edges, no halo),
 *   2. lightens ink that is too dark to read on the dark page,
 *   3. trims empty margins and caps the size at 800×400,
 *
 * and returns several finished "looks" so the admin can confirm or override
 * the recommended one. Everything is exported as PNG, so an uploaded SVG is
 * never served as SVG.
 */

const WORK_MAX_EDGE = 1200; // processing resolution cap; keeps the pixel loops fast
const OUT_MAX_W = 800;
const OUT_MAX_H = 400;

/**
 * Background removal maps "how far a pixel is from the backdrop colour"
 * (0 = backdrop, 1 = as far as possible) to opacity. Below ALPHA_LO it is
 * backdrop, above ALPHA_HI it is solid ink, in between it is an anti-aliased
 * edge that gets partial opacity with the backdrop colour un-mixed out of it.
 */
const ALPHA_LO = 0.1;
const ALPHA_HI = 0.6;

/** Ink below this relative luminance is hard to see on the dark page. */
const MIN_LUMINANCE = 0.14;
/** Lightness given to black ink when it is flipped (the site's off-white, not harsh pure white). */
const FLIPPED_MAX_L = 0.95;

export type LogoLook = 'adapted' | 'keepWhite' | 'white' | 'original';

export interface LogoVariant {
  look: LogoLook;
  blob: Blob;
  width: number;
  height: number;
}

export interface LogoAnalysis {
  /** What was found behind the logo. */
  backdrop: 'light' | 'dark' | 'transparent' | 'none';
  /** Dark ink was lightened in the adapted look. */
  lightened: boolean;
  /** The look judged best for this logo. */
  recommended: LogoLook;
  variants: LogoVariant[];
}

/* ── Colour helpers ─────────────────────────────────────────────────── */

const srgbToLinear = (v: number) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const LIN = new Float32Array(256).map((_, i) => srgbToLinear(i));
const lin = (v: number) => LIN[v <= 0 ? 0 : v >= 255 ? 255 : Math.round(v)];
const luminance = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

const smoothstep = (lo: number, hi: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
};

/** h in [0,6), s and l in [0,1] → rgb 0-255, written into `out`. */
const hslToRgb = (h: number, s: number, l: number, out: number[]) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 1) { r = c; g = x; }
  else if (h < 2) { r = x; g = c; }
  else if (h < 3) { g = c; b = x; }
  else if (h < 4) { g = x; b = c; }
  else if (h < 5) { r = x; b = c; }
  else { r = c; b = x; }
  out[0] = (r + m) * 255;
  out[1] = (g + m) * 255;
  out[2] = (b + m) * 255;
};

/* ── Step 1: what is behind the logo? ───────────────────────────────── */

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

interface PlainBackdrop {
  kind: 'light' | 'dark';
  r: number;
  g: number;
  b: number;
}
type Backdrop = { kind: 'transparent' | 'none' } | PlainBackdrop;

/**
 * A backdrop is a single plain colour around the edge of the image. Only
 * near-white and near-black ones count: a coloured field is usually part of
 * a badge-style logo and is kept.
 */
const findBackdrop = (data: Uint8ClampedArray, w: number, h: number): Backdrop => {
  const border = borderPixels(w, h);
  const clear = border.filter((p) => data[p * 4 + 3] < 128).length;
  if (clear > border.length * 0.1) return { kind: 'transparent' };

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
  if (top.n < border.length * 0.6) return { kind: 'none' }; // busy edges: a photo, not a plain backdrop

  const r = top.r / top.n, g = top.g / top.n, b = top.b / top.n;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (min >= 190) return { kind: 'light', r, g, b };
  if (max <= 60 && max - min <= 24) return { kind: 'dark', r, g, b };
  return { kind: 'none' };
};

/**
 * Smallest opacity a pixel could have if it were ink laid over the backdrop
 * ("colour to alpha"): 0 for the backdrop colour itself, 1 for a colour as
 * far from it as the channel range allows. Only ink darker than a light
 * backdrop (or lighter than a dark one) counts, so JPEG noise on the far side
 * of the backdrop colour is still backdrop.
 */
const distanceFromBackdrop = (data: Uint8ClampedArray, o: number, bg: PlainBackdrop) => {
  const ch =
    bg.kind === 'light'
      ? (c: number, k: number) => (c < k ? (k - c) / k : 0)
      : (c: number, k: number) => (c > k ? (c - k) / (255 - k) : 0);
  return Math.max(ch(data[o], bg.r), ch(data[o + 1], bg.g), ch(data[o + 2], bg.b));
};

/**
 * An enclosed backdrop-coloured area is a glow, gradient or pale fill inside
 * the logo (not a letter hole) when pale, nearly-backdrop colour still
 * surrounds it GRADIENT_DEPTH pixels out, along a fair share of its outline.
 */
const GRADIENT_DEPTH = 4;
const GRADIENT_REACH = 10;
const GRADIENT_SHARE = 0.25;
/** "Pale" for that test: close to the backdrop, unlike flat mid-tone ink such as grey text. */
const PALE_HI = 0.35;

/** What the image is made of, relative to its backdrop. */
interface BackdropPlan {
  /** Per-pixel distance from the backdrop colour, 0..1. */
  dist: Float32Array;
  /** Backdrop connected to the image edge: always removed. */
  outer: Uint8Array;
  /**
   * Crisp backdrop-coloured areas enclosed by the logo: the holes inside
   * letters, or white lettering on a badge. Removing them is a judgement call.
   * Enclosed glows and gradients are never listed here; they are left alone.
   */
  enclosed: Uint8Array;
  enclosedArea: number;
}

const planRemoval = (src: ImageData, bg: PlainBackdrop): BackdropPlan => {
  const { width: w, height: h, data } = src;
  const n = w * h;
  const dist = new Float32Array(n);
  for (let p = 0; p < n; p++) dist[p] = distanceFromBackdrop(data, p * 4, bg);

  const outer = new Uint8Array(n);
  const enclosed = new Uint8Array(n);
  const seen = new Uint8Array(n);
  const stack = new Int32Array(n);
  const members = new Int32Array(n);
  const stamp = new Int32Array(n); // which component last visited a soft pixel
  let enclosedArea = 0;

  /** Collect the 4-connected area of backdrop-coloured pixels containing `start`. */
  const collect = (start: number) => {
    let sp = 0, count = 0;
    const visit = (q: number) => {
      if (!seen[q] && dist[q] <= ALPHA_LO) {
        seen[q] = 1;
        stack[sp++] = q;
      }
    };
    seen[start] = 1;
    stack[sp++] = start;
    while (sp > 0) {
      const p = stack[--sp];
      members[count++] = p;
      const x = p % w;
      if (x > 0) visit(p - 1);
      if (x < w - 1) visit(p + 1);
      if (p >= w) visit(p - w);
      if (p < n - w) visit(p + w);
    }
    return count;
  };

  // Backdrop touching the image edge.
  for (const p of borderPixels(w, h)) {
    if (seen[p] || dist[p] > ALPHA_LO) continue;
    const count = collect(p);
    for (let i = 0; i < count; i++) outer[members[i]] = 1;
  }

  // Backdrop-coloured areas enclosed by ink.
  let id = 0;
  const frontier = new Int32Array(n);
  let fl = 0, onOutline = false;
  const isPale = (q: number) => dist[q] > ALPHA_LO && dist[q] < PALE_HI;
  const grow = (q: number) => {
    if (isPale(q) && stamp[q] !== id) {
      stamp[q] = id;
      frontier[fl++] = q;
    }
  };
  const edge = (q: number) => {
    if (dist[q] <= ALPHA_LO) return;
    onOutline = true;
    grow(q);
  };
  for (let start = 0; start < n; start++) {
    if (seen[start] || dist[start] > ALPHA_LO) continue;
    const count = collect(start);
    id++;

    // Measure the pale surround: walk outwards through pale pixels, ring by
    // ring. An anti-aliased edge runs out after a couple of rings; a glow or
    // pale fill is still going several rings out.
    let outline = 0, deep = 0;
    fl = 0;
    for (let i = 0; i < count; i++) {
      const p = members[i];
      const x = p % w;
      onOutline = false;
      if (x > 0) edge(p - 1);
      if (x < w - 1) edge(p + 1);
      if (p >= w) edge(p - w);
      if (p < n - w) edge(p + w);
      if (onOutline) outline++;
    }
    let from = 0;
    for (let step = 0; step < GRADIENT_REACH && from < fl; step++) {
      const to = fl;
      if (step >= GRADIENT_DEPTH) deep += to - from;
      for (let i = from; i < to; i++) {
        const p = frontier[i];
        const x = p % w;
        if (x > 0) grow(p - 1);
        if (x < w - 1) grow(p + 1);
        if (p >= w) grow(p - w);
        if (p < n - w) grow(p + w);
      }
      from = to;
    }
    if (deep > 0 && deep >= outline * GRADIENT_SHARE) continue; // glow / pale fill: part of the design

    for (let i = 0; i < count; i++) enclosed[members[i]] = 1;
    enclosedArea += count;
  }

  return { dist, outer, enclosed, enclosedArea };
};

/**
 * Remove the backdrop according to the plan. The outer backdrop always goes;
 * `clearEnclosed` also removes the crisp enclosed areas. Edges next to a
 * removed area fade out smoothly, with the backdrop colour un-mixed from the
 * ink so no halo is left. Pale fills and glows that are not edges stay solid.
 */
const applyRemoval = (src: ImageData, bg: PlainBackdrop, plan: BackdropPlan, clearEnclosed: boolean): ImageData => {
  const { width: w, height: h } = src;
  const n = w * h;
  const data = new Uint8ClampedArray(src.data);
  const { dist } = plan;
  const cleared = (p: number) => plan.outer[p] === 1 || (clearEnclosed && plan.enclosed[p] === 1);

  // Find the edge pixels to fade: in-between pixels reached from a removed
  // area. Past the first two pixels the walk only continues "uphill" (towards
  // ink), so it follows an anti-aliased edge of any width but stops at a flat
  // pale fill instead of dissolving it.
  const depth = new Uint8Array(n); // 0 = not an edge pixel
  const queue = new Int32Array(n);
  let head = 0, tail = 0;
  const isSoft = (q: number) => dist[q] > ALPHA_LO && dist[q] < ALPHA_HI;
  const seed = (q: number) => {
    if (depth[q] === 0 && isSoft(q)) {
      depth[q] = 1;
      queue[tail++] = q;
    }
  };
  for (let p = 0; p < n; p++) {
    if (!cleared(p)) continue;
    const x = p % w;
    if (x > 0) seed(p - 1);
    if (x < w - 1) seed(p + 1);
    if (p >= w) seed(p - w);
    if (p < n - w) seed(p + w);
  }
  let from = 0, next = 0;
  const grow = (q: number) => {
    if (depth[q] !== 0 || !isSoft(q)) return;
    if (next > 2 && dist[q] < dist[from] + 0.015) return;
    depth[q] = next;
    queue[tail++] = q;
  };
  while (head < tail) {
    const p = queue[head++];
    from = p;
    next = Math.min(255, depth[p] + 1);
    const x = p % w;
    if (x > 0) grow(p - 1);
    if (x < w - 1) grow(p + 1);
    if (p >= w) grow(p - w);
    if (p < n - w) grow(p + w);
  }

  for (let p = 0; p < n; p++) {
    const o = p * 4;
    if (cleared(p)) {
      data[o + 3] = 0;
    } else if (depth[p] !== 0) {
      const a = (dist[p] - ALPHA_LO) / (ALPHA_HI - ALPHA_LO);
      data[o] = (data[o] - (1 - a) * bg.r) / a;
      data[o + 1] = (data[o + 1] - (1 - a) * bg.g) / a;
      data[o + 2] = (data[o + 2] - (1 - a) * bg.b) / a;
      data[o + 3] = Math.round(data[o + 3] * a);
    }
  }
  return new ImageData(data, w, h);
};

/**
 * True when the logo looks like a solid coloured shape with backdrop-coloured
 * details inside it (white lettering on a red badge). Those details are part
 * of the design and read best kept, whereas the holes inside ordinary letters
 * must be cleared.
 */
const looksLikeBadge = (src: ImageData, plan: BackdropPlan): boolean => {
  const { width: w, height: h, data } = src;
  let ink = 0, darkNeutral = 0;
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let p = 0; p < w * h; p++) {
    if (plan.outer[p]) continue;
    const x = p % w, y = (p / w) | 0;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (plan.enclosed[p] || plan.dist[p] < ALPHA_HI) continue;
    ink++;
    const o = p * 4;
    const max = Math.max(data[o], data[o + 1], data[o + 2]), min = Math.min(data[o], data[o + 1], data[o + 2]);
    if ((max - min) / 255 < 0.15 && (max + min) / 510 < 0.35) darkNeutral++;
  }
  if (maxX < 0 || ink === 0) return false;
  const filled = ink + plan.enclosedArea;
  const solidity = filled / ((maxX - minX + 1) * (maxY - minY + 1));
  const enclosedShare = plan.enclosedArea / filled;
  // Mostly-black logos are flipped to white, which would swallow white details.
  return solidity >= 0.7 && enclosedShare >= 0.1 && enclosedShare <= 0.6 && darkNeutral / ink < 0.2;
};

/* ── Step 2: make dark ink readable on the dark page ────────────────── */

/** Shares of visible ink that are near-black and near-white. */
const neutralShares = (img: ImageData) => {
  const { data } = img;
  let total = 0, dark = 0, light = 0;
  for (let o = 0; o < data.length; o += 4) {
    const a = data[o + 3] / 255;
    if (a < 0.05) continue;
    const max = Math.max(data[o], data[o + 1], data[o + 2]);
    const min = Math.min(data[o], data[o + 1], data[o + 2]);
    const l = (max + min) / 510;
    total += a;
    if ((max - min) / 255 < 0.15) {
      if (l < 0.35) dark += a;
      else if (l > 0.75) light += a;
    }
  }
  return total === 0 ? { dark: 0, light: 0 } : { dark: dark / total, light: light / total };
};

/** Ink darker than this is a candidate for lightening (the effect fades in below it). */
const DARK_CEILING = MIN_LUMINANCE * 1.3;
const DARK_FLOOR = MIN_LUMINANCE * 0.7;
/** A dark area counts as "against the page" when at least this much of its outline is transparent. */
const EXPOSED_SHARE = 0.25;

/**
 * Mark the dark pixels that sit directly against the page. Dark lettering on
 * top of a lighter part of the logo (black text on a yellow emblem) already
 * has contrast and must stay dark; a dark wordmark on nothing would vanish
 * and must be lightened. Each connected dark area is judged by how much of
 * its outline borders transparency.
 */
const exposedDarkInk = (data: Uint8ClampedArray, w: number, h: number): Uint8Array => {
  const n = w * h;
  // 0 = not dark, 1 = dark (unvisited), 2 = dark (visited)
  const state = new Uint8Array(n);
  for (let p = 0; p < n; p++) {
    const o = p * 4;
    if (data[o + 3] > 0 && luminance(data[o], data[o + 1], data[o + 2]) < DARK_CEILING) state[p] = 1;
  }
  const exposed = new Uint8Array(n);
  const stack = new Int32Array(n);
  const members = new Int32Array(n);

  for (let start = 0; start < n; start++) {
    if (state[start] !== 1) continue;
    let sp = 0, count = 0, clear = 0, solid = 0;
    state[start] = 2;
    stack[sp++] = start;
    const look = (q: number) => {
      if (state[q] === 1) {
        state[q] = 2;
        stack[sp++] = q;
      } else if (state[q] === 0) {
        if (data[q * 4 + 3] < 64) clear++;
        else solid++;
      }
    };
    while (sp > 0) {
      const p = stack[--sp];
      members[count++] = p;
      const x = p % w;
      // The image edge counts as open page: trimmed logos touch it.
      if (x > 0) look(p - 1); else clear++;
      if (x < w - 1) look(p + 1); else clear++;
      if (p >= w) look(p - w); else clear++;
      if (p < n - w) look(p + w); else clear++;
    }
    if (clear + solid === 0 || clear / (clear + solid) >= EXPOSED_SHARE) {
      for (let i = 0; i < count; i++) exposed[members[i]] = 1;
    }
  }
  return exposed;
};

/**
 * Lighten ink that would disappear on the dark page, keeping hues:
 *  - black / grey ink is flipped (black → off-white, dark grey → light grey),
 *  - dark coloured ink (navy, deep green…) is lifted just far enough to read.
 * Only dark areas that sit against the page are touched (see exposedDarkInk).
 * `flipNeutrals: false` lifts blacks to grey instead of flipping them, for
 * logos where white details must stay distinct from them.
 */
const lightenDarkInk = (src: ImageData, flipNeutrals: boolean): { image: ImageData; changed: boolean } => {
  const { width: w, height: h } = src;
  const data = new Uint8ClampedArray(src.data);
  const exposed = exposedDarkInk(data, w, h);
  const rgb = [0, 0, 0];
  let changedWeight = 0, totalWeight = 0;

  for (let p = 0; p < w * h; p++) {
    const o = p * 4;
    const alpha = data[o + 3];
    if (alpha === 0) continue;
    totalWeight += alpha;
    if (!exposed[p]) continue;

    const r = data[o], g = data[o + 1], b = data[o + 2];
    const lum = luminance(r, g, b);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 510;
    const chroma = (max - min) / 255;
    const s = max === min ? 0 : chroma / (1 - Math.abs(2 * l - 1));
    let hue = 0;
    if (max !== min) {
      if (max === r) hue = ((g - b) / (max - min) + 6) % 6;
      else if (max === g) hue = (b - r) / (max - min) + 2;
      else hue = (r - g) / (max - min) + 4;
    }

    // Coloured ink: raise lightness until it clears the luminance floor.
    let lifted = l;
    if (lum < MIN_LUMINANCE) {
      let lo = l, hi = 0.8;
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        hslToRgb(hue, s, mid, rgb);
        if (luminance(rgb[0], rgb[1], rgb[2]) < MIN_LUMINANCE) lo = mid;
        else hi = mid;
      }
      lifted = hi;
    }
    // Neutral ink: mirror lightness around mid-grey, fading in as the ink gets
    // darker so near-threshold greys don't speckle.
    let flipped = lifted;
    if (flipNeutrals && l < 0.5) {
      const strength = 1 - smoothstep(DARK_FLOOR, DARK_CEILING, lum);
      flipped = l + (Math.min(FLIPPED_MAX_L, 1 - l) - l) * strength;
    }

    // Blend the two treatments by how colourful the ink is, so there is no hard seam.
    const colourful = smoothstep(0.08, 0.25, chroma);
    const target = flipped + (lifted - flipped) * colourful;
    if (Math.abs(target - l) < 0.004) continue;
    hslToRgb(hue, s, target, rgb);
    data[o] = rgb[0];
    data[o + 1] = rgb[1];
    data[o + 2] = rgb[2];
    if (Math.abs(target - l) > 0.05) changedWeight += alpha;
  }
  return { image: new ImageData(data, w, h), changed: totalWeight > 0 && changedWeight / totalWeight > 0.01 };
};

/**
 * One-colour version: every pixel becomes off-white. With a known backdrop,
 * opacity follows how far each pixel is from the backdrop colour everywhere,
 * so details inside an emblem show as cut-outs instead of one solid blob.
 * Without one (already-transparent files) the existing opacity is kept.
 */
const solidWhite = (src: ImageData, plan?: BackdropPlan): ImageData => {
  const data = new Uint8ClampedArray(src.data);
  for (let p = 0, o = 0; o < data.length; p++, o += 4) {
    if (plan) {
      const a = plan.outer[p] ? 0 : Math.min(1, Math.max(0, (plan.dist[p] - ALPHA_LO) / (ALPHA_HI - ALPHA_LO)));
      data[o + 3] = Math.round(data[o + 3] * a);
    }
    if (data[o + 3] === 0) continue;
    data[o] = 244;
    data[o + 1] = 241;
    data[o + 2] = 236;
  }
  return new ImageData(data, src.width, src.height);
};

/* ── Output ─────────────────────────────────────────────────────────── */

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

/** Trim empty margins, cap the size and encode as PNG. */
const exportVariant = async (look: LogoLook, img: ImageData): Promise<LogoVariant> => {
  const full = document.createElement('canvas');
  full.width = img.width;
  full.height = img.height;
  const fctx = full.getContext('2d');
  if (!fctx) throw new Error('Could not process the logo.');
  fctx.putImageData(img, 0, 0);

  const box = opaqueBounds(img) ?? { x: 0, y: 0, w: img.width, h: img.height };
  const scale = Math.min(1, OUT_MAX_W / box.w, OUT_MAX_H / box.h);
  const out = document.createElement('canvas');
  out.width = Math.max(1, Math.round(box.w * scale));
  out.height = Math.max(1, Math.round(box.h * scale));
  const octx = out.getContext('2d');
  if (!octx) throw new Error('Could not process the logo.');
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(full, box.x, box.y, box.w, box.h, 0, 0, out.width, out.height);

  const blob = await new Promise<Blob>((resolve, reject) =>
    out.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process the logo.'))), 'image/png')
  );
  return { look, blob, width: out.width, height: out.height };
};

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

/** Analyse a logo file and produce every look it can be shown in, with a recommendation. */
export const analyseLogo = async (file: Blob): Promise<LogoAnalysis> => {
  const img = await loadImage(file);
  // SVGs without width/height report 0×0; give them a sensible canvas.
  const w0 = img.naturalWidth || 800;
  const h0 = img.naturalHeight || 400;
  const s = Math.min(1, WORK_MAX_EDGE / Math.max(w0, h0));
  const w = Math.max(1, Math.round(w0 * s));
  const h = Math.max(1, Math.round(h0 * s));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not process the logo.');
  ctx.drawImage(img, 0, 0, w, h);
  const original = ctx.getImageData(0, 0, w, h);

  const backdrop = findBackdrop(original.data, w, h);
  const variants: Promise<LogoVariant>[] = [];
  let recommended: LogoLook = 'original';
  let lightened = false;

  if (backdrop.kind === 'light' || backdrop.kind === 'dark') {
    const plan = planRemoval(original, backdrop);
    const everywhere = applyRemoval(original, backdrop, plan, true);
    const hasEnclosed = plan.enclosedArea > w * h * 0.002;
    recommended = hasEnclosed && looksLikeBadge(original, plan) ? 'keepWhite' : 'adapted';

    const adapted = lightenDarkInk(everywhere, true);
    variants.push(exportVariant('adapted', adapted.image));
    lightened = adapted.changed;
    // Only worth offering when the logo actually has crisp enclosed details to keep.
    if (hasEnclosed) {
      const kept = lightenDarkInk(applyRemoval(original, backdrop, plan, false), false);
      variants.push(exportVariant('keepWhite', kept.image));
      if (recommended === 'keepWhite') lightened = kept.changed;
    }
    variants.push(exportVariant('white', solidWhite(original, plan)));
  } else if (backdrop.kind === 'transparent') {
    // Black and white ink side by side: flipping black would merge the two, so only lift it to grey.
    const shares = neutralShares(original);
    const adapted = lightenDarkInk(original, !(shares.dark > 0.1 && shares.light > 0.1));
    variants.push(exportVariant('adapted', adapted.image));
    lightened = adapted.changed;
    variants.push(exportVariant('white', solidWhite(original)));
    recommended = 'adapted';
  }
  variants.push(exportVariant('original', original));

  return {
    backdrop: backdrop.kind,
    lightened,
    recommended,
    variants: await Promise.all(variants),
  };
};
