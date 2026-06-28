import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOnlineButton } from "@/components/BookingDialog";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, MapPin, ExternalLink } from "lucide-react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useBranches } from "@/hooks/useBranches";
import { cld } from "@/lib/cloudinary";

const salonImage = cld("estique/gallery/about-detail", { width: 1200 });
const heroImage = cld("estique/gallery/hero-secondary", { width: 1200 });

const values = [
  {
    title: "Considered Craft",
    description:
      "Every shape, line, and finish is placed with intention. We treat nail care as a quiet form of artistry.",
  },
  {
    title: "Unhurried Time",
    description:
      "Appointments are paced so nothing feels rushed — your treatment, your conversation, your moment to slow down.",
  },
  {
    title: "Chosen with Care",
    description:
      "We work with lacquers, gels, and finishes selected for their wear, their colour, and how they treat your nails.",
  },
  {
    title: "Made for You",
    description:
      "From a clean classic to something more personal, your treatment is shaped around how you want to feel walking out.",
  },
];

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/xa2tcA4pd8TCwZA57";

const AboutPage = () => {
  const heroRef = useScrollReveal<HTMLElement>();
  const storyRef = useScrollReveal<HTMLElement>();
  const valuesRef = useScrollReveal<HTMLElement>();
  const locationRef = useScrollReveal<HTMLElement>();
  const ctaRef = useScrollReveal<HTMLElement>();

  const { data: branches } = useBranches();
  const primary = branches?.[0];

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
            A small studio for thoughtful nail care and beauty — built for
            people who notice the details.
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
              A studio shaped<br />
              <span className="italic font-medium">around the detail</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-5 text-base md:text-lg scroll-reveal scroll-reveal-delay-3">
              Estique was started by people who care, perhaps too much, about
              how a manicure should feel. We wanted a room where the work could
              be done unhurried, with proper time given to every set of hands.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-5 text-base md:text-lg scroll-reveal scroll-reveal-delay-3">
              The space is small by design — warm light, soft surfaces, a quiet
              palette of champagne and cream. It's the kind of place you arrive
              tired and leave a little lighter.
            </p>

            <p className="text-muted-foreground leading-relaxed text-base md:text-lg scroll-reveal scroll-reveal-delay-4">
              Our team is experienced, patient, and genuinely fond of the
              craft. A clean classic or something more elaborate — both get the
              same level of attention.
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
              Quiet artistry,<br />
              <span className="italic font-medium">finished by hand</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-5 text-base md:text-lg">
              Our team treats each nail as its own small canvas. A nude tip
              done well, a hand-painted detail done patiently — both ask for
              the same eye and the same steady hand.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8 text-base md:text-lg">
              We keep our technique current and our products considered, so
              what you leave with looks good now and holds up after.
            </p>

            <Link to="/services">
              <Button className="btn-shimmer rounded-lg bg-primary text-primary-foreground text-sm tracking-wider px-7 py-3 hover:bg-primary transition-all duration-500">
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

      {/* Find Us — map + address */}
      <section ref={locationRef} className="py-20 md:py-[100px] bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-6 mb-4 scroll-reveal">
              <div className="h-px w-16 bg-primary/40" />
              <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold">
                Find Us
              </p>
              <div className="h-px w-16 bg-primary/40" />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold scroll-reveal scroll-reveal-delay-1">
              Visit Our Studio
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch max-w-5xl mx-auto">
            {/* Map embed */}
            <div className="scroll-reveal scroll-reveal-delay-1">
              {primary?.map_embed_url ? (
                <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md shadow-foreground/5 bg-foreground/5">
                  <iframe
                    title="Estique Nails & Beauty Artistry location"
                    src={primary.map_embed_url}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              ) : (
                /* Fallback placeholder while map_embed_url is not yet set in Supabase */
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex aspect-[4/3] items-center justify-center rounded-lg bg-accent/40 border border-border/40 group hover:bg-accent/60 transition-colors duration-300"
                >
                  <div className="text-center px-6">
                    <MapPin className="h-10 w-10 text-primary/40 mx-auto mb-3 group-hover:text-primary transition-colors duration-300" />
                    <p className="text-sm font-semibold text-foreground/80 mb-1">ESTIQUE Nails & Beauty Artistry</p>
                    {primary?.address && (
                      <p className="text-xs text-muted-foreground">{primary.address}</p>
                    )}
                  </div>
                </a>
              )}
            </div>

            {/* Address card */}
            <div className="flex flex-col justify-center scroll-reveal scroll-reveal-delay-2">
              <h3 className="text-xl md:text-2xl font-semibold mb-2 leading-snug">
                Estique Nails
                <br />
                <span className="italic font-medium text-muted-foreground">
                  & Beauty Artistry
                </span>
              </h3>

              {primary?.address ? (
                <div className="flex items-start gap-3 mt-4 mb-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-foreground/80">{primary.address}</span>
                    {primary.address_note && (
                      <span className="block italic text-muted-foreground/70 text-xs mt-0.5">
                        {primary.address_note}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-4 mb-1">
                  Address coming soon
                </p>
              )}

              <p className="text-xs text-muted-foreground/60 ml-7 mb-8">
                Sydney, Australia
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start border border-primary/40 text-foreground/80 hover:bg-primary hover:text-primary-foreground hover:border-primary px-6 py-3 text-xs font-medium tracking-[0.12em] uppercase transition-all duration-500"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Get Directions
                </a>
                <Link to="/location">
                  <Button
                    variant="outline"
                    className="rounded-lg border-foreground/20 text-foreground/70 text-xs tracking-wider px-6 py-3 hover:bg-foreground hover:text-background transition-all duration-500"
                  >
                    Full Location Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-16 md:py-20 bg-accent/20 text-center">
        <div className="container mx-auto px-4 scroll-reveal">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Come and see us
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Reserve a time that works for you. We'll take care of the rest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <BookOnlineButton>Book an Appointment</BookOnlineButton>
            <Link to="/gallery">
              <Button
                variant="outline"
                className="rounded-lg border-foreground/30 text-foreground px-10 py-6 text-base tracking-[0.1em] font-medium hover:bg-foreground hover:text-background transition-all duration-500"
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
