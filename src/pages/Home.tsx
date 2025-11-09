import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, Users, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/Banner.jpg';
import workshopImage from '@/assets/workshop-atvs.jpg';
import eventImage from '@/assets/event-competition.jpg';

// Video files are served from public folder to avoid bundling large files
const video1 = '/videos/1AUTO ARCHITECTS MOTOSPORT BAJA season 2020.mp4';
const video2 = '/videos/2IMAGINATION 4.0SEASON END.mp4';
const video3 = '/videos/3TEAM AUTO ARCHITECTS _ imagination 3.0 _The Journe(1080P_HD).mp4';
const video4 = '/videos/4The Off Road Hustle _Auto Architects_ IMAGINATION(1080P_HD).mp4';
const video5 = '/videos/AUTO ARCHITECTS BAJA SAEINDIA 2020.mp4';
const video6 = '/videos/season 2020 baja auto architects.mp4';
const video7 = '/videos/WhatsApp Video 2019-11-26 at 1.07.35 PM.mp4';

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
      <section className="relative h-[80vh] md:h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 hero-gradient opacity-75" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl text-white mb-4 md:mb-6">
            AUTOARCHITECTS
            <span className="block text-gradient-energy">ATV Club</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Where innovation meets adventure. Engineering the future of off-road vehicles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="energy-gradient hover-glow transition-smooth text-base md:text-lg px-6 md:px-8 py-3 md:py-6">
              <Link to="/about">
                Explore Our Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/50 bg-white/10 text-white hover:bg-white/20 hover:border-white/70 backdrop-blur-sm text-base md:text-lg px-6 md:px-8 py-3 md:py-6 transition-smooth">
              <Link to="/members">
               Join Team
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
              <h3 className="font-display font-bold text-3xl text-white mb-2">30+</h3>
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
              Showcasing Our Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Showcasing our journey through competitions, workshops, and challenges
            </p>
          </div>

          <div className="overflow-x-auto pb-6">
            <div className="flex space-x-8 min-w-max">
              <div
                className="group relative w-[400px]"
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-card overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl">
                  <div className="relative">
                    <video
                      className="w-full"
                      muted
                      onMouseEnter={(e) => e.currentTarget.play()}
                    >
                      <source src={video1} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-lg text-steel-dark mb-2">Motorsport BAJA Season 2020</h3>
                    <p className="text-sm text-muted-foreground">Our team's journey through the intense BAJA competition season, showcasing dedication and engineering excellence.</p>
                  </div>
                </div>
              </div>

              <div
                className="group relative w-[400px]"
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-card overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl">
                  <div className="relative">
                    <video
                      className="w-full"
                      muted
                      onMouseEnter={(e) => e.currentTarget.play()}
                    >
                      <source src={video2} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-lg text-steel-dark mb-2">IMAGINATION 4.0 Season Finale</h3>
                    <p className="text-sm text-muted-foreground">The culmination of our innovative design process and technical achievements in the latest season.</p>
                  </div>
                </div>
              </div>

              <div
                className="group relative w-[400px]"
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-card overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl">
                  <div className="relative">
                    <video
                      className="w-full"
                      muted
                      onMouseEnter={(e) => e.currentTarget.play()}
                    >
                      <source src={video3} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-lg text-steel-dark mb-2">IMAGINATION 3.0 Journey</h3>
                    <p className="text-sm text-muted-foreground">A glimpse into our team's evolution and groundbreaking achievements during IMAGINATION 3.0.</p>
                  </div>
                </div>
              </div>

              <div
                className="group relative w-[400px]"
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-card overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl">
                  <div className="relative">
                    <video
                      className="w-full"
                      muted
                      onMouseEnter={(e) => e.currentTarget.play()}
                    >
                      <source src={video4} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-lg text-steel-dark mb-2">The Off-Road Hustle</h3>
                    <p className="text-sm text-muted-foreground">Experience the thrill and challenges of off-road engineering with our dedicated team.</p>
                  </div>
                </div>
              </div>

              <div
                className="group relative w-[400px]"
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-card overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl">
                  <div className="relative">
                    <video
                      className="w-full"
                      muted
                      onMouseEnter={(e) => e.currentTarget.play()}
                    >
                      <source src={video5} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-lg text-steel-dark mb-2">BAJA SAEINDIA 2020</h3>
                    <p className="text-sm text-muted-foreground">Our competitive spirit and technical prowess on display at BAJA SAEINDIA 2020.</p>
                  </div>
                </div>
              </div>

              <div
                className="group relative w-[400px]"
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-card overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl">
                  <div className="relative">
                    <video
                      className="w-full"
                      muted
                      onMouseEnter={(e) => e.currentTarget.play()}
                    >
                      <source src={video6} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-lg text-steel-dark mb-2">Season 2020 Highlights</h3>
                    <p className="text-sm text-muted-foreground">A compilation of our best moments and achievements throughout the 2020 season.</p>
                  </div>
                </div>
              </div>

              <div
                className="group relative w-[400px]"
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-card overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl">
                  <div className="relative">
                    <video
                      className="w-full"
                      muted
                      onMouseEnter={(e) => e.currentTarget.play()}
                    >
                      <source src={video7} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-lg text-steel-dark mb-2">Team Showcase 2019</h3>
                    <p className="text-sm text-muted-foreground">A special glimpse into our team's dynamics and innovative approach to ATV engineering.</p>
                  </div>
                </div>
              </div>
            </div>
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