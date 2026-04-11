import { Sparkles, Hand, Footprints, Palette, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  { icon: Hand, title: "Luxury Manicure", desc: "Meticulous nail shaping, cuticle care, and polish with premium products." },
  { icon: Footprints, title: "Spa Pedicure", desc: "Soothing foot soak, exfoliation, and massage for total relaxation." },
  { icon: Palette, title: "Nail Art", desc: "Custom designs from minimalist accents to intricate hand-painted creations." },
  { icon: Bath, title: "Spa Treatment", desc: "Indulgent hand and foot treatments with nourishing masks and serums." },
];

const ServicesSection = () => (
  <section id="services" className="py-20 md:py-28 bg-secondary/30">
    <div className="container mx-auto px-4 text-center">
      <Sparkles className="h-5 w-5 text-primary mx-auto mb-3" />
      <p className="uppercase tracking-[0.25em] text-primary text-xs font-semibold mb-3">Luxurious Nail Care</p>
      <h2 className="text-3xl md:text-4xl font-semibold mb-12" style={{ fontFamily: "'Noto Serif', serif" }}>
        Our Signature Services
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {services.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="border-none shadow-sm hover:shadow-md transition-shadow bg-background rounded-2xl">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-5">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
        View All Services
      </Button>
    </div>
  </section>
);

export default ServicesSection;
