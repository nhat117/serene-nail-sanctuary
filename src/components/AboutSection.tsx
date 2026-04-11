import { Button } from "@/components/ui/button";
import StarField from "@/components/StarField";
import salonImage from "@/assets/salon-interior.jpg";

const AboutSection = () => (
  <section id="about" className="relative py-28 md:py-36 bg-background">
    <StarField count={10} colorClass="bg-primary/15" />
    {/* Section label with decorative lines */}
    <div className="flex items-center justify-center gap-6 mb-14">
      <div className="h-px w-16 bg-primary/40" />
      <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold">
        About Estique
      </p>
      <div className="h-px w-16 bg-primary/40" />
    </div>

    <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-14 lg:gap-20 items-center">
      {/* Image */}
      <div className="relative group">
        <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-xl shadow-foreground/5">
          <img
            src={salonImage}
            alt="Elegant salon interior with beige chair and gold lamp"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content */}
      <div className="lg:pl-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 leading-tight">
          Refined Beauty & Elegance
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-10 text-base md:text-lg">
          At Estique, we offer a sanctuary of serene sophistication. Indulge in
          luxurious nail, skincare, and beauty services tailored to perfection.
          Our tranquil space and meticulous attention to detail ensure an
          experience of true luxury.
        </p>
        <Button className="rounded-lg bg-primary text-primary-foreground px-10 py-5 text-sm tracking-wider font-medium hover:bg-primary/85 transition-all duration-500 shadow-sm">
          Learn More
        </Button>
      </div>
    </div>
  </section>
);

export default AboutSection;
