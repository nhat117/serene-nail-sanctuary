import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOnlineButton } from "@/components/BookingDialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Info, Sparkles, Wallet } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  usePricing,
  type PriceCategoryRow,
  type PriceTableRow,
  type PricingNoteRow,
} from "@/hooks/usePricing";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cld } from "@/lib/cloudinary";

const pricingHero =
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1920&q=80";

const NOTE_ICONS: Record<string, typeof Wallet> = {
  Wallet,
  Info,
  Sparkles,
};

const PricingPage = () => {
  const heroRef = useScrollReveal<HTMLElement>();
  const tablesRef = useScrollReveal<HTMLElement>();
  const { data: categories, isLoading, isError } = usePricing();

  const orderedCategories = categories ?? [];
  const defaultCategorySlug =
    orderedCategories[0]?.slug ?? "nails";

  return (
    <div className="min-h-screen">
      <TopBar />
      <Navbar />

      {/* Page Hero */}
      <section
        ref={heroRef}
        className="relative py-24 md:py-[120px] text-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pricingHero})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-black/50"
          aria-hidden="true"
        />
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-center gap-6 mb-4 scroll-reveal">
            <div className="h-px w-16 bg-primary/40" />
            <p className="uppercase tracking-[0.3em] text-primary text-xs font-semibold">
              Our Menu
            </p>
            <div className="h-px w-16 bg-primary/40" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-white scroll-reveal scroll-reveal-delay-1">
            Services & Pricing
          </h1>

          <p className="text-white max-w-xl mx-auto text-base md:text-lg leading-relaxed scroll-reveal scroll-reveal-delay-2">
            Our full menu of nail and waxing services, with clear, honest
            pricing. All prices are in AUD.
          </p>
        </div>
      </section>

      <section ref={tablesRef} className="py-10 md:py-16 bg-accent/20">
        <div className="container mx-auto px-4 max-w-6xl">
          {isLoading ? (
            <PricingSkeleton />
          ) : isError || orderedCategories.length === 0 ? (
            <PricingEmpty isError={isError} />
          ) : (
            <Tabs defaultValue={defaultCategorySlug} className="w-full">
              <TabsList className="mx-auto flex w-full max-w-md h-12 bg-background border border-foreground/10 rounded-lg p-1 mb-10 md:mb-14">
                {orderedCategories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.slug}
                    className="flex-1 text-xs md:text-sm tracking-[0.2em] uppercase font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                  >
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {orderedCategories.map((cat) => (
                <TabsContent
                  key={cat.id}
                  value={cat.slug}
                  className="space-y-8 md:space-y-10"
                >
                  <CategoryContent category={cat} />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Book your visit
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Choose a treatment, pick a time, and we'll see you soon.
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

const CategoryContent = ({ category }: { category: PriceCategoryRow }) => {
  const isWaxing = category.slug === "waxing";
  const tables = category.price_tables;

  return (
    <>
      {isWaxing ? (
        <div className="space-y-8 md:space-y-10">
          {tables.map((table) => (
            <WaxStyleTable key={table.id} table={table} />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {tables.map((table) => (
            <PriceCard key={table.id} table={table} />
          ))}
        </div>
      )}

      {category.pricing_notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </>
  );
};

const PriceCard = ({ table }: { table: PriceTableRow }) => {
  const isMultiCol = table.price_columns.length > 1;
  const cols = table.price_columns;

  return (
    <div className="bg-background rounded-lg shadow-sm border border-foreground/5 overflow-hidden flex flex-col">
      <div className="px-6 md:px-7 pt-6 md:pt-7 pb-4 border-b border-foreground/5">
        <h3 className="text-lg md:text-xl font-semibold leading-tight">
          {table.title}
        </h3>
        {table.note && (
          <p className="text-xs md:text-sm text-muted-foreground italic mt-1.5">
            {table.note}
          </p>
        )}
      </div>

      <div className="px-6 md:px-7 py-5 flex-1">
        {isMultiCol && (
          <div
            className="grid items-end pb-3 mb-3 border-b border-foreground/10"
            style={{
              gridTemplateColumns: `1fr repeat(${cols.length}, minmax(0, 7rem))`,
            }}
          >
            <span />
            {cols.map((col) => (
              <span
                key={col.id}
                className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-foreground/60 font-semibold text-right"
              >
                {col.label}
              </span>
            ))}
          </div>
        )}

        <ul>
          {table.price_rows.map((row) => {
            const cellByColumn = new Map(
              row.price_cells.map((c) => [c.column_id, c.value]),
            );
            return (
              <li
                key={row.id}
                className="grid items-center py-2.5 border-b border-foreground/5 last:border-0 gap-3"
                style={{
                  gridTemplateColumns: isMultiCol
                    ? `1fr repeat(${cols.length}, minmax(0, 7rem))`
                    : `1fr auto`,
                }}
              >
                <span className="text-sm md:text-[15px] text-foreground/85 leading-snug">
                  {row.service}
                </span>
                {cols.map((col) => (
                  <span
                    key={col.id}
                    className="text-sm md:text-[15px] text-primary font-semibold tracking-wide text-right tabular-nums"
                  >
                    {cellByColumn.get(col.id) ?? "—"}
                  </span>
                ))}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const WaxStyleTable = ({ table }: { table: PriceTableRow }) => {
  const cols = table.price_columns;

  return (
    <div className="bg-background rounded-lg shadow-sm border border-foreground/5 overflow-hidden">
      <div className="px-6 md:px-9 pt-6 md:pt-8 pb-4 border-b border-foreground/5">
        <h3 className="text-xl md:text-2xl font-semibold leading-tight">
          {table.title}
        </h3>
        {table.note && (
          <p className="text-xs md:text-sm text-muted-foreground italic mt-1.5">
            {table.note}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-foreground/10 bg-accent/20">
              <th className="px-6 md:px-9 py-3 text-left text-[10px] md:text-xs uppercase tracking-[0.2em] text-foreground/60 font-semibold">
                Service
              </th>
              {cols.map((col, i) => (
                <th
                  key={col.id}
                  className={`px-4 md:px-6 py-3 text-right text-[10px] md:text-xs uppercase tracking-[0.2em] text-foreground/60 font-semibold w-32 md:w-40 ${
                    i === cols.length - 1 ? "pr-6 md:pr-9" : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.price_rows.map((row, idx) => {
              const cellByColumn = new Map(
                row.price_cells.map((c) => [c.column_id, c.value]),
              );
              return (
                <tr
                  key={row.id}
                  className={`border-b border-foreground/5 last:border-0 ${
                    idx % 2 === 1 ? "bg-accent/10" : ""
                  }`}
                >
                  <td className="px-6 md:px-9 py-3 md:py-3.5 text-sm md:text-[15px] text-foreground/85">
                    {row.service}
                  </td>
                  {cols.map((col, i) => (
                    <td
                      key={col.id}
                      className={`px-4 md:px-6 py-3 md:py-3.5 text-sm md:text-[15px] text-right tabular-nums ${
                        i === cols.length - 1 ? "pr-6 md:pr-9" : ""
                      }`}
                    >
                      <PriceCell value={cellByColumn.get(col.id) ?? "—"} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PriceCell = ({ value }: { value: string }) => {
  if (value === "—") {
    return <span className="text-foreground/30">—</span>;
  }
  return (
    <span className="text-primary font-semibold tracking-wide">{value}</span>
  );
};

const NoteCard = ({ note }: { note: PricingNoteRow }) => {
  const Icon = (note.icon && NOTE_ICONS[note.icon]) ?? Info;
  const lines = note.body.split("\n").map((l) => l.trim()).filter(Boolean);

  return (
    <div className="bg-background rounded-lg shadow-sm border border-foreground/5 p-7 md:p-9">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold">{note.title}</h3>
      </div>
      <ul className="space-y-2.5 text-sm md:text-base text-foreground/80 leading-relaxed pl-12">
        {lines.map((line, i) => (
          <li key={i} className="list-disc list-outside ml-4">
            {line}
          </li>
        ))}
      </ul>
      {note.highlight && (
        <div className="mt-6 ml-12 inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary/10 border border-primary/20">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <p className="text-xs md:text-sm text-foreground/90 font-medium tracking-wide">
            {note.highlight}
          </p>
        </div>
      )}
    </div>
  );
};

const PricingSkeleton = () => (
  <div className="space-y-8">
    <Skeleton className="h-12 w-full max-w-md mx-auto" />
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-background rounded-lg border border-foreground/5 p-7 space-y-3"
        >
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  </div>
);

const PricingEmpty = ({ isError }: { isError: boolean }) => (
  <div className="bg-background rounded-lg border border-foreground/5 p-10 text-center">
    <h3 className="text-lg font-semibold mb-2">
      {isError ? "We couldn't load our prices right now" : "Pricing coming soon"}
    </h3>
    <p className="text-sm text-muted-foreground">
      {isError
        ? "Please refresh the page or contact us directly for current pricing."
        : "Our price list is being updated. Please check back shortly."}
    </p>
  </div>
);

export default PricingPage;
