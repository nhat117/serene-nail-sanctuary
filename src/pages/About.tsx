import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight } from "lucide-react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import salonImage from "@/assets/salon-interior.jpg";
import heroImage from "@/assets/hero-nails-stock.jpg";

const values = [
  {
    title: "Meticulous Craft",
    description:
      "Every stroke, every shape, every finish is executed with the precision of an artist. We treat nail care as a fine art form.",
  },
  {
    title: "Quiet Luxury",
    description:
      "No rush, no noise — just the calm pleasure of being cared for in a space designed for tranquility and refined taste.",
  },
  {
    title: "Premium Products",
    description:
      "We source only the finest nail lacquers, gels, and skincare products from trusted luxury brands around the world.",
  },
  {
    title: "Personalized Experience",
    description:
      "From your first consultation to the final polish, every treatment is tailored to your preferences and style.",
  },
];

const AboutPage = () => {
  const heroRef = useScrollReveal<HTMLElement>();
  const storyRef = useScrollReveal<HTMLElement>();
  const valuesRef = useScrollReveal<HTMLElement>();
  const ctaRef = useScrollReveal<HTMLElement>();

  return (
    <div className="min-h-screen">
      <TopBar />
      <Navbar />

      {/* Page Hero */}
      <section ref={heroRef} className="py-20 md:py-[100px] bg-white text-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6 mb-4 scroll-reveal">
            <div className="h-px w-16 bg-primary/40" />
            <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold">
              Our Story
            </p>
            <div className="h-px w-16 bg-primary/40" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 scroll-reveal scroll-reveal-delay-1">
            About Estique
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed scroll-reveal scroll-reveal-delay-2">
            A sanctuary where refined beauty meets quiet luxury — crafted for
            those who appreciate the art of meticulous care.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="py-16 md:py-24 bg-background">
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
            <div className="absolute -bottom-3 -left-3 w-full h-full border border-primary/15 -z-10" />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 leading-[1.15] scroll-reveal scroll-reveal-delay-2">
              Where Sophistication
              <br />
              <span className="italic font-medium">Meets Tranquility</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-5 text-base md:text-lg scroll-reveal scroll-reveal-delay-3">
              Founded with a passion for beauty and an obsession with detail,
              Estique was born from the belief that nail care should be more than
              a routine — it should be a ritual. Our studio is a place where you
              can slow down, breathe, and let yourself be cared for.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-5 text-base md:text-lg scroll-reveal scroll-reveal-delay-3">
              Every element of our space has been thoughtfully curated: the warm
              glow of our gold-accented interiors, the soft textures, the
              calming palette of champagne and cream. We designed Estique to feel
              like stepping into a world apart.
            </p>

            <p className="text-muted-foreground leading-relaxed text-base md:text-lg scroll-reveal scroll-reveal-delay-4">
              Our team of skilled artisans brings years of expertise and a
              genuine love for their craft. Whether it's a simple manicure or an
              elaborate bridal design, we approach every appointment with the
              same care and precision.
            </p>
          </div>
        </div>
      </section>

      {/* Second Image + Text (reversed) */}
      <section className="py-16 md:py-24 bg-accent/20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content (left on desktop) */}
          <div className="order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 leading-[1.15]">
              The Art of
              <br />
              <span className="italic font-medium">Nail Perfection</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-5 text-base md:text-lg">
              At Estique, we see nails as a canvas. Our artisans combine
              classical techniques with modern trends to create looks that are
              uniquely yours — from understated nude elegance to bold
              hand-painted designs.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8 text-base md:text-lg">
              We invest in continuous education and use only top-tier products
              to ensure lasting quality. Your hands are in the best hands.
            </p>

            <Link to="/services">
              <Button className="btn-shimmer rounded-lg bg-primary text-primary-foreground text-xs tracking-wider px-6 py-2 hover:bg-primary/85 transition-all duration-500">
                Explore Our Services
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Image (right on desktop) */}
          <div className="relative group order-1 md:order-2">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={heroImage}
                alt="Elegant manicured hands with nude nails"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-primary/15 -z-10" />
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section ref={valuesRef} className="py-20 md:py-[100px] bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-6 mb-4 scroll-reveal">
              <div className="h-px w-16 bg-primary/40" />
              <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold">
                What Sets Us Apart
              </p>
              <div className="h-px w-16 bg-primary/40" />
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold scroll-reveal scroll-reveal-delay-1">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, index) => (
              <div
                key={v.title}
                className={`text-center scroll-reveal scroll-reveal-delay-${Math.min(index + 1, 4)}`}
              >
                <div className="w-12 h-px bg-primary/40 mx-auto mb-6" />
                <h3 className="text-lg font-semibold mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-16 md:py-20 bg-accent/20 text-center">
        <div className="container mx-auto px-4 scroll-reveal">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Ready to Experience Estique?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Book your appointment and discover what quiet luxury feels like.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking">
              <Button className="btn-shimmer rounded-lg bg-primary text-primary-foreground text-xs tracking-wider px-6 py-2 hover:bg-primary/85 transition-all duration-500">
                Book an Appointment
              </Button>
            </Link>
            <Link to="/gallery">
              <Button
                variant="outline"
                className="rounded-none border-foreground/30 text-foreground px-8 py-5 text-sm tracking-[0.1em] font-medium hover:bg-foreground hover:text-background transition-all duration-500"
              >
                View Our Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
