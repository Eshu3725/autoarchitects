import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { SubsystemId } from '@/data/club';
import { terrain, FRONT_AXLE_X, REAR_AXLE_X, GROUND_Y, type RigPose } from './rig';

/**
 * Side-elevation line drawing of a BAJA-style ATV.
 * Each subsystem is its own <g> so it can be highlighted to match the
 * team's departments. Not to scale — it's a schematic, and labelled as one.
 *
 * Pass a `rig` pose and the drawing becomes a working model: the wheels follow
 * the ground, the sprung mass rides on the coilovers, and every link that
 * joins the two is redrawn between its real end points.
 */

type DrawId = Exclude<SubsystemId, 'operations'>;

const r2 = (v: number) => Math.round(v * 100) / 100;
/** translate() for a group that has moved up by `d`. */
const lift = (d: number) => (d ? `translate(0 ${r2(-d)})` : undefined);

const HOTSPOTS: Record<DrawId, { n: string; anchor: [number, number]; bubble: [number, number] }> = {
  chassis: { n: '01', anchor: [432, 88], bubble: [478, 46] },
  suspension: { n: '02', anchor: [590, 274], bubble: [716, 222] },
  steering: { n: '03', anchor: [470, 162], bubble: [512, 122] },
  brakes: { n: '04', anchor: [646, 318], bubble: [742, 356] },
  transmission: { n: '05', anchor: [238, 170], bubble: [196, 122] },
};

/** Coilover: straight damper body with a zig-zag spring over its middle. */
function coilover(x1: number, y1: number, x2: number, y2: number, coils = 7, amp = 7) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const start = 0.18;
  const end = 0.78;
  const pts: string[] = [`M${x1} ${y1}`, `L${(x1 + dx * start).toFixed(1)} ${(y1 + dy * start).toFixed(1)}`];
  const steps = coils * 2;
  for (let i = 0; i <= steps; i++) {
    const t = start + ((end - start) * i) / steps;
    const side = i === 0 || i === steps ? 0 : i % 2 ? 1 : -1;
    const x = x1 + dx * t + px * amp * side;
    const y = y1 + dy * t + py * amp * side;
    pts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  pts.push(`L${x2} ${y2}`);
  return pts.join(' ');
}

