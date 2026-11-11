import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { SubsystemId } from '@/data/club';

/**
 * Side-elevation line drawing of a BAJA-style ATV.
 * Each subsystem is its own <g> so it can be highlighted to match the
 * team's departments. Not to scale — it's a schematic, and labelled as one.
 */

type DrawId = Exclude<SubsystemId, 'operations'>;

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

function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} pathLength={1} className="draw-line" />
      <circle cx={cx} cy={cy} r={r - 5} strokeDasharray="5 6" strokeWidth={3} opacity={0.35} />
      <circle cx={cx} cy={cy} r={r - 14} pathLength={1} className="draw-line" opacity={0.6} />
      <circle cx={cx} cy={cy} r={r * 0.53} pathLength={1} className="draw-line" />
      <circle cx={cx} cy={cy} r={6} />
    </g>
  );
}

export default function BuggyBlueprint({
  active,
  onSelect,
  className,
}: {
  active: SubsystemId | null;
  onSelect?: (id: SubsystemId) => void;
  className?: string;
}) {
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
        <path d="M30 400 H770" strokeDasharray="10 6 2 6" />
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
      <g style={{ color: 'hsl(var(--bone))' }} opacity={active ? 0.15 : 0.35} strokeWidth={1.2}>
        <path d="M318 294 L338 170 L354 172 L338 284 L412 284 L414 294 Z" />
      </g>

      {part(
        'chassis',
        <>
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
        </>
      )}

      {part(
        'transmission',
        <>
          <rect x="196" y="196" width="78" height="52" rx="3" />
          <path d="M210 196 L220 160 L262 160 L270 196" />
          <path d="M218 170 H264 M216 180 H266 M214 188 H268" opacity={0.6} />
          <circle cx="206" cy="236" r="12" />
          <rect x="212" y="286" width="46" height="36" rx="3" />
          <circle cx="232" cy="302" r="15" />
          <path d="M195 241 L218 314 M217 230 L246 292" />
          <path d="M212 314 L181 328" strokeWidth={3} />
        </>
      )}

      {part(
        'suspension',
        <>
          {/* front double wishbone */}
          <path d="M586 252 L620 300 M604 304 L632 362 M620 300 L632 362" />
          <path d={coilover(562, 208, 616, 338)} />
          {/* rear trailing links */}
          <path d="M290 300 L180 326 M282 318 L182 338" />
          <path d={coilover(128, 238, 172, 320, 6)} />
        </>
      )}

      {part(
        'steering',
        <>
          <ellipse cx="468" cy="164" rx="6" ry="24" transform="rotate(-35 468 164)" />
          <path d="M473 172 L590 262" />
          <rect x="584" y="256" width="26" height="12" rx="2" />
          <path d="M610 262 L624 316" />
        </>
      )}

      {part(
        'brakes',
        <>
          <circle cx="175" cy="330" r="24" />
          <circle cx="175" cy="330" r="16" strokeDasharray="3 4" />
          <circle cx="625" cy="332" r="23" />
          <circle cx="625" cy="332" r="15" strokeDasharray="3 4" />
          <rect x="146" y="306" width="12" height="18" rx="2" />
          <rect x="640" y="308" width="12" height="18" rx="2" />
          <path d="M676 294 L662 254 M656 252 H670" />
          <rect x="644" y="264" width="14" height="8" rx="1" />
          <path d="M646 308 C 648 292 636 292 600 292 L 180 292 L 156 306" strokeDasharray="6 5" opacity={0.8} />
        </>
      )}

      {/* Wheels sit on top as reference geometry */}
      <g style={{ color: 'hsl(var(--bone))' }} opacity={active && active !== 'operations' ? 0.35 : 0.8} strokeWidth={1.5}>
        <Wheel cx={175} cy={330} r={68} />
        <Wheel cx={625} cy={332} r={66} />
      </g>

      {/* Hotspots */}
      {(Object.keys(HOTSPOTS) as DrawId[]).map((id) => {
        const h = HOTSPOTS[id];
        const isActive = active === id;
        return (
          <g
            key={id}
            role="button"
            tabIndex={0}
            aria-label={`Highlight subsystem ${h.n}`}
            className="cursor-pointer outline-none"
            onClick={() => onSelect?.(id)}
            onMouseEnter={() => onSelect?.(id)}
            onFocus={() => onSelect?.(id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect?.(id);
            }}
            style={{ color: isActive ? 'hsl(var(--energy))' : 'hsl(var(--bone))' }}
          >
            <path
              d={`M${h.anchor[0]} ${h.anchor[1]} L${h.bubble[0]} ${h.bubble[1]}`}
              strokeWidth={1}
              opacity={isActive ? 1 : 0.5}
            />
            <circle cx={h.anchor[0]} cy={h.anchor[1]} r={3} fill="currentColor" stroke="none" />
            <circle
              cx={h.bubble[0]}
              cy={h.bubble[1]}
              r={15}
              fill={isActive ? 'hsl(var(--energy))' : 'hsl(var(--background))'}
              strokeWidth={1.5}
            />
            <text
              x={h.bubble[0]}
              y={h.bubble[1] + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              className="font-mono"
              fill={isActive ? 'white' : 'currentColor'}
              stroke="none"
            >
              {h.n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
