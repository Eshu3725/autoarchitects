import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import TAALogo from '@/assets/TAA.png';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Members', path: '/members' },
    { name: 'Login', path: '/login' },
  ];

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-smooth px-4 py-2 rounded-lg font-medium ${
      isActive 
        ? 'bg-energy text-white shadow-glow' 
        : 'text-steel hover:bg-steel/10 hover:text-energy'
    }`;

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-elegant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={TAALogo} alt="TAA Logo" className="h-10" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-steel-dark">AUTOARCHITECTS</span>
              <span className="text-xs text-muted-foreground font-medium">ONE TEAM ONE DREAM !!!</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={getLinkClass}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-steel hover:text-energy hover:bg-steel/10"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-border mt-2">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={getLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;