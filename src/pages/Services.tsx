import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import serviceManicure from "@/assets/service-manicure.jpg";
import serviceGel from "@/assets/service-gel.jpg";
import servicePedicure from "@/assets/service-pedicure.jpg";
import serviceBridal from "@/assets/service-bridal.jpg";
import salonImage from "@/assets/salon-interior.jpg";
import heroImage from "@/assets/hero-nails.jpg";

const allServices = [
  {
    name: "Classic Manicure",
    duration: "45 min",
    price: "From $35",
    description:
      "Meticulous nail shaping, cuticle care, and polish with premium products. Our signature manicure includes a relaxing hand massage and your choice of luxury lacquer.",
    image: serviceManicure,
  },
  {
    name: "Gel Extensions",
    duration: "75 min",
    price: "From $65",
    description:
      "Flawless gel extensions crafted for elegant, long-lasting nails. Choose from a range of shapes and lengths, finished with your preferred color or nail art.",
    image: serviceGel,
  },
  {
    name: "Luxury Spa Pedicure",
    duration: "60 min",
    price: "From $50",
    description:
      "Soothing foot soak with aromatic botanicals, gentle exfoliation, callus treatment, and a deeply relaxing massage. Finished with precision polish.",
    image: servicePedicure,
  },
  {
    name: "Bridal Nail Package",
    duration: "90 min",
    price: "From $90",
    description:
      "Bespoke bridal nail art for your most special day. Includes consultation, custom design, gel application, and a complimentary touch-up before the ceremony.",
    image: serviceBridal,
  },
  {
    name: "Nail Art Design",
    duration: "60 min",
    price: "From $55",
    description:
      "Express your style with our bespoke nail art service. From minimalist line art to intricate hand-painted designs, our artists bring your vision to life.",
    image: salonImage,
  },
  {
    name: "Hydrating Hand Treatment",
    duration: "30 min",
    price: "From $40",
    description:
      "An intensive hydrating ritual featuring warm paraffin wax, nourishing serums, and a rich shea butter massage. Leaves hands velvety soft and rejuvenated.",
    image: heroImage,
  },
  {
    name: "Express Gel Manicure",
    duration: "30 min",
    price: "From $30",
    description:
      "A streamlined gel manicure for those on the go. Includes nail shaping, cuticle care, and chip-resistant gel polish that lasts up to two weeks.",
    image: serviceManicure,
  },
  {
    name: "Deluxe Mani-Pedi Combo",
    duration: "120 min",
    price: "From $85",
    description:
      "The ultimate pampering experience combining our signature manicure and luxury spa pedicure. Includes extended massage, hot stone treatment, and premium polish.",
    image: servicePedicure,
  },
];

const ServicesPage = () => {
  const heroRef = useScrollReveal<HTMLElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="min-h-screen">
      <TopBar />
      <Navbar />

      {/* Page Hero */}
      <section
        ref={heroRef}
        className="py-20 md:py-[100px] bg-white text-center"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6 mb-4 scroll-reveal">
            <div className="h-px w-16 bg-primary/40" />
            <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold">
              Our Offerings
            </p>
            <div className="h-px w-16 bg-primary/40" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 scroll-reveal scroll-reveal-delay-1">
            Services & Pricing
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed scroll-reveal scroll-reveal-delay-2">
            Discover our complete menu of luxury nail care and beauty treatments,
            each crafted with meticulous attention to detail.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-10 md:py-16 bg-accent/20" ref={gridRef}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
            {allServices.map((service, index) => (
              <div
                key={service.name}
                className={`group bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 scroll-reveal scroll-reveal-delay-${Math.min((index % 4) + 1, 4)}`}
              >
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
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
        </div>
      </section>

      {/* Back to Home CTA */}
      <section className="py-16 md:py-20 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Ready to Experience Estique?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Book your appointment today and discover the art of quiet luxury.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="rounded-none bg-primary text-primary-foreground px-10 py-5 text-sm tracking-[0.15em] font-medium hover:bg-primary/85 transition-all duration-500">
              Book an Appointment
            </Button>
            <Link to="/">
              <Button
                variant="outline"
                className="rounded-none border-foreground/30 text-foreground px-8 py-5 text-sm tracking-[0.1em] font-medium hover:bg-foreground hover:text-background transition-all duration-500"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
