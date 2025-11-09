import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import TAAFooterLogo from '@/assets/TAA_footer.png';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-steel-dark via-steel to-metallic text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-energy rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Club Info */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-energy/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img src={TAAFooterLogo} alt="TAA Footer Logo" className="h-12 transition-transform duration-300 group-hover:scale-110 relative z-10" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl group-hover:text-energy transition-colors">AUTOARCHITECTS</h3>
                <p className="text-white/70 text-sm font-semibold">Engineering Excellence</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              Where innovation meets adventure. Join our community of ATV enthusiasts
              and engineers building the future of off-road vehicles.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 animate-fade-in-up delay-200">
            <h3 className="font-display font-bold text-xl mb-4">Contact <span className="text-energy">Us</span></h3>
            <div className="space-y-4">
              <a href="mailto:autoarchitects@sit.ac.in" className="flex items-center space-x-3 text-white/80 hover:text-energy transition-colors group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-energy/20 transition-colors">
                  <Mail className="w-5 h-5 text-energy" />
                </div>
                <span className="font-medium">autoarchitects@sit.ac.in</span>
              </a>
              <a href="tel:+916363852155" className="flex items-center space-x-3 text-white/80 hover:text-energy transition-colors group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-energy/20 transition-colors">
                  <Phone className="w-5 h-5 text-energy" />
                </div>
                <span className="font-medium">+91 6363852155</span>
              </a>
              <div className="flex items-center space-x-3 text-white/80 group">
                <div className="p-2 bg-white/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-energy" />
                </div>
                <span className="font-medium">Siddaganga Institute of Technology</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-6 animate-fade-in-up delay-300">
            <h3 className="font-display font-bold text-xl mb-4">Follow <span className="text-energy">Us</span></h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-energy hover-glow hover-scale transition-all duration-300 group border border-white/20 hover:border-energy/50"
              >
                <Facebook className="w-6 h-6 text-white/80 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-energy hover-glow hover-scale transition-all duration-300 group border border-white/20 hover:border-energy/50"
              >
                <Instagram className="w-6 h-6 text-white/80 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-energy hover-glow hover-scale transition-all duration-300 group border border-white/20 hover:border-energy/50"
              >
                <Twitter className="w-6 h-6 text-white/80 group-hover:text-white" />
              </a>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Stay updated with our latest builds, events, and competitions.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center animate-fade-in">
          <p className="text-white/70 font-medium">
            © 2025 <span className="text-energy font-bold">AUTOARCHITECTS</span> ATV Club. All rights reserved. Built with passion for engineering excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;