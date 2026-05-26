import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail, Phone, Facebook, Instagram, Twitter, MapPin, ExternalLink } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const STATIC_MEMBERS = [
  // Leadership Team
  {
    name: "Kushal M.V",
    role: "Steering",
    year: "4th Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME426",
    email: "kushalmvkushi2@gmail.com",
    category: "technical"
  },
  {
    name: "Tejashree P",
    role: "Chassis (CAE)",
    year: "4th Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI22ME059",
    email: "tejashree62005@gmail.com",
    category: "technical"
  },

  // Steering Team
  {
    name: "Kushal N.S",
    role: "Steering",
    year: "4th Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI22ME021",
    email: "kushalns32@gmail.com",
    category: "technical"
  },
  {
    name: "Skanda Moudgalya KS",
    role: "Steering",
    year: "4th Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI22ME052",
    email: "skandaksmoudgalya@gmail.com",
    category: "technical"
  },
  {
    name: "Siddharth S.",
    role: "Steering",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME093",
    email: "siddharth.s7060@gmail.com",
    category: "technical"
  },
  {
    name: "Veeresh",
    role: "Steering",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME108",
    email: "veereshsg14@gmail.com",
    category: "technical"
  },
  {
    name: "Dhanush gowda",
    role: "Steering",
    year: "2nd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI24ME025",
    email: "dhanushggowdaa@gmail.com",
    category: "technical" 
  },
  {
    name: "Inchara M.K",
    role: "Steering",
    year: "2nd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI24ME039",
    email: "incharakswamy31@gmail.com",
    category: "technical"
  },

  // Transmission Team
  {
    name: "Karthik K",
    role: "Transmission",
    year: "4th Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI22ME020",
    email: "karthikkantharaju28@gmail.com",
    category: "technical"
  },

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
    name: "Sharadhi Simha Chi Na",
    role: "Transmission",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME084",
    email: "sharadhisimhachina@gmail.com",
    category: "technical"
  },
  {
    name: "Shivaprakash H B",
    role: "Transmission",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME089",
    email: "shivaprakashb712@gmail.com",
    category: "technical"
  },
  {
    name: "Dimple K",
    role: "Transmission",
    year: "2nd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI24ME028",
    email: "dimplek5936@gmail.com",
    category: "technical"
  },
  {
    name: "Karthik S",
    role: "Transmission",
    year: "2nd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI24ME046",
    email: "karthikkarthi19370@gmail.com",
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
    name: "Likith H",
    role: "Suspension",
    year: "4th Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI22ME023",
    email: "likhith.785@gmail.com",
    category: "technical"
  },
  {
    name: "Prathik Jain T.N",
    role: "Suspension",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME070",
    email: "prathikjaintn21@gmail.com",
    category: "technical"
  },
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
    name: "Jaswanth D.",
    role: "Suspension",
    year: "2nd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI24ME041",
    email: "jaswanthd150@gmail.com",
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
    name: "Vivek Hiresomannavar",
    role: "Brakes",
    year: "4th Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI22ME067",
    email: "vivekhiresomannavar@gmail.com",
    category: "technical"
  },
  {
    name: "Basavaraj L Arakeri",
    role: "Brakes",
    year: "4th Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI22ME008",
    email: "basavarajarakeri@zohomail.in",
    category: "technical"
  },
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

  // CAE (Chassis) Team
  {
    name: "Yashas M.S",
    role: "Chassis (CAE)",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME115",
    email: "yashasms9125@gmail.com",
    category: "technical"
  },
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
    name: "Mohammed Umar Siddiq",
    role: "Brakes",
    year: "3rd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI23ME059",
    email: "mdumarsiddiq5@gmail.com",
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
    name: "Nikshith J",
    role: "Chassis (CAE)",
    year: "2nd Year",
    major: "Mechanical Engineering",
    bio: "USN: 1SI24ME075",
    email: "nikshithjagadeesh@gmail.com",
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

  // Graphics Team
  {
    name: "Eshaan AV",
    role: "Digital",
    year: "3rd Year",
    major: "Artificial Intelligence and Data Science",
    bio: "USN: 1SI23AD011",
    email: "eshaanvenkatesh3725@gmail.com",
    category: "operations"
  },
  {
    name: "Bhumika B.R",
    role: "Graphics",
    year: "2nd Year",
    major: "Computer Science and Engineering",
    bio: "USN: 1SI24CS034",
    email: "b301898@gmail.com",
    category: "operations"
  }
];

