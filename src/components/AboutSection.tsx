import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const AboutSection = () => (
  <section id="about" className="py-20 md:py-28 bg-background">
    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
      {/* Image placeholder */}
      <div className="aspect-[4/5] rounded-2xl bg-secondary flex items-center justify-center overflow-hidden">
        <div className="text-center text-muted-foreground">
          <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary/40" />
          <p className="text-sm">Salon Interior</p>
        </div>
      </div>

      {/* Content */}
      <div>
        <p className="uppercase tracking-[0.25em] text-primary text-xs font-semibold mb-3">About Estique</p>
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 leading-tight" style={{ fontFamily: "'Noto Serif', serif" }}>
          Refined Beauty<br />& Elegance
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          At Estique, we believe beauty is found in the details. Our artisans blend modern techniques with timeless elegance, creating an experience that goes beyond the ordinary.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Every visit is a retreat — a moment to pause, breathe, and emerge feeling polished and renewed. We use only the finest products to ensure your nails look stunning and stay healthy.
        </p>
        <Button variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          Learn More
        </Button>
      </div>
    </div>
  </section>
);

export default AboutSection;
