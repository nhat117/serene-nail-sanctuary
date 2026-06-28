import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useBranches, type BranchRow } from "@/hooks/useBranches";
import { BookOnlineButton } from "@/components/BookingDialog";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import salonImage from "@/assets/gallery/about-detail.jpg";

const LocationPage = () => {
  const heroRef = useScrollReveal<HTMLElement>();
  const contentRef = useScrollReveal<HTMLElement>();
  const { data: branches, isLoading, isError } = useBranches();

  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeBranchId && branches && branches.length > 0) {
      setActiveBranchId(branches[0].id);
    }
  }, [activeBranchId, branches]);

  const activeBranch = useMemo(
    () => branches?.find((b) => b.id === activeBranchId) ?? branches?.[0],
    [branches, activeBranchId],
  );

  return (
    <div className="min-h-screen">
      <TopBar />
      <Navbar />

      <section
        ref={heroRef}
        className="py-20 md:py-[100px] bg-white text-center"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6 mb-4 scroll-reveal">
            <div className="h-px w-16 bg-primary/40" />
            <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold">
              Visit Us
            </p>
            <div className="h-px w-16 bg-primary/40" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 scroll-reveal scroll-reveal-delay-1">
            Our Locations
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed scroll-reveal scroll-reveal-delay-2">
            Find the Estique studio nearest to you, and the trading hours that
            suit your week.
          </p>
        </div>
      </section>

      <section ref={contentRef} className="py-10 md:py-16 bg-accent/20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <LocationSkeleton />
          ) : isError || !branches || branches.length === 0 || !activeBranch ? (
            <LocationEmpty isError={isError} />
          ) : (
            <>
              {/* Sub-tab strip — designed to scale with future branches */}
              <div className="border-b border-foreground/10 mb-10 md:mb-14 overflow-x-auto">
                <div
                  role="tablist"
                  aria-label="Branch locations"
                  className="flex items-end gap-2 md:gap-4 min-w-max"
                >
                  {branches.map((branch) => {
                    const isActive = branch.id === activeBranch.id;
                    return (
                      <button
                        key={branch.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveBranchId(branch.id)}
                        className={`relative px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm tracking-[0.2em] uppercase font-medium transition-colors duration-300 ${
                          isActive
                            ? "text-primary"
                            : "text-foreground/60 hover:text-foreground"
                        }`}
                      >
                        {branch.short_label}
                        <span
                          className={`absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary transition-transform duration-500 origin-left ${
                            isActive ? "scale-x-100" : "scale-x-0"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-foreground/30 border-l border-foreground/10 hidden sm:inline-block">
                    More Locations · Coming Soon
                  </span>
                </div>
              </div>

              <BranchDetails branch={activeBranch} />
            </>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background text-center">
        <div className="container mx-auto px-4">
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
      </section>

      <Footer />
    </div>
  );
};

const BranchDetails = ({ branch }: { branch: BranchRow }) => {
  const directionsHref = branch.map_embed_url
    ? branch.map_embed_url
        .replace("&output=embed", "")
        .replace("/maps?", "/maps/search/?api=1&")
        .replace("q=", "query=")
    : null;

  const branchShortName = branch.short_label.split(" ").slice(-1)[0];

  return (
    <div
      key={branch.id}
      className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start"
    >
      <div className="space-y-6 scroll-reveal-left">
        <div className="relative group">
          <div className="aspect-[4/5] overflow-hidden rounded-lg shadow-xl shadow-foreground/5">
            <img
              src={branch.image_url || salonImage}
              alt={`${branch.name} interior`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-3 -left-3 w-full h-full border border-primary/15 -z-10" />
        </div>

        {branch.map_embed_url && (
          <div className="aspect-[16/10] overflow-hidden rounded-lg shadow-md shadow-foreground/5 bg-foreground/5">
            <iframe
              title={`${branch.name} location map`}
              src={branch.map_embed_url}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        )}
      </div>

      <div className="lg:pt-2 scroll-reveal-right scroll-reveal-delay-1">
        {branch.city && (
          <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold mb-3">
            {branch.city}
          </p>
        )}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 leading-tight">
          {branch.name}
        </h2>

        <DetailRow
          icon={MapPin}
          label="Address"
          extraNote={branch.address_note ?? undefined}
        >
          {branch.address}
        </DetailRow>

        {branch.phone && (
          <DetailRow icon={Phone} label="Phone">
            <a
              href={`tel:${branch.phone.replace(/\s+/g, "")}`}
              className="text-foreground/90 text-base hover:text-primary transition-colors duration-300"
            >
              {branch.phone}
            </a>
          </DetailRow>
        )}

        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs uppercase tracking-[0.2em] text-foreground/70 font-semibold mb-3">
              Trading Hours
            </h3>
            <ul className="space-y-2">
              {branch.branch_trading_hours.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-6 text-sm pb-2 border-b border-foreground/5 last:border-0"
                >
                  <span className="text-foreground/80">{row.days_label}</span>
                  <span className="text-primary font-medium tracking-wide">
                    {row.hours_label}
                  </span>
                </li>
              ))}
              {branch.public_holidays && (
                <li className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-6 text-sm pt-1">
                  <span className="text-foreground/80">Public Holidays</span>
                  <span className="text-muted-foreground italic">
                    {branch.public_holidays}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {branch.instagram && (
          <DetailRow icon={Instagram} label="Follow Us">
            <a
              href={`https://instagram.com/${branch.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/90 text-base hover:text-primary transition-colors duration-300"
            >
              {branch.instagram}
            </a>
          </DetailRow>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <BookOnlineButton className="px-6 py-5">
            Book at {branchShortName}
            <ArrowRight className="h-3.5 w-3.5 ml-2" />
          </BookOnlineButton>
          {directionsHref && (
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="rounded-lg border-foreground/20 text-foreground text-sm tracking-wider px-8 py-6 hover:bg-foreground hover:text-background transition-all duration-500"
              >
                Get Directions
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({
  icon: Icon,
  label,
  extraNote,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  extraNote?: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-4 mb-6">
    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div>
      <h3 className="text-xs uppercase tracking-[0.2em] text-foreground/70 font-semibold mb-2">
        {label}
      </h3>
      <p className="text-foreground/90 text-base leading-relaxed">{children}</p>
      {extraNote && (
        <p className="text-muted-foreground text-sm italic mt-1">{extraNote}</p>
      )}
    </div>
  </div>
);

const LocationSkeleton = () => (
  <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
    <Skeleton className="aspect-[4/5] rounded-lg" />
    <div className="space-y-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

const LocationEmpty = ({ isError }: { isError: boolean }) => (
  <div className="bg-background rounded-lg border border-foreground/5 p-10 text-center max-w-xl mx-auto">
    <h3 className="text-lg font-semibold mb-2">
      {isError
        ? "We couldn't load our locations right now"
        : "Locations coming soon"}
    </h3>
    <p className="text-sm text-muted-foreground">
      {isError
        ? "Please refresh the page or contact us directly for our address and trading hours."
        : "Our branch information is being updated. Please check back shortly."}
    </p>
  </div>
);

export default LocationPage;