function Wheel({ cx, cy, r, spin = 0 }: { cx: number; cy: number; r: number; spin?: number }) {
  const hub = r * 0.53;
  const rim = r - 14;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} pathLength={1} className="draw-line" />
      {/* tread blocks and rim marks turn with the wheel */}
      <g transform={`rotate(${r2(spin)} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={r - 5} strokeDasharray="5 6" strokeWidth={3} opacity={0.35} />
        {[0, 120, 240].map((deg) => {
          const c = Math.cos((deg * Math.PI) / 180);
          const s = Math.sin((deg * Math.PI) / 180);
          return (
            <path
              key={deg}
              d={`M${r2(cx + c * (hub + 3))} ${r2(cy + s * (hub + 3))} L${r2(cx + c * (rim - 3))} ${r2(cy + s * (rim - 3))}`}
              opacity={0.5}
            />
          );
        })}
      </g>
      <circle cx={cx} cy={cy} r={rim} pathLength={1} className="draw-line" opacity={0.6} />
      <circle cx={cx} cy={cy} r={hub} pathLength={1} className="draw-line" />
      <circle cx={cx} cy={cy} r={6} />
    </g>
  );
}

export default function BuggyBlueprint({
  active,
  onSelect,
  className,
  rig,
}: {
  active: SubsystemId | null;
  onSelect?: (id: SubsystemId) => void;
  className?: string;
  /** Live pose from the test rig. Omit for the static drawing. */
  rig?: RigPose;
}) {
  const f = rig?.front ?? 0; // front wheel lift
  const r = rig?.rear ?? 0; // rear wheel lift
  const h = rig?.heave ?? 0; // sprung-mass lift
  const dist = rig?.dist ?? 0;
  const amp = rig?.amp ?? 0;
  const spinRear = (dist / 68) * (180 / Math.PI);
  const spinFront = (dist / 66) * (180 / Math.PI);

  // The ground: a straight datum at rest, the scrolling track when the rig runs.
  let ground = `M30 ${GROUND_Y} H770`;
  if (amp > 0.002) {
    const pts: string[] = [];
    for (let x = 30; x <= 770; x += 10) pts.push(`${x} ${r2(GROUND_Y - amp * terrain(x + dist))}`);
    ground = `M${pts.join(' L')}`;
  }

  // Where each callout leader lands, so it follows the part it points at.
  const anchorLift: Record<DrawId, number> = {
    chassis: h,
    steering: h,
    transmission: h,
    suspension: (h + f) / 2,
    brakes: f,
  };

  const part = (id: DrawId, children: ReactNode) => {
    const isActive = active === id;
    const dimmed = active !== null && active !== 'operations' && !isActive;
    return (
      <g
        data-sys={id}
        style={{
          color: isActive ? 'hsl(var(--energy))' : 'hsl(var(--bone))',
          opacity: dimmed ? 0.22 : isActive ? 1 : 0.72,
          strokeWidth: isActive ? 2.4 : 1.5,
          transition: 'opacity .35s ease, color .35s ease, stroke-width .35s ease',
        }}
      >
        {children}
      </g>
    );
  };

  const nodes: [number, number][] = [
    [110, 300], [290, 300], [306, 96], [432, 88], [560, 198], [708, 288],
    [292, 228], [586, 232], [120, 228], [606, 302], [302, 150], [680, 302],
  ];

  return (
    <svg
      viewBox="0 0 800 460"
      className={cn('w-full h-auto select-none', className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Side elevation schematic of a Team AutoArchitects ATV, showing chassis, suspension, steering, brakes and transmission"
    >
      <defs>
        <marker id="bp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="hsl(var(--bone))" stroke="none" opacity="0.6" />
        </marker>
      </defs>

      {/* Drawing annotations */}
      <g style={{ color: 'hsl(var(--bone))' }} opacity={0.5} strokeWidth={1}>
        <text x="40" y="36" fill="currentColor" stroke="none" className="font-mono" fontSize="11" letterSpacing="2">
          SIDE ELEVATION · NTS
        </text>
        <text x="40" y="52" fill="currentColor" stroke="none" className="font-mono" fontSize="10" letterSpacing="2" opacity="0.7">
          DWG AA-ATV-01
        </text>
        {/* ground */}
        <path d={ground} strokeDasharray="10 6 2 6" strokeDashoffset={r2(dist % 24)} />
        {/* wheelbase */}
        <path d="M175 406 V444 M625 406 V444" />
        <path d="M181 434 H619" markerStart="url(#bp-arrow)" markerEnd="url(#bp-arrow)" />
        <text x="400" y="428" textAnchor="middle" fill="currentColor" stroke="none" className="font-mono" fontSize="11" letterSpacing="2">
          WHEELBASE
        </text>
        {/* overall height */}
        <path d="M48 88 H296 M48 400 H96" opacity={0.6} strokeDasharray="2 5" />
        <path d="M60 94 V394" markerStart="url(#bp-arrow)" markerEnd="url(#bp-arrow)" />
        <text
          x="50"
          y="244"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          className="font-mono"
          fontSize="11"
          letterSpacing="2"
          transform="rotate(-90 50 244)"
        >
          OVERALL HEIGHT
        </text>
      </g>

      {/* Seat (reference geometry, not a subsystem) */}
      <g style={{ color: 'hsl(var(--bone))' }} opacity={active ? 0.15 : 0.35} strokeWidth={1.2} transform={lift(h)}>
        <path d="M318 294 L338 170 L354 172 L338 284 L412 284 L414 294 Z" />
      </g>

      {part(
        'chassis',
        <g transform={lift(h)}>
          <path pathLength={1} className="draw-line" d="M110 300 L290 300 L680 302 L708 288" />
          <path pathLength={1} className="draw-line" d="M290 300 L306 96 L432 88 L560 198 L708 288" />
          <path pathLength={1} className="draw-line" d="M292 228 L586 232" />
          <path pathLength={1} className="draw-line" d="M110 300 L120 228 L292 228" />
          <path pathLength={1} className="draw-line" d="M120 228 L302 150" />
          <path pathLength={1} className="draw-line" d="M560 198 L586 232 L606 302" />
          <path pathLength={1} className="draw-line" d="M432 88 L452 232" opacity={0.6} />
          {nodes.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={3.2} fill="hsl(var(--background))" />
          ))}
        </g>
      )}

      {part(
        'transmission',
        <>
          <g transform={lift(h)}>
            <rect x="196" y="196" width="78" height="52" rx="3" />
            <path d="M210 196 L220 160 L262 160 L270 196" />
            <path d="M218 170 H264 M216 180 H266 M214 188 H268" opacity={0.6} />
            <circle cx="206" cy="236" r="12" />
            <rect x="212" y="286" width="46" height="36" rx="3" />
            <circle cx="232" cy="302" r="15" />
            <path d="M195 241 L218 314 M217 230 L246 292" />
          </g>
          {/* half-shaft: gearbox end rides with the chassis, hub end with the wheel */}
          <path d={`M212 ${r2(314 - h)} L181 ${r2(328 - r)}`} strokeWidth={3} />
        </>
      )}

      {part(
        'suspension',
        <>
          {/* front double wishbone: inboard pivots on the chassis, upright on the wheel */}
          <path
            d={`M586 ${r2(252 - h)} L620 ${r2(300 - f)} M604 ${r2(304 - h)} L632 ${r2(362 - f)} M620 ${r2(300 - f)} L632 ${r2(362 - f)}`}
          />
          <path d={coilover(562, r2(208 - h), 616, r2(338 - (h + 0.43 * (f - h))))} />
          {/* rear trailing links */}
          <path d={`M290 ${r2(300 - h)} L180 ${r2(326 - r)} M282 ${r2(318 - h)} L182 ${r2(338 - r)}`} />
          <path d={coilover(128, r2(238 - h), 172, r2(320 - r), 6)} />
        </>
      )}

      {part(
        'steering',
        <>
          <g transform={lift(h)}>
            <ellipse cx="468" cy="164" rx="6" ry="24" transform="rotate(-35 468 164)" />
            <path d="M473 172 L590 262" />
            <rect x="584" y="256" width="26" height="12" rx="2" />
          </g>
          {/* tie rod: rack to steering arm */}
          <path d={`M610 ${r2(262 - h)} L624 ${r2(316 - f)}`} />
        </>
      )}

      {part(
        'brakes',
        <>
          {/* discs turn with the wheels, calipers ride on the uprights */}
          <g transform={lift(r)}>
            <circle cx="175" cy="330" r="24" />
            <circle cx="175" cy="330" r="16" strokeDasharray="3 4" transform={`rotate(${r2(spinRear)} 175 330)`} />
            <rect x="146" y="306" width="12" height="18" rx="2" />
          </g>
          <g transform={lift(f)}>
            <circle cx="625" cy="332" r="23" />
            <circle cx="625" cy="332" r="15" strokeDasharray="3 4" transform={`rotate(${r2(spinFront)} 625 332)`} />
            <rect x="640" y="308" width="12" height="18" rx="2" />
          </g>
          {/* pedal and master cylinder on the chassis */}
          <g transform={lift(h)}>
            <path d="M676 294 L662 254 M656 252 H670" />
            <rect x="644" y="264" width="14" height="8" rx="1" />
          </g>
          <path
            d={`M646 ${r2(308 - f)} C 648 ${r2(292 - h)} 636 ${r2(292 - h)} 600 ${r2(292 - h)} L 180 ${r2(292 - h)} L 156 ${r2(306 - r)}`}
            strokeDasharray="6 5"
            opacity={0.8}
          />
        </>
      )}

      {/* Wheels sit on top as reference geometry */}
      <g style={{ color: 'hsl(var(--bone))' }} opacity={active && active !== 'operations' ? 0.35 : 0.8} strokeWidth={1.5}>
        <g transform={lift(r)}>
          <Wheel cx={REAR_AXLE_X} cy={330} r={68} spin={spinRear} />
        </g>
        <g transform={lift(f)}>
          <Wheel cx={FRONT_AXLE_X} cy={332} r={66} spin={spinFront} />
        </g>
      </g>

      {/* Hotspots */}
      {(Object.keys(HOTSPOTS) as DrawId[]).map((id) => {
        const spot = HOTSPOTS[id];
        const isActive = active === id;
        const ax = spot.anchor[0];
        const ay = r2(spot.anchor[1] - anchorLift[id]);
        return (
          <g
            key={id}
            role="button"
            tabIndex={0}
            aria-label={`Highlight subsystem ${spot.n}`}
            className="cursor-pointer outline-none"
            onClick={() => onSelect?.(id)}
            onMouseEnter={() => onSelect?.(id)}
            onFocus={() => onSelect?.(id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect?.(id);
            }}
            style={{ color: isActive ? 'hsl(var(--energy))' : 'hsl(var(--bone))' }}
          >
            <path d={`M${ax} ${ay} L${spot.bubble[0]} ${spot.bubble[1]}`} strokeWidth={1} opacity={isActive ? 1 : 0.5} />
            <circle cx={ax} cy={ay} r={3} fill="currentColor" stroke="none" />
            <circle
              cx={spot.bubble[0]}
              cy={spot.bubble[1]}
              r={15}
              fill={isActive ? 'hsl(var(--energy))' : 'hsl(var(--background))'}
              strokeWidth={1.5}
            />
            <text
              x={spot.bubble[0]}
              y={spot.bubble[1] + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              className="font-mono"
              fill={isActive ? 'white' : 'currentColor'}
              stroke="none"
            >
              {spot.n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
