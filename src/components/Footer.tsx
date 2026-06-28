import {
  MapPin,
  Phone,
  Instagram,
  Facebook,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import StarField from "@/components/StarField";
import { useBranches } from "@/hooks/useBranches";

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/xa2tcA4pd8TCwZA57";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Gallery", to: "/gallery" },
  { label: "Studio", to: "/studio" },
  { label: "Book Online", to: "/booking" },
];

const Footer = () => {
  const { data: branches } = useBranches();
  const primary = branches?.[0];

  const instagramHandle = primary?.instagram?.replace(/^@/, "") ?? null;
  const instagramHref = instagramHandle
    ? `https://instagram.com/${instagramHandle}`
    : null;

  return (
    <footer id="contact" className="relative py-20 bg-white/70 backdrop-blur-md">
      <StarField count={10} colorClass="bg-primary/10" />
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

          {/* Brand — spans 1 col */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <img
                src="https://res.cloudinary.com/dzzoimn4v/image/upload/e_colorize:100,co_rgb:CCB68D/v1778645820/estique_logo_transparent_kwyboz.png"
                alt="Estique"
                className="h-20 md:h-24 w-auto object-contain"
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              A small studio for considered nail care and beauty — finished
              with patience, polished to last.
            </p>
            <div className="flex gap-3 mt-6">
              {instagramHref && (
                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary/20 transition-colors duration-300"
                >
                  <Instagram className="h-4 w-4 text-foreground/60" />
                </a>
              )}
              <a
                href="https://www.facebook.com/Estiquenailsandbeautyartistry"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary/20 transition-colors duration-300"
              >
                <Facebook className="h-4 w-4 text-foreground/60" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold mb-5 text-xs uppercase tracking-[0.2em] text-foreground/70">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold mb-5 text-xs uppercase tracking-[0.2em] text-foreground/70">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {primary?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    {primary.address}
                    {primary.address_note && (
                      <span className="block italic text-muted-foreground/70">
                        {primary.address_note}
                      </span>
                    )}
                  </span>
                </li>
              )}
              {primary?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <a
                    href={`tel:${primary.phone.replace(/\s+/g, "")}`}
                    className="hover:text-primary transition-colors"
                  >
                    {primary.phone}
                  </a>
                </li>
              )}
              {instagramHref && (
                <li className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-primary shrink-0" />
                  <a
                    href={instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {primary?.instagram}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Hours */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold mb-5 text-xs uppercase tracking-[0.2em] text-foreground/70">
              Hours
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {primary?.branch_trading_hours?.length ? (
                <>
                  {primary.branch_trading_hours.map((row) => (
                    <li key={row.id}>
                      <span className="block text-foreground/80">
                        {row.days_label}
                      </span>
                      <span className="text-muted-foreground/80">
                        {row.hours_label}
                      </span>
                    </li>
                  ))}
                  {primary.public_holidays && (
                    <li className="italic text-muted-foreground/70">
                      Public Holidays: {primary.public_holidays}
                    </li>
                  )}
                </>
              ) : (
                <li className="italic text-muted-foreground/60">
                  Hours coming soon
                </li>
              )}
            </ul>
          </div>

          {/* Map — next to Hours */}
          <div className="lg:col-span-1 md:col-span-2">
            <h4 className="font-semibold mb-5 text-xs uppercase tracking-[0.2em] text-foreground/70">
              Find Us
            </h4>
            {primary?.map_embed_url ? (
              <div className="rounded-lg overflow-hidden border border-border/40 shadow-sm shadow-foreground/5 aspect-[4/3]">
                <iframe
                  title="Estique location map"
                  src={primary.map_embed_url}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0 grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                  allowFullScreen
                />
              </div>
            ) : (
              /* Placeholder shown until map_embed_url is set in Supabase */
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex aspect-[4/3] items-center justify-center rounded-lg bg-accent/40 border border-border/40 group hover:bg-accent/60 transition-colors duration-300"
              >
                <div className="text-center px-4">
                  <MapPin className="h-8 w-8 text-primary/40 mx-auto mb-2 group-hover:text-primary transition-colors duration-300" />
                  <p className="text-sm font-semibold text-foreground/80 mb-1">ESTIQUE Nails & Beauty Artistry</p>
                  {primary?.address && (
                    <p className="text-xs text-muted-foreground">{primary.address}</p>
                  )}
                </div>
              </a>
            )}
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <ExternalLink className="h-3 w-3" />
              Get Directions
            </a>
          </div>

        </div>

        <div className="border-t border-foreground/10 pt-8 text-center text-xs text-muted-foreground/60 tracking-wide">
          © {new Date().getFullYear()} Estique. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
