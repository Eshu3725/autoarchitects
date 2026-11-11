import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import TAALogo from '@/assets/TAA.png';
import { CLUB } from '@/data/club';
import { cn } from '@/lib/utils';

const publicNavItems = [
  { n: '01', name: 'Home', path: '/' },
  { n: '02', name: 'About', path: '/about' },
  { n: '03', name: 'Crew', path: '/members' },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleDashboardClick = () => {
    navigate(user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    setIsMenuOpen(false);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'group relative flex items-baseline gap-1.5 px-3 py-2 font-display font-bold uppercase tracking-wide text-[15px] transition-colors',
      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
    );

  const indicator = (isActive: boolean) => (
    <span
      className={cn(
        'absolute left-3 right-3 -bottom-[13px] h-[3px] bg-energy origin-left transition-transform duration-300',
        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
      )}
      aria-hidden
    />
  );

  return (
    <>
      {/* Workshop status strip */}
      <div className="bg-graphite border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-4">
          <p className="label-mono text-[10px] sm:text-[11px] text-muted-foreground truncate">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-energy animate-blink mr-2 align-middle" />
            In the workshop <span className="text-foreground/40 mx-1.5">/</span>
            <span className="text-foreground">Building for {CLUB.nowBuilding}</span>
          </p>
          <p className="label-mono text-[10px] text-muted-foreground hidden md:block">
            {CLUB.institute} · {CLUB.city}
          </p>
        </div>
      </div>

      <nav className="bg-background/85 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3 group" aria-label="Team AutoArchitects home">
              <img
                src={TAALogo}
                alt=""
                className="h-11 w-11 object-contain transition-transform duration-500 group-hover:-rotate-6"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display font-extrabold italic uppercase text-xl tracking-tight">
                  Auto<span className="text-energy">Architects</span>
                </span>
                <span className="label-mono text-[9px] text-muted-foreground mt-1">SIT · ATV Engineering Team</span>
              </span>
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {publicNavItems.map((item) => (
                <NavLink key={item.path} to={item.path} end className={linkClass}>
                  {({ isActive }) => (
                    <>
                      <span className="font-mono text-[10px] text-energy/80">{item.n}</span>
                      {item.name}
                      {indicator(isActive)}
                    </>
                  )}
                </NavLink>
              ))}

              <span className="w-px h-6 bg-border mx-3" aria-hidden />

              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleDashboardClick}
                    className="flex items-center gap-2 px-3 py-2 font-display font-bold uppercase tracking-wide text-[15px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 font-display font-bold uppercase tracking-wide text-[15px] text-muted-foreground hover:text-energy transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="group flex items-center gap-1.5 h-10 px-4 bg-foreground text-background font-display font-bold uppercase tracking-wide text-[15px] hover:bg-energy hover:text-white transition-colors"
                >
                  Crew login
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center border border-border text-foreground"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-fade-in">
            <div className="px-4 py-4 flex flex-col">
              {publicNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-baseline gap-3 py-3 border-b border-border font-display font-extrabold italic uppercase text-3xl',
                      isActive ? 'text-energy' : 'text-foreground'
                    )
                  }
                >
                  <span className="font-mono not-italic text-xs text-muted-foreground">{item.n}</span>
                  {item.name}
                </NavLink>
              ))}
              <div className="flex gap-2 pt-4">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={handleDashboardClick}
                      className="flex-1 h-12 flex items-center justify-center gap-2 border border-border font-display font-bold uppercase"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 h-12 flex items-center justify-center gap-2 border border-border font-display font-bold uppercase text-energy"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 h-12 flex items-center justify-center gap-2 bg-foreground text-background font-display font-bold uppercase"
                  >
                    Crew login <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
