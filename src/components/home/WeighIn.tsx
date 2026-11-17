import { useEffect, useRef, useState } from 'react';
import { SectionHeader, RacePlate } from '@/components/brand/Primitives';
import { useInView } from '@/hooks/use-in-view';
import { prefersReducedMotion } from '@/hooks/use-scroll-progress';
import { GARAGE } from '@/data/club';
import { cn } from '@/lib/utils';

/** Every car with a published mass, oldest first. */
const CARS = GARAGE.filter((m) => m.mass)
  .map((m) => ({ ...m, kg: parseFloat(m.mass!) }))
  .reverse();

const FIRST = CARS[0];
const LAST = CARS[CARS.length - 1];
const AXIS_MAX = Math.ceil(FIRST.kg / 100) * 100;
const TICKS = Array.from({ length: AXIS_MAX / 100 + 1 }, (_, i) => i * 100);
const pct = (kg: number) => `${(kg / AXIS_MAX) * 100}%`;
const kgText = (kg: number) => kg.toFixed(1);

/** Eases a displayed number toward its target, like a scale settling. */
function useSettle(target: number) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (prefersReducedMotion()) {
      from.current = target;
      setShown(target);
      return;
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 650);
      const v = start + (target - start) * (1 - (1 - t) ** 3);
      from.current = v;
      setShown(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return shown;
}

/**
 * The weigh-in: published vehicle mass, car by car. Plays through once when it
 * scrolls into view, then hands control to the visitor.
 */
