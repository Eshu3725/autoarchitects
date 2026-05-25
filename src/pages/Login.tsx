import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, Eye, EyeOff, Zap, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import TAALogo from '@/assets/TAA.png';

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
    <div className="min-h-screen bg-background relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 grid-background opacity-10 pointer-events-none" />
      
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-energy/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3 mb-6 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-energy/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <img
                src={TAALogo}
                alt="AutoArchitects Logo"
                className="w-16 h-16 object-contain relative z-10 transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-black text-2xl tracking-tight text-white">AUTOARCHITECTS</span>
              <span className="text-[10px] text-energy font-extrabold tracking-widest uppercase">ATV CLUB</span>
            </div>
          </div>
          <h1 className="font-display font-black text-3xl text-white uppercase tracking-tight mb-2">
            INSIDERS PANEL
          </h1>
          <p className="text-zinc-400 text-sm">
            Sign in to access your telemetry dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card className="glass-panel border border-white/5 shadow-2xl rounded-2xl overflow-hidden animate-scale-in">
          <CardHeader className="text-center pb-4 border-b border-white/5 bg-black/10">
            <CardTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {error && (
              <Alert variant="destructive" className="bg-red-950/55 border-red-500/20 text-red-400">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300 text-xs font-bold uppercase tracking-wider">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-11 bg-black/30 border-white/10 text-white placeholder:text-zinc-600 focus:border-energy focus:ring-energy/20 transition-smooth rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300 text-xs font-bold uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your USN or Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-11 bg-black/30 border-white/10 text-white placeholder:text-zinc-600 focus:border-energy focus:ring-energy/20 transition-smooth rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-zinc-500 hover:text-energy transition-smooth"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 bg-zinc-900 border-zinc-800 text-energy focus:ring-energy/20 rounded"
                  />
                  <Label htmlFor="remember" className="text-xs text-zinc-400 font-medium cursor-pointer">
                    Remember device
                  </Label>
                </div>
                <Link 
                  to="#" 
                  className="text-xs text-energy hover:text-energy-light transition-smooth font-bold uppercase tracking-wider"
                >
                  Forgot Key?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 energy-gradient hover-glow transition-smooth font-bold text-sm uppercase tracking-wider rounded-xl border border-energy-light/20 shadow-lg"
              >
                {isLoading ? 'Decrypting Credentials...' : 'Access Portal'}
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs text-zinc-500">
                Facing issues? Contact{' '}
                <a
                  href="mailto:autoarchitects@gmail.com"
                  className="text-energy hover:text-energy-light transition-smooth font-bold"
                >
                  support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
            Telemetry Control Center v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;