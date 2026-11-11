import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, ArrowLeft, ArrowUpRight, ChevronDown } from 'lucide-react';
import RegistrationModal from '@/components/RegistrationModal';
import BuggyBlueprint from '@/components/brand/BuggyBlueprint';
import { SectionHeader, RacePlate, Marquee, Reveal, Callout } from '@/components/brand/Primitives';
import { useInView } from '@/hooks/use-in-view';
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

  return (
    <section id="anatomy" className="relative py-24 md:py-32 border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader sheet="02" kicker="General arrangement" title={<>Anatomy of <span className="text-energy">the machine</span></>}>
          An ATV is five systems that all have to survive the same crash, jump and four-hour endurance run. Each one has its
          own sub-team of students who own it from first sketch to final weld.
        </SectionHeader>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div ref={ref} className={cn('lg:col-span-7 lg:sticky lg:top-28', inView && 'is-in')}>
            <div className="crop-marks">
              <div className="relative border border-border bg-graphite/60 p-3 sm:p-6">
                <div className="absolute inset-0 drafting-grid opacity-70 pointer-events-none" aria-hidden />
                <BuggyBlueprint active={active} onSelect={select} className="relative" />
              </div>
            </div>
            <p className="label-mono text-[10px] text-muted-foreground mt-4">
              Fig. 2: Schematic side elevation. Hover a callout or pick a system.
            </p>
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
  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 20), behavior: 'smooth' });
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
        className="mt-12 flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] scroll-px-4 sm:scroll-px-6 lg:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))] pb-2"
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
    </section>
  );
}

const Home = () => {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
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
            <h1 className="mt-6 font-display font-extrabold italic uppercase tracking-tight leading-[0.86] text-[3.4rem] sm:text-7xl xl:text-[5.6rem] animate-fade-in-up delay-100">
              We build
              <br />
              the machines
              <br />
              <span className="text-energy">we race.</span>
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
              <div className="relative aspect-[4907/3995] overflow-hidden border border-border">
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
              </div>
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
                <dd className="font-display font-extrabold italic text-4xl sm:text-5xl leading-none mt-2">{s.value}</dd>
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

          <ol className="lg:col-span-7 relative">
            <span className="absolute left-[27px] top-4 bottom-4 w-px bg-border" aria-hidden />
            {BUILD_STAGES.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <li key={stage.op}>
                  <Reveal delay={i * 60} className="relative flex gap-6 pb-10 last:pb-0">
                    <span className="relative z-10 w-14 h-14 shrink-0 bg-background border border-border flex items-center justify-center">
                      <Icon className="w-6 h-6 text-energy" />
                    </span>
                    <div className="flex-1 border border-border bg-card p-6 hover:border-energy/50 transition-colors">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-display font-extrabold uppercase italic text-3xl leading-none">{stage.title}</h3>
                        <span className="font-mono text-xs text-energy">{stage.op}</span>
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
        </div>
      </section>

      {/* ═════════ ANATOMY ═════════ */}
      <Anatomy />

      {/* ═════════ GARAGE ═════════ */}
      <Garage />

      {/* ═════════ RECORD ═════════ */}
      <section id="record" className="relative py-24 md:py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sheet="04" kicker="Timing sheet" title={<>Competition <span className="text-energy">record</span></>}>
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
      <section id="footage" className="relative py-24 md:py-32 border-b border-border bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sheet="05" kicker="Paddock footage" title={<>On track, <span className="text-energy">on camera</span></>}>
            The workshop, the paddock and the dirt, filmed by the team.
          </SectionHeader>
          <div className="grid md:grid-cols-3 gap-6">
            {VIDEOS.map((v, i) => (
              <Reveal key={v.id} delay={i * 80}>
                <article className="border border-border bg-background h-full flex flex-col">
                  <div className="aspect-video bg-black">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${v.id}`}
                      title={v.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
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
                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
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

      <RegistrationModal open={isRegistrationModalOpen} onOpenChange={setIsRegistrationModalOpen} />
    </div>
  );
};

export default Home;
