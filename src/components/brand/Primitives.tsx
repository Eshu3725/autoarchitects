import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';

/** Section header styled like a drawing-sheet label: "SHEET 02 — THE PROCESS". */
export function SectionHeader({
  sheet,
  kicker,
  title,
  children,
  align = 'left',
  className,
}: {
  sheet: string;
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  const centered = align === 'center';
  return (
    <header className={cn('mb-12 md:mb-16', centered && 'text-center', className)}>
      <div className={cn('flex items-center gap-3 mb-5', centered && 'justify-center')}>
        <span className="label-mono text-energy">Sheet {sheet}</span>
        <span className="h-px w-10 bg-energy/60" aria-hidden />
        <span className="label-mono text-muted-foreground">{kicker}</span>
      </div>
      <h2 className="font-display font-extrabold uppercase italic text-4xl sm:text-5xl md:text-6xl leading-[0.92] tracking-tight text-foreground">
        {title}
      </h2>
      {children && (
        <p
          className={cn(
            'mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl',
            centered && 'mx-auto'
          )}
        >
          {children}
        </p>
      )}
    </header>
  );
}

/** Competition number plate. */
export function RacePlate({
  number,
  size = 'md',
  className,
}: {
  number: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = {
    sm: 'h-8 min-w-[2.75rem] px-2 text-lg',
    md: 'h-11 min-w-[3.75rem] px-3 text-2xl',
    lg: 'h-20 min-w-[7rem] px-5 text-5xl',
  };
  return <span className={cn('race-plate', sizes[size], className)}>{number}</span>;
}

export function HazardStripe({ className, red = false }: { className?: string; red?: boolean }) {
  return <div aria-hidden className={cn(red ? 'hazard-stripe-red' : 'hazard-stripe', 'h-2 w-full', className)} />;
}

/** Infinite horizontal ticker. Content is duplicated for a seamless loop. */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="font-display font-extrabold italic uppercase text-2xl md:text-3xl tracking-tight px-6">
            {item}
          </span>
          <span className="text-energy text-xl" aria-hidden>
            ▶
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={cn('overflow-hidden whitespace-nowrap', className)}>
      <div className="flex w-max animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/** Wraps children and fades them up when scrolled into view. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={cn('reveal', inView && 'is-in', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** A dimension-style leader pointing at part of a photo. x/y are % of the container. */
export function Callout({
  x,
  y,
  side,
  title,
  sub,
  delay = 0,
}: {
  x: number;
  y: number;
  side: 'left' | 'right' | 'down';
  title: string;
  sub: string;
  delay?: number;
}) {
  const label = (
    <span className="block bg-graphite/90 backdrop-blur-sm border border-bone/25 px-2.5 py-1.5 whitespace-nowrap">
      <span className="block font-display font-bold uppercase text-sm leading-none text-bone">{title}</span>
      <span className="block font-mono text-[10px] text-bone/60 mt-1">{sub}</span>
    </span>
  );
  return (
    <div
      className="absolute hidden sm:block animate-fade-in"
      style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}ms` }}
    >
      <span className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-energy ring-4 ring-energy/30" />
      {side === 'right' && (
        <span className="absolute left-2 top-0 -translate-y-1/2 flex items-center">
          <span className="w-10 h-px bg-bone/70" />
          {label}
        </span>
      )}
      {side === 'left' && (
        <span className="absolute right-2 top-0 -translate-y-1/2 flex items-center flex-row-reverse">
          <span className="w-10 h-px bg-bone/70" />
          {label}
        </span>
      )}
      {side === 'down' && (
        <span className="absolute top-2 left-0 -translate-x-1/2 flex flex-col items-center">
          <span className="h-8 w-px bg-bone/70" />
          {label}
        </span>
      )}
    </div>
  );
}

/** Small key/value cell used in title blocks and spec rows. */
export function SpecCell({ k, v, className }: { k: string; v: ReactNode; className?: string }) {
  return (
    <div className={cn('px-4 py-3', className)}>
      <div className="label-mono text-muted-foreground mb-1">{k}</div>
      <div className="font-display font-bold uppercase text-lg leading-tight text-foreground">{v}</div>
    </div>
  );
}
