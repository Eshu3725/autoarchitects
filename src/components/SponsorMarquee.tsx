import { useEffect, useRef, useState, type FocusEvent, type MouseEvent, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';
import { balancedLogoSize, logoDimensions, tierLabel, type Sponsor } from '@/lib/sponsors';

/** Each copy of the row needs enough logos to overfill wide screens, or the loop shows a gap. */
const MIN_LOGOS_PER_HALF = 10;
/** How much wider than the screen one copy must be, so a logo and its twin are never on screen together. */
const SPARE_WIDTH = 360;
const MAX_GROW = 8;

/** Resting drift, px per second. */
const CRUISE = 64;
const MAX_SPEED = 1100;
/** Speed added per pixel of page scroll: scrolling makes the lane surge the same way. */
const SCROLL_KICK = 7;
/** Seconds to settle back to cruising speed, and to brake under the pointer. */
const SETTLE = 0.7;
const BRAKE = 0.22;
/** Logos lean into the direction of travel once the lane is moving faster than this. */
const LEAN_FROM = 120;
const LEAN_PER_DEG = 110;
const MAX_LEAN = 7;
/** Pixels the pointer must travel before a press becomes a drag (so taps still open links). */
const DRAG_SLOP = 6;
/** Spacing of the major ticks on the rails; they slide by one period and repeat. */
const RAIL_PERIOD = 40;

const mod = (n: number, m: number) => ((n % m) + m) % m;
const clamp = (n: number, limit: number) => Math.max(-limit, Math.min(limit, n));
const pad = (n: number) => String(n).padStart(2, '0');

type LogoSponsor = Pick<Sponsor, 'name' | 'logo_url' | 'website'>;

/**
 * A sponsor's logo sitting directly on the page, with no plate behind it.
 * Logos are cleaned up for the dark site on upload (background removed, dark
 * ink lightened) and sized here by their shape so they carry equal weight.
 * Sponsors without a logo show their name as a wordmark.
 */
export function SponsorLogo({ sponsor, focusable = true }: { sponsor: LogoSponsor; focusable?: boolean }) {
  let body;
  if (sponsor.logo_url) {
    const dims = logoDimensions(sponsor.logo_url);
    const size = dims && balancedLogoSize(dims.width / dims.height);
    body = (
      <img
        src={sponsor.logo_url}
        alt={sponsor.name}
        loading="lazy"
        draggable={false}
        width={size?.width}
        height={size?.height}
        // --logo-scale shrinks every logo together on small screens.
        style={
          size && {
            width: `calc(${size.width}px * var(--logo-scale, 1))`,
            height: `calc(${size.height}px * var(--logo-scale, 1))`,
          }
        }
        className={cn('block object-contain', !size && 'h-12 sm:h-14 w-auto max-w-[11rem] sm:max-w-[14rem]')}
      />
    );
  } else {
    body = (
      <span className="block max-w-[13rem] sm:max-w-[16rem] font-display font-extrabold italic uppercase text-foreground/85 text-xl sm:text-2xl leading-[0.95] text-center line-clamp-2">
        {sponsor.name}
      </span>
    );
  }

  return sponsor.website ? (
    <a
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer sponsored"
      title={sponsor.name}
      draggable={false}
      tabIndex={focusable ? undefined : -1}
      className="block opacity-90 hover:opacity-100 hover:scale-105 transition duration-300 focus-modern"
    >
      {body}
    </a>
  ) : (
    <div title={sponsor.name} className="opacity-90">
      {body}
    </div>
  );
}

/** Small dark tile for the dashboard: shows a logo exactly as it sits on the site's background. */
export function SponsorLogoThumb({ sponsor, className }: { sponsor: Pick<Sponsor, 'name' | 'logo_url'>; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center bg-background border border-white/10 p-2 overflow-hidden', className)}>
      {sponsor.logo_url ? (
        <img src={sponsor.logo_url} alt={sponsor.name} loading="lazy" className="max-h-full max-w-full object-contain" />
      ) : (
        <span className="font-display font-extrabold italic uppercase text-foreground/70 text-xs leading-none text-center line-clamp-2">
          {sponsor.name}
        </span>
      )}
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

const ITEM_CLASS = 'flex items-center h-24 sm:h-28 px-6 sm:px-10';

/** Everything the animation loop tracks between frames. Kept out of React state so a frame never re-renders. */
interface Motion {
  /** Distance travelled, px. Unbounded; wrapped to one copy's width when drawn. */
  x: number;
  /** Speed, px/s. Positive moves the logos left. */
  v: number;
  dir: 1 | -1;
  /** Width of one copy of the row, and of the visible stage. */
  half: number;
  width: number;
  /** Centre of each logo, measured from the start of its copy. */
  centres: number[];
  active: number;
  lean: number;
  placed: boolean;
  hover: boolean;
  focus: boolean;
  /** Position to glide to (keyboard focus brings its logo to the centre). */
  seek: number | null;
  press: { id: number; startX: number; startPos: number; lastX: number; lastT: number } | null;
  dragging: boolean;
  /** A drag just ended: swallow the click it would otherwise produce. */
  moved: boolean;
}

/**
 * One row of logos that never wraps. It drifts on its own, surges and changes
 * direction with page scroll, brakes under the pointer and can be dragged or
 * flung. Whichever logo is crossing the centre mark is "locked on": enlarged,
 * bracketed, and named in the readout underneath.
 */
function SponsorLane({ sponsors, className }: { sponsors: Sponsor[]; className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const railTopRef = useRef<HTMLSpanElement>(null);
  const railBottomRef = useRef<HTMLSpanElement>(null);
  const motion = useRef<Motion>({
    x: 0,
    v: CRUISE,
    dir: 1,
    half: 0,
    width: 0,
    centres: [],
    active: -1,
    lean: 0,
    placed: false,
    hover: false,
    focus: false,
    seek: null,
    press: null,
    dragging: false,
    moved: false,
  });

  // Extra copies added if the measured row turns out narrower than the screen.
  const [grow, setGrow] = useState(1);
  const [active, setActive] = useState(0);

  const repeats = Math.max(1, Math.ceil(MIN_LOGOS_PER_HALF / sponsors.length)) * grow;
  const half = Array.from({ length: repeats }, () => sponsors).flat();
  const count = half.length;
  const activeSlot = active % count;
  const current = half[activeSlot];

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    const railTop = railTopRef.current;
    const railBottom = railBottomRef.current;
    if (!stage || !track || !railTop || !railBottom) return;
    const s = motion.current;

    const draw = () => {
      if (!s.half) return;
      // The point of the row that sits on the centre mark. It is always shown from
      // the middle copy, so the copies either side cover both edges of the screen.
      const centre = mod(s.x + s.width / 2, s.half);
      track.style.transform = `translate3d(${s.width / 2 - s.half - centre}px,0,0)`;
      railTop.style.transform = `translate3d(${-mod(s.x, RAIL_PERIOD)}px,0,0)`;
      // The lower rail runs at half speed for a little depth.
      railBottom.style.transform = `translate3d(${-mod(s.x * 0.5, RAIL_PERIOD)}px,0,0)`;

      const over = Math.max(Math.abs(s.v) - LEAN_FROM, 0);
      const lean = Math.round(Math.sign(s.v) * Math.min(over / LEAN_PER_DEG, MAX_LEAN) * 10) / 10;
      if (lean !== s.lean) {
        s.lean = lean;
        track.style.setProperty('--lean', `${lean}deg`);
      }

      // Which logo is nearest the centre mark?
      let slot = 0;
      let best = Infinity;
      for (let i = 0; i < s.centres.length; i++) {
        const d = Math.abs(s.centres[i] - centre);
        const dist = Math.min(d, s.half - d);
        if (dist < best) {
          best = dist;
          slot = i;
        }
      }
      if (slot !== s.active) {
        s.active = slot;
        setActive(slot);
      }
    };

    const measure = () => {
      const items = track.children;
      const n = items.length / 3;
      const first = items[0] as HTMLElement | undefined;
      const twin = items[n] as HTMLElement | undefined;
      if (!first || !twin) return;
      s.width = stage.clientWidth;
      s.half = twin.offsetLeft - first.offsetLeft;
      s.centres = Array.from({ length: n }, (_, i) => {
        const el = items[i] as HTMLElement;
        return el.offsetLeft + el.offsetWidth / 2;
      });
      if (!s.half) return;
      if (s.half < s.width + SPARE_WIDTH) setGrow((g) => Math.min(g + 1, MAX_GROW));
      if (!s.placed) {
        // Open with the first (highest-tier) sponsor on the centre mark.
        s.x = s.centres[0] - s.width / 2;
        s.placed = true;
      }
      draw();
    };

    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!s.dragging) {
        if (s.seek !== null) {
          s.x += (s.seek - s.x) * (1 - Math.exp(-dt / 0.16));
          s.v = 0;
          if (Math.abs(s.seek - s.x) < 0.5) {
            s.x = s.seek;
            s.seek = null;
          }
        } else {
          const held = s.hover || s.focus;
          const target = held ? 0 : CRUISE * s.dir;
          s.v += (target - s.v) * (1 - Math.exp(-dt / (held ? BRAKE : SETTLE)));
          s.x += s.v * dt;
        }
      }
      draw();
      raf = requestAnimationFrame(frame);
    };

    // Only animate while the lane is on screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(stage);

    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(track);
    measure();

    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (!dy || !raf || s.dragging) return;
      s.v = clamp(s.v + dy * SCROLL_KICK, MAX_SPEED);
      s.dir = dy > 0 ? 1 : -1;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [count]);

  /* ── Pointer: brake on hover, drag to scrub, fling on release ── */

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const s = motion.current;
    s.press = { id: e.pointerId, startX: e.clientX, startPos: s.x, lastX: e.clientX, lastT: e.timeStamp };
    s.moved = false;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = motion.current;
    const p = s.press;
    if (!p || p.id !== e.pointerId) {
      if (e.pointerType === 'mouse') s.hover = true;
      return;
    }
    if (!s.dragging) {
      if (Math.abs(e.clientX - p.startX) < DRAG_SLOP) return;
      s.dragging = true;
      s.moved = true;
      s.seek = null;
      // Start the drag from where the lane is now, so it doesn't jump.
      p.startX = e.clientX;
      p.startPos = s.x;
      p.lastX = e.clientX;
      p.lastT = e.timeStamp;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.dataset.dragging = '';
      return;
    }
    const dt = (e.timeStamp - p.lastT) / 1000;
    if (dt > 0) s.v = clamp(0.6 * s.v + 0.4 * ((p.lastX - e.clientX) / dt), MAX_SPEED * 1.5);
    p.lastX = e.clientX;
    p.lastT = e.timeStamp;
    s.x = p.startPos - (e.clientX - p.startX);
  };

  const endPress = (e: PointerEvent<HTMLDivElement>) => {
    const s = motion.current;
    const p = s.press;
    if (!p || p.id !== e.pointerId) return;
    s.press = null;
    if (!s.dragging) return;
    s.dragging = false;
    delete e.currentTarget.dataset.dragging;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    // Held still before letting go: no fling.
    if (e.timeStamp - p.lastT > 90) s.v = 0;
    if (Math.abs(s.v) > 30) s.dir = s.v > 0 ? 1 : -1;
    // Let the fling coast; the brake comes back on when the mouse next moves.
    s.hover = false;
  };

  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    const s = motion.current;
    if (!s.moved) return;
    s.moved = false;
    e.preventDefault();
    e.stopPropagation();
  };

  /* ── Keyboard: tabbing to a logo stops the lane and brings that logo to the centre ── */

  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    const s = motion.current;
    const el = e.target as HTMLElement;
    if (!el.matches(':focus-visible')) return;
    const item = el.closest('li');
    if (!item || !s.half) return;
    s.focus = true;
    const want = item.offsetLeft + item.offsetWidth / 2 - s.width / 2;
    // Take the shorter way round the loop.
    s.seek = s.x + mod(want - s.x + s.half / 2, s.half) - s.half / 2;
  };

  const onBlur = () => {
    const s = motion.current;
    s.focus = false;
    s.seek = null;
  };

  return (
    <div
      className={cn('[--logo-scale:0.78] sm:[--logo-scale:1]', className)}
      role="group"
      aria-label="Our sponsors"
    >
      <div className="relative">
        <div
          ref={stageRef}
          className="sponsor-lane-stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPress}
          onPointerCancel={endPress}
          onPointerLeave={() => {
            motion.current.hover = false;
          }}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
          onFocus={onFocus}
          onBlur={onBlur}
          // Focus can still scroll a clipped box in older browsers; keep it pinned.
          onScroll={(e) => {
            e.currentTarget.scrollLeft = 0;
          }}
        >
          <div className="sponsor-lane-rail is-top" aria-hidden>
            <span ref={railTopRef} />
          </div>
          <ul ref={trackRef} className="sponsor-lane-track">
            {/* Three identical copies: the track slides by one copy's width and loops seamlessly.
                The middle copy holds the real, focusable logos, as it is the one that reaches the centre. */}
            {[...half, ...half, ...half].map((s, i) => {
              const isOriginal = i >= count && i < count + sponsors.length;
              return (
                <li
                  key={`${s.id}-${i}`}
                  className={cn('sponsor-lane-item', ITEM_CLASS, i % count === activeSlot && 'is-active')}
                  aria-hidden={!isOriginal || undefined}
                >
                  <div className="sponsor-lane-lean">
                    <div className="sponsor-lane-logo">
                      <SponsorLogo sponsor={s} focusable={isOriginal} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="sponsor-lane-rail is-bottom" aria-hidden>
            <span ref={railBottomRef} />
          </div>
        </div>
        {/* Centre mark */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[5px] border-x-transparent border-t-[7px] border-t-energy"
        />
      </div>

      {/* Readout: names the logo on the centre mark, like a callout on a drawing */}
      <div className="flex flex-col items-center" aria-hidden>
        <span className="relative h-5 w-px bg-energy/70">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-energy ring-4 ring-energy/25" />
        </span>
        <div className="w-64 sm:w-80 max-w-[calc(100vw-2rem)] bg-graphite/90 border border-bone/25 px-3 py-2 text-center overflow-hidden">
          <div key={`${current.id}-${activeSlot}`} className="sponsor-lane-readout">
            <span className="block truncate font-display font-bold uppercase text-base sm:text-lg leading-none text-bone">
              {current.name}
            </span>
            <span className="block truncate font-mono text-[10px] uppercase tracking-[0.18em] text-bone/60 mt-1.5">
              <span className="text-energy">{pad((activeSlot % sponsors.length) + 1)}</span> / {pad(sponsors.length)} ·{' '}
              {tierLabel(current.tier)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Reduced motion: the same single row, standing still, scrolled sideways by hand. */
function SponsorRow({ sponsors, className }: { sponsors: Sponsor[]; className?: string }) {
  return (
    <div
      className={cn('overflow-x-auto [--logo-scale:0.78] sm:[--logo-scale:1]', className)}
      role="group"
      aria-label="Our sponsors"
    >
      <ul className="flex items-center w-max mx-auto px-4">
        {sponsors.map((s) => (
          <li key={s.id} className={cn(ITEM_CLASS, 'shrink-0')}>
            <SponsorLogo sponsor={s} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The sponsor strip: always one line, however many sponsors there are. */
export default function SponsorMarquee({ sponsors, className }: { sponsors: Sponsor[]; className?: string }) {
  const reduced = usePrefersReducedMotion();
  if (sponsors.length === 0) return null;
  return reduced ? (
    <SponsorRow sponsors={sponsors} className={className} />
  ) : (
    <SponsorLane sponsors={sponsors} className={className} />
  );
}
