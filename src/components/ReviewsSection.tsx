import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/xa2tcA4pd8TCwZA57";

// Replace with live Google Places API data when available.
// Shape mirrors the Google Places Review object for easy swap-in:
// { author_name, rating, text, relative_time_description }
const reviews = [
  {
    name: "Sophie L.",
    initials: "SL",
    rating: 5,
    text: "Absolutely the best nail salon experience I've ever had. The attention to detail is extraordinary — my nails looked like art. The ambiance is so calming and luxurious.",
    date: "2 weeks ago",
  },
  {
    name: "Jessica M.",
    initials: "JM",
    rating: 5,
    text: "I've been coming here for months and every single visit is perfect. The technicians really listen to what you want and deliver results beyond expectations.",
    date: "1 month ago",
  },
  {
    name: "Rachel T.",
    initials: "RT",
    rating: 5,
    text: "Such a serene and elegant space. They took their time, no rushing, and my gel manicure is still flawless after 3 weeks. Will not go anywhere else.",
    date: "3 weeks ago",
  },
  {
    name: "Amanda K.",
    initials: "AK",
    rating: 5,
    text: "The team here is incredibly skilled and professional. My bridal nails were exactly what I envisioned. Everyone at the wedding kept complimenting them!",
    date: "1 month ago",
  },
  {
    name: "Chloe R.",
    initials: "CR",
    rating: 5,
    text: "From the moment I walked in I felt like royalty. The salon is immaculate, the service impeccable. My go-to for any special occasion — or just because.",
    date: "2 months ago",
  },
  {
    name: "Natalie W.",
    initials: "NW",
    rating: 5,
    text: "Truly a cut above. My nails have never looked better, and the whole experience felt like a mini spa day. Highly recommend the gel pedicure.",
    date: "2 months ago",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const AUTOPLAY_INTERVAL = 4000;

const ReviewsSection = () => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Auto-scroll
  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);

    const timer = setInterval(() => api.scrollNext(), AUTOPLAY_INTERVAL);
    return () => {
      clearInterval(timer);
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section ref={sectionRef} className="py-20 md:py-[100px] bg-accent/10">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-6 mb-4 scroll-reveal">
            <div className="h-px w-16 bg-primary/40" />
            <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold">
              Kind Words
            </p>
            <div className="h-px w-16 bg-primary/40" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 scroll-reveal scroll-reveal-delay-1">
            Loved by our clients
          </h2>

          {/* Trust bar */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-5 scroll-reveal scroll-reveal-delay-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-xl font-semibold text-foreground">5.0</span>
            </div>
            <span className="hidden sm:block h-4 w-px bg-foreground/20" />
            <span className="text-sm text-muted-foreground">47+ reviews</span>
            <span className="hidden sm:block h-4 w-px bg-foreground/20" />
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <GoogleLogo />
              View all on Google
            </a>
          </div>
        </div>

        {/* Carousel */}
        <div className="scroll-reveal scroll-reveal-delay-3">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {reviews.map((review) => (
                <CarouselItem
                  key={review.name}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="bg-card border border-border/60 rounded-lg shadow-soft p-7 flex flex-col gap-5 h-full">
                    <div className="flex items-start justify-between">
                      <span className="font-serif text-5xl leading-none text-primary/25 select-none">&ldquo;</span>
                      <StarRating rating={review.rating} />
                    </div>

                    <p className="text-sm text-foreground/75 leading-relaxed flex-1 line-clamp-5">
                      {review.text}
                    </p>

                    <div className="flex items-center gap-3 pt-1 border-t border-border/30">
                      <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-primary tracking-wide">
                          {review.initials}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground leading-tight">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="ml-auto opacity-60">
                        <GoogleLogo />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dot indicators */}
          {count > 0 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-primary w-5 h-1.5"
                      : "bg-foreground/20 w-1.5 h-1.5 hover:bg-foreground/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default ReviewsSection;
