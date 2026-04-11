import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-nails-stock.jpg";

const sparkles = [
  { size: 4, left: "12%", top: "15%", delay: 0 },
  { size: 3, left: "25%", top: "55%", delay: 1.4 },
  { size: 5, left: "42%", top: "25%", delay: 0.7 },
  { size: 3, left: "58%", top: "10%", delay: 2.0 },
  { size: 4, left: "75%", top: "45%", delay: 0.3 },
  { size: 3, left: "90%", top: "20%", delay: 1.8 },
  { size: 4, left: "48%", top: "72%", delay: 1.1 },
];

const HeroSection = () => (
  <section id="home" className="relative overflow-hidden">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img
        src={heroImage}
        alt="Elegant manicured hands with nude nails on soft white fur"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/55 to-transparent" />
    </div>

    {/* Floating Sparkles */}
    {sparkles.map((s, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-primary/30 animate-sparkle pointer-events-none z-10"
        style={{
          width: s.size,
          height: s.size,
          left: s.left,
          top: s.top,
          animationDelay: `${s.delay}s`,
        }}
      />
    ))}

    <div className="container mx-auto px-4 relative z-10">
      <div className="min-h-[85vh] flex items-center">
        <div className="max-w-lg py-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.1] mb-8 animate-fade-up">
            Experience
            <br />
            Quiet Luxury
          </h1>

          <p className="text-muted-foreground max-w-md mb-10 text-base md:text-lg leading-relaxed animate-fade-up-delay">
            Welcome to Estique, where sophistication meets tranquility. Enjoy
            bespoke nail care and beauty treatments in an elegant, relaxing
            atmosphere.
          </p>

          <div className="animate-fade-up-delay-2">
            <Button
              variant="outline"
              size="lg"
              className="rounded-none border-foreground text-foreground px-10 py-6 text-sm tracking-wider font-medium hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Book an Appointment
            </Button>
          </div>

          {/* Decorative diamonds */}
          <div className="flex items-center gap-3 mt-8 animate-fade-up-delay-3">
            <span className="text-primary/50 text-xs">&#9830;</span>
            <span className="text-primary/70 text-sm">&#9830;</span>
            <span className="text-primary/50 text-xs">&#9830;</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
