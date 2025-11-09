import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import TAALogo from '@/assets/TAA.png';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const publicNavItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Members', path: '/members' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleDashboardClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/user/dashboard');
    }
    setIsMenuOpen(false);
  };

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-smooth px-4 py-2 rounded-lg font-medium ${
      isActive 
        ? 'bg-energy text-white shadow-glow' 
        : 'text-steel hover:bg-steel/10 hover:text-energy'
    }`;

  return (
    <nav className="bg-background/98 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-energy/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img src={TAALogo} alt="TAA Logo" className="h-12 transition-all duration-300 group-hover:scale-110 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-steel-dark group-hover:text-energy transition-colors duration-300">AUTOARCHITECTS</span>
              <span className="text-xs text-energy font-semibold tracking-wider">ONE TEAM ONE DREAM !!!</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {publicNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={getLinkClass}
              >
                {item.name}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <Button
                  onClick={handleDashboardClick}
                  variant="ghost"
                  className="px-4 py-2 rounded-lg font-medium text-steel hover:bg-steel/10 hover:text-energy transition-smooth"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="px-4 py-2 rounded-lg font-medium text-steel hover:bg-red-500/10 hover:text-red-600 transition-smooth"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <NavLink to="/login" className={getLinkClass}>
                Login
              </NavLink>
            )}
          </div>

          {/* Mobile menu button */}
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
              {publicNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={getLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}

              {isAuthenticated ? (
                <>
                  <Button
                    onClick={handleDashboardClick}
                    variant="ghost"
                    className="justify-start px-4 py-2 rounded-lg font-medium text-steel hover:bg-steel/10 hover:text-energy transition-smooth"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="justify-start px-4 py-2 rounded-lg font-medium text-steel hover:bg-red-500/10 hover:text-red-600 transition-smooth"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className={getLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;