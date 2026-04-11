import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import salonImage from "@/assets/salon-interior.jpg";

const AboutSection = () => {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      id="about"
      className="py-20 md:py-[100px] bg-background"
      ref={sectionRef}
    >
      {/* Section label */}
      <div className="flex items-center justify-center gap-6 mb-14 scroll-reveal">
        <div className="h-px w-16 bg-primary/40" />
        <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold">
          About Estique
        </p>
        <div className="h-px w-16 bg-primary/40" />
      </div>

      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Image */}
        <div className="relative group scroll-reveal scroll-reveal-delay-1">
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={salonImage}
              alt="Elegant salon interior with beige chair and warm gold-accented lighting"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          {/* Gold accent frame */}
          <div className="absolute -bottom-3 -left-3 w-full h-full border border-primary/15 -z-10" />
        </div>

        {/* Content */}
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 leading-[1.1] scroll-reveal scroll-reveal-delay-2">
            Refined Beauty
            <br />
            <span className="italic font-medium">& Elegance</span>
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-6 text-base md:text-lg scroll-reveal scroll-reveal-delay-3">
            Estique is a sanctuary of serene sophistication, where every detail
            is curated for your comfort. From the warm glow of our gold-accented
            interiors to the meticulous artistry of our nail technicians, we
            elevate beauty care into an experience of true luxury.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-10 text-base md:text-lg scroll-reveal scroll-reveal-delay-3">
            Indulge in bespoke treatments tailored to perfection — because you
            deserve nothing less than extraordinary.
          </p>

          <div className="scroll-reveal scroll-reveal-delay-4">
            <Button className="rounded-none bg-primary text-primary-foreground px-10 py-5 text-sm tracking-[0.15em] font-medium hover:bg-primary/85 transition-all duration-500">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
