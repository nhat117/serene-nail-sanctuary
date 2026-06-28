import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOnlineButton } from "@/components/BookingDialog";
import { ArrowLeft, ArrowRight, Clock, Info } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cld } from "@/lib/cloudinary";

const g = (name: string) => cld(`estique/gallery/${name}`, { width: 800 });
const serviceManicure = g("service-manicure");
const serviceGel = g("service-gel");
const servicePedicure = g("service-art");
const serviceBridal = g("service-bridal");
const salonInterior = g("about-detail");
const gFrench = g("gallery-french");
const gPolka = g("gallery-polka");
const gStripes = g("gallery-stripes");
const gStars = g("gallery-stars");
const gCosmic = g("gallery-cosmic");
const gVangogh = g("gallery-vangogh");
const gGreen = g("gallery-green");
const gGold = g("gallery-gold");
const heroNails = g("hero-nails");
const heroSecondary = g("hero-secondary");

// All pools use Estique's own nail-art photos.
const NAIL_ART_PHOTOS = [gStars, gCosmic, gVangogh, serviceBridal];
const MANICURE_PHOTOS = [serviceManicure, gFrench, gPolka, gStripes];
const GEL_EXTENSION_PHOTOS = [serviceGel, gGreen, gGold, heroNails];
const PEDICURE_PHOTOS = [servicePedicure, gCosmic, gVangogh];
const SALON_PHOTOS = [salonInterior, heroSecondary, gGold, heroNails];

const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  "Face Wax": [salonInterior, heroSecondary, gGold, heroNails],
  "Body Wax": [heroSecondary, salonInterior, gGold, heroNails],
  "Nail Extension / Acrylic": GEL_EXTENSION_PHOTOS,
  "SNS": MANICURE_PHOTOS,
  "Nail Enhancement": GEL_EXTENSION_PHOTOS,
  "Add-ons": SALON_PHOTOS,
  "Hands — Normal Polish": MANICURE_PHOTOS,
  "Hands — Shellac": [
    gFrench,
    gPolka,
    gStripes,
    gStars,
  ],
  "Nail Art": NAIL_ART_PHOTOS,
  "Feet — Normal Polish": PEDICURE_PHOTOS,
  "Feet — Shellac & Enhancement": PEDICURE_PHOTOS,
};

const FALLBACK_POOL = [serviceManicure, serviceGel, servicePedicure];

const imageForService = (s: { category: string | null }, indexInCategory: number) => {
  const pool =
    (s.category && CATEGORY_IMAGE_POOLS[s.category]) || FALLBACK_POOL;
  return pool[indexInCategory % pool.length];
};

type Service = {
  id: string;
  name: string;
  category: string | null;
  duration_minutes: number;
  price: number;
  price_label: string | null;
  disclaimer: string | null;
  sort_order: number;
};

const CATEGORY_ORDER = [
  "Face Wax",
  "Body Wax",
  "Nail Extension / Acrylic",
  "SNS",
  "Nail Enhancement",
  "Add-ons",
  "Hands — Normal Polish",
  "Hands — Shellac",
  "Nail Art",
  "Feet — Normal Polish",
  "Feet — Shellac & Enhancement",
];

const formatPrice = (svc: Service) => {
  if (svc.price_label) return svc.price_label;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(svc.price);
};

const ServicesPage = () => {
  const heroRef = useScrollReveal<HTMLElement>();
  const gridRef = useScrollReveal<HTMLElement>();

  const { data: services, isLoading, isError } = useQuery({
    queryKey: ["services-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id,name,category,duration_minutes,price,price_label,disclaimer,sort_order")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Service[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const grouped = useMemo(() => {
    if (!services) return [] as Array<{ category: string; items: Service[] }>;
    const map = new Map<string, Service[]>();
    for (const s of services) {
      const cat = s.category ?? "Other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(s);
    }
    const ordered: Array<{ category: string; items: Service[] }> = [];
    for (const cat of CATEGORY_ORDER) {
      const items = map.get(cat);
      if (items?.length) ordered.push({ category: cat, items });
      map.delete(cat);
    }
    for (const [cat, items] of map) ordered.push({ category: cat, items });
    return ordered;
  }, [services]);

  return (
    <div className="min-h-screen">
      <TopBar />
      <Navbar />

      <section ref={heroRef} className="py-20 md:py-[100px] bg-white text-center">
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
            Our full menu of nail care, waxing, and beauty treatments.
            (F) for Her, (M) for Him.
          </p>
        </div>
      </section>

      <section ref={gridRef} className="py-10 md:py-16 bg-accent/20">
        <div className="container mx-auto px-4 max-w-6xl">
          {isLoading ? (
            <ServicesSkeleton />
          ) : isError || grouped.length === 0 ? (
            <ServicesEmpty isError={isError} />
          ) : (
            <div className="space-y-12 md:space-y-16">
              {grouped.map((group) => (
                <CategoryBlock key={group.category} group={group} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Book your visit
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Pick a treatment, choose a time. We look forward to having you in.
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

      <Footer />
    </div>
  );
};

const CategoryBlock = ({
  group,
}: {
  group: { category: string; items: Service[] };
}) => {
  const hasDisclaimer = group.items.some((s) => s.disclaimer);
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">{group.category}</h2>
        <div className="h-px flex-1 bg-foreground/10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {group.items.map((service, idx) => (
          <Link
            key={service.id}
            to={`/booking?service=${service.id}`}
            className="group bg-background rounded-lg border border-foreground/5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden"
          >
            <div className="aspect-[16/10] overflow-hidden bg-accent/30">
              <img
                src={imageForService(service, idx)}
                alt={service.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-5 md:p-6 flex flex-col flex-1">
              <h3 className="text-base md:text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {service.name}
              </h3>

              <div className="flex items-center gap-3 text-muted-foreground text-xs mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {service.duration_minutes} min
                </span>
                <span className="text-primary/60">|</span>
                <span className="text-primary font-semibold tabular-nums">
                  {formatPrice(service)}
                </span>
              </div>

              {service.disclaimer && (
                <p className="text-[11px] text-muted-foreground italic mb-3 leading-relaxed">
                  {service.disclaimer}
                </p>
              )}

              <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-foreground/70 group-hover:text-primary transition-colors">
                Book now
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {hasDisclaimer && (
        <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5">
          <Info className="h-3 w-3" />
          Final price for variable items is confirmed on consultation.
        </p>
      )}
    </div>
  );
};

const ServicesSkeleton = () => (
  <div className="space-y-12">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i}>
        <Skeleton className="h-7 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, j) => (
            <div
              key={j}
              className="bg-background rounded-lg border border-foreground/5 p-5 space-y-3"
            >
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const ServicesEmpty = ({ isError }: { isError: boolean }) => (
  <div className="bg-background rounded-lg border border-foreground/5 p-10 text-center">
    <h3 className="text-lg font-semibold mb-2">
      {isError ? "We couldn't load our services right now" : "Services coming soon"}
    </h3>
    <p className="text-sm text-muted-foreground">
      {isError
        ? "Please refresh the page or contact us directly to book."
        : "Our menu is being updated. Please check back shortly."}
    </p>
  </div>
);

export default ServicesPage;
