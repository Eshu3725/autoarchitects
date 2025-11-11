import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail } from 'lucide-react';

const Members = () => {
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

  const teamMembers = [
    // Leadership Team
    {
      name: "Kushal M.V",
      role: "Captain (Steering)",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME426",
      email: "kushalmvkushi2@gmail.com",
      category: "leadership"
    },
    {
      name: "Tejashree P",
      role: "Vice Captain (Chassis) CAE",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI22ME059",
      email: "tejashree62005@gmail.com",
      category: "leadership"
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
      email: "dhanushgowdaa@gmail.com",
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
      name: "Damaresh R",
      role: "Transmission",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME014",
      email: "damareshr@gmail.com",
      category: "technical"
    },
    {
      name: "Darshan H.S",
      role: "Transmission",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME016",
      email: "darshanvaibhav2@gmail.com",
      category: "technical"
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
      email: "karthikkarthik19370@gmail.com",
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
      bio: "USN: 1SI23ME000",
      email: "prathikjaintn12@gmail.com",
      category: "technical"
    },
    {
      name: "Mithan Yadav H.R",
      role: "Suspension",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME057",
      email: "mithunyadavhr@gmail.com",
      category: "technical"
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
      bio: "USN: 1SI24ME008",
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
      major: "Mechanical Engineering",
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

  // Group members by category
  const leadershipMembers = teamMembers.filter(m => m.category === 'leadership');
  const technicalMembers = teamMembers.filter(m => m.category === 'technical');
  const operationsMembers = teamMembers.filter(m => m.category === 'operations');

  const getRoleColor = (role: string) => {
    if (role.includes('President')) return 'energy';
    if (role.includes('Lead') || role.includes('Director')) return 'steel';
    return 'metallic';
  };

  // Render member card component
  const renderMemberCard = (member: typeof teamMembers[0], index: number) => (
    <Card key={index} className="group glass-card border-2 border-white/10 shadow-2xl hover-lift transition-all duration-500 overflow-hidden hover:border-energy/30 hover:shadow-energy/10 animate-scale-in" style={{ animationDelay: `${(index % 9) * 0.1}s` }}>
      <CardContent className="p-0">
        {/* Avatar Section */}
        <div className="h-52 metallic-gradient flex items-center justify-center relative overflow-hidden">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-energy/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

          <div className="relative z-10">
            <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 group-hover:border-energy/50 transition-all duration-300 group-hover:scale-110 shadow-2xl">
              <span className="font-display font-bold text-4xl text-white">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-steel-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </div>

        {/* Content Section */}
        <div className="p-6 bg-gradient-to-b from-background/95 to-background">
          <div className="text-center mb-4">
            <h3 className="font-display font-bold text-xl text-steel-dark mb-2 group-hover:text-energy transition-colors">
              {member.name}
            </h3>
            <Badge
              variant="secondary"
              className={`mb-3 font-semibold transition-all duration-300 ${
                getRoleColor(member.role) === 'energy'
                  ? 'bg-energy/10 text-energy border border-energy/20 group-hover:bg-energy group-hover:text-white'
                  : getRoleColor(member.role) === 'steel'
                  ? 'bg-steel/10 text-steel border border-steel/20 group-hover:bg-steel group-hover:text-white'
                  : 'bg-metallic/10 text-metallic border border-metallic/20 group-hover:bg-metallic group-hover:text-white'
              }`}
            >
              {member.role}
            </Badge>
            <p className="text-sm text-muted-foreground font-medium">
              {member.year} • {member.major}
            </p>
          </div>

          <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
            {member.bio}
          </p>

          {/* Contact Links */}
          <div className="flex justify-center pt-4 border-t border-border/50">
            <a
              href={`mailto:${member.email}`}
              className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-energy hover-glow transition-all duration-300 group/btn border border-white/20 hover:border-energy/50 hover:scale-110"
            >
              <Mail className="w-5 h-5 text-steel group-hover/btn:text-white transition-colors" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient py-24 md:py-32 text-white overflow-hidden">
        {/* Animated background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-energy rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-6 animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 bg-energy/30 rounded-full blur-2xl" />
              <Users className="w-20 h-20 mx-auto text-energy relative z-10" />
            </div>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-6 animate-fade-in-up">
            Our <span className="text-gradient-energy">Team</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Meet the passionate engineers and innovators driving AutoArchitects forward
          </p>
        </div>
      </section>

      {/* Scroll Navigation */}
      <section className="py-6 bg-gradient-to-b from-background to-muted/20 border-b border-border/50 sticky top-16 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="transition-all duration-300 hover-scale glass-card border-steel/20 text-steel hover:bg-energy/10 hover:text-energy hover:border-energy/30"
            >
              All Members <span className="ml-1 opacity-70">({teamMembers.length})</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection('leadership-team')}
              className="transition-all duration-300 hover-scale glass-card border-steel/20 text-steel hover:bg-energy/10 hover:text-energy hover:border-energy/30"
            >
              Leadership <span className="ml-1 opacity-70">({leadershipMembers.length})</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection('technical-team')}
              className="transition-all duration-300 hover-scale glass-card border-steel/20 text-steel hover:bg-energy/10 hover:text-energy hover:border-energy/30"
            >
              Technical <span className="ml-1 opacity-70">({technicalMembers.length})</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection('operations-team')}
              className="transition-all duration-300 hover-scale glass-card border-steel/20 text-steel hover:bg-energy/10 hover:text-energy hover:border-energy/30"
            >
              Operations <span className="ml-1 opacity-70">({operationsMembers.length})</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section id="leadership-team" className="py-24 bg-gradient-to-b from-muted/30 via-background to-muted/20 relative overflow-hidden scroll-mt-24">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-energy rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-steel-dark mb-4">
              Leadership <span className="text-gradient-energy">Team</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {leadershipMembers.length} Members
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadershipMembers.map((member, index) => renderMemberCard(member, index))}
          </div>
        </div>
      </section>

      {/* Technical Team Section */}
      <section id="technical-team" className="py-24 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden scroll-mt-24">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-steel rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-steel-dark mb-4">
              Technical <span className="text-gradient-energy">Team</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {technicalMembers.length} Members
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicalMembers.map((member, index) => renderMemberCard(member, index))}
          </div>
        </div>
      </section>

      {/* Operations Team Section */}
      <section id="operations-team" className="py-24 bg-gradient-to-b from-muted/20 via-background to-muted/30 relative overflow-hidden scroll-mt-24">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-1/3 left-1/2 w-96 h-96 bg-energy rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-steel-dark mb-4">
              Operations <span className="text-gradient-energy">Team</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {operationsMembers.length} Members
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {operationsMembers.map((member, index) => renderMemberCard(member, index))}
          </div>
        </div>
      </section>



      {/* Join Us Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-steel-dark via-steel to-metallic overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-energy rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="glass-card p-12 md:p-16 rounded-3xl border-2 border-white/20 shadow-2xl animate-scale-in">
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Join Our <span className="text-gradient-energy">Team</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Ready to be part of something amazing? We're always looking for passionate
              engineers and innovators to join our mission.
            </p>
            <Button size="lg" className="energy-gradient hover-glow hover-shine transition-all duration-300 text-lg px-10 py-7 font-semibold shadow-2xl hover:scale-105">
              <Mail className="mr-2 w-6 h-6" />
              Contact Us to Join
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Members;