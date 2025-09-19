import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import TAAFooterLogo from '@/assets/TAA_footer.png';

const Footer = () => {
  return (
    <footer className="bg-steel-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Club Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={TAAFooterLogo} alt="TAA Footer Logo" className="h-10" />
              <div>
                <h3 className="font-display font-bold text-lg">AUTOARCHITECTS</h3>
                <p className="text-steel-light text-sm">Engineering Excellence</p>
              </div>
            </div>
            <p className="text-steel-light">
              Where innovation meets adventure. Join our community of ATV enthusiasts 
              and engineers building the future of off-road vehicles.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-steel-light">
                <Mail className="w-5 h-5 text-energy" />
                <span>contact@velotechatv.edu</span>
              </div>
              <div className="flex items-center space-x-3 text-steel-light">
                <Phone className="w-5 h-5 text-energy" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-steel-light">
                <MapPin className="w-5 h-5 text-energy" />
                <span>Siddaganga Institute of Technology</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-lg">Follow Us</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-steel/30 rounded-lg flex items-center justify-center hover:bg-energy hover-glow transition-smooth group"
              >
                <Facebook className="w-5 h-5 text-steel-light group-hover:text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-steel/30 rounded-lg flex items-center justify-center hover:bg-energy hover-glow transition-smooth group"
              >
                <Instagram className="w-5 h-5 text-steel-light group-hover:text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-steel/30 rounded-lg flex items-center justify-center hover:bg-energy hover-glow transition-smooth group"
              >
                <Twitter className="w-5 h-5 text-steel-light group-hover:text-white" />
              </a>
            </div>
            <p className="text-steel-light text-sm">
              Stay updated with our latest builds, events, and competitions.
            </p>
          </div>
        </div>

        <div className="border-t border-steel mt-8 pt-8 text-center">
          <p className="text-steel-light">
            © 2025 AUTOARCHITECTS ATV Club. All rights reserved. Built with passion for engineering excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;