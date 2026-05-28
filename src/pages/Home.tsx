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
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Tech Grid Overlay across the entire page background */}
      <div className="absolute inset-0 grid-background opacity-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 hover:scale-110"
          style={{ backgroundImage: `url(${heroImage})`, transition: 'transform 10s ease-in-out' }}
        />
        {/* Sleek dark gradient to hide edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-background/80 to-background" />

        {/* Dynamic speed-lines background overlay - hidden on mobile to prevent overflow */}
        <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
          <div className="absolute top-[30%] left-[-50px] sm:left-[-100px] w-[150px] sm:w-[200px] h-[2px] bg-gradient-to-r from-transparent to-energy animate-pulse-glow" style={{ animationDuration: '3s' }} />
          <div className="absolute top-[60%] right-[-50px] sm:right-[-100px] w-[200px] sm:w-[300px] h-[2px] bg-gradient-to-l from-transparent to-energy animate-pulse-glow" style={{ animationDuration: '4s' }} />
        </div>

        <div className="relative z-10 text-center w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-energy/10 border border-energy/30 text-energy text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest animate-fade-in-up">
            Motorsport Engineering Club
          </div>
          <h1 className="font-display font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-4 sm:mb-6 tracking-tighter uppercase leading-none animate-fade-in-up break-words">
            AUTOARCHITECTS
            <span className="block text-gradient-energy mt-2 sm:mt-3 tracking-wider sm:tracking-widest text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light">ATV CLUB</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-300 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto font-medium leading-relaxed px-2 sm:px-0 animate-fade-in-up delay-200">
            Where raw power meets precision engineering. We design, manufacture, and race high-performance all-terrain vehicles.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-up delay-300 px-2 sm:px-0">
            <Button asChild size="lg" className="btn-modern energy-gradient hover-glow text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-5 sm:py-6 font-bold shadow-2xl rounded-xl border border-energy-light/20 w-full sm:w-auto min-h-[48px]">
              <Link to="/about#our-journey" className="flex items-center justify-center">
                Explore Journey<ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
            <Button
              onClick={() => setIsRegistrationModalOpen(true)}
              variant="outline"
              size="lg"
              className="btn-modern bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/15 hover:border-energy hover:text-energy hover:scale-105 text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-5 sm:py-6 font-bold shadow-2xl transition-all duration-300 rounded-xl w-full sm:w-auto min-h-[48px]"
            >
              Join the Team
            </Button>
          </div>
        </div>

        {/* Scroll indicator - hidden on very small screens */}
        <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-1.5 h-3 bg-energy rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-background via-background to-muted/20 relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16 md:mb-20 animate-fade-in-up">
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight mb-3 sm:mb-4 px-2">
              Our <span className="text-gradient-energy">Telemetry</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
              A record of our continuous strive for engineering superiority and race-track performance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="group text-center p-6 sm:p-8 md:p-10 rounded-2xl glass-panel hover-neon-border transition-all duration-500 border border-white/5 hover:border-energy/30 animate-fade-in-up delay-100 relative overflow-hidden">
              {/* Telemetry dial overlay */}
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 border border-white/5 rounded-full -mr-6 -mt-6 sm:-mr-8 sm:-mt-8 opacity-20 group-hover:scale-125 transition-transform duration-500" />
              <div className="relative inline-block mb-4 sm:mb-6">
                <div className="absolute inset-0 bg-energy/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-energy mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white mb-2 tracking-tight">10+</h3>
              <p className="text-energy font-bold text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest">Awards Won</p>
              <p className="text-zinc-400 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed">National recognition for design, durability, and craftsmanship</p>
            </div>

            <div className="group text-center p-6 sm:p-8 md:p-10 rounded-2xl glass-panel hover-neon-border transition-all duration-500 border border-white/5 hover:border-energy/30 animate-fade-in-up delay-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 border border-white/5 rounded-full -mr-6 -mt-6 sm:-mr-8 sm:-mt-8 opacity-20 group-hover:scale-125 transition-transform duration-500" />
              <div className="relative inline-block mb-4 sm:mb-6">
                <div className="absolute inset-0 bg-energy/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <Users className="w-12 h-12 sm:w-14 sm:h-14 text-energy mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white mb-2 tracking-tight">35+</h3>
              <p className="text-energy font-bold text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest">Active Engineers</p>
              <p className="text-zinc-400 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed">Dedicated minds across structural, chassis, transmission, and electronics subteams</p>
            </div>

            <div className="group text-center p-6 sm:p-8 md:p-10 rounded-2xl glass-panel hover-neon-border transition-all duration-500 border border-white/5 hover:border-energy/30 animate-fade-in-up delay-300 relative overflow-hidden sm:col-span-2 md:col-span-1">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 border border-white/5 rounded-full -mr-6 -mt-6 sm:-mr-8 sm:-mt-8 opacity-20 group-hover:scale-125 transition-transform duration-500" />
              <div className="relative inline-block mb-4 sm:mb-6">
                <div className="absolute inset-0 bg-energy/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <Wrench className="w-12 h-12 sm:w-14 sm:h-14 text-energy mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white mb-2 tracking-tight">10+</h3>
              <p className="text-energy font-bold text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest">ATVs Built</p>
              <p className="text-zinc-400 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed">Custom-fabricated off-road machines engineered to endure the toughest terrains</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase */}
      <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-muted/10 via-background to-muted/10 relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16 md:mb-20 animate-fade-in-up">
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight mb-3 sm:mb-4 px-2">
              Showcasing Our <span className="text-gradient-energy">Journey</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
              Experience the adrenaline, engineering process, and track-side challenges of Team AutoArchitects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {youtubeVideos.map((video, index) => (
              <div
                key={video.id}
                className="group animate-scale-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative glass-panel rounded-xl sm:rounded-2xl border border-white/5 shadow-2xl overflow-hidden transition-all duration-500 ease-out hover:scale-[1.03] hover:border-energy/40 hover:shadow-energy/10">
                  <div className="relative overflow-hidden aspect-video border-b border-white/5">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4 sm:p-6 bg-gradient-to-b from-background/50 to-background">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-2 group-hover:text-energy transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
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
      <section className="py-16 sm:py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight mb-3 sm:mb-4 px-2">
              Visual <span className="text-gradient-energy">Collections</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
              A glance at our custom-designed structures, manufacturing, and test sessions
            </p>
          </div>

          {/* ATV Image Carousel */}
          <div className="relative group/carousel max-w-6xl mx-auto">
            <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl" ref={emblaRef}>
              <div className="flex">
                {atvImages.map((image, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0">
                    <div className="relative">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover transition-transform duration-700 hover:scale-105"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85" />
                      {/* Image Caption */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12 text-left">
                        <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-energy text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider sm:tracking-widest rounded-md mb-2 sm:mb-3">
                          Featured Build
                        </span>
                        <h3 className="font-display font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-1 sm:mb-2 uppercase tracking-tight">
                          {image.alt}
                        </h3>
                        <p className="text-zinc-300 text-xs sm:text-sm md:text-base lg:text-lg max-w-xl font-medium leading-relaxed">
                          Precision engineering combined with rugged chassis structure built to dominate all terrains.
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
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-energy hover:border-energy text-white transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-110 z-10 shadow-2xl"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-energy hover:border-energy text-white transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-110 z-10 shadow-2xl"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
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