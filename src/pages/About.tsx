import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye, ShieldCheck } from 'lucide-react';
import sunilImage from '@/assets/Sunil.jpg';
import nareshImage from '@/assets/Naresh.jpg';
import { SectionHeader, Reveal, RacePlate } from '@/components/brand/Primitives';
import { CLUB, RECORD, IMAGES } from '@/data/club';
import { cn } from '@/lib/utils';

const BRIEF = [
  {
    code: 'REQ-01',
    title: 'Mission',
    icon: Target,
    body: 'Give students real, hands-on engineering: design, manufacturing, testing and national-level competition on a vehicle they built themselves.',
  },
  {
    code: 'REQ-02',
    title: 'Vision',
    icon: Eye,
    body: 'Be the leading university ATV team in the country, pioneering sustainable off-road vehicle technology and the engineers who build it.',
  },
  {
    code: 'REQ-03',
    title: 'Values',
    icon: ShieldCheck,
    body: 'Engineering rigour, safety before speed, teamwork across every branch, and responsible, sustainable practice in everything we build.',
  },
];

const ADVISORS = [
  {
    name: 'Dr. B Sunil',
    role: 'Professor, Mechanical Engineering',
    image: sunilImage,
    imgPos: 'object-center',
    focus: 'Vehicle dynamics & automotive structures',
    body: 'Brings over 15 years of expert guidance in vehicle dynamics and automotive structures.',
  },
  {
    name: 'Dr. Naresh H',
    role: 'Assistant Professor, Mechanical Engineering',
    image: nareshImage,
    imgPos: 'object-top',
    focus: 'Power systems & automotive controls',
    body: 'Specialises in power systems and automotive control set-ups, guiding the team’s hybrid technology work.',
  },
];

