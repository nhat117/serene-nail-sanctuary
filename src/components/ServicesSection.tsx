import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import serviceManicure from "@/assets/service-manicure.jpg";
import serviceGel from "@/assets/service-gel.jpg";
import servicePedicure from "@/assets/service-pedicure.jpg";
import serviceBridal from "@/assets/service-bridal.jpg";

const services = [
  {
    name: "Classic Manicure",
    duration: "45 min",
    price: "From $35",
    description:
      "Meticulous nail shaping, cuticle care, and polish with premium products.",
    image: serviceManicure,
    alt: "Classic manicure with elegant nail styling",
  },
  {
    name: "Gel Extensions",
    duration: "75 min",
    price: "From $65",
    description:
      "Flawless gel extensions for elegant, long-lasting nails.",
    image: serviceGel,
    alt: "Premium gel nail extensions",
  },
  {
    name: "Luxury Spa Pedicure",
    duration: "60 min",
    price: "From $50",
    description:
      "Soothing foot soak, exfoliation, and massage for total relaxation.",
    image: servicePedicure,
    alt: "Relaxing luxury spa pedicure treatment",
  },
  {
    name: "Bridal Nail Package",
    duration: "90 min",
    price: "From $90",
    description:
      "Bespoke bridal nail art for your most special day.",
    image: serviceBridal,
    alt: "Bridal nail package with elegant designs",
  },
];

const ServicesSection = () => {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      id="services"
      className="py-20 md:py-[100px] bg-accent/30"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-6 mb-4 scroll-reveal">
            <div className="h-px w-16 bg-primary/40" />
            <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold">
              Luxurious Nail Care
            </p>
            <div className="h-px w-16 bg-primary/40" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold scroll-reveal scroll-reveal-delay-1">
            Our Signature Services
          </h2>
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mb-16">
          {services.map((service, index) => (
            <div
              key={service.name}
              className={`group bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 scroll-reveal scroll-reveal-delay-${Math.min(index + 1, 4)}`}
            >
              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="text-base md:text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors duration-300">
                  {service.name}
                </h3>

                <div className="flex items-center gap-3 text-muted-foreground text-xs mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {service.duration}
                  </span>
                  <span className="text-primary/60">|</span>
                  <span className="text-primary font-semibold">
                    {service.price}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                <button className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-foreground/70 hover:text-primary transition-colors duration-300 group/link">
                  Book Now
                  <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center scroll-reveal">
          <Link to="/services">
            <Button
              variant="outline"
              className="rounded-none border-foreground text-foreground px-10 py-5 text-sm tracking-[0.15em] font-medium hover:bg-foreground hover:text-background transition-all duration-500"
            >
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
