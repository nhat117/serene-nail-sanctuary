import { Button } from "@/components/ui/button";
import StarField from "@/components/StarField";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cld } from "@/lib/cloudinary";

const salonImage = cld("estique/gallery/drive-import/salon-img-8428", { width: 1200 });

const AboutSection = () => {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} id="about" className="relative py-28 md:py-36 bg-background">
      <StarField count={10} colorClass="bg-primary/15" />
      {/* Section label with animated decorative lines */}
      <div className="flex items-center justify-center gap-6 mb-14 scroll-reveal">
        <div className="h-px w-16 bg-primary/40 line-expand" />
        <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold">
          About ESTIQUE
        </p>
        <div className="h-px w-16 bg-primary/40 line-expand" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Image — slides in from left */}
        <div className="relative group scroll-reveal-left">
          {/* Gold glow behind image */}
          <div
            className="absolute -bottom-8 -left-8 w-56 h-56 rounded-full pointer-events-none z-0"
            style={{
              background: "radial-gradient(circle, hsl(32 40% 70% / 0.15) 0%, transparent 70%)",
              animation: "glowPulse 7s ease-in-out 1s infinite",
            }}
          />
          <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-soft-lg relative z-[1]">
            <img
              src={salonImage}
              alt="A manicurist at the table, working in close detail on a client's hands"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Content — slides in from right */}
        <div className="lg:pl-4 scroll-reveal-right scroll-reveal-delay-2">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 leading-tight">
            The ESTIQUE<br />
            <span className="italic font-medium text-foreground/80">signature</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10 text-base md:text-lg">
            Every set we finish carries the ESTIQUE touch — delicate gold
            detail, soft tones, and lines drawn by hand. Our artists take the
            time each set deserves, so the result is something you'll be quiet
            about, but never stop noticing.
          </p>
          <Button className="btn-shimmer rounded-lg bg-primary text-primary-foreground px-12 py-6 text-base tracking-wider font-medium hover:bg-primary transition-all duration-500 shadow-soft">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
