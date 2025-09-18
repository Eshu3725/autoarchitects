import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display font-bold text-9xl text-energy mb-4">404</h1>
          <h2 className="font-display font-bold text-3xl text-steel-dark mb-4">Page Not Found</h2>
          <p className="text-muted-foreground text-lg">
            Looks like you've ventured off the beaten path. This page doesn't exist in our club's territory.
          </p>
        </div>
        
        <Button 
          asChild 
          size="lg" 
          className="energy-gradient hover-glow transition-smooth font-semibold"
        >
          <a href="/">
            <HomeIcon className="mr-2 w-5 h-5" />
            Return to Home Base
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