const Members = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for sticky navigation
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const [teamMembers, setTeamMembers] = useState<any[]>(STATIC_MEMBERS.filter(m => m.year !== '4th Year'));

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('name');
        
        if (error) {
          console.error("Error loading dynamic members:", error);
          return;
        }

        if (data && data.length > 0) {
          const mappedMembers = data
            .filter(u => u.year !== '4th Year')
            .map(u => ({
              name: u.name,
              role: u.designation || (u.role === 'admin' ? 'Admin' : 'Team Member'),
              year: u.year || '1st Year',
              major: u.major || 'Mechanical Engineering',
              bio: u.bio || '',
              email: u.email,
              category: u.category || 'technical'
            }));
          
          setTeamMembers(mappedMembers);
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
  const digitalMembers = teamMembers.filter(m => m.role.includes('Digital') && m.category !== 'leadership');
  const graphicsMembers = teamMembers.filter(m => m.role.includes('Graphics') && m.category !== 'leadership');

  const renderMemberCard = (member: typeof teamMembers[0], index: number) => {
    // Determine category styling
    const isLeadership = member.category === 'leadership' || member.role.includes('Captain');
    const isOperations = member.category === 'operations' || member.role.includes('Digital') || member.role.includes('Graphics');
    
    let accentBg = 'bg-energy/10 text-energy border-energy/20';
    let cardBorder = 'hover:border-energy/40';
    if (!isLeadership && isOperations) {
      accentBg = 'bg-amber/10 text-amber border-amber/20';
      cardBorder = 'hover:border-amber/40';
    } else if (!isLeadership && !isOperations) {
      accentBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      cardBorder = 'hover:border-cyan-500/40';
    }

    return (
      <div key={index} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4 sm:px-6">
        <Card className={`group glass-panel border border-white/5 shadow-2xl transition-all duration-500 overflow-hidden ${cardBorder} h-full flex flex-col justify-between hover:scale-[1.02]`}>
          <CardContent className="p-0 flex-1 flex flex-col justify-between">
            {/* Avatar Section */}
            <div className="h-44 bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center relative overflow-hidden border-b border-white/5">
              {/* Telemetry Grid Line Overlay */}
              <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/10 group-hover:border-energy transition-all duration-500 group-hover:scale-110 shadow-2xl relative">
                  <span className="font-display font-black text-3xl text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                  {/* Neon pulsing ring */}
                  <div className="absolute -inset-1 rounded-full border border-energy/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="text-center mb-4">
                <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-energy transition-colors">
                  {member.name}
                </h3>
                <Badge
                  variant="secondary"
                  className={`mb-3 font-semibold px-3 py-1 text-xs uppercase tracking-wider rounded-md border ${accentBg}`}
                >
                  {member.role}
                </Badge>
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">
                  {member.year} • {member.major}
                </p>
              </div>

              {member.bio && (
                <p className="text-xs text-zinc-500 text-center mb-6 leading-relaxed italic">
                  {member.bio}
                </p>
              )}

              {/* Contact Links */}
              <div className="flex justify-center pt-4 border-t border-white/5">
                <a
                  href={`mailto:${member.email}`}
                  className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-energy hover:text-white transition-all duration-300 group/btn border border-white/10"
                >
                  <Mail className="w-4 h-4 text-zinc-400 group-hover/btn:text-white transition-colors" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Carousel component for team sections
  const TeamCarousel = ({ members, sectionId, title }: { members: typeof teamMembers, sectionId: string, title: string }) => {
    const [emblaRef] = useEmblaCarousel(
      {
        loop: true,
        align: 'start',
        skipSnaps: false,
        dragFree: false
      },
      [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]
    );

    return (
      <section id={sectionId} className="py-24 bg-gradient-to-b from-background via-background to-muted/20 relative overflow-hidden scroll-mt-24 border-b border-white/5">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-energy rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-tight mb-4">
              {title} <span className="text-gradient-energy">Team</span>
            </h2>
            <p className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">
              {members.length} {members.length === 1 ? 'Engineer' : 'Engineers'}
            </p>
          </div>

          {/* Carousel */}
          <div className="relative py-8 px-4 -mx-4 bg-black/10 backdrop-blur-sm rounded-2xl border border-white/5">
            <div className="overflow-hidden -mx-4" ref={emblaRef}>
              <div className="flex">
                {members.map((member, index) => renderMemberCard(member, index))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen relative bg-background">
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 grid-background opacity-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative hero-gradient py-24 md:py-32 text-white overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-energy rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-6 animate-scale-in">
            <div className="relative">
              <div className="absolute -inset-2 bg-energy/30 rounded-full blur-2xl" />
              <Users className="w-16 h-16 mx-auto text-energy relative z-10" />
            </div>
          </div>
          <h1 className="font-display font-black text-5xl md:text-7xl mb-6 uppercase tracking-tight">
            OUR <span className="text-gradient-energy">TEAM</span>
          </h1>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Meet the engineers and innovators driving AutoArchitects to the top step of the podium
          </p>
        </div>
      </section>

      {/* Scroll Navigation */}
      <section className="py-4 bg-background/90 border-b border-white/5 sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex md:flex-wrap gap-2 justify-start md:justify-center overflow-x-auto scrollbar-hide pb-1 md:pb-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="transition-all duration-300 hover-scale bg-zinc-900/60 border-white/5 text-zinc-400 hover:bg-energy/10 hover:text-energy hover:border-energy/40 text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap flex-shrink-0 font-bold uppercase tracking-wider rounded-lg"
            >
              All ({teamMembers.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection('leadership-team')}
              className="transition-all duration-300 hover-scale bg-zinc-900/60 border-white/5 text-zinc-400 hover:bg-energy/10 hover:text-energy hover:border-energy/40 text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap flex-shrink-0 font-bold uppercase tracking-wider rounded-lg"
            >
              Leadership ({leadershipMembers.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection('steering-team')}
              className="transition-all duration-300 hover-scale bg-zinc-900/60 border-white/5 text-zinc-400 hover:bg-energy/10 hover:text-energy hover:border-energy/40 text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap flex-shrink-0 font-bold uppercase tracking-wider rounded-lg"
            >
              Steering ({steeringMembers.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection('transmission-team')}
              className="transition-all duration-300 hover-scale bg-zinc-900/60 border-white/5 text-zinc-400 hover:bg-energy/10 hover:text-energy hover:border-energy/40 text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap flex-shrink-0 font-bold uppercase tracking-wider rounded-lg"
            >
              Transmission ({transmissionMembers.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection('suspension-team')}
              className="transition-all duration-300 hover-scale bg-zinc-900/60 border-white/5 text-zinc-400 hover:bg-energy/10 hover:text-energy hover:border-energy/40 text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap flex-shrink-0 font-bold uppercase tracking-wider rounded-lg"
            >
              Suspension ({suspensionMembers.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection('brakes-team')}
              className="transition-all duration-300 hover-scale bg-zinc-900/60 border-white/5 text-zinc-400 hover:bg-energy/10 hover:text-energy hover:border-energy/40 text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap flex-shrink-0 font-bold uppercase tracking-wider rounded-lg"
            >
              Brakes ({brakesMembers.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection('chassis-team')}
              className="transition-all duration-300 hover-scale bg-zinc-900/60 border-white/5 text-zinc-400 hover:bg-energy/10 hover:text-energy hover:border-energy/40 text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap flex-shrink-0 font-bold uppercase tracking-wider rounded-lg"
            >
              Chassis/CAE ({chassisMembers.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection('digital-team')}
              className="transition-all duration-300 hover-scale bg-zinc-900/60 border-white/5 text-zinc-400 hover:bg-energy/10 hover:text-energy hover:border-energy/40 text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap flex-shrink-0 font-bold uppercase tracking-wider rounded-lg"
            >
              Digital ({digitalMembers.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection('graphics-team')}
              className="transition-all duration-300 hover-scale bg-zinc-900/60 border-white/5 text-zinc-400 hover:bg-energy/10 hover:text-energy hover:border-energy/40 text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap flex-shrink-0 font-bold uppercase tracking-wider rounded-lg"
            >
              Graphics ({graphicsMembers.length})
            </Button>
          </div>
        </div>
      </section>

      {/* Team Carousels by Domain */}
      <TeamCarousel members={leadershipMembers} sectionId="leadership-team" title="Leadership" />
      <TeamCarousel members={steeringMembers} sectionId="steering-team" title="Steering" />
      <TeamCarousel members={transmissionMembers} sectionId="transmission-team" title="Transmission" />
      <TeamCarousel members={suspensionMembers} sectionId="suspension-team" title="Suspension" />
      <TeamCarousel members={brakesMembers} sectionId="brakes-team" title="Brakes" />
      <TeamCarousel members={chassisMembers} sectionId="chassis-team" title="Chassis/CAE" />
      <TeamCarousel members={digitalMembers} sectionId="digital-team" title="Digital" />
      <TeamCarousel members={graphicsMembers} sectionId="graphics-team" title="Graphics" />



      {/* Join Us Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-background via-zinc-950 to-background border-t border-white/5 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-energy rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="glass-panel p-12 md:p-16 rounded-3xl border border-white/10 shadow-2xl animate-scale-in">
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Contact <span className="text-gradient-energy">Team</span>
            </h2>
            <p className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              We are committed to providing timely and reliable support. Reach out to us with your queries, and our team will respond with the professionalism and clarity you deserve.
            </p>
            <Button
              size="lg"
              onClick={() => setIsContactModalOpen(true)}
              className="energy-gradient hover-glow hover-shine transition-all duration-300 text-lg px-10 py-7 font-semibold shadow-2xl hover:scale-105"
            >
              <Mail className="mr-2 w-6 h-6" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Us Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto glass-panel border border-white/10 shadow-2xl p-4 sm:p-6 bg-zinc-950/95 backdrop-blur-2xl">
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="font-display text-2xl sm:text-3xl font-bold text-white">
              Contact <span className="text-gradient-energy">Us</span>
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-zinc-400">
              Get in touch with the AutoArchitects team. We're here to help!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6 py-3 sm:py-4">
            {/* Email */}
            <div className="group">
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-zinc-900/40 hover:bg-energy/10 transition-all duration-300 border border-white/5 hover:border-energy/30">
                <div className="p-2 sm:p-3 bg-energy/10 rounded-lg group-hover:bg-energy/20 transition-colors flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-energy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-zinc-500 mb-1">Email Address</p>
                  <a
                    href="mailto:autoarchitects@gmail.com"
                    className="text-sm sm:text-base text-zinc-100 font-bold hover:text-energy transition-colors flex items-center gap-1 sm:gap-2 break-all"
                  >
                    <span className="truncate">autoarchitects@gmail.com</span>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="group">
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-zinc-900/40 hover:bg-energy/10 transition-all duration-300 border border-white/5 hover:border-energy/30">
                <div className="p-2 sm:p-3 bg-energy/10 rounded-lg group-hover:bg-energy/20 transition-colors flex-shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-energy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-zinc-500 mb-1">Phone Number</p>
                  <a
                    href="tel:+916363852155"
                    className="text-sm sm:text-base text-zinc-100 font-bold hover:text-energy transition-colors flex items-center gap-1 sm:gap-2"
                  >
                    +91 6363852155
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="group">
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-zinc-900/40 hover:bg-energy/10 transition-all duration-300 border border-white/5 hover:border-energy/30">
                <div className="p-2 sm:p-3 bg-energy/10 rounded-lg group-hover:bg-energy/20 transition-colors flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-energy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-zinc-500 mb-1">Location</p>
                  <p className="text-sm sm:text-base text-zinc-100 font-bold">Siddaganga Institute of Technology</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-xs sm:text-sm font-semibold text-zinc-400 mb-3">Follow Us On Social Media</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <a
                  href="https://www.instagram.com/autoarchitects?igsh=cTZuNGdrcmM2M2I1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group min-h-[48px]"
                >
                  <Instagram className="w-5 h-5 text-pink-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base text-pink-600">Instagram</span>
                </a>
                <a
                  href="https://www.facebook.com/autoarchitects.sit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group min-h-[48px]"
                >
                  <Facebook className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base text-blue-600">Facebook</span>
                </a>
                <a
                  href="https://twitter.com/autoarchitects_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-sky-400/10 to-sky-500/10 hover:from-sky-400/20 hover:to-sky-500/20 border border-sky-400/20 hover:border-sky-400/40 transition-all duration-300 group min-h-[48px]"
                >
                  <Twitter className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base text-sky-500">Twitter</span>
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Members;