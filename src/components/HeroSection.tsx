import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-nails-stock.jpg";

const sparkles = [
  { size: 4, left: "8%", top: "18%", delay: 0 },
  { size: 3, left: "22%", top: "65%", delay: 1.4 },
  { size: 5, left: "38%", top: "30%", delay: 0.7 },
  { size: 3, left: "55%", top: "12%", delay: 2.0 },
  { size: 4, left: "72%", top: "50%", delay: 0.3 },
  { size: 3, left: "88%", top: "22%", delay: 1.8 },
  { size: 4, left: "45%", top: "80%", delay: 1.1 },
];

const HeroSection = () => (
  <section id="home" className="relative overflow-hidden bg-white">
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

    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-[9fr_11fr] lg:min-h-[85vh] items-center gap-12 lg:gap-16">
        {/* Left — Text Content */}
        <div className="pt-20 pb-8 lg:py-0">
          {/* Decorative gold line */}
          <div className="w-12 h-px bg-primary/60 mb-8 animate-fade-up" />

          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-semibold leading-[1.05] mb-8 animate-fade-up tracking-tight">
            Experience
            <br />
            <span className="italic font-medium">Quiet Luxury</span>
          </h1>

          <p className="text-foreground/60 max-w-md mb-10 text-base md:text-lg leading-relaxed animate-fade-up-delay">
            Welcome to Estique, where sophistication meets tranquility. Enjoy
            bespoke nail care and beauty treatments in an elegant, relaxing
            atmosphere.
          </p>

          <div className="animate-fade-up-delay-2">
            <Button className="bg-primary text-primary-foreground rounded-none px-10 py-6 text-sm tracking-[0.15em] font-medium hover:bg-primary/85 transition-all duration-500 shadow-sm hover:shadow-md">
              Book an Appointment
            </Button>
          </div>
        </div>

        {/* Right — Image */}
        <div className="relative pb-12 lg:pb-0 animate-fade-up-delay">
          <div className="aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
            <img
              src={heroImage}
              alt="Elegant manicured hands with nude nails on soft white fur"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Gold accent frame offset */}
          <div className="hidden lg:block absolute -bottom-4 -right-4 w-full h-full border border-primary/20 -z-10" />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
