import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, Users, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-atv.jpg';
import workshopImage from '@/assets/workshop-atvs.jpg';
import eventImage from '@/assets/event-competition.jpg';

const Home = () => {
  const pastEvents = [
    {
      title: "National ATV Championship 2024",
      description: "Our team secured 2nd place in the national competition with our custom-built racing ATV.",
      image: eventImage,
      date: "March 2024"
    },
    {
      title: "Innovation Workshop Series",
      description: "Monthly workshops covering advanced engineering techniques and ATV modifications.",
      image: workshopImage,
      date: "Ongoing"
    },
    {
      title: "Desert Challenge Competition",
      description: "Extreme terrain testing of our latest all-terrain vehicle prototypes.",
      image: eventImage,
      date: "January 2024"
    }
  ];

  const showcaseATVs = [
    {
      name: "Thunderbolt Racing ATV",
      description: "High-performance racing machine with custom suspension and 450cc engine.",
      specs: ["450cc Engine", "Custom Suspension", "Lightweight Frame"]
    },
    {
      name: "All-Terrain Explorer",
      description: "Versatile ATV designed for extreme off-road conditions and long expeditions.",
      specs: ["600cc Engine", "All-Weather Design", "GPS Navigation"]
    },
    {
      name: "Electric Pioneer",
      description: "Eco-friendly electric ATV showcasing sustainable engineering innovation.",
      specs: ["Electric Motor", "Long Range Battery", "Regenerative Braking"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 hero-gradient opacity-75" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-6">
            VeloTech
            <span className="block text-gradient-energy">ATV Club</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Where innovation meets adventure. Engineering the future of off-road vehicles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="energy-gradient hover-glow transition-smooth text-lg px-8 py-6">
              <Link to="/about">
                Explore Our Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
              <Link to="/members">
                Meet The Team
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl metallic-gradient shadow-card hover-lift transition-smooth">
              <Trophy className="w-12 h-12 text-energy mx-auto mb-4" />
              <h3 className="font-display font-bold text-3xl text-white mb-2">15+</h3>
              <p className="text-white/80 font-medium">Awards Won</p>
            </div>
            <div className="text-center p-8 rounded-xl metallic-gradient shadow-card hover-lift transition-smooth">
              <Users className="w-12 h-12 text-energy mx-auto mb-4" />
              <h3 className="font-display font-bold text-3xl text-white mb-2">50+</h3>
              <p className="text-white/80 font-medium">Active Members</p>
            </div>
            <div className="text-center p-8 rounded-xl metallic-gradient shadow-card hover-lift transition-smooth">
              <Wrench className="w-12 h-12 text-energy mx-auto mb-4" />
              <h3 className="font-display font-bold text-3xl text-white mb-2">25+</h3>
              <p className="text-white/80 font-medium">ATVs Built</p>
            </div>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-steel-dark mb-6">
              Past Events
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Showcasing our journey through competitions, workshops, and challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <Card key={index} className="overflow-hidden shadow-card hover-lift transition-smooth border-0">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-smooth hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-energy bg-energy/10 px-3 py-1 rounded-full">
                      {event.date}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-xl text-steel-dark mb-3">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ATV Showcase */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-steel-dark mb-6">
              Our ATV Collection
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Engineering excellence in every vehicle we build
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {showcaseATVs.map((atv, index) => (
                <div key={index} className="p-6 rounded-xl border border-border shadow-card hover-lift transition-smooth">
                  <h3 className="font-display font-bold text-2xl text-steel-dark mb-3">
                    {atv.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {atv.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {atv.specs.map((spec, specIndex) => (
                      <span 
                        key={specIndex}
                        className="text-sm bg-energy/10 text-energy px-3 py-1 rounded-full font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <img 
                src={workshopImage} 
                alt="ATV Workshop" 
                className="w-full h-auto rounded-xl shadow-elegant"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-steel-dark/50 to-transparent rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;