import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from 'lucide-react';

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
            <div className="flex items-center justify-center w-10 h-10 energy-gradient rounded-lg shadow-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-steel-dark">VeloTech</span>
              <span className="text-xs text-muted-foreground font-medium">ATV CLUB</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
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

          {/* Mobile menu button */}
          <div className="md:hidden">
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