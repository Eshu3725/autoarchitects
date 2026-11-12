import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Mail, Phone } from 'lucide-react';
import { SectionHeader, Reveal, Callout, RacePlate } from '@/components/brand/Primitives';
import SponsorEnquiryForm from '@/components/SponsorEnquiryForm';
import SponsorMarquee from '@/components/SponsorMarquee';
import type { TierChoice } from '@/types/sponsor';
import { CLUB, IMAGES, TIERS, DELIVERABLES, CONTACTS, PATRONS, BAJA_FACTS } from '@/data/club';
import { fetchSponsors, groupByTier, STATIC_SPONSORS, type Sponsor } from '@/lib/sponsors';
import { cn } from '@/lib/utils';

const SPONSOR_MAIL = `mailto:${CLUB.email}?subject=${encodeURIComponent(`Sponsorship · ${CLUB.nowBuilding}`)}`;

const scrollToForm = () => {
  const el = document.getElementById('enquire');
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Sponsors = () => {
  const [tier, setTier] = useState<TierChoice>('undecided');
  const chooseTier = (t: TierChoice) => {
    setTier(t);
    scrollToForm();
  };

  // Sponsors added in the admin dashboard. Starts with the built-in list so the
  // section never renders empty; the database list replaces it once loaded.
  const [sponsors, setSponsors] = useState<Sponsor[]>(STATIC_SPONSORS);
  useEffect(() => {
    let cancelled = false;
    fetchSponsors({ visibleOnly: true }).then(({ data, error }) => {
      if (cancelled) return;
      if (error) console.warn('Sponsors: using built-in list.', error);
      else if (data.length > 0) setSponsors(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const sponsorGroups = groupByTier(sponsors);

  const strip = [
    { value: BAJA_FACTS[3].value, label: 'Teams at BAJA SAEINDIA' },
    { value: BAJA_FACTS[2].value, label: 'Days of competition' },
    { value: String(CLUB.crew), label: 'Student engineers' },
    { value: String(TIERS.length), label: 'Ways to partner' },
  ];

  return (
    <div className="relative bg-background overflow-x-hidden">
      {/* ═════════ HERO ═════════ */}
      <section className="relative border-b border-border">
        <div className="absolute inset-0 drafting-grid drafting-grid-fade pointer-events-none" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-16 md:pb-20 grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <div className="lg:col-span-5">
            <p className="label-mono text-muted-foreground animate-fade-in-up">
              <span className="text-energy">●</span> Partner with us · {CLUB.nowBuilding}
            </p>
            <h1 className="mt-6 font-display font-extrabold italic uppercase tracking-tight leading-[0.86] text-[3.4rem] sm:text-7xl xl:text-[5.4rem] animate-fade-in-up delay-100">
              Your logo.
              <br />
              On the <span className="text-energy">nose.</span>
            </h1>
            <p className="mt-7 text-lg text-muted-foreground leading-relaxed max-w-md animate-fade-in-up delay-200">
              We're designing and fabricating an IC-engine ATV to the SAE rulebook for{' '}
              <span className="text-foreground">{CLUB.nowBuilding}</span>. Back it with money, components or services, and your
              brand travels with the car: on track, in the pits and across our channels.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-300">
              <a
                href="#enquire"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToForm();
                }}
                className="group h-14 px-7 bg-energy text-white font-display font-bold uppercase tracking-wide text-lg flex items-center justify-center gap-2 hover:bg-energy-dark transition-colors"
              >
                Become a sponsor
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#tiers"
                className="h-14 px-7 border border-foreground/30 font-display font-bold uppercase tracking-wide text-lg flex items-center justify-center gap-2 hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                See the tiers
                <ArrowDown className="w-5 h-5" />
              </a>
            </div>
          </div>

          <figure className="lg:col-span-7 animate-fade-in delay-200">
            <div className="crop-marks">
              <div className="relative aspect-[3/2] overflow-hidden border border-border">
                <img
                  src={IMAGES.m37Pits}
                  alt="Car M37 in the paddock, showing the firewall, nose and sidepod where sponsor logos go"
                  className="absolute inset-0 w-full h-full object-cover"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <Callout x={49} y={34} side="right" title="Firewall" sub="Title sponsor" delay={700} />
                <Callout x={56} y={73} side="right" title="Nose" sub="Title · Major" delay={900} />
                <Callout x={39} y={64} side="left" title="Sidepod" sub="Associate · Technical · Media" delay={1100} />
              </div>
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-4 label-mono text-[10px] text-muted-foreground">
              <span>Fig. 1: Logo zones on car M37</span>
              <span className="hidden sm:inline">Helmet &amp; crew kit too</span>
            </figcaption>
          </figure>
        </div>

        <div className="relative border-t border-border bg-graphite/80">
          <dl className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4">
            {strip.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  'px-4 sm:px-6 lg:px-8 py-6 border-border',
                  i % 2 === 0 && 'border-r',
                  i < 2 && 'border-b lg:border-b-0',
                  (i === 1 || i === 2) && 'lg:border-r'
                )}
              >
                <dt className="label-mono text-[10px] text-muted-foreground">{s.label}</dt>
                <dd className="font-display font-extrabold italic text-4xl sm:text-5xl leading-none mt-2">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═════════ CURRENT PARTNERS ═════════ */}
      <section className="relative py-24 md:py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sheet="01" kicker="On the car now" title={<>Current <span className="text-energy">partners</span></>}>
            The institute, industry and software partners who already put their name on the build.
          </SectionHeader>
        </div>

        {/* Full-bleed logo strip */}
        <Reveal className="mb-12 md:mb-16">
          <SponsorMarquee sponsors={sponsors} />
        </Reveal>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-border divide-y divide-border bg-card">
            {sponsorGroups.map((group, i) => (
              <Reveal key={group.tier.id} delay={i * 60} className="grid md:grid-cols-12 gap-4 p-5 md:p-6 items-center">
                <p className="md:col-span-3 label-mono text-energy">{group.tier.group}</p>
                <ul className="md:col-span-9 flex flex-wrap gap-3">
                  {group.sponsors.map((s) => {
                    const content = (
                      <>
                        {s.logo_url && (
                          <span className="h-8 w-14 shrink-0 bg-bone flex items-center justify-center p-1">
                            <img src={s.logo_url} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                          </span>
                        )}
                        <span>{s.name}</span>
                        {s.since && <span className="font-mono text-[10px] text-muted-foreground font-normal not-italic">{s.since}</span>}
                      </>
                    );
                    const cls =
                      'border border-border bg-background px-4 h-12 flex items-center gap-3 font-display font-extrabold uppercase text-lg sm:text-xl leading-none tracking-tight';
                    return (
                      <li key={s.id}>
                        {s.website ? (
                          <a
                            href={s.website}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className={cn(cls, 'hover:border-energy hover:text-energy transition-colors')}
                          >
                            {content}
                          </a>
                        ) : (
                          <span className={cls}>{content}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ TIERS ═════════ */}
      <section id="tiers" className="relative py-24 md:py-32 border-b border-border bg-graphite scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sheet="02" kicker="Sponsorship scheme" title={<>Six ways <span className="text-energy">onto the car</span></>}>
            Every tier puts your brand on our website, our social channels and the banners at the vehicle unveiling, alumni
            meet and workshops. Higher tiers move it onto the car itself.
          </SectionHeader>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TIERS.map((t, i) => (
              <Reveal key={t.id} delay={i * 60}>
                <article
                  className={cn(
                    'relative h-full border bg-background p-6 flex flex-col',
                    t.id === 'title' ? 'border-energy' : 'border-border'
                  )}
                >
                  <span className={cn('absolute top-0 left-0 right-0 h-1', t.id === 'title' ? 'bg-energy' : 'bg-energy/40')} aria-hidden />
                  <div className="flex items-center justify-between">
                    <RacePlate number={t.code} size="sm" />
                    <span className="label-mono text-[10px] text-muted-foreground">Tier</span>
                  </div>
                  <h3 className="mt-6 font-display font-extrabold italic uppercase text-4xl leading-none">{t.name}</h3>
                  <p className="mt-2 font-mono text-sm text-amber">{t.amount}</p>
                  <p className="mt-4 text-muted-foreground leading-relaxed flex-1">{t.pitch}</p>
                  <button
                    type="button"
                    onClick={() => chooseTier(t.id)}
                    className={cn(
                      'group mt-6 h-11 px-4 flex items-center justify-between font-display font-bold uppercase tracking-wide transition-colors',
                      t.id === 'title'
                        ? 'bg-energy text-white hover:bg-energy-dark'
                        : 'border border-border hover:border-energy hover:text-energy'
                    )}
                  >
                    Enquire about {t.name}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ DELIVERABLES MATRIX ═════════ */}
      <section className="relative py-24 md:py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sheet="03" kicker="Bill of deliverables" title={<>What you <span className="text-energy">get</span></>}>
            Before the event and at the event, tier by tier.
          </SectionHeader>
          <Reveal>
            <div className="border border-border bg-card overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 label-mono text-[10px] text-muted-foreground font-normal w-[34%]">Deliverable</th>
                    {TIERS.map((t) => (
                      <th key={t.id} className="p-4 text-center">
                        <span className="block font-mono text-[10px] text-energy">{t.code}</span>
                        <span className="block font-display font-bold uppercase text-base leading-tight mt-1">{t.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DELIVERABLES.map((d) => (
                    <tr key={d.item} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                      <th scope="row" className="text-left p-4 font-normal text-foreground/90">
                        {d.item}
                      </th>
                      {TIERS.map((t) => {
                        const v = d.tiers[t.id];
                        return (
                          <td key={t.id} className="p-4 text-center align-middle">
                            {v === true ? (
                              <Check className="w-4 h-4 mx-auto text-energy" aria-label="Included" />
                            ) : v ? (
                              <span className="label-mono text-[10px] text-amber">{v}</span>
                            ) : (
                              <span className="text-muted-foreground/40" aria-label="Not included">
                                ·
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="mt-4 label-mono text-[10px] text-muted-foreground sm:hidden">Scroll the table sideways →</p>
        </div>
      </section>

      {/* ═════════ ENQUIRY FORM ═════════ */}
      <section id="enquire" className="relative py-24 md:py-32 border-b border-border bg-graphite scroll-mt-20">
        <div className="absolute inset-0 drafting-grid opacity-40 pointer-events-none" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeader sheet="04" kicker="Sponsorship form" title={<>Put your name <span className="text-energy">on the car</span></>}>
                Tell us who you are and how you'd like to back the {CLUB.nowBuilding} build. It goes straight to the team, and
                we'll reply with the full brochure.
              </SectionHeader>
              <p className="text-sm text-muted-foreground leading-relaxed -mt-6 border-l-2 border-energy pl-4">
                <span className="text-foreground font-semibold">Team members:</span> found a company that might sponsor us?
                Choose "Team member referring a sponsor" and enter their details.
              </p>
            </div>
          </div>
          <div className="lg:col-span-8">
            <SponsorEnquiryForm tier={tier} onTierChange={setTier} />
          </div>
        </div>
      </section>

      {/* ═════════ CONTACT SHEET ═════════ */}
      <section id="contact" className="relative py-24 md:py-32 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sheet="05" kicker="Contact sheet" title={<>Talk to <span className="text-energy">the team</span></>}>
            Rather talk first? Call or write to any of us. Sponsorship can be monetary or in kind: components, materials,
            software or services.
          </SectionHeader>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CONTACTS.map((c, i) => (
              <Reveal key={c.name} delay={i * 60}>
                <article className="h-full border border-border bg-card flex flex-col">
                  <div className="p-5 flex-1">
                    <p className="label-mono text-[10px] text-energy">{c.role}</p>
                    <h3 className="mt-2 font-display font-extrabold uppercase text-2xl leading-none">{c.name}</h3>
                  </div>
                  <div className="border-t border-border divide-y divide-border text-sm">
                    {c.phone && (
                      <a
                        href={`tel:${c.phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-2.5 px-5 py-3 hover:bg-muted/50 hover:text-energy transition-colors"
                      >
                        <Phone className="w-4 h-4 text-energy shrink-0" />
                        <span className="font-mono">{c.phone}</span>
                      </a>
                    )}
                    <a
                      href={`mailto:${c.email}`}
                      className="flex items-center gap-2.5 px-5 py-3 hover:bg-muted/50 hover:text-energy transition-colors min-w-0"
                    >
                      <Mail className="w-4 h-4 text-energy shrink-0" />
                      <span className="truncate">{c.email}</span>
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-5 border border-border grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {PATRONS.map((p) => (
                <a key={p.name} href={`mailto:${p.email}`} className="p-5 hover:bg-muted/40 transition-colors group">
                  <p className="label-mono text-[10px] text-muted-foreground">{p.role}</p>
                  <p className="mt-1.5 font-display font-extrabold uppercase text-xl leading-none group-hover:text-energy transition-colors">
                    {p.name}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{p.email}</p>
                </a>
            ))}
            <a
              href={SPONSOR_MAIL}
              className="p-5 bg-energy text-white flex items-center justify-between gap-4 hover:bg-energy-dark transition-colors"
            >
              <span>
                <span className="block label-mono text-[10px] text-white/80">Team inbox</span>
                <span className="block mt-1.5 font-display font-extrabold uppercase text-xl leading-none">{CLUB.email}</span>
              </span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sponsors;
