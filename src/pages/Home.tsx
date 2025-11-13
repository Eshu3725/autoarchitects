import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, Users, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import heroImage from '@/assets/Banner.jpg';
import workshopImage from '@/assets/workshop-atvs.jpg';
import eventImage from '@/assets/event-competition.jpg';
import bannerImage from '@/assets/Banner2.png';
import dscImage from '@/assets/DSC_0691.jpg';
import image from  '@/assets/image.png';
import RegistrationModal from '@/components/RegistrationModal';

// YouTube video embeds
const youtubeVideos = [
  {
    id: 's5r2IgRNKy8',
    title: 'Imagination 4.0',
    description: 'Experience our innovative design process and technical achievements in the latest season of Imagination 4.0.'
  },
  {
    id: 'jJvIsFY4SLE',
    title: 'Offroad Hustle',
    description: 'Experience the thrill and challenges of off-road engineering with our dedicated team pushing boundaries.'
  },
  {
    id: '3iw9kQVrP6A',
    title: 'Team AutoArchitects',
    description: 'A glimpse into our team\'s dynamics, dedication, and innovative approach to ATV engineering excellence.'
  }
];

const Home = () => {
  // Registration Modal State
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

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

  // ATV Carousel Images
  const atvImages = [
    { src: dscImage, alt: "Imagination 4.0" },
    { src: bannerImage, alt: "Team AutoArchitects" },
    { src: image, alt: "One Team One Dream" }
  ];

  // Embla Carousel Setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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
              <Link to="/about#our-journey">
                Know about Us<ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              onClick={() => setIsRegistrationModalOpen(true)}
              variant="outline"
              size="lg"
              className="bg-white/20 backdrop-blur-md border-2 border-white/60 text-white hover:bg-white/30 hover:border-white hover:scale-105 text-base md:text-lg px-8 md:px-10 py-4 md:py-7 font-bold transition-all duration-300 shadow-2xl hover:shadow-white/20"
            >
              Join Team
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
              <h3 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-br from-energy to-energy-dark bg-clip-text text-transparent mb-3">10+</h3>
              <p className="text-foreground/80 font-semibold text-lg">Awards Won</p>
              <p className="text-muted-foreground text-sm mt-2">National & International Recognition</p>
            </div>
            <div className="group text-center p-10 rounded-2xl glass-card hover-lift transition-smooth border-2 border-transparent hover:border-energy/30 animate-fade-in-up delay-200">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-energy/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <Users className="w-16 h-16 text-energy mx-auto relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-br from-energy to-energy-dark bg-clip-text text-transparent mb-3">35+</h3>
              <p className="text-foreground/80 font-semibold text-lg">Active Members</p>
              <p className="text-muted-foreground text-sm mt-2">Passionate Engineers & Innovators</p>
            </div>
            <div className="group text-center p-10 rounded-2xl glass-card hover-lift transition-smooth border-2 border-transparent hover:border-energy/30 animate-fade-in-up delay-300">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-energy/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <Wrench className="w-16 h-16 text-energy mx-auto relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-br from-energy to-energy-dark bg-clip-text text-transparent mb-3">10+</h3>
              <p className="text-foreground/80 font-semibold text-lg">ATVs Built</p>
              <p className="text-muted-foreground text-sm mt-2">Cutting-Edge ATV Designs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {youtubeVideos.map((video, index) => (
              <div
                key={video.id}
                className="group animate-scale-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative glass-card rounded-2xl border-2 border-white/10 shadow-2xl overflow-hidden transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-energy/20 group-hover:border-energy/30">
                  <div className="relative overflow-hidden aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6 bg-gradient-to-b from-background/95 to-background">
                    <h3 className="font-display font-bold text-xl text-steel-dark mb-2 group-hover:text-energy transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATV Showcase */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-steel-dark mb-6">
            Visual <span className="text-gradient-energy">Collections</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Engineering excellence in every vehicle we build
            </p>
          </div>

          {/* ATV Image Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
              <div className="flex">
                {atvImages.map((image, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0">
                    <div className="relative group">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-[500px] md:h-[600px] object-cover rounded-2xl shadow-2xl"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-steel-dark/70 via-steel-dark/20 to-transparent rounded-2xl" />
                      {/* Image Caption */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <h3 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">
                          {image.alt}
                        </h3>
                        <p className="text-white/90 text-lg">
                          Precision engineering meets performance
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 glass-card p-3 rounded-full hover:bg-white/30 transition-all duration-300 shadow-2xl hover:scale-110 z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 glass-card p-3 rounded-full hover:bg-white/30 transition-all duration-300 shadow-2xl hover:scale-110 z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <RegistrationModal
        open={isRegistrationModalOpen}
        onOpenChange={setIsRegistrationModalOpen}
      />
    </div>
  );
};

export default Home;