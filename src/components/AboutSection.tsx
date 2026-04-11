import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import salonImage from "@/assets/salon-interior.jpg";

const AboutSection = () => (
  <section id="about" className="py-24 md:py-32 bg-background">
    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
      {/* Image */}
      <div className="relative group">
        <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
          <img
            src={salonImage}
            alt="Elegant salon interior with beige chair and gold lamp"
            loading="lazy"
            width={800}
            height={1000}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        {/* Decorative border */}
        <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border-2 border-primary/20 -z-10" />
        <Sparkles className="absolute -top-3 -right-3 h-6 w-6 text-primary/40 animate-float" />
      </div>

      {/* Content */}
      <div>
        <p className="uppercase tracking-[0.25em] text-primary text-xs font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          About Estique
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 leading-tight">
          Refined Beauty
          <br />
          & Elegance
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-5 text-base md:text-lg">
          At Estique, we believe beauty is found in the details. Our artisans blend modern techniques with timeless elegance, creating an experience that goes beyond the ordinary.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-10 text-base md:text-lg">
          Every visit is a retreat — a moment to pause, breathe, and emerge feeling polished and renewed. We use only the finest products to ensure your nails look stunning and stay healthy.
        </p>
        <Button variant="outline" className="rounded-full px-10 py-5 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-base">
          Learn More
        </Button>
      </div>
    </div>
  </section>
);

export default AboutSection;
