import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => (
  <section id="home" className="relative overflow-hidden bg-secondary/40">
    <div className="container mx-auto px-4 py-24 md:py-36 flex flex-col items-center text-center relative z-10">
      {/* Decorative sparkles */}
      <Sparkles className="h-6 w-6 text-primary mb-4 animate-pulse" />

      <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold mb-4" style={{ fontFamily: "'Manrope', sans-serif" }}>
        Welcome to Estique
      </p>

      <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight max-w-3xl mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>
        Experience Quiet Luxury
      </h1>

      <p className="text-muted-foreground max-w-lg mb-8 text-base md:text-lg leading-relaxed">
        Crafting moments of tranquility, one manicure at a time. Your sanctuary for refined nail care and timeless elegance.
      </p>

      <Button size="lg" className="rounded-full px-10 text-base">
        Book an Appointment
      </Button>

      {/* Floating sparkles */}
      <Sparkles className="absolute top-16 left-[15%] h-4 w-4 text-primary/40 hidden md:block" />
      <Sparkles className="absolute bottom-20 right-[12%] h-5 w-5 text-primary/30 hidden md:block" />
      <Sparkles className="absolute top-1/3 right-[20%] h-3 w-3 text-primary/20 hidden md:block" />
    </div>
  </section>
);

export default HeroSection;
