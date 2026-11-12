import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import type { Sponsor } from '@/lib/sponsors';

/** Each half of a row needs enough tiles to overfill wide screens, or the loop shows a gap. */
const MIN_TILES_PER_HALF = 10;
/** Seconds per tile: keeps the speed the same however many sponsors there are. */
const SECONDS_PER_TILE = 3.5;

/** A sponsor's logo on a white plate, so dark and coloured logos both read on the dark site. */
export function SponsorLogoTile({
  sponsor,
  className,
  focusable = true,
}: {
  sponsor: Pick<Sponsor, 'name' | 'logo_url' | 'website'>;
  className?: string;
  focusable?: boolean;
}) {
  const body = sponsor.logo_url ? (
    // Logos are trimmed to their edges on upload; scale them up to fill the plate.
    <img src={sponsor.logo_url} alt={sponsor.name} loading="lazy" className="h-full w-full object-contain" />
  ) : (
    <span className="font-display font-extrabold italic uppercase text-graphite text-lg sm:text-xl leading-[0.95] text-center line-clamp-2">
      {sponsor.name}
    </span>
  );
  const cls = cn(
    // Pure white, so any white left inside a logo (letter counters, white shapes) blends in.
    'flex items-center justify-center bg-white border border-border p-3 sm:p-4 transition-transform duration-300',
    className
  );
  return sponsor.website ? (
    <a
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer sponsored"
      title={sponsor.name}
      tabIndex={focusable ? undefined : -1}
      className={cn(cls, 'hover:-translate-y-1 focus-modern')}
    >
      {body}
    </a>
  ) : (
    <div title={sponsor.name} className={cls}>
      {body}
    </div>
  );
}

function MarqueeRow({ sponsors, reverse }: { sponsors: Sponsor[]; reverse?: boolean }) {
  const repeats = Math.max(1, Math.ceil(MIN_TILES_PER_HALF / sponsors.length));
  const half = Array.from({ length: repeats }, () => sponsors).flat();
  const style = { '--marquee-duration': `${half.length * SECONDS_PER_TILE}s` } as CSSProperties;

  return (
    <div className="logo-marquee">
      <ul className={cn('logo-marquee-track py-2', reverse && 'is-reverse')} style={style}>
        {/* Two identical halves: the track slides by 50% and loops seamlessly. */}
        {[...half, ...half].map((s, i) => {
          const isOriginal = i < sponsors.length;
          return (
            <li key={`${s.id}-${i}`} className={cn('px-2 sm:px-3', !isOriginal && 'logo-marquee-dup')} aria-hidden={!isOriginal || undefined}>
              <SponsorLogoTile sponsor={s} focusable={isOriginal} className="h-24 w-44 sm:h-28 sm:w-56" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Infinite, hover-pausable logo ticker. Splits into two opposing rows when there are enough sponsors. */
export default function SponsorMarquee({ sponsors, className }: { sponsors: Sponsor[]; className?: string }) {
  if (sponsors.length === 0) return null;
  const rows =
    sponsors.length >= 8
      ? [sponsors.filter((_, i) => i % 2 === 0), sponsors.filter((_, i) => i % 2 === 1)]
      : [sponsors];
  return (
    <div className={cn('space-y-4', className)} role="group" aria-label="Our sponsors">
      {rows.map((row, i) => (
        <MarqueeRow key={i} sponsors={row} reverse={i === 1} />
      ))}
    </div>
  );
}
