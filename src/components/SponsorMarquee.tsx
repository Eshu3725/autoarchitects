import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { balancedLogoSize, logoDimensions, type Sponsor } from '@/lib/sponsors';

/** Each half of a row needs enough logos to overfill wide screens, or the loop shows a gap. */
const MIN_LOGOS_PER_HALF = 10;
/** Seconds per logo: keeps the speed the same however many sponsors there are. */
const SECONDS_PER_LOGO = 3.5;

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

function MarqueeRow({ sponsors, reverse }: { sponsors: Sponsor[]; reverse?: boolean }) {
  const repeats = Math.max(1, Math.ceil(MIN_LOGOS_PER_HALF / sponsors.length));
  const half = Array.from({ length: repeats }, () => sponsors).flat();
  const style = { '--marquee-duration': `${half.length * SECONDS_PER_LOGO}s` } as CSSProperties;

  return (
    <div className="logo-marquee">
      <ul className={cn('logo-marquee-track items-center', reverse && 'is-reverse')} style={style}>
        {/* Two identical halves: the track slides by 50% and loops seamlessly. */}
        {[...half, ...half].map((s, i) => {
          const isOriginal = i < sponsors.length;
          return (
            <li
              key={`${s.id}-${i}`}
              className={cn('flex items-center h-24 sm:h-28 px-6 sm:px-10', !isOriginal && 'logo-marquee-dup')}
              aria-hidden={!isOriginal || undefined}
            >
              <SponsorLogo sponsor={s} focusable={isOriginal} />
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
    <div
      className={cn('space-y-2 [--logo-scale:0.78] sm:[--logo-scale:1]', className)}
      role="group"
      aria-label="Our sponsors"
    >
      {rows.map((row, i) => (
        <MarqueeRow key={i} sponsors={row} reverse={i === 1} />
      ))}
    </div>
  );
}
