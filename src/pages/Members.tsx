import { Mail, Phone, Instagram, Facebook, Twitter, MapPin, ArrowUpRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { isRemovedMember } from '@/lib/removedMembers';
import { SUBSYSTEMS, CLUB, TEAM_PHONE } from '@/data/club';
import { cn } from '@/lib/utils';

const STATIC_MEMBERS = [
  // Steering Team
  {
    name: "Veeresh",
    role: "Steering",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME108",
    email: "veereshsg14@gmail.com",
    category: "technical"
  },

  // Transmission Team
  {
    name: "Darshan H.S",
    role: "Captain (Transmission)",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME016",
    email: "darshanvaibhav2@gmail.com",
    category: "leadership"
  },
  {
    name: "Bhumika B R",
    role: "Transmission",
    year: "2nd Year",
    major: "Computer Science and Engineering",
    bio: "USN: 1SI24CS034",
    email: "b301898@gmail.com",
    category: "technical"
  },
  {
    name: "Bhavana R",
    role: "Transmission",
    year: "1st Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI25ME020",
    email: "bhavana.feb14@gmail.com",
    category: "technical"
  },
  {
    name: "Pavan H.S",
    role: "Transmission",
    year: "2nd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI24ME080",
    email: "pavanshekar0206@gmail.com",
    category: "technical"
  },

  // Suspension Team
  {
    name: "Mithan Yadav H.R",
    role: "Vice Captain (Suspension)",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME057",
    email: "mithunyadavhr@gmail.com",
    category: "leadership"
  },
  {
    name: "Vivek J",
    role: "Suspension",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME111",
    email: "vivek8884168@gmail.com",
    category: "technical"
  },
  {
    name: "Manoj G",
    role: "Suspension",
    year: "2nd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI24ME061",
    email: "manojyadav.girish@gmail.com",
    category: "technical"
  },

  // Brakes Team
  {
    name: "Sumanth Honnungar",
    role: "Brakes",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME100",
    email: "sumanthhonnungar@gmail.com",
    category: "technical"
  },
  {
    name: "Kavana G",
    role: "Brakes",
    year: "2nd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI24ME048",
    email: "kavanag720@gmail.com",
    category: "technical"
  },
  {
    name: "Shashi Kumar",
    role: "Brakes",
    year: "2nd Year",
    major: "Chemical Engineering",
    bio: "USN: 1SI24CH045",
    email: "shashi60835@gmail.com",
    category: "technical"
  },
  {
    name: "Gowtham Gowda S",
    role: "Brakes",
    year: "1st Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI25ME038",
    email: "gowthamgowda8261@gmail.com",
    category: "technical"
  },

  // CAE (Chassis) Team
  {
    name: "Medha D.",
    role: "Chassis (CAE)",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME055",
    email: "dmedha2005@gmail.com",
    category: "technical"
  },
  {
    name: "Kamalesh D.R",
    role: "Chassis (CAE)",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME038",
    email: "drkamalesh397@gmail.com",
    category: "technical"
  },
  {
    name: "Pallav B",
    role: "Chassis (CAE)",
    year: "2nd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI24ME078",
    email: "pallavpallu806@gmail.com",
    category: "technical"
  },

  // Operations Team
  {
    name: "Eshaan AV",
    role: "Operations",
    year: "3rd Year",
    major: "Artificial Intelligence and Data Science",
    bio: "USN: 1SI23AD011",
    email: "eshaanvenkatesh3725@gmail.com",
    category: "operations"
  }
];

const Members = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 130; // Sticky nav (64px) + sub-team index bar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const [teamMembers, setTeamMembers] = useState<any[]>(
    STATIC_MEMBERS.filter(sm => !isRemovedMember(sm))
  );

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'user')  // Only get non-admin users
          .order('name');

        if (error) {
          console.error("Error loading dynamic members:", error);
          return;
        }

        if (data && data.length > 0) {
          const mappedMembers = data
            .map(u => ({
              name: u.name,
              role: u.designation || 'Team Member',
              year: u.year || '1st Year',
              major: u.major || 'Mechanical Engineering',
              bio: u.bio || '',
              email: u.email,
              category: u.category || 'technical'
            }))
            .filter(m => !isRemovedMember(m));

          // Merge database members with static members (remove duplicates by email)
          const allEmails = new Set(mappedMembers.map(m => m.email.toLowerCase()));
          const uniqueStaticMembers = STATIC_MEMBERS.filter(
            sm => !allEmails.has(sm.email.toLowerCase()) && !isRemovedMember(sm)
          );

          setTeamMembers([...mappedMembers, ...uniqueStaticMembers]);
        }
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    fetchMembers();
  }, []);

  // Group members by technical domain
  const leadershipMembers = teamMembers.filter(m => m.category === 'leadership');
  const steeringMembers = teamMembers.filter(m => m.role.includes('Steering') && m.category !== 'leadership');
  const transmissionMembers = teamMembers.filter(m => m.role.includes('Transmission') && m.category !== 'leadership');
  const suspensionMembers = teamMembers.filter(m => m.role.includes('Suspension') && m.category !== 'leadership');
  const brakesMembers = teamMembers.filter(m => m.role.includes('Brakes') && m.category !== 'leadership');
  const chassisMembers = teamMembers.filter(m => (m.role.includes('Chassis') || m.role.includes('CAE')) && m.category !== 'leadership');
  const operationsMembers = teamMembers.filter(m => m.role.includes('Operations') && m.category !== 'leadership');

  type Member = (typeof teamMembers)[number];

  const sub = (id: string) => SUBSYSTEMS.find((s) => s.id === id)!;
  const departments = [
    {
      id: 'leadership-team',
      code: '00',
      title: 'Leadership',
      blurb: 'Captain and vice-captain. They own the build schedule, the crew and every call on race day.',
      members: leadershipMembers,
    },
    { id: 'chassis-team', code: sub('chassis').code, title: 'Chassis / CAE', blurb: sub('chassis').summary, members: chassisMembers },
    { id: 'suspension-team', code: sub('suspension').code, title: 'Suspension', blurb: sub('suspension').summary, members: suspensionMembers },
    { id: 'steering-team', code: sub('steering').code, title: 'Steering', blurb: sub('steering').summary, members: steeringMembers },
    { id: 'brakes-team', code: sub('brakes').code, title: 'Brakes', blurb: sub('brakes').summary, members: brakesMembers },
    { id: 'transmission-team', code: sub('transmission').code, title: 'Transmission', blurb: sub('transmission').summary, members: transmissionMembers },
    { id: 'operations-team', code: sub('operations').code, title: 'Operations', blurb: sub('operations').summary, members: operationsMembers },
  ].filter((d) => d.members.length > 0);

  const initials = (name: string) =>
    name
      .replace(/\./g, ' ')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  /** Crew pass, styled after the lanyard passes the team wears in the paddock. */
  const renderCrewPass = (member: Member, code: string) => {
    const isLead = member.category === 'leadership' || member.role.includes('Captain');
    return (
      <article
        key={member.email}
        className="group relative border border-border bg-card flex flex-col hover:border-energy/60 transition-colors"
      >
        <div
          className={cn(
            'flex items-center justify-between px-4 h-9 border-b border-border',
            isLead ? 'bg-energy text-white' : 'bg-muted text-muted-foreground'
          )}
        >
          <span className="label-mono text-[10px]">{isLead ? 'Crew pass · Lead' : 'Crew pass'}</span>
          <span className="font-mono text-[10px]">SUB-{code}</span>
        </div>
        <span
          className="absolute left-1/2 -translate-x-1/2 top-[30px] w-10 h-2 rounded-full bg-background border border-border"
          aria-hidden
        />

        <div className="p-5 pt-7 flex gap-4 items-start">
          <span className={cn('race-plate h-16 w-16 shrink-0 text-3xl not-italic', isLead && 'border-energy')} aria-hidden>
            {initials(member.name)}
          </span>
          <div className="min-w-0">
            <h3 className="font-display font-extrabold uppercase text-2xl leading-none truncate">{member.name}</h3>
            <p className={cn('mt-2 font-display font-bold uppercase text-sm', isLead ? 'text-energy' : 'text-foreground/80')}>
              {member.role}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {member.year} · {member.major}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 px-5 py-3 border-t border-dashed border-border">
          <span className="font-mono text-[11px] text-muted-foreground truncate">{member.bio}</span>
          <a
            href={`mailto:${member.email}`}
            aria-label={`Email ${member.name}`}
            className="w-9 h-9 shrink-0 border border-border flex items-center justify-center text-muted-foreground hover:bg-energy hover:border-energy hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </article>
    );
  };

  const socials = [
    { href: 'https://www.instagram.com/autoarchitects?igsh=cTZuNGdrcmM2M2I1', icon: Instagram, label: 'Instagram' },
    { href: 'https://www.facebook.com/autoarchitects.sit', icon: Facebook, label: 'Facebook' },
    { href: 'https://twitter.com/autoarchitects_', icon: Twitter, label: 'Twitter' },
  ];

  return (
    <div className="relative bg-background">
      {/* ═════════ HERO ═════════ */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 drafting-grid drafting-grid-fade pointer-events-none" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-20 pb-14 md:pb-16 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <p className="label-mono text-muted-foreground animate-fade-in-up">
              <span className="text-energy">●</span> Crew roster · {CLUB.institute}
            </p>
            <h1 className="mt-6 font-display font-extrabold italic uppercase tracking-tight leading-[0.86] text-6xl sm:text-7xl xl:text-8xl animate-fade-in-up delay-100">
              One car.
              <br />
              <span className="text-energy">Every</span> branch.
            </h1>
            <p className="mt-7 text-lg text-muted-foreground leading-relaxed max-w-xl animate-fade-in-up delay-200">
              Mechanical engineers weld next to computer scientists, chemical engineers work on brakes and AI &amp; data science
              students run operations. Every sub-team owns its system from first sketch to race day.
            </p>
          </div>
          <dl className="lg:col-span-4 grid grid-cols-2 border border-border bg-card animate-fade-in delay-300">
            <div className="p-5 border-r border-border">
              <dt className="label-mono text-[10px] text-muted-foreground">On the roster</dt>
              <dd className="font-display font-extrabold italic text-5xl leading-none mt-2">{teamMembers.length}</dd>
            </div>
            <div className="p-5">
              <dt className="label-mono text-[10px] text-muted-foreground">Sub-teams</dt>
              <dd className="font-display font-extrabold italic text-5xl leading-none mt-2">{departments.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ═════════ SUB-TEAM INDEX ═════════ */}
      <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {departments.map((d) => (
              <button
                key={d.id}
                onClick={() => scrollToSection(d.id)}
                className="shrink-0 flex items-baseline gap-2 px-3 h-10 pt-2 border border-transparent hover:border-border font-display font-bold uppercase text-[15px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="font-mono text-[10px] text-energy">{d.code}</span>
                {d.title}
                <span className="font-mono text-[10px]">({d.members.length})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═════════ DEPARTMENTS ═════════ */}
      {departments.map((d, i) => (
        <section
          key={d.id}
          id={d.id}
          className={cn('relative py-16 md:py-20 border-b border-border scroll-mt-32', i % 2 === 1 && 'bg-graphite')}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-6 mb-10 items-end">
              <div className="lg:col-span-7">
                <p className="label-mono text-energy">Sub-assembly {d.code}</p>
                <h2 className="mt-3 font-display font-extrabold italic uppercase text-5xl md:text-6xl leading-[0.9] tracking-tight">
                  {d.title}
                </h2>
              </div>
              <p className="lg:col-span-5 text-muted-foreground leading-relaxed">{d.blurb}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {d.members.map((m) => renderCrewPass(m, d.code))}
            </div>
          </div>
        </section>
      ))}

      {/* ═════════ CONTACT ═════════ */}
      <section className="relative py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-border bg-card grid lg:grid-cols-12">
            <div className="lg:col-span-8 p-8 sm:p-12">
              <p className="label-mono text-energy">Sponsors · Recruits · Press</p>
              <h2 className="mt-4 font-display font-extrabold italic uppercase text-4xl sm:text-5xl leading-[0.92] tracking-tight">
                Talk to the team
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-xl">
                Want to sponsor a build, join the crew or see the car up close? Reach out and someone from the team will get
                back to you.
              </p>
            </div>
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-border p-8 sm:p-12 flex items-center">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full h-14 bg-energy text-white font-display font-bold uppercase tracking-wide text-lg flex items-center justify-center gap-2 hover:bg-energy-dark transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contact us
              </button>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="w-[95vw] max-w-[560px] max-h-[90vh] overflow-y-auto bg-card border border-border p-0 gap-0">
          <DialogHeader className="p-6 border-b border-border text-left">
            <p className="label-mono text-[10px] text-energy">Contact sheet</p>
            <DialogTitle className="font-display font-extrabold italic uppercase text-3xl leading-none mt-2">
              Team AutoArchitects
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Get in touch with the team. We're happy to help.
            </DialogDescription>
          </DialogHeader>

          <div className="divide-y divide-border">
            <a href={`mailto:${CLUB.email}`} className="flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors group">
              <Mail className="w-5 h-5 text-energy shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block label-mono text-[10px] text-muted-foreground">Email</span>
                <span className="block font-semibold truncate">{CLUB.email}</span>
              </span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-energy" />
            </a>
            <a href={TEAM_PHONE.href} className="flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors group">
              <Phone className="w-5 h-5 text-energy shrink-0" />
              <span className="flex-1">
                <span className="block label-mono text-[10px] text-muted-foreground">Phone</span>
                <span className="block font-semibold">{TEAM_PHONE.display} · Captain</span>
              </span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-energy" />
            </a>
            <div className="flex items-center gap-4 p-5">
              <MapPin className="w-5 h-5 text-energy shrink-0" />
              <span>
                <span className="block label-mono text-[10px] text-muted-foreground">Location</span>
                <span className="block font-semibold">
                  {CLUB.institute}, {CLUB.city}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-14 font-display font-bold uppercase hover:bg-energy hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Members;
