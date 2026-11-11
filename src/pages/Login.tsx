import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import TAALogo from '@/assets/TAA.png';
import pitsImage from '@/assets/web/m37-pits.jpg';
import { RacePlate } from '@/components/brand/Primitives';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        toast.success('Login successful!');
        // Navigation will be handled by useEffect
      } else {
        setError('Invalid email or password. Please try again.');
        toast.error('Login failed');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      toast.error('Login error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      {/* Pit-lane photo panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-border">
        <img
          src={pitsImage}
          alt="Team AutoArchitects working on car M37 in the paddock"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/40 to-graphite/30" />
        <div className="hazard-stripe h-2 relative" />
        <div className="relative p-10 xl:p-14">
          <RacePlate number="M37" className="mb-6" />
          <p className="font-display font-extrabold italic uppercase text-6xl xl:text-7xl leading-[0.86] tracking-tight text-bone">
            Pit lane.
            <br />
            <span className="text-energy">Crew only.</span>
          </p>
          <p className="mt-5 text-bone/70 max-w-sm leading-relaxed">
            Attendance, notices, leave requests and registrations for Team AutoArchitects members and admins.
          </p>
        </div>
      </aside>

      {/* Form */}
      <main className="relative flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="absolute inset-0 drafting-grid drafting-grid-fade pointer-events-none" aria-hidden />
        <div className="relative w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
            <img src={TAALogo} alt="" className="w-12 h-12 object-contain" />
            <span className="flex flex-col leading-none">
              <span className="font-display font-extrabold italic uppercase text-xl">
                Auto<span className="text-energy">Architects</span>
              </span>
              <span className="label-mono text-[9px] text-muted-foreground mt-1 group-hover:text-foreground transition-colors">
                ← Back to site
              </span>
            </span>
          </Link>

          <p className="label-mono text-energy">Crew portal</p>
          <h1 className="mt-3 font-display font-extrabold italic uppercase text-5xl leading-[0.9] tracking-tight">Sign in</h1>
          <p className="mt-3 text-muted-foreground">Use your team email and password to reach your dashboard.</p>

          <div className="mt-8 border border-border bg-card">
            <div className="flex items-center justify-between px-5 h-9 border-b border-border bg-muted">
              <span className="label-mono text-[10px] text-muted-foreground">Crew pass · Authentication</span>
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/40 text-destructive rounded-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="label-mono text-[10px] text-muted-foreground">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="your.email@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-background border-border rounded-sm focus-visible:ring-energy/40 focus-visible:border-energy"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="label-mono text-[10px] text-muted-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your USN or password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-11 h-12 bg-background border-border rounded-sm focus-visible:ring-energy/40 focus-visible:border-energy"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="remember" className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input id="remember" type="checkbox" className="w-4 h-4 accent-[hsl(var(--energy))]" />
                    Remember this device
                  </label>
                  <Link to="#" className="text-sm text-energy hover:text-energy-light transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-sm bg-energy hover:bg-energy-dark text-white font-display font-bold uppercase tracking-wide text-lg"
                >
                  {isLoading ? (
                    'Checking credentials…'
                  ) : (
                    <span className="flex items-center gap-2">
                      Enter the pit <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>
            </div>

            <div className="px-5 sm:px-6 py-3 border-t border-dashed border-border text-sm text-muted-foreground">
              Trouble signing in?{' '}
              <a href="mailto:autoarchitects@gmail.com" className="text-energy hover:text-energy-light font-semibold">
                Contact the team
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
