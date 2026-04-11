import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import serviceManicure from "@/assets/service-manicure.jpg";
import serviceGel from "@/assets/service-gel.jpg";
import servicePedicure from "@/assets/service-pedicure.jpg";
import serviceBridal from "@/assets/service-bridal.jpg";
import salonImage from "@/assets/salon-interior.jpg";

const ServicesSection = () => (
  <section id="services" className="py-24 md:py-32 bg-accent/20">
    <div className="container mx-auto px-4 text-center">
      {/* Section label with decorative lines */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="h-px w-16 bg-primary/40" />
        <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold">
          Luxurious Nail Care
        </p>
        <div className="h-px w-16 bg-primary/40" />
      </div>

      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-16">
        Our Signature Services
      </h2>

      {/* Mosaic Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-14">
        {/* Row 1: 4 images */}
        <div className="aspect-[3/4] overflow-hidden rounded-sm">
          <img
            src={serviceManicure}
            alt="Classic Manicure"
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="aspect-[3/4] overflow-hidden rounded-sm">
          <img
            src={servicePedicure}
            alt="Luxury Spa Pedicure"
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="aspect-[3/4] overflow-hidden rounded-sm">
          <img
            src={salonImage}
            alt="Salon Interior"
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="aspect-[3/4] overflow-hidden rounded-sm">
          <img
            src={serviceGel}
            alt="Gel Extensions"
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Row 2: 2 wider images */}
        <div className="col-span-2 aspect-[16/9] overflow-hidden rounded-sm">
          <img
            src={serviceBridal}
            alt="Bridal Nail Package"
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="col-span-2 aspect-[16/9] overflow-hidden rounded-sm">
          <img
            src={serviceManicure}
            alt="Nail Art Design"
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      <Link to="/services">
        <Button className="rounded-none bg-primary text-primary-foreground px-10 py-5 text-sm tracking-wider font-medium hover:bg-primary/90 transition-all duration-300">
          View All Services
        </Button>
      </Link>
    </div>
  </section>
);

export default ServicesSection;
