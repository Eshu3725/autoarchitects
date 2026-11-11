import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { RacePlate, HazardStripe } from "@/components/brand/Primitives";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HazardStripe />
      <div className="relative flex-1 flex items-center justify-center px-4 py-16">
        <div className="absolute inset-0 drafting-grid drafting-grid-fade pointer-events-none" aria-hidden />
        <div className="relative text-center max-w-xl">
          <RacePlate number="404" size="lg" />
          <p className="label-mono text-energy mt-10">Race control · Status</p>
          <h1 className="mt-3 font-display font-extrabold italic uppercase text-7xl sm:text-8xl leading-[0.85] tracking-tight">
            DNF
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Did not finish. <span className="font-mono text-sm text-foreground">{location.pathname}</span> went off the
            track. There's nothing on this part of the course.
          </p>
          <Link
            to="/"
            className="mt-10 inline-flex h-14 px-8 items-center gap-2 bg-energy text-white font-display font-bold uppercase tracking-wide text-lg hover:bg-energy-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to the pits
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
