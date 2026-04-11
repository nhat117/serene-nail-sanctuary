import { Button } from "@/components/ui/button";
import StarField from "@/components/StarField";
import heroImage from "@/assets/hero-nails-stock.jpg";

const HeroSection = () => (
  <section id="home" className="relative overflow-hidden bg-background">
    {/* Floating Stars */}
    <StarField count={18} colorClass="bg-primary/25" />

    <div className="container mx-auto px-4 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[85vh] items-center gap-10 lg:gap-16">
        {/* Left — Text Content */}
        <div className="pt-20 pb-8 lg:py-0 lg:pr-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.08] mb-8 animate-fade-up">
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
            <Button className="rounded-lg bg-primary text-primary-foreground px-10 py-6 text-sm tracking-wider font-medium hover:bg-primary/85 transition-all duration-500 shadow-sm">
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

        {/* Right — Image */}
        <div className="relative pb-10 lg:pb-0 animate-fade-up-delay">
          <div className="aspect-[4/5] lg:aspect-[3/4] rounded-lg overflow-hidden shadow-2xl shadow-foreground/5">
            <img
              src={heroImage}
              alt="Elegant manicured hands with nude nails on soft white fur"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