export default function WeighIn() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const [sel, setSel] = useState(0);
  const [touched, setTouched] = useState(false);

  // First viewing: step from the heaviest car to the lightest.
  useEffect(() => {
    if (!inView || touched) return;
    if (prefersReducedMotion()) {
      setSel(CARS.length - 1);
      return;
    }
    const t = window.setInterval(() => {
      setSel((cur) => {
        if (cur >= CARS.length - 1) {
          window.clearInterval(t);
          return cur;
        }
        return cur + 1;
      });
    }, 900);
    return () => window.clearInterval(t);
  }, [inView, touched]);

  const pick = (i: number) => {
    setTouched(true);
    setSel(i);
  };

  const car = CARS[sel];
  const shown = useSettle(car.kg);
  const shed = FIRST.kg - car.kg;
  const prev = sel > 0 ? CARS[sel - 1] : null;
  const totalShed = FIRST.kg - LAST.kg;
  const years = Number(LAST.season) - Number(FIRST.season);

  return (
    <section id="weigh-in" className="relative py-24 md:py-32 border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader sheet="04" kicker="Mass budget" title={<>The <span className="text-energy">weigh-in</span></>}>
          Mass is the number every sub-team fights over: a lighter car accelerates harder, stops shorter and puts less load
          through everything that could break. These are the vehicle masses published in the team docket.
        </SectionHeader>

        <div ref={ref} className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Readout */}
          <div className="lg:col-span-5 border border-border bg-card flex flex-col">
            <div className="relative aspect-[16/9] overflow-hidden bg-muted border-b border-border">
              {car.image && (
                <img
                  key={car.image}
                  src={car.image}
                  alt={car.plate ? `Car ${car.plate}, ${car.name}` : `${car.season} car, ${car.name}`}
                  loading="lazy"
                  className={cn('absolute inset-0 w-full h-full object-cover animate-fade-in', car.cropFrame && 'scale-[1.12]')}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              {car.plate && <RacePlate number={car.plate} size="sm" className="absolute top-3 left-3" />}
              <p className="absolute bottom-3 left-4 right-4 flex items-baseline justify-between gap-3 text-white">
                <span className="font-display font-extrabold uppercase text-2xl leading-none">{car.name}</span>
                <span className="font-mono text-xs">{car.season}</span>
              </p>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col">
              <p className="label-mono text-[10px] text-muted-foreground">Vehicle mass</p>
              {/* The settling digits are decoration; readers get the final figure once. */}
              <p className="mt-2 flex items-baseline gap-3" aria-hidden>
                <span className="font-display font-extrabold italic leading-none text-7xl sm:text-8xl tabular-nums">
                  {kgText(shown)}
                </span>
                <span className="font-display font-bold uppercase text-2xl text-muted-foreground">kg</span>
              </p>
              <p className="sr-only" aria-live={touched ? 'polite' : 'off'}>
                {car.season}
                {car.plate ? `, car ${car.plate}` : ''}: {car.mass}
              </p>

              <dl className="mt-auto pt-6 grid grid-cols-2 border-t border-border">
                <div className="pt-4 pr-4">
                  <dt className="label-mono text-[9px] text-muted-foreground">Against {FIRST.season}</dt>
                  <dd className="mt-1.5 font-mono text-sm">
                    {sel === 0 ? (
                      <span className="text-muted-foreground">Baseline</span>
                    ) : (
                      <>
                        <span className="text-energy">−{kgText(shed)} kg</span>
                        <span className="text-muted-foreground"> · −{Math.round((shed / FIRST.kg) * 100)}%</span>
                      </>
                    )}
                  </dd>
                </div>
                <div className="pt-4 pl-4 border-l border-border">
                  <dt className="label-mono text-[9px] text-muted-foreground">Against the car before</dt>
                  <dd className="mt-1.5 font-mono text-sm">
                    {prev ? <>−{kgText(prev.kg - car.kg)} kg</> : <span className="text-muted-foreground">First on record</span>}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex-1 border border-border bg-graphite/60 p-4 sm:p-6 flex flex-col">
              <div className="flex items-center justify-between gap-4 mb-5">
                <p className="label-mono text-[10px] text-muted-foreground">Fig. 4: Vehicle mass by car, kg</p>
                <p className="hidden sm:flex items-center gap-2 label-mono text-[10px] text-muted-foreground">
                  <span className="hatch-energy w-5 h-3 border border-energy/50" aria-hidden />
                  Mass removed since {FIRST.season}
                </p>
              </div>

              <div className="relative flex-1 min-h-[260px] sm:min-h-[320px] ml-8">
                {/* gridlines */}
                {TICKS.map((t) => (
                  <span key={t} className="absolute left-0 right-0 border-t border-border" style={{ bottom: pct(t) }} aria-hidden>
                    <span className="absolute -left-8 -translate-y-1/2 w-6 text-right font-mono text-[10px] text-muted-foreground">
                      {t}
                    </span>
                  </span>
                ))}
                {/* baseline car, carried across as the reference */}
                <span
                  className="absolute left-0 right-0 border-t border-dashed border-bone/50"
                  style={{ bottom: pct(FIRST.kg) }}
                  aria-hidden
                />

                <div className="absolute inset-0 flex items-stretch gap-2 sm:gap-4 px-1 sm:px-3" role="group" aria-label="Pick a car">
                  {CARS.map((c, i) => {
                    const on = i === sel;
                    return (
                      <button
                        key={c.season}
                        type="button"
                        onClick={() => pick(i)}
                        onMouseEnter={() => pick(i)}
                        onFocus={() => pick(i)}
                        aria-pressed={on}
                        aria-label={`${c.season}${c.plate ? `, car ${c.plate}` : ''}: ${c.mass}`}
                        className="group relative flex-1 outline-none"
                      >
                        {/* mass removed since the baseline car */}
                        <span
                          className={cn(
                            'hatch-energy absolute inset-x-[16%] border-x border-energy/40 flex items-center justify-center transition-opacity duration-300',
                            on && i > 0 ? 'opacity-100' : 'opacity-0'
                          )}
                          style={{ bottom: pct(c.kg), height: pct(FIRST.kg - c.kg) }}
                          aria-hidden
                        >
                          {FIRST.kg - c.kg > 60 && (
                            <span className="bg-graphite border border-energy/50 px-1.5 py-0.5 font-mono text-[10px] sm:text-[11px] text-foreground whitespace-nowrap">
                              −{kgText(FIRST.kg - c.kg)}
                            </span>
                          )}
                        </span>
                        <span
                          className={cn(
                            'absolute inset-x-[16%] bottom-0 rounded-t-[3px] transition-[height,background-color] duration-700 ease-out group-focus-visible:ring-2 group-focus-visible:ring-amber',
                            on ? 'bg-energy' : 'bg-bone/25 group-hover:bg-bone/40'
                          )}
                          style={{ height: inView ? pct(c.kg) : 0, transitionDelay: inView ? `${i * 70}ms` : '0ms' }}
                          aria-hidden
                        />
                        <span
                          className={cn(
                            'absolute inset-x-0 pb-1.5 text-center font-mono text-[11px] sm:text-xs transition-all duration-700 ease-out',
                            on ? 'text-foreground font-bold' : 'text-muted-foreground',
                            inView ? 'opacity-100' : 'opacity-0'
                          )}
                          style={{ bottom: inView ? pct(c.kg) : 0 }}
                          aria-hidden
                        >
                          {c.kg}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* x axis */}
              <div className="ml-8 mt-3 flex gap-2 sm:gap-4 px-1 sm:px-3" aria-hidden>
                {CARS.map((c, i) => (
                  <span key={c.season} className="flex-1 text-center">
                    <span className={cn('block font-mono text-xs', i === sel ? 'text-foreground' : 'text-muted-foreground')}>
                      {c.season}
                    </span>
                    <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">{c.plate ? `#${c.plate}` : '—'}</span>
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-6 border-l-2 border-energy pl-4 text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">
                {kgText(totalShed)} kg gone in {years} years.
              </strong>{' '}
              {totalShed > LAST.kg
                ? `The team has cut more mass out of the car than the whole ${LAST.season} car weighs.`
                : `That is ${Math.round((totalShed / FIRST.kg) * 100)}% of the ${FIRST.season} car.`}
            </p>

            <table className="sr-only">
              <caption>Vehicle mass by car</caption>
              <thead>
                <tr>
                  <th scope="col">Season</th>
                  <th scope="col">Car</th>
                  <th scope="col">Mass</th>
                </tr>
              </thead>
              <tbody>
                {CARS.map((c) => (
                  <tr key={c.season}>
                    <td>{c.season}</td>
                    <td>{c.plate ? `#${c.plate} ${c.name}` : c.name}</td>
                    <td>{c.mass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
