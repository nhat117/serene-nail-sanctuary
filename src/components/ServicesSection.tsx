import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StarField from "@/components/StarField";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cld } from "@/lib/cloudinary";

const g = (name: string) => cld(`estique/gallery/${name}`, { width: 800 });
const serviceManicure = g("service-manicure");
const serviceGel = g("service-gel");
const servicePedicure = g("service-art");
const serviceBridal = g("service-bridal");

const services = [
  { image: serviceManicure, alt: "Classic French manicure" },
  { image: serviceGel, alt: "Delicate floral gel design" },
  { image: servicePedicure, alt: "Hand-painted nail art" },
  { image: serviceBridal, alt: "Bridal-style nails with 3D detail" },
];

const delayClasses = [
  "",
  "scroll-reveal-delay-1",
  "scroll-reveal-delay-2",
  "scroll-reveal-delay-3",
];

const ServicesSection = () => {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} id="services" className="relative py-28 md:py-36 bg-accent/20">
      <StarField count={14} colorClass="bg-primary/20" />
      <div className="container mx-auto px-4 lg:px-8 text-center">
        {/* Section label with animated decorative lines */}
        <div className="flex items-center justify-center gap-6 mb-4 scroll-reveal">
          <div className="h-px w-16 bg-primary/40 line-expand" />
          <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold">
            Considered Nail Care
          </p>
          <div className="h-px w-16 bg-primary/40 line-expand" />
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-16 scroll-reveal">
          A menu shaped by craft
        </h2>

        {/* 4-image grid — staggered scale reveal */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-16">
          {services.map((service, i) => (
            <div
              key={service.alt}
              className={`group aspect-[3/4] rounded-lg overflow-hidden shadow-soft scroll-reveal-scale ${delayClasses[i]}`}
            >
              <img
                src={service.image}
                alt={service.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="scroll-reveal">
          <Link to="/services">
            <Button className="btn-shimmer rounded-lg bg-primary text-primary-foreground px-12 py-6 text-base tracking-wider font-medium hover:bg-primary transition-all duration-500 shadow-soft">
              View Full Menu
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
