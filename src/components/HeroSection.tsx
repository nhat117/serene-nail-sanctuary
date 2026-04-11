import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-nails.jpg";

const HeroSection = () => (
  <section id="home" className="relative overflow-hidden bg-accent/30">
    <div className="container mx-auto px-4 py-20 md:py-0">
      <div className="grid md:grid-cols-12 gap-8 items-center min-h-[85vh]">
        {/* Left — Text (45%) */}
        <div className="md:col-span-5 relative z-10 py-12">
          <div className="animate-fade-up">
            <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Welcome to Estique
            </p>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.1] mb-8 animate-fade-up-delay">
            Experience
            <br />
            <span className="text-primary">Quiet Luxury</span>
          </h1>

          <p className="text-muted-foreground max-w-md mb-10 text-base md:text-lg leading-relaxed animate-fade-up-delay-2">
            Welcome to Estique, where sophistication meets tranquility. Enjoy bespoke nail care and beauty treatments in an elegant, relaxing atmosphere.
          </p>

          <div className="animate-fade-up-delay-3">
            <Button size="lg" className="rounded-full px-12 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              Book an Appointment
            </Button>
          </div>
        </div>

        {/* Right — Image (55%) */}
        <div className="md:col-span-7 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl animate-fade-up-delay">
            <img
              src={heroImage}
              alt="Luxury beauty with roses and gold jewelry on silk"
              width={960}
              height={1080}
              className="w-full h-[500px] md:h-[700px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>

          {/* Floating sparkles */}
          <Sparkles className="absolute top-8 -left-4 h-5 w-5 text-primary/50 animate-float hidden md:block" />
          <Sparkles className="absolute bottom-16 -right-2 h-6 w-6 text-primary/40 animate-float-delay hidden md:block" />
          <Sparkles className="absolute top-1/3 right-8 h-4 w-4 text-primary/30 animate-float-slow hidden md:block" />
        </div>
      </div>
    </div>

    {/* Background sparkles */}
    <Sparkles className="absolute top-20 left-[8%] h-3 w-3 text-primary/20 animate-float hidden lg:block" />
    <Sparkles className="absolute bottom-32 left-[5%] h-4 w-4 text-primary/15 animate-float-slow hidden lg:block" />
  </section>
);

export default HeroSection;
