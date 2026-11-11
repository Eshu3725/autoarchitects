import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import TAAFooterLogo from '@/assets/TAA_footer.png';
import { CLUB, TEAM_PHONE } from '@/data/club';
import { HazardStripe } from '@/components/brand/Primitives';

const socials = [
  { href: 'https://www.instagram.com/autoarchitects?igsh=cTZuNGdrcmM2M2I1', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.facebook.com/autoarchitects.sit', icon: Facebook, label: 'Facebook' },
  { href: 'https://twitter.com/autoarchitects_', icon: Twitter, label: 'Twitter' },
];

/** Footer laid out like the title block in the corner of an engineering drawing. */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-graphite text-foreground border-t border-border overflow-hidden">
      <HazardStripe className="h-1.5 opacity-90" />
      <div className="absolute inset-0 drafting-grid opacity-40 pointer-events-none" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Oversized sign-off */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <div>
            <p className="label-mono text-energy mb-4">{CLUB.motto}</p>
            <p className="font-display font-extrabold italic uppercase leading-[0.85] tracking-tight text-5xl sm:text-7xl md:text-8xl">
              Built.<br />
              <span className="text-outline">Not bought.</span>
            </p>
          </div>
          <img src={TAAFooterLogo} alt="Team AutoArchitects logo" className="w-28 h-28 sm:w-36 sm:h-36 object-contain opacity-90" />
        </div>

        {/* Title block */}
        <div className="border border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 text-sm bg-background/60">
          <div className="lg:col-span-4 p-5 border-b sm:border-r lg:border-b-0 border-border">
            <div className="label-mono text-muted-foreground mb-2">Project</div>
            <div className="font-display font-extrabold uppercase text-2xl leading-none">{CLUB.name}</div>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              The student ATV engineering team of {CLUB.institute}. We design, analyse, fabricate and race all-terrain vehicles.
            </p>
          </div>

          <div className="lg:col-span-3 p-5 border-b lg:border-b-0 lg:border-r border-border">
            <div className="label-mono text-muted-foreground mb-3">Contact</div>
            <ul className="space-y-2.5">
              <li>
                <a href={`mailto:${CLUB.email}`} className="flex items-center gap-2.5 hover:text-energy transition-colors">
                  <Mail className="w-4 h-4 text-energy shrink-0" />
                  {CLUB.email}
                </a>
              </li>
              <li>
                <a href={TEAM_PHONE.href} className="flex items-center gap-2.5 hover:text-energy transition-colors">
                  <Phone className="w-4 h-4 text-energy shrink-0" />
                  {TEAM_PHONE.display}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <MapPin className="w-4 h-4 text-energy shrink-0 mt-0.5" />
                <span>
                  {CLUB.institute}, {CLUB.city}
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 p-5 border-b sm:border-r lg:border-b-0 border-border">
            <div className="label-mono text-muted-foreground mb-3">Index</div>
            <ul className="space-y-1.5 font-display font-bold uppercase text-base">
              <li><Link to="/" className="hover:text-energy transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-energy transition-colors">About</Link></li>
              <li><Link to="/members" className="hover:text-energy transition-colors">Crew</Link></li>
              <li><Link to="/sponsors" className="hover:text-energy transition-colors">Sponsors</Link></li>
              <li><Link to="/login" className="hover:text-energy transition-colors">Crew login</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3 grid grid-rows-[1fr_auto]">
            <div className="p-5 border-b border-border">
              <div className="label-mono text-muted-foreground mb-3">Follow the build</div>
              <div className="flex gap-2">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-11 h-11 border border-border flex items-center justify-center hover:bg-energy hover:border-energy hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="px-3 py-2.5">
                <div className="label-mono text-[9px] text-muted-foreground">Est.</div>
                <div className="font-mono text-sm">{CLUB.founded}</div>
              </div>
              <div className="px-3 py-2.5">
                <div className="label-mono text-[9px] text-muted-foreground">Rev.</div>
                <div className="font-mono text-sm">{year}</div>
              </div>
              <div className="px-3 py-2.5">
                <div className="label-mono text-[9px] text-muted-foreground">Sheet</div>
                <div className="font-mono text-sm">1 / 1</div>
              </div>
            </div>
          </div>
        </div>

        <p className="label-mono text-[10px] text-muted-foreground mt-6">
          © {year} {CLUB.name} · {CLUB.institute}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
