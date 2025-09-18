import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Lock, Mail, Eye, EyeOff, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-steel/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 energy-gradient rounded-xl shadow-glow">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl text-steel-dark">VeloTech</span>
              <span className="text-xs text-muted-foreground font-medium">ATV CLUB</span>
            </div>
          </div>
          <h1 className="font-display font-bold text-3xl text-steel-dark mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your club member portal
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-elegant">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-display text-2xl text-steel-dark">Member Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-steel font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 border-steel/20 focus:border-energy focus:ring-energy/20 transition-smooth"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-steel font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 border-steel/20 focus:border-energy focus:ring-energy/20 transition-smooth"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-energy transition-smooth"
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
                    className="w-4 h-4 text-energy border-steel/30 rounded focus:ring-energy/20"
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Remember me
                  </Label>
                </div>
                <Link 
                  to="#" 
                  className="text-sm text-energy hover:text-energy-dark transition-smooth font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button 
                type="submit"
                className="w-full h-12 energy-gradient hover-glow transition-smooth font-semibold text-lg"
              >
                Sign In
              </Button>
            </form>

            <div className="relative">
              <Separator className="my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-card px-4 text-sm text-muted-foreground">
                  New to VeloTech?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center space-y-4">
              <Button 
                variant="outline" 
                className="w-full h-12 border-steel/30 text-steel hover:bg-steel/10 hover:text-energy hover:border-energy transition-smooth font-semibold"
                asChild
              >
                <Link to="#">
                  Create New Account
                </Link>
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Need help? Contact{' '}
                <a 
                  href="mailto:support@velotechatv.edu" 
                  className="text-energy hover:text-energy-dark transition-smooth font-medium"
                >
                  support@velotechatv.edu
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link to="#" className="text-energy hover:text-energy-dark transition-smooth">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="#" className="text-energy hover:text-energy-dark transition-smooth">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;