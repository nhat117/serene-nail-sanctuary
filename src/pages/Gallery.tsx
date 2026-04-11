import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80&fit=crop",
    alt: "Nail art with dark and gold accents",
    category: "Nail Art",
    span: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800&q=80&fit=crop",
    alt: "Manicure in progress at salon",
    category: "Manicure",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&q=80&fit=crop",
    alt: "Classic red nail design",
    category: "Nail Art",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&q=80&fit=crop",
    alt: "Gel extensions application",
    category: "Extensions",
    span: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&q=80&fit=crop",
    alt: "Pastel nail art with glitter accents",
    category: "Nail Art",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=800&q=80&fit=crop",
    alt: "Gel nails closeup on pink background",
    category: "Gel Nails",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&q=80&fit=crop",
    alt: "Luxury pedicure spa treatment with orchids",
    category: "Pedicure",
    span: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?w=800&q=80&fit=crop",
    alt: "Hand care and cuticle oil treatment",
    category: "Hand Care",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&fit=crop",
    alt: "Elegant salon interior",
    category: "Our Salon",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1599948128020-9a44505b0d1b?w=800&q=80&fit=crop",
    alt: "Nail polish collection display",
    category: "Products",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=800&q=80&fit=crop",
    alt: "Spa flat lay with luxury accessories",
    category: "Spa",
    span: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&q=80&fit=crop",
    alt: "Luxury beauty products",
    category: "Products",
    span: "",
  },
];

const categories = [
  "All",
  ...Array.from(new Set(galleryImages.map((img) => img.category))),
];

const GalleryPage = () => {
  const heroRef = useScrollReveal<HTMLElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
  };

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      (lightboxIndex - 1 + filteredImages.length) % filteredImages.length
    );
  };

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
              Our Portfolio
            </p>
            <div className="h-px w-16 bg-primary/40" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 scroll-reveal scroll-reveal-delay-1">
            Gallery
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-12 scroll-reveal scroll-reveal-delay-2">
            A curated collection of our finest work — from minimalist elegance to
            intricate nail art, each creation tells a story of craftsmanship.
          </p>

          {/* Category filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 scroll-reveal scroll-reveal-delay-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-xs font-medium tracking-[0.1em] uppercase rounded-none border transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-foreground/60 border-border hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Gallery Grid */}
      <section className="py-10 md:py-16 bg-accent/20" ref={gridRef}>
        <div className="container mx-auto px-4">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.src}
                className={`group relative break-inside-avoid overflow-hidden rounded-lg cursor-pointer scroll-reveal scroll-reveal-delay-${Math.min((index % 4) + 1, 4)}`}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-500 flex items-end">
                  <div className="w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block bg-primary/90 text-primary-foreground text-[10px] font-medium tracking-[0.15em] uppercase px-3 py-1">
                      {image.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Love What You See?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Book your appointment and let our artists create something beautiful
            for you.
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

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-foreground/90 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Previous */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 md:left-8 text-white/60 hover:text-white transition-colors z-10"
          >
            <ArrowLeft className="h-8 w-8" />
          </button>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[lightboxIndex].src.replace("w=800", "w=1400")}
              alt={filteredImages[lightboxIndex].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-sm"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <span className="text-white/90 text-sm font-medium">
                {filteredImages[lightboxIndex].alt}
              </span>
              <span className="text-white/50 text-xs ml-3">
                {lightboxIndex + 1} / {filteredImages.length}
              </span>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 md:right-8 text-white/60 hover:text-white transition-colors z-10"
          >
            <ArrowRight className="h-8 w-8" />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;
