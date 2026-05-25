import { Card, CardContent } from "@/components/ui/card";
import { Award, Target, Eye, Heart, Trophy, Users, Calendar } from 'lucide-react';
import facultyImage from '@/assets/faculty-advisor.jpg';
import sunilImage from '@/assets/Sunil.jpg';
import nareshImage from '@/assets/Naresh.jpg';

const About = () => {
  const achievements = [
    {
      year: "2025",
      title: "Cleared Technical Round of BAJA SAE INDIA 2025",
      description: "Outstanding performance in the national competition with our innovative racing ATV design.",
      icon: Trophy
    },
    {
      year: "2020",
      title: "Champions Of Champions",
      description: "Awarded for exceptional technical design and manufacturing quality in regional competition.",
      icon: Target
    },
    {
      year: "2010",
      title: "37th place",
      description: "In BAJA SAE INDIA 2010 we secured 37th position among 180 teams.",
      icon: Users
    }
  ];

  const milestones = [
    { year: "2008", event: "Club Founded", members: "10+" },
    { year: "2010", event: "First Competition", members: "25+" },
    { year: "2016", event: "National Recognition", members: "30+" },
    { year: "2020", event: "Champions of champions", members: "30+" },
    { year: "2025", event: "BAJA SAE INDIA 2025", members: "30+" },
    { year: "2026", event: "ATVC INDIA 2026", members: "30+" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 grid-background opacity-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="hero-gradient py-24 md:py-32 text-white relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-energy rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-energy/10 border border-energy/30 text-energy text-xs font-bold uppercase tracking-widest">
            About Team AutoArchitects
          </div>
          <h1 className="font-display font-black text-5xl sm:text-7xl mb-6 tracking-tight uppercase">
            WHO WE <span className="text-gradient-energy">ARE</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Driving innovation in off-road vehicle engineering through passion,
            dedication, and cutting-edge automotive tech.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-background border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 glass-panel hover-neon-border border border-white/5 hover:border-energy/30 transition-all duration-500 hover:-translate-y-2">
              <CardContent className="pt-6">
                <div className="w-16 h-16 energy-gradient rounded-xl flex items-center justify-center mx-auto mb-6 shadow-glow border border-white/10">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-4 uppercase tracking-tight">Mission</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  To foster innovation in ATV engineering while providing students with
                  hands-on experience in design, manufacturing, testing, and competitive national racing.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 glass-panel hover-neon-border border border-white/5 hover:border-energy/30 transition-all duration-500 hover:-translate-y-2">
              <CardContent className="pt-6">
                <div className="w-16 h-16 energy-gradient rounded-xl flex items-center justify-center mx-auto mb-6 shadow-glow border border-white/10">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-4 uppercase tracking-tight">Vision</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  To be the leading university ATV club, pioneering sustainable
                  off-road vehicle technologies and inspiring the next generation of global engineers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 glass-panel hover-neon-border border border-white/5 hover:border-energy/30 transition-all duration-500 hover:-translate-y-2">
              <CardContent className="pt-6">
                <div className="w-16 h-16 energy-gradient rounded-xl flex items-center justify-center mx-auto mb-6 shadow-glow border border-white/10">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-4 uppercase tracking-tight">Values</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Excellence in engineering design, collaborative teamwork, innovation, safety,
                  and sustainable green practices in all our projects.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tight mb-4">
              Our <span className="text-gradient-energy">Achievements</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              National recognition of our commitment to engineering perfection and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {achievements.map((achievement, index) => (
              <Card key={index} className="p-6 glass-panel hover-neon-border border border-white/5 hover:border-energy/30 transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between">
                <CardContent className="pt-6 flex-1 flex flex-col">
                  <div className="w-12 h-12 energy-gradient rounded-lg flex items-center justify-center shadow-glow border border-white/10 mb-6">
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-energy bg-energy/10 border border-energy/20 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
                      Season {achievement.year}
                    </span>
                    <h3 className="font-display font-bold text-xl text-white mb-3">
                      {achievement.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Advisors */}
      <section className="py-24 bg-background border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tight mb-4">
              Faculty <span className="text-gradient-energy">Advisors</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Meet the mentors guiding our team towards technical excellence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 glass-panel border border-white/5 hover:border-energy/20 transition-all duration-500">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
                  <div className="relative w-36 h-36 flex-shrink-0">
                    <img
                      src={sunilImage}
                      alt="Dr. B Sunil"
                      className="w-full h-full object-cover rounded-xl shadow-2xl border border-white/10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display font-black text-2xl text-white mb-1 uppercase tracking-tight">
                      Dr. B Sunil
                    </h3>
                    <p className="text-energy font-bold text-xs uppercase tracking-wider mb-3">
                      Professor of Mechanical Engineering
                    </p>
                    <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                      Brings over 15 years of expert guidance in vehicle dynamics and automotive structures.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                        PhD
                      </span>
                      <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                        15+ Yrs Exp
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 glass-panel border border-white/5 hover:border-energy/20 transition-all duration-500">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
                  <div className="relative w-36 h-36 flex-shrink-0">
                    <img
                      src={nareshImage}
                      alt="Dr. Naresh H"
                      className="w-full h-full object-cover object-top rounded-xl shadow-2xl border border-white/10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display font-black text-2xl text-white mb-1 uppercase tracking-tight">
                      Dr. Naresh H
                    </h3>
                    <p className="text-energy font-bold text-xs uppercase tracking-wider mb-3">
                      Assistant Professor of Mechanical Engineering
                    </p>
                    <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                      Specializes in power systems and automotive control setups, guiding hybrid technology.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                        PhD
                      </span>
                      <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                        EV Specialist
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="our-journey" className="py-24 bg-gradient-to-b from-background to-zinc-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tight mb-4">
              Our <span className="text-gradient-energy">Journey</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Milestones that map out our team's history, expansion, and victories
            </p>
          </div>

          <div className="max-w-3xl mx-auto relative">
            {/* Steering line representing racetrack track */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-energy via-zinc-800 to-energy rounded-full" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-center group animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Milestones Pulse Indicator */}
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center z-10 transition-all duration-300 group-hover:border-energy group-hover:scale-110 shadow-2xl">
                    <span className="text-xs font-extrabold text-white group-hover:text-energy">{milestone.year}</span>
                  </div>

                  {/* Milestone Card */}
                  <div className="ml-8 flex-1">
                    <Card className="p-6 glass-panel border border-white/5 hover:border-energy/20 transition-all duration-300">
                      <CardContent className="pt-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">
                            {milestone.event}
                          </h3>
                          <span className="text-xs font-black text-energy uppercase tracking-widest bg-energy/10 border border-energy/20 px-3 py-1 rounded-md self-start sm:self-auto">
                            {milestone.members} Members
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;