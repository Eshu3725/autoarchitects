import { Card, CardContent } from "@/components/ui/card";
import { Award, Target, Eye, Heart, Trophy, Users, Calendar } from 'lucide-react';
import facultyImage from '@/assets/faculty-advisor.jpg';
import sunilImage from '@/assets/Sunil.jpg';
import nareshImage from '@/assets/Naresh.jpg';

const About = () => {
  const achievements = [
    {
      year: "2024",
      title: "National ATV Championship - 2nd Place",
      description: "Outstanding performance in the national competition with our innovative racing ATV design.",
      icon: Trophy
    },
    {
      year: "2023",
      title: "Innovation Excellence Award",
      description: "Recognized for groundbreaking electric ATV prototype and sustainable engineering practices.",
      icon: Award
    },
    {
      year: "2023",
      title: "Best Engineering Design",
      description: "Awarded for exceptional technical design and manufacturing quality in regional competition.",
      icon: Target
    },
    {
      year: "2022",
      title: "Student Organization of the Year",
      description: "University recognition for outstanding contribution to engineering education and student development.",
      icon: Users
    }
  ];

  const milestones = [
    { year: "2012", event: "Club Founded", members: "12" },
    { year: "2013", event: "First Competition", members: "25" },
    { year: "2022", event: "Regional Champions", members: "35" },
    { year: "2023", event: "National Recognition", members: "45" },
    { year: "2024", event: "Innovation Leaders", members: "50+" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl mb-4 md:mb-6">
            About AutoArchitects
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Driving innovation in off-road vehicle engineering through passion, 
            dedication, and cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-card hover-lift transition-smooth">
              <CardContent className="pt-6">
                <div className="w-16 h-16 energy-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl text-steel-dark mb-4">Mission</h3>
                <p className="text-muted-foreground">
                  To foster innovation in ATV engineering while providing students with 
                  hands-on experience in design, manufacturing, and competitive racing.
                </p> 
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-card hover-lift transition-smooth">
              <CardContent className="pt-6">
                <div className="w-16 h-16 energy-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl text-steel-dark mb-4">Vision</h3>
                <p className="text-muted-foreground">
                  To be the leading university ATV club, pioneering sustainable 
                  off-road vehicle technologies and inspiring the next generation of engineers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-card hover-lift transition-smooth">
              <CardContent className="pt-6">
                <div className="w-16 h-16 energy-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl text-steel-dark mb-4">Values</h3>
                <p className="text-muted-foreground">
                  Excellence in engineering, teamwork, innovation, safety, 
                  and sustainable practices in all our projects and competitions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-steel-dark mb-6">
              Our Achievements
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Recognition of our commitment to excellence and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="p-6 border-0 shadow-card hover-lift transition-smooth">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 energy-gradient rounded-lg flex items-center justify-center shadow-glow flex-shrink-0">
                      <achievement.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-bold text-energy bg-energy/10 px-3 py-1 rounded-full">
                          {achievement.year}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-xl text-steel-dark mb-3">
                        {achievement.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Advisors */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-steel-dark mb-6">
              Faculty Advisors
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated faculty members guiding our engineering journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="p-8 border-0 shadow-elegant">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-40 h-40 mb-6">
                    <img 
                      src={sunilImage} 
                      alt="Dr. Sunil Kumar" 
                      className="w-full h-full object-cover rounded-xl shadow-card"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-steel-dark/20 to-transparent rounded-xl" />
                  </div>
                  
                  <div>
                    <h3 className="font-display font-bold text-2xl text-steel-dark mb-1">
                      Dr. B Sunil
                    </h3>
                    <p className="text-energy font-semibold text-md mb-4">
                      Professor of Mechanical Engineering
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">
                      He has brings over 15 years of experience in automotive engineering and vehicle dynamics. His expertise has been instrumental in our club's success.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="bg-energy/10 text-energy px-3 py-1 rounded-full text-xs font-medium">
                        PhD Mechanical Engineering
                      </span>
                      <span className="bg-energy/10 text-energy px-3 py-1 rounded-full text-xs font-medium">
                        15+ Years Experience
                      </span>
                      <span className="bg-energy/10 text-energy px-3 py-1 rounded-full text-xs font-medium">
                        Automotive Expert
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 border-0 shadow-elegant">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-40 h-40 mb-6">
                    <img 
                      src={nareshImage} 
                      alt="Dr. Naresh Sharma" 
                      className="w-full h-full object-cover object-top rounded-xl shadow-card"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-steel-dark/20 to-transparent rounded-xl" />
                  </div>
                  
                  <div>
                    <h3 className="font-display font-bold text-2xl text-steel-dark mb-1">
                      Dr. Naresh H
                    </h3>
                    <p className="text-energy font-semibold text-md mb-4">
                      Assistant Professor of Mechanical Engineering
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">
                      He is specializes in embedded systems and battery technology, guiding our transition to electric and autonomous ATV development.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="bg-energy/10 text-energy px-3 py-1 rounded-full text-xs font-medium">
                        PhD Mechanical Engineering
                      </span>
                      <span className="bg-energy/10 text-energy px-3 py-1 rounded-full text-xs font-medium">
                        Automotive Expert
                      </span>
                      <span className="bg-energy/10 text-energy px-3 py-1 rounded-full text-xs font-medium">
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
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-steel-dark mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Milestones that shaped our club's growth and success
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-energy/30" />
              
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-center">
                    <div className="w-16 h-16 energy-gradient rounded-full flex items-center justify-center shadow-glow z-10">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-8 flex-1">
                      <Card className="p-6 border-0 shadow-card hover-lift transition-smooth">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-display font-bold text-xl text-steel-dark">
                              {milestone.event}
                            </h3>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-energy">{milestone.year}</span>
                              <p className="text-sm text-muted-foreground">{milestone.members} members</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;