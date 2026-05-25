import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import TAAFooterLogo from '@/assets/TAA_footer.png';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white overflow-hidden border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-energy rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-800 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Club Info */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-energy/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img src={TAAFooterLogo} alt="TAA Footer Logo" className="h-12 transition-all duration-300 group-hover:scale-110 relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl tracking-tight text-white group-hover:text-energy transition-colors">AUTOARCHITECTS</h3>
                <p className="text-energy text-xs font-bold uppercase tracking-wider">Engineering Excellence</p>
              </div>
            </div>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Where innovation meets adventure. We are a community of ATV enthusiasts
              and engineers building the future of off-road vehicle performance.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 animate-fade-in-up delay-200">
            <h3 className="font-display font-bold text-lg tracking-wider uppercase text-white mb-4">Contact <span className="text-energy">Us</span></h3>
            <div className="space-y-4">
              <a href="mailto:autoarchitects@gmail.com" className="flex items-center space-x-3 text-zinc-400 hover:text-energy transition-colors group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-energy/20 transition-colors">
                  <Mail className="w-5 h-5 text-energy" />
                </div>
                <span className="font-semibold text-sm">autoarchitects@gmail.com</span>
              </a>
              <a href="tel:+916363852155" className="flex items-center space-x-3 text-zinc-400 hover:text-energy transition-colors group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-energy/20 transition-colors">
                  <Phone className="w-5 h-5 text-energy" />
                </div>
                <span className="font-semibold text-sm">+91 6363852155</span>
              </a>
              <div className="flex items-center space-x-3 text-zinc-400 group">
                <div className="p-2 bg-white/5 rounded-lg">
                  <MapPin className="w-5 h-5 text-energy" />
                </div>
                <span className="font-semibold text-sm">Siddaganga Institute of Technology</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-6 animate-fade-in-up delay-300">
            <h3 className="font-display font-bold text-lg tracking-wider uppercase text-white mb-4">Follow <span className="text-energy">Us</span></h3>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/autoarchitects.sit"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 glass rounded-xl flex items-center justify-center hover:bg-energy hover-glow hover-scale transition-all duration-300 group border border-white/10 hover:border-energy/50"
              >
                <Facebook className="w-5 h-5 text-white/80 group-hover:text-white" />
              </a>
              <a
                href="https://www.instagram.com/autoarchitects?igsh=cTZuNGdrcmM2M2I1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 glass rounded-xl flex items-center justify-center hover:bg-energy hover-glow hover-scale transition-all duration-300 group border border-white/10 hover:border-energy/50"
              >
                <Instagram className="w-5 h-5 text-white/80 group-hover:text-white" />
              </a>
              <a
                href="https://twitter.com/autoarchitects_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 glass rounded-xl flex items-center justify-center hover:bg-energy hover-glow hover-scale transition-all duration-300 group border border-white/10 hover:border-energy/50"
              >
                <Twitter className="w-5 h-5 text-white/80 group-hover:text-white" />
              </a>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Stay updated with our latest builds, events, and championships.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 text-center animate-fade-in">
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
            © 2026 <span className="text-energy font-black">AUTOARCHITECTS</span> ATV Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;