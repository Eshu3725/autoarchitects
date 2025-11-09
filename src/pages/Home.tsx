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
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[10s] hover:scale-110"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 hero-gradient opacity-80" />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white mb-4 md:mb-6 animate-fade-in-up">
            AUTOARCHITECTS
            <span className="block text-gradient-energy mt-2 animate-pulse-glow">ATV Club</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in-up delay-200">
            Where innovation meets adventure. Engineering the future of off-road vehicles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Button asChild size="lg" className="energy-gradient hover-glow hover-shine transition-smooth text-base md:text-lg px-8 md:px-10 py-4 md:py-7 font-semibold shadow-2xl">
              <Link to="/about">
                Explore Our Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-2 border-white/60 text-white hover:bg-white/30 hover:border-white hover:scale-105 text-base md:text-lg px-8 md:px-10 py-4 md:py-7 font-bold transition-all duration-300 shadow-2xl hover:shadow-white/20">
              <Link to="/members">
               Join Team
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-b from-background via-background to-muted/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-energy rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-steel-dark mb-4">
              Our <span className="text-gradient-energy">Achievements</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pushing boundaries and setting new standards in ATV engineering
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-10 rounded-2xl glass-card hover-lift transition-smooth border-2 border-transparent hover:border-energy/30 animate-fade-in-up delay-100">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-energy/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <Trophy className="w-16 h-16 text-energy mx-auto relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-br from-energy to-energy-dark bg-clip-text text-transparent mb-3">15+</h3>
              <p className="text-foreground/80 font-semibold text-lg">Awards Won</p>
              <p className="text-muted-foreground text-sm mt-2">National & International Recognition</p>
            </div>
            <div className="group text-center p-10 rounded-2xl glass-card hover-lift transition-smooth border-2 border-transparent hover:border-energy/30 animate-fade-in-up delay-200">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-energy/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <Users className="w-16 h-16 text-energy mx-auto relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-br from-energy to-energy-dark bg-clip-text text-transparent mb-3">30+</h3>
              <p className="text-foreground/80 font-semibold text-lg">Active Members</p>
              <p className="text-muted-foreground text-sm mt-2">Passionate Engineers & Innovators</p>
            </div>
            <div className="group text-center p-10 rounded-2xl glass-card hover-lift transition-smooth border-2 border-transparent hover:border-energy/30 animate-fade-in-up delay-300">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-energy/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <Wrench className="w-16 h-16 text-energy mx-auto relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-br from-energy to-energy-dark bg-clip-text text-transparent mb-3">25+</h3>
              <p className="text-foreground/80 font-semibold text-lg">ATVs Built</p>
              <p className="text-muted-foreground text-sm mt-2">Cutting-Edge ATV Designs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-24 bg-gradient-to-b from-muted/30 via-background to-muted/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-steel-dark mb-4">
              Showcasing Our <span className="text-gradient-energy">Journey</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience our journey through competitions, workshops, and challenges
            </p>
          </div>

          <div className="overflow-x-auto pb-8 -mx-4 px-4">
            <div className="flex space-x-6 min-w-max">
              <div
                className="group relative w-[420px]"
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
                <div className="relative glass-card rounded-2xl border-2 border-white/10 shadow-2xl overflow-hidden transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-energy/20 group-hover:border-energy/30">
                  <div className="relative overflow-hidden">
                    <video
                      className="w-full aspect-video object-cover"
                      muted
                      onMouseEnter={(e) => e.currentTarget.play()}
                    >
                      <source src={video1} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 bg-gradient-to-b from-background/95 to-background">
                    <h3 className="font-display font-bold text-xl text-steel-dark mb-2 group-hover:text-energy transition-colors">Motorsport BAJA Season 2020</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Our team's journey through the intense BAJA competition season, showcasing dedication and engineering excellence.</p>
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