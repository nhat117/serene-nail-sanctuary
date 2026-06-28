import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookOnlineButton } from "@/components/BookingDialog";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cld } from "@/lib/cloudinary";

// CDN URL for one gallery image. Width 1200 covers the largest column on
// 4-up desktop layouts; Cloudinary auto-serves AVIF/WebP via f_auto.
const g = (name: string) => cld(`estique/gallery/${name}`, { width: 1200 });

const heroNails = g("hero-nails");
const signature = g("service-signature");
const manicure = g("service-manicure");
const gel = g("service-gel");
const bridal = g("service-bridal");
const art = g("service-art");
const stars = g("gallery-stars");
const stripes = g("gallery-stripes");
const polka = g("gallery-polka");
const cosmic = g("gallery-cosmic");
const vangogh = g("gallery-vangogh");
const french = g("gallery-french");
const green = g("gallery-green");
const gold = g("gallery-gold");
const studioSign = g("studio-sign");
const studioLogoWall = g("studio-logo-wall");
const studioBowSign = g("studio-bow-sign");
const studioPolishWall = g("studio-polish-wall");
const studioShelves = g("studio-shelves");
const studioPedicure = g("studio-pedicure");
const studioSpa = g("studio-spa");
const studioDetail = g("studio-detail");
const studioWorkstation = g("studio-workstation");
const studioHandpaint = g("studio-handpaint");

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

  // Studio — the Estique space, signage, and team at work
  { src: studioSign, alt: "Estique storefront with brick wall logo and bow sign", category: "Studio" },
  { src: studioLogoWall, alt: "Estique wall logo in polished brass on white brick", category: "Studio" },
  { src: studioBowSign, alt: "The Estique bow emblem on the outdoor sign", category: "Studio" },
  { src: studioPolishWall, alt: "Floor-to-ceiling polish wall inside the studio", category: "Studio" },
  { src: studioShelves, alt: "Soft pink polish shelves with greenery", category: "Studio" },
  { src: studioPedicure, alt: "Pedicure chairs lined up in the spa area", category: "Studio" },
  { src: studioSpa, alt: "Pedicure stations and basins ready for the day", category: "Studio" },
  { src: studioWorkstation, alt: "Manicure stations with task lamps and supplies", category: "Studio" },
  { src: studioDetail, alt: "Close-up of a manicurist refining nail shape", category: "Studio" },
  { src: studioHandpaint, alt: "Hand-painting a nail in progress with fine brushwork", category: "Studio" },
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
              src={filteredImages[lightboxIndex].src.replace(/,w_\d+/, ",w_1800")}
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
