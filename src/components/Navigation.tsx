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
    `relative transition-all duration-300 px-4 py-2 rounded-lg font-semibold tracking-wider uppercase text-xs sm:text-sm ${
      isActive 
        ? 'text-energy bg-energy/10 border border-energy/20 shadow-[inset_0_0_12px_rgba(230,0,18,0.15)] shadow-energy/20' 
        : 'text-steel hover:text-energy hover:bg-white/5'
    }`;

  return (
    <nav className="bg-background/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-22 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-energy/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <img src={TAALogo} alt="TAA Logo" className="h-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight text-white group-hover:text-energy transition-colors duration-300">AUTOARCHITECTS</span>
              <span className="text-[10px] text-energy font-extrabold tracking-widest uppercase">ONE TEAM ONE DREAM !!!</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
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
                  className="px-4 py-2 rounded-lg font-semibold tracking-wider uppercase text-xs text-steel hover:bg-white/5 hover:text-energy transition-smooth h-auto"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="px-4 py-2 rounded-lg font-semibold tracking-wider uppercase text-xs text-steel hover:bg-red-500/10 hover:text-red-500 transition-smooth h-auto"
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