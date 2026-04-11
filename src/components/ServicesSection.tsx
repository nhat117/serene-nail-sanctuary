import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import serviceManicure from "@/assets/service-manicure.jpg";
import serviceGel from "@/assets/service-gel.jpg";
import servicePedicure from "@/assets/service-pedicure.jpg";
import serviceBridal from "@/assets/service-bridal.jpg";

const services = [
  { image: serviceManicure, title: "Classic Manicure", duration: "45 min", price: "From $35", desc: "Meticulous nail shaping, cuticle care, and polish with premium products." },
  { image: serviceGel, title: "Gel Extensions", duration: "75 min", price: "From $65", desc: "Flawless gel extensions for elegant, long-lasting nails." },
  { image: servicePedicure, title: "Luxury Spa Pedicure", duration: "60 min", price: "From $50", desc: "Soothing foot soak, exfoliation, and massage for total relaxation." },
  { image: serviceBridal, title: "Bridal Nail Package", duration: "90 min", price: "From $90", desc: "Bespoke bridal nail art for your most special day." },
];

const ServicesSection = () => (
  <section id="services" className="py-24 md:py-32 bg-accent/20">
    <div className="container mx-auto px-4 text-center">
      <p className="uppercase tracking-[0.25em] text-primary text-xs font-semibold mb-4 flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4" />
        Luxurious Nail Care
      </p>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-16">
        Our Signature Services
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
        {services.map(({ image, title, duration, price, desc }) => (
          <div
            key={title}
            className="group bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
          >
            {/* Image */}
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={image}
                alt={title}
                loading="lazy"
                width={640}
                height={800}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Content */}
            <div className="p-6 text-left">
              <h3 className="text-lg font-semibold mb-1">{title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span>{duration}</span>
                <span className="w-1 h-1 rounded-full bg-primary/40" />
                <span className="text-primary font-semibold">{price}</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{desc}</p>
              <button className="text-primary text-sm font-semibold flex items-center gap-1.5 group-hover:gap-3 transition-all duration-300">
                Book Now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="rounded-full px-10 py-5 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-base">
        View All Services
      </Button>
    </div>
  </section>
);

export default ServicesSection;