const About = () => {
  const timeline = [...RECORD].reverse();

  return (
    <div className="relative bg-background overflow-x-hidden">
      {/* ═════════ HERO ═════════ */}
      <section className="relative border-b border-border">
        <div className="absolute inset-0 drafting-grid drafting-grid-fade pointer-events-none" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-20 pb-16 md:pb-24 grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-6">
            <p className="label-mono text-muted-foreground animate-fade-in-up">
              <span className="text-energy">●</span> About the team · Est. {CLUB.founded}
            </p>
            <h1 className="mt-6 font-display font-extrabold italic uppercase tracking-tight leading-[0.86] text-6xl sm:text-7xl xl:text-8xl animate-fade-in-up delay-100">
              Ten students
              <br />
              and a <span className="text-energy">rulebook.</span>
            </h1>
            <div className="mt-8 space-y-4 text-lg text-muted-foreground leading-relaxed max-w-xl animate-fade-in-up delay-200">
              <p>
                That's how Team AutoArchitects started at {CLUB.institute} in {CLUB.founded}. Two years later our first car took
                the start at <span className="text-foreground">BAJA SAEINDIA 2010</span> and finished 37th out of 180 teams.
              </p>
              <p>
                Since then the team has grown past thirty engineers and more than ten machines, each one designed, analysed,
                fabricated and raced by students. The cars have changed every season. The rule hasn't:{' '}
                <span className="text-foreground font-semibold">if we can make it, we make it ourselves.</span>
              </p>
            </div>
          </div>

          <figure className="lg:col-span-6 animate-fade-in delay-200">
            <div className="crop-marks">
              <div className="relative overflow-hidden border border-border">
                <img
                  src={IMAGES.teamBaja2025}
                  alt="Team AutoArchitects with car M37 at BAJA SAEINDIA 2025"
                  className="w-full aspect-[4/3] object-cover"
                />
                <RacePlate number="M37" size="sm" className="absolute top-4 right-4" />
              </div>
            </div>
            <figcaption className="mt-4 label-mono text-[10px] text-muted-foreground">
              Fig. 1: The crew with car M37 in the paddock, BAJA SAEINDIA 2025
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═════════ DESIGN BRIEF ═════════ */}
      <section className="relative py-24 md:py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sheet="01" kicker="Design brief" title={<>What we're <span className="text-energy">built for</span></>} />
          <div className="grid md:grid-cols-3 border border-border divide-y md:divide-y-0 md:divide-x divide-border bg-card">
            {BRIEF.map((b, i) => {
              const Icon = b.icon;
              return (
                <Reveal key={b.code} delay={i * 80} className="p-8 lg:p-10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-energy">{b.code}</span>
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="mt-8 font-display font-extrabold italic uppercase text-4xl leading-none">{b.title}</h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{b.body}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════════ ADVISORS ═════════ */}
      <section className="relative py-24 md:py-32 border-b border-border bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sheet="02" kicker="Checked & approved by" title={<>Faculty <span className="text-energy">advisors</span></>}>
            Every design goes past the people who sign off on it. Our faculty advisors guide the engineering and keep the team
            honest.
          </SectionHeader>

          <div className="grid lg:grid-cols-2 gap-6">
            {ADVISORS.map((a, i) => (
              <Reveal key={a.name} delay={i * 100}>
                <article className="border border-border bg-background grid sm:grid-cols-[180px_1fr] h-full">
                  <div className="relative aspect-square sm:aspect-auto sm:h-full overflow-hidden border-b sm:border-b-0 sm:border-r border-border bg-muted">
                    <img
                      src={a.image}
                      alt={a.name}
                      className={cn('absolute inset-0 w-full h-full object-cover grayscale contrast-110', a.imgPos)}
                    />
                  </div>
                  <div className="p-6 flex flex-col gap-0">

                    <p className="label-mono text-[10px] text-energy">Advisor {String(i + 1).padStart(2, '0')}</p>
                    <h3 className="mt-2 font-display font-extrabold uppercase text-3xl leading-none">{a.name}</h3>
                    <p className="mt-2 text-sm text-foreground/80">{a.role}</p>
                    <p className="mt-4 mb-6 text-muted-foreground leading-relaxed">{a.body}</p>
                    <dl className="mt-auto pt-3 grid grid-cols-2 border-t border-border">
                      <div className="pt-3 pr-3">
                        <dt className="label-mono text-[9px] text-muted-foreground">Focus</dt>
                        <dd className="text-sm mt-1">{a.focus}</dd>
                      </div>
                      <div className="pt-3 pl-3 border-l border-border">
                        <dt className="label-mono text-[9px] text-muted-foreground">Credentials</dt>
                        <dd className="text-sm mt-1">PhD · 15+ yrs</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ TIMELINE ═════════ */}
      <section id="our-journey" className="relative py-24 md:py-32 border-b border-border scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sheet="03" kicker="Revision history" title={<>The <span className="text-energy">journey</span></>}>
            Every engineering drawing keeps a revision table. This is ours.
          </SectionHeader>

          <ol className="relative">
            <span className="absolute left-[88px] md:left-1/2 top-0 bottom-0 w-px bg-border" aria-hidden />
            {timeline.map((m, i) => {
              const right = i % 2 === 1;
              return (
                <li key={m.year + m.event} className="relative mb-8 last:mb-0">
                  <Reveal className="grid grid-cols-[88px_1fr] md:grid-cols-2 items-center">
                    <div className={cn('md:pr-12 md:text-right', right && 'md:order-2 md:pl-12 md:pr-0 md:text-left')}>
                      <span
                        className={cn(
                          'font-display font-extrabold italic text-4xl md:text-6xl leading-none',
                          m.status === 'live' ? 'text-energy' : 'text-foreground/90'
                        )}
                      >
                        {m.year}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'absolute left-[88px] md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 border-2',
                        m.status === 'live' ? 'bg-energy border-energy pulse-glow' : 'bg-background border-foreground/60'
                      )}
                      aria-hidden
                    />
                    <div className={cn('pl-8 md:pl-12', right && 'md:order-1 md:pl-0 md:pr-12')}>
                      <div className="border border-border bg-card p-5 hover:border-energy/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-display font-extrabold uppercase text-2xl leading-tight">{m.event}</h3>
                          <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap mt-1.5">
                            Rev. {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{m.detail}</p>
                        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between label-mono text-[10px]">
                          <span className={cn(m.status === 'live' ? 'text-energy' : m.status === 'award' ? 'text-amber' : 'text-foreground')}>
                            {m.result}
                          </span>
                          {m.members && <span className="text-muted-foreground">Crew {m.members}</span>}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ═════════ CTA ═════════ */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <h2 className="font-display font-extrabold italic uppercase text-4xl sm:text-5xl leading-[0.92] tracking-tight">
            The next revision
            <br />
            is <span className="text-energy">being built now.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/members"
              className="group h-14 px-8 bg-energy text-white font-display font-bold uppercase tracking-wide text-lg flex items-center justify-center gap-2 hover:bg-energy-dark transition-colors"
            >
              Meet the crew <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/#garage"
              className="h-14 px-8 border border-foreground/30 font-display font-bold uppercase tracking-wide text-lg flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
            >
              See the garage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
