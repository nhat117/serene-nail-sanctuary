import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StarField from "@/components/StarField";
import heroImage from "@/assets/hero-nails-stock.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
  <section id="home" className="relative min-h-screen overflow-hidden">
    {/* Full-bleed background image with slow zoom */}
    <img
      src={heroImage}
      alt="Elegant manicured hands with nude nails on soft white fur"
      className="absolute inset-0 w-full h-full object-cover animate-hero-zoom"
    />

    {/* Dark gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

    {/* Animated shimmer sweep */}
    <div className="absolute inset-0 animate-hero-shimmer pointer-events-none" />

    {/* Floating Stars */}
    <StarField count={18} colorClass="bg-primary/25" />

    {/* Text overlay */}
    <div className="relative z-10 container mx-auto px-4 lg:px-8 flex items-center min-h-screen">
      <div className="max-w-2xl py-20">
        <p className="uppercase tracking-[0.3em] text-white text-lg md:text-xl lg:text-2xl font-semibold mb-6 animate-letter-reveal">
          Welcome to
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold leading-[1.08] mb-8 text-white animate-fade-up">
          Estique
        </h1>

        <p className="text-white/80 max-w-xl mb-10 text-lg md:text-xl lg:text-2xl leading-relaxed animate-fade-up-delay">
          Discover a space where exceptional nail artistry meets thoughtful
          care. From timeless manicures to indulgent beauty treatments, every
          visit is designed to leave you feeling polished, confident, and
          completely relaxed.
        </p>

        <div className="animate-fade-up-delay-2">
          <Button
            onClick={() => navigate("/booking")}
            className="btn-shimmer rounded-lg bg-primary text-primary-foreground px-12 py-7 text-base tracking-wider font-medium hover:bg-primary transition-all duration-500 shadow-sm"
          >
            Book an Appointment
          </Button>
        </div>

        {/* Decorative diamonds */}
        <div className="flex items-center gap-3 mt-10 animate-fade-up-delay-3">
          <span className="text-primary/40 text-[10px]">&#9830;</span>
          <span className="text-primary/60 text-xs">&#9830;</span>
          <span className="text-primary/40 text-[10px]">&#9830;</span>
        </div>
      </div>
    </div>
  </section>
  );
};

export default HeroSection;
