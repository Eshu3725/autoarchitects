import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, ArrowLeft, ArrowUpRight, ChevronDown, Play } from 'lucide-react';
import RegistrationModal from '@/components/RegistrationModal';
import TestRig from '@/components/home/TestRig';
import WeighIn from '@/components/home/WeighIn';
import { SectionHeader, RacePlate, Marquee, Reveal, Callout, Odometer, CadViewport } from '@/components/brand/Primitives';
import { useInView } from '@/hooks/use-in-view';
import { useScrollProgress, prefersReducedMotion } from '@/hooks/use-scroll-progress';
import { cn } from '@/lib/utils';
import {
  CLUB,
  STATS,
  SUBSYSTEMS,
  BUILD_STAGES,
  GARAGE,
  RECORD,
  VIDEOS,
  BRANCHES,
  IMAGES,
  type SubsystemId,
} from '@/data/club';

/* ── Interactive anatomy section ── */
function Anatomy() {
  const [active, setActive] = useState<SubsystemId>('chassis');
  const [userControlled, setUserControlled] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>(0.25);

  useEffect(() => {
    if (userControlled || !inView) return;
    const ids = SUBSYSTEMS.filter((s) => s.onDrawing).map((s) => s.id);
    const t = window.setInterval(() => {
      setActive((cur) => ids[(ids.indexOf(cur) + 1) % ids.length]);
    }, 3200);
    return () => window.clearInterval(t);
  }, [userControlled, inView]);

  const select = (id: SubsystemId) => {
    setUserControlled(true);
    setActive(id);
  };

  // Test rig. It runs itself for a few seconds the first time the drawing is
  // seen, to show that the drawing moves; after that it is the visitor's.
  const [rigRunning, setRigRunning] = useState(false);
  const rigTouched = useRef(false);
  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const start = window.setTimeout(() => !rigTouched.current && setRigRunning(true), 1900);
    const stop = window.setTimeout(() => !rigTouched.current && setRigRunning(false), 6200);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(stop);
    };
  }, [inView]);

  const toggleRig = () => {
    rigTouched.current = true;
    if (!rigRunning) select('suspension');
    setRigRunning((on) => !on);
  };

  return (
    <section id="anatomy" className="relative py-24 md:py-32 border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader sheet="02" kicker="General arrangement" title={<>Anatomy of <span className="text-energy">the machine</span></>}>
          An ATV is five systems that all have to survive the same crash, jump and four-hour endurance run. Each one has its
          own sub-team of students who own it from first sketch to final weld.
        </SectionHeader>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div ref={ref} className={cn('lg:col-span-7 lg:sticky lg:top-28', inView && 'is-in')}>
            <TestRig active={active} onSelect={select} running={rigRunning} onToggle={toggleRig} />
          </div>

          <ol className="lg:col-span-5 border-t border-border">
            {SUBSYSTEMS.map((s) => {
              const isActive = active === s.id;
              const Icon = s.icon;
              return (
                <li key={s.id} className="border-b border-border">
                  <button
                    type="button"
                    onClick={() => select(s.id)}
                    onMouseEnter={() => select(s.id)}
                    aria-expanded={isActive}
                    className="w-full text-left py-5 flex items-start gap-4 group"
                  >
                    <span
                      className={cn(
                        'font-mono text-xs mt-1.5 w-7 shrink-0 transition-colors',
                        isActive ? 'text-energy' : 'text-muted-foreground'
                      )}
                    >
                      {s.code}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center justify-between gap-3">
                        <span
                          className={cn(
                            'font-display font-extrabold uppercase text-2xl sm:text-3xl leading-none tracking-tight transition-colors',
                            isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        >
                          {s.name}
                        </span>
                        <Icon className={cn('w-5 h-5 shrink-0 transition-colors', isActive ? 'text-energy' : 'text-muted-foreground/60')} />
                      </span>
                      <span
                        className={cn(
                          'grid transition-all duration-500 ease-out',
                          isActive ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
                        )}
                      >
                        <span className="overflow-hidden">
                          <span className="block text-muted-foreground leading-relaxed">{s.summary}</span>
                          <Link
                            to={`/members#${s.anchor}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 mt-3 label-mono text-energy hover:text-energy-light"
                          >
                            Meet the {s.team} crew <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ── Competition record: one expandable row per event ── */
function CompetitionRecord() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="border border-border bg-card">
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-muted/50 label-mono text-[10px] text-muted-foreground">
        <span className="col-span-1">Season</span>
        <span className="col-span-7">Event · Car</span>
        <span className="col-span-4 text-right pr-9">Result</span>
      </div>
      {RECORD.map((r, i) => {
        const key = (r.year ?? '') + r.cars.join('') + r.event;
        const multiCar = r.groups.length > 1;
        const isOpen = open === key;
        const panelId = `record-panel-${i}`;
        return (
          <div key={key} className={cn('border-b border-border last:border-b-0 transition-colors', isOpen && 'bg-muted/30')}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : key)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="group w-full text-left grid grid-cols-12 gap-x-4 gap-y-1 px-5 md:px-6 py-5 items-center hover:bg-muted/30 transition-colors"
            >
              <span className="col-span-3 md:col-span-1 font-mono text-sm text-muted-foreground">{r.year ?? '—'}</span>
              <span className="col-span-9 md:col-span-7 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-display font-bold uppercase text-xl md:text-2xl leading-tight">{r.event}</span>
                {r.cars.map((c) => (
                  <span key={c} className="font-mono text-[11px] border border-border px-1.5 py-0.5 text-foreground/80">
                    #{c}
                  </span>
                ))}
              </span>
              <span className="col-span-12 md:col-span-4 flex items-center justify-between md:justify-end gap-4 pl-[25%] md:pl-0">
                <span
                  className={cn(
                    'inline-flex items-center gap-2 font-display font-extrabold italic uppercase text-2xl leading-none',
                    r.status === 'live' && 'text-energy',
                    r.status === 'award' && 'text-amber',
                    r.status === 'milestone' && 'text-muted-foreground'
                  )}
                >
                  {r.status === 'live' && <span className="w-2 h-2 rounded-full bg-energy pulse-glow" />}
                  {r.result}
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'w-5 h-5 shrink-0 transition-all duration-300',
                    isOpen ? 'rotate-180 text-energy' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-label={`${r.event} achievements`}
              aria-hidden={!isOpen}
              className={cn(
                'grid transition-all duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden grid grid-cols-12 gap-x-4 px-5 md:px-6">
                <div className="col-start-4 col-span-9 md:col-start-2 md:col-span-11 pb-6 space-y-5">
                  {r.groups.map((g) => (
                    <div key={g.car ?? 'main'}>
                      {multiCar && (
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pb-2 mb-3 border-b border-border">
                          {g.car && <span className="font-mono text-[11px] text-energy">#{g.car}</span>}
                          {g.title && <span className="font-display font-bold uppercase text-lg leading-tight">{g.title}</span>}
                          {g.result && (
                            <span className="ml-auto font-display font-extrabold italic uppercase text-lg leading-none">{g.result}</span>
                          )}
                        </div>
                      )}
                      <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2.5">
                        {g.achievements.map((a) => (
                          <li key={a} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                            <span className="mt-[0.55em] w-1.5 h-1.5 shrink-0 rotate-45 bg-energy" aria-hidden />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Garage rail ── */
function Garage() {
  const rail = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  const cardStep = () => (rail.current?.querySelector<HTMLElement>('[data-card]')?.offsetWidth ?? 320) + 20;
  const scrollBy = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });

  // Position readout under the rail, written straight to the DOM.
  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0;
    if (thumb.current) thumb.current.style.left = `${p * 80}%`;
    if (counter.current) {
      const n = Math.min(GARAGE.length, Math.round(el.scrollLeft / cardStep()) + 1);
      counter.current.textContent = String(n).padStart(2, '0');
    }
  };

  // Mouse drag. Touch keeps native scrolling, which already feels right.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = rail.current;
    if (e.pointerType !== 'mouse' || e.button !== 0 || !el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
    el.style.scrollSnapType = 'none';
    el.dataset.dragging = '';
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current && rail.current) rail.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const onPointerUp = () => {
    const el = rail.current;
    if (!drag.current || !el) return;
    drag.current = null;
    delete el.dataset.dragging;
    // settle on the nearest card, then hand back to scroll snapping
    const step = cardStep();
    el.scrollTo({ left: Math.round(el.scrollLeft / step) * step, behavior: 'smooth' });
    window.setTimeout(() => {
      if (!drag.current) el.style.scrollSnapType = '';
    }, 450);
  };

  return (
    <section id="garage" className="relative py-24 md:py-32 border-b border-border bg-graphite overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader sheet="03" kicker="Build archive" title={<>The <span className="text-energy">garage</span></>} className="mb-0 md:mb-0">
            Every one of these was cut, welded, wired and raced by students, and each one starts from what the last one taught
            us. From 380 kg in 2012 to under 175 kg by 2020.
          </SectionHeader>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Previous machine"
              className="w-12 h-12 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Next machine"
              className="w-12 h-12 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={rail}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="mt-12 flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:cursor-grab data-[dragging]:cursor-grabbing data-[dragging]:select-none px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] scroll-px-4 sm:scroll-px-6 lg:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))] pb-2"
      >
        {GARAGE.map((m, i) => (
          <article
            key={m.plate ?? m.name}
            data-card
            className="group snap-start shrink-0 w-[82vw] sm:w-[360px] border border-border bg-background flex flex-col"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              {m.image ? (
                <img
                  src={m.image}
                  alt={m.plate ? `Car ${m.plate}, ${m.name}` : `${m.season} car, ${m.name}`}
                  loading="lazy"
                  draggable={false}
                  className={cn(
                    'w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]',
                    m.cropFrame && 'scale-[1.12] group-hover:scale-[1.16]'
                  )}
                />
              ) : m.inBuild ? (
                <div className="absolute inset-0 bg-gradient-to-br from-energy-dark via-energy/70 to-graphite flex flex-col items-center justify-center text-center">
                  <div className="absolute inset-0 drafting-grid opacity-40" aria-hidden />
                  <span className="relative font-display font-extrabold italic uppercase text-5xl leading-none text-white">
                    {m.season}
                  </span>
                  <span className="relative label-mono text-[11px] text-white/80 mt-3">
                    Loading<span className="animate-blink">…</span>
                  </span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-graphite flex flex-col items-center justify-center">
                  <div className="absolute inset-0 drafting-grid opacity-70" aria-hidden />
                  <span className="relative font-display font-extrabold italic text-7xl leading-none text-outline">{m.plate}</span>
                  <span className="relative label-mono text-[10px] text-muted-foreground mt-4">Photo to come</span>
                </div>
              )}
              {m.image && <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />}
              {m.plate && <RacePlate number={m.plate} className="absolute top-3 left-3" />}
              {m.inBuild && (
                <span className="absolute top-3 right-3 label-mono text-[10px] bg-amber text-graphite px-2 py-1">In build</span>
              )}
              <span className="absolute bottom-3 right-3 font-mono text-[10px] text-white/80">
                {String(i + 1).padStart(2, '0')} / {String(GARAGE.length).padStart(2, '0')}
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <p className="label-mono text-[10px] text-energy">{m.meta}</p>
              <h3 className="font-display font-extrabold uppercase text-2xl leading-tight mt-2">{m.name}</h3>
              <p className="flex-1 text-sm text-muted-foreground leading-relaxed mt-2">{m.note}</p>
              <dl className="mt-5 pt-1 grid grid-cols-2 border-t border-border">
                <div className="pt-3 pr-3">
                  <dt className="label-mono text-[9px] text-muted-foreground">Season</dt>
                  <dd className="font-mono text-sm mt-1">{m.season ?? '—'}</dd>
                </div>
                <div className="pt-3 pl-3 border-l border-border">
                  <dt className="label-mono text-[9px] text-muted-foreground">Mass</dt>
                  <dd className="font-mono text-sm mt-1">{m.mass ?? '—'}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
        <div className="shrink-0 w-px" aria-hidden />
      </div>

      {/* Rail position */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex items-center gap-5" aria-hidden>
        <span className="font-mono text-xs text-muted-foreground">
          <span ref={counter} className="text-foreground">
            01
          </span>{' '}
          / {String(GARAGE.length).padStart(2, '0')}
        </span>
        <span className="relative flex-1 h-px bg-border">
          <span ref={thumb} className="absolute -top-px left-0 h-[3px] w-1/5 bg-energy" />
        </span>
        <span className="hidden md:inline label-mono text-[10px] text-muted-foreground">Drag to browse</span>
      </div>
    </section>
  );
}

/* ── Build cycle: the route line fills as the page scrolls past each operation ── */
function BuildCycle() {
  const [reached, setReached] = useState(0);
  const fill = useRef<HTMLSpanElement>(null);
  const head = useRef<HTMLSpanElement>(null);

  const list = useScrollProgress<HTMLOListElement>((p, el) => {
    if (fill.current) fill.current.style.transform = `scaleY(${p})`;
    if (head.current) head.current.style.top = `${p * 100}%`;
    const y = p * el.offsetHeight;
    let n = 0;
    el.querySelectorAll<HTMLElement>('[data-op]').forEach((li) => {
      if (li.offsetTop + 28 <= y + 1) n += 1;
    });
    setReached(n);
  }, 0.62);

  return (
    <ol ref={list} className="lg:col-span-7 relative">
      <span className="absolute left-[27px] top-0 bottom-0 w-px bg-border" aria-hidden />
      <span ref={fill} className="absolute left-[27px] top-0 bottom-0 w-px bg-energy origin-top scale-y-0" aria-hidden />
      <span
        ref={head}
        className="absolute left-[27px] top-0 w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-energy"
        aria-hidden
      />
      {BUILD_STAGES.map((stage, i) => {
        const Icon = stage.icon;
        const done = i < reached;
        const current = i === reached - 1;
        return (
          <li key={stage.op} data-op>
            <Reveal delay={i * 60} className="relative flex gap-6 pb-10 last:pb-0">
              <span
                className={cn(
                  'relative z-10 w-14 h-14 shrink-0 border flex items-center justify-center transition-colors duration-500',
                  done ? 'bg-energy border-energy' : 'bg-background border-border'
                )}
              >
                <Icon className={cn('w-6 h-6 transition-colors duration-500', done ? 'text-white' : 'text-energy')} />
              </span>
              <div
                className={cn(
                  'flex-1 border bg-card p-6 transition-colors duration-500 hover:border-energy/50',
                  current ? 'border-energy/60' : 'border-border'
                )}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display font-extrabold uppercase italic text-3xl leading-none">{stage.title}</h3>
                  <span className={cn('font-mono text-xs transition-colors duration-500', done ? 'text-energy' : 'text-muted-foreground')}>
                    {stage.op}
                  </span>
                </div>
                <p className="mt-3 text-muted-foreground leading-relaxed">{stage.body}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {stage.tags.map((t) => (
                    <li key={t} className="label-mono text-[10px] border border-border px-2 py-1 text-foreground/80">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Footage: a poster until asked, so three players don't load with the page ── */
function Reel({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const [poster, setPoster] = useState(true);

  if (playing) {
    return (
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
      className="group relative block w-full h-full overflow-hidden"
    >
      <span className="absolute inset-0 drafting-grid opacity-60" aria-hidden />
      {poster && (
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          onError={() => setPoster(false)}
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.04]"
        />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" aria-hidden />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-16 h-16 flex items-center justify-center bg-energy text-white transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110">
          <Play className="w-6 h-6 fill-current translate-x-0.5" />
        </span>
      </span>
      <span className="absolute bottom-3 left-3 flex items-center gap-2 label-mono text-[10px] text-white/90">
        <span className="w-1.5 h-1.5 rounded-full bg-energy" aria-hidden />
        Play reel
      </span>
    </button>
  );
}

/* ── Join: type your name onto a length of chassis tube ── */
function NameTube({ value, onChange, onSubmit }: { value: string; onChange: (v: string) => void; onSubmit: () => void }) {
  return (
    <form
      className="mt-8 max-w-xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="chassis-name" className="label-mono text-[10px] text-muted-foreground">
        Try it: type your name onto the tube
      </label>
      <div className="chassis-tube relative mt-3 h-16 sm:h-[4.5rem] flex items-center px-7 sm:px-9">
        {/* weld beads where the tube meets its nodes */}
        <span className="absolute left-3 inset-y-2 w-1 rounded-full bg-black/30" aria-hidden />
        <span className="absolute right-3 inset-y-2 w-1 rounded-full bg-black/30" aria-hidden />
        <input
          id="chassis-name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={24}
          autoComplete="name"
          spellCheck={false}
          placeholder="Your name here"
          className="w-full min-w-0 bg-transparent outline-none font-display font-extrabold italic uppercase tracking-[0.06em] text-3xl sm:text-4xl leading-none text-white caret-white"
        />
        <span className="hidden sm:block shrink-0 pl-4 font-mono text-[10px] tracking-[0.18em] text-white/70 whitespace-nowrap">
          CREW · {CLUB.nowBuilding.match(/\d{4}/)?.[0]}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground min-h-[1.25rem]">
        {value.trim() ? (
          <>
            Reads well in chassis red, <span className="text-foreground font-semibold">{value.trim()}</span>. Press Enter to
            start your application.
          </>
        ) : (
          'Go on. See how it reads in chassis red.'
        )}
      </p>
    </form>
  );
}

const Home = () => {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [chassisName, setChassisName] = useState('');
  const openJoin = () => setIsRegistrationModalOpen(true);

  return (
    <div className="relative bg-background overflow-x-hidden">
      {/* ═════════ HERO ═════════ */}
      <section className="relative border-b border-border">
        <div className="absolute inset-0 drafting-grid drafting-grid-fade pointer-events-none" aria-hidden />
        <div
          className="absolute -top-40 right-0 w-[60vw] h-[60vw] rounded-full bg-energy/10 blur-[120px] pointer-events-none"
          aria-hidden
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-16 md:pb-20 grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <div className="lg:col-span-5">
            <p className="label-mono text-muted-foreground animate-fade-in-up">
              <span className="text-energy">●</span> {CLUB.institute}
            </p>
            <h1 className="mt-6 font-display font-extrabold italic uppercase tracking-tight leading-[0.86] text-[3.4rem] sm:text-7xl xl:text-[5.6rem]">
              {['We build', 'the machines', 'we race.'].map((line, i) => (
                <span key={line} className="line-mask">
                  <span className={cn('line-rise', i === 2 && 'text-energy')} style={{ animationDelay: `${100 + i * 110}ms` }}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <p className="mt-7 text-lg text-muted-foreground leading-relaxed max-w-md animate-fade-in-up delay-200">
              <strong className="text-foreground font-semibold">Team AutoArchitects</strong> is the off-road racing team of SIT's
              Department of Mechanical Engineering. Every season we design, simulate, fabricate and test an all-terrain vehicle
              from bare tube stock, then race it at <span className="text-foreground">BAJA SAEINDIA</span> and{' '}
              <span className="text-foreground">ATVC</span>.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-300">
              <button
                onClick={openJoin}
                className="group h-14 px-7 bg-energy text-white font-display font-bold uppercase tracking-wide text-lg flex items-center justify-center gap-2 hover:bg-energy-dark transition-colors"
              >
                Join the build
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#build-cycle"
                className="h-14 px-7 border border-foreground/30 font-display font-bold uppercase tracking-wide text-lg flex items-center justify-center gap-2 hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                How a car is made
                <ArrowDown className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Figure 1 */}
          <figure className="lg:col-span-7 animate-fade-in delay-200">
            <div className="crop-marks">
              <CadViewport className="aspect-[4907/3995] border border-border">
                <img
                  src={IMAGES.car150Track}
                  alt="Team AutoArchitects car number 150 at speed on a dirt track"
                  className="absolute inset-0 w-full h-full object-cover"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                <Callout x={59} y={41.3} side="right" title="Roll cage" sub="Tubular steel · welded in-house" delay={700} />
                <Callout x={46.5} y={64.5} side="left" title="Powertrain" sub="Briggs & Stratton engine" delay={900} />
                <Callout x={77.75} y={74.6} side="down" title="Suspension" sub="Independent · long-travel" delay={1100} />
                <RacePlate number="150" size="sm" className="absolute top-4 left-4" />
              </CadViewport>
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-4 label-mono text-[10px] text-muted-foreground">
              <span>Fig. 1: Car #150 "Imagination 4.0" at speed</span>
              <span className="hidden sm:inline">Designed &amp; manufactured by students</span>
            </figcaption>
          </figure>
        </div>

        {/* Spec strip */}
        <div className="relative border-t border-border bg-graphite/80">
          <dl className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  'px-4 sm:px-6 lg:px-8 py-6 border-border',
                  i % 2 === 0 && 'border-r',
                  i < 2 && 'border-b lg:border-b-0',
                  i === 1 && 'lg:border-r',
                  i === 2 && 'lg:border-r'
                )}
              >
                <dt className="label-mono text-[10px] text-muted-foreground">{s.label}</dt>
                <dd className="font-display font-extrabold italic text-4xl sm:text-5xl leading-none mt-2">
                  <Odometer value={s.value} />
                </dd>
                <dd className="text-xs text-muted-foreground mt-2 hidden sm:block">{s.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═════════ TICKER ═════════ */}
      <div className="bg-amber text-graphite border-b border-border py-3">
        <Marquee items={['Design', 'Analyse', 'Fabricate', 'Test', 'Compete', 'Repeat']} />
      </div>

      {/* ═════════ BUILD CYCLE ═════════ */}
      <section id="build-cycle" className="relative py-24 md:py-32 border-b border-border scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeader sheet="01" kicker="Route sheet" title={<>From tube stock <span className="text-energy">to start line</span></>}>
                There's no kit and no off-the-shelf frame. A season is a full product cycle, run like a production line: five
                operations, all done by students.
              </SectionHeader>
              <figure className="hidden lg:block crop-marks max-w-sm">
                <img
                  src={IMAGES.chassisShakedown}
                  alt="An unpainted ATV chassis kicking up dust on a shakedown run"
                  loading="lazy"
                  className="w-full aspect-[480/526] object-cover border border-border"
                />
                <figcaption className="label-mono text-[10px] text-muted-foreground mt-3">
                  Fig. 3: Bare chassis on a shakedown run (OP-40)
                </figcaption>
              </figure>
            </div>
          </div>

          <BuildCycle />
        </div>
      </section>

      {/* ═════════ ANATOMY ═════════ */}
      <Anatomy />

      {/* ═════════ GARAGE ═════════ */}
      <Garage />

      {/* ═════════ WEIGH-IN ═════════ */}
      <WeighIn />

      {/* ═════════ RECORD ═════════ */}
      <section id="record" className="relative py-24 md:py-32 border-b border-border bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sheet="05" kicker="Timing sheet" title={<>Competition <span className="text-energy">record</span></>}>
            Student motorsport is judged on design reports, cost, sales and inspection as much as lap times. AIR is All-India
            Rank. Here is every car's result since the team's first in 2012. Open an event to see what the car achieved there.
          </SectionHeader>

          <Reveal>
            <CompetitionRecord />
          </Reveal>
          <div className="mt-6 flex justify-end">
            <Link to="/about#our-journey" className="inline-flex items-center gap-2 label-mono text-energy hover:text-energy-light">
              Full team history <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═════════ FOOTAGE ═════════ */}
      <section id="footage" className="relative py-24 md:py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sheet="06" kicker="Paddock footage" title={<>On track, <span className="text-energy">on camera</span></>}>
            The workshop, the paddock and the dirt, filmed by the team.
          </SectionHeader>
          <div className="grid md:grid-cols-3 gap-6">
            {VIDEOS.map((v, i) => (
              <Reveal key={v.id} delay={i * 80}>
                <article className="border border-border bg-card h-full flex flex-col hover:border-energy/50 transition-colors">
                  <div className="aspect-video bg-black">
                    <Reel id={v.id} title={v.title} />
                  </div>
                  <div className="p-5 border-t border-border">
                    <p className="label-mono text-[10px] text-energy">Reel {String(i + 1).padStart(2, '0')}</p>
                    <h3 className="font-display font-extrabold uppercase text-2xl mt-1.5">{v.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{v.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ JOIN ═════════ */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hazard-stripe p-[6px]">
            <div className="relative bg-background overflow-hidden">
              <div className="absolute inset-0 drafting-grid opacity-60 pointer-events-none" aria-hidden />
              <div className="relative grid lg:grid-cols-12 gap-10 p-8 sm:p-12 lg:p-16">
                <div className="lg:col-span-7">
                  <p className="label-mono text-energy">Recruitment open</p>
                  <h2 className="mt-4 font-display font-extrabold italic uppercase leading-[0.9] tracking-tight text-5xl sm:text-6xl lg:text-7xl">
                    Put your name
                    <br />
                    on the chassis.
                  </h2>
                  <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
                    You don't need to have built a car before. You learn by building one. The current crew comes from{' '}
                    {BRANCHES.slice(0, -1).join(', ')} and {BRANCHES[BRANCHES.length - 1]} engineering, and every sub-team takes
                    newcomers.
                  </p>
                  <NameTube value={chassisName} onChange={setChassisName} onSubmit={openJoin} />
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={openJoin}
                      className="group h-14 px-8 bg-energy text-white font-display font-bold uppercase tracking-wide text-lg flex items-center justify-center gap-2 hover:bg-energy-dark transition-colors"
                    >
                      Apply to join
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                    <Link
                      to="/members"
                      className="h-14 px-8 border border-foreground/30 font-display font-bold uppercase tracking-wide text-lg flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-colors"
                    >
                      Meet the crew
                      <ArrowUpRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <p className="label-mono text-muted-foreground mb-3">Sub-teams</p>
                  <ul className="border-t border-border">
                    {SUBSYSTEMS.map((s) => (
                      <li key={s.id}>
                        <Link
                          to={`/members#${s.anchor}`}
                          className="group flex items-center justify-between py-3.5 border-b border-border"
                        >
                          <span className="flex items-baseline gap-3">
                            <span className="font-mono text-xs text-energy">{s.code}</span>
                            <span className="font-display font-bold uppercase text-xl group-hover:text-energy transition-colors">
                              {s.name}
                            </span>
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-energy group-hover:translate-x-1 transition-all" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RegistrationModal
        open={isRegistrationModalOpen}
        onOpenChange={setIsRegistrationModalOpen}
        initialName={chassisName.trim()}
      />
    </div>
  );
};

export default Home;
