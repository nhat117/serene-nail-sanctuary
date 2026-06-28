import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookOnlineButton } from "@/components/BookingDialog";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import heroNails from "@/assets/gallery/hero-nails.jpg";
import heroSecondary from "@/assets/gallery/hero-secondary.jpg";
import aboutDetail from "@/assets/gallery/about-detail.jpg";
import signature from "@/assets/gallery/service-signature.jpg";
import manicure from "@/assets/gallery/service-manicure.jpg";
import gel from "@/assets/gallery/service-gel.jpg";
import bridal from "@/assets/gallery/service-bridal.jpg";
import art from "@/assets/gallery/service-art.jpg";
import stars from "@/assets/gallery/gallery-stars.jpg";
import stripes from "@/assets/gallery/gallery-stripes.jpg";
import polka from "@/assets/gallery/gallery-polka.jpg";
import cosmic from "@/assets/gallery/gallery-cosmic.jpg";
import vangogh from "@/assets/gallery/gallery-vangogh.jpg";
import french from "@/assets/gallery/gallery-french.jpg";
import green from "@/assets/gallery/gallery-green.jpg";
import gold from "@/assets/gallery/gallery-gold.jpg";
import studioWarm from "@/assets/gallery/studio-warm.jpg";
import studioJewelry from "@/assets/gallery/studio-jewelry.jpg";
import studioTable from "@/assets/gallery/studio-table.jpg";
import studioJade from "@/assets/gallery/studio-jade.jpg";
import studioPlum from "@/assets/gallery/studio-plum.jpg";

// Four clean categories grouped by feel rather than technique:
//   Signature — showpiece work, gold + jewelry, the "wow" set
//   Classic   — clean French tips and polished, everyday-elegant nails
//   Statement — hand-painted art and themed designs
//   Studio    — atmosphere shots from in the salon
type Category = "Signature" | "Classic" | "Statement" | "Studio";

type GalleryItem = { src: string; alt: string; category: Category };

const galleryImages: GalleryItem[] = [
  // Signature — gold detail, layered jewelry, the headline work
  { src: heroNails, alt: "Gold-accented signature nail set", category: "Signature" },
  { src: gold, alt: "Stacked gold detail with soft French tips", category: "Signature" },
  { src: signature, alt: "Mixed-finish signature set with crystal accents", category: "Signature" },
  { src: bridal, alt: "Bridal-style nails with 3D floral detail", category: "Signature" },

  // Classic — French tips and clean lines
  { src: manicure, alt: "Classic French manicure", category: "Classic" },
  { src: french, alt: "Soft French tips with subtle accents", category: "Classic" },
  { src: polka, alt: "French tips with playful polka detail", category: "Classic" },
  { src: gel, alt: "Delicate floral gel design", category: "Classic" },

  // Statement — hand-painted and themed
  { src: art, alt: "Plum and silver hand-painted artistry", category: "Statement" },
  { src: stars, alt: "Burgundy and cream stars with polka dots", category: "Statement" },
  { src: stripes, alt: "Pastel stripes and stars on almond nails", category: "Statement" },
  { src: cosmic, alt: "Cosmic-themed nail art", category: "Statement" },
  { src: vangogh, alt: "Starry-night hand-painted nails", category: "Statement" },
  { src: green, alt: "Sheer nails with green floral inlay", category: "Statement" },

  // Studio — atmosphere and in-salon detail
  { src: heroSecondary, alt: "Layered gold rings and chocolate-tone nails in the studio", category: "Studio" },
  { src: aboutDetail, alt: "Close work showing delicate gold accents", category: "Studio" },
  { src: studioWarm, alt: "Warm in-studio detail with chunky knit", category: "Studio" },
  { src: studioJewelry, alt: "Stacked rings and gold detail at the studio table", category: "Studio" },
  { src: studioTable, alt: "Finished set resting on the studio table", category: "Studio" },
  { src: studioJade, alt: "Hands at the studio table with jade-tone nails", category: "Studio" },
  { src: studioPlum, alt: "Plum-tone set photographed in the studio", category: "Studio" },
];

const categories = [
  "All",
  ...Array.from(new Set(galleryImages.map((img) => img.category))),
];

const GalleryPage = () => {
  const heroRef = useScrollReveal<HTMLElement>();
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
            A small selection of recent work — from clean French tips to
            hand-painted detail, all done by the team at Estique.
          </p>

          {/* Category filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 scroll-reveal scroll-reveal-delay-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-xs font-medium tracking-[0.1em] uppercase rounded-full border transition-all duration-300 ${
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
      <section className="py-10 md:py-16 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.src}
                className="group relative break-inside-avoid overflow-hidden rounded-lg cursor-pointer animate-fade-up"
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
            See something you'd like
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Bring an idea, or let us suggest one. Book a time that suits you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <BookOnlineButton>Book an Appointment</BookOnlineButton>
            <Link to="/">
              <Button
                variant="outline"
                className="rounded-lg border-foreground/30 text-foreground px-10 py-6 text-base tracking-[0.1em] font-medium hover:bg-foreground hover:text-background transition-all duration-500"
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
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
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
