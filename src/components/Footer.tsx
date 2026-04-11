import { Sparkles, MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import StarField from "@/components/StarField";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Gallery", to: "/gallery" },
  { label: "Pricing", to: "/#pricing" },
];

const Footer = () => (
  <footer id="contact" className="relative py-20" style={{ backgroundColor: "#F5F0EB" }}>
    <StarField count={10} colorClass="bg-primary/10" />
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-10 mb-14">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span
              className="text-xl tracking-[0.15em] font-semibold text-foreground"
              style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
            >
              Estique.
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Your sanctuary for refined nail care and timeless elegance.
            Experience quiet luxury.
          </p>
          <div className="flex gap-3 mt-6">
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary/20 transition-colors duration-300"
            >
              <Instagram className="h-4 w-4 text-foreground/60" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary/20 transition-colors duration-300"
            >
              <Facebook className="h-4 w-4 text-foreground/60" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
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
        <div>
          <h4 className="font-semibold mb-5 text-xs uppercase tracking-[0.2em] text-foreground/70">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              123 Elegance Ave, Suite 100
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              (123) 456-7890
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              hello@estique.com
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="font-semibold mb-5 text-xs uppercase tracking-[0.2em] text-foreground/70">
            Hours
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Monday – Friday: 9am – 7pm</li>
            <li>Saturday: 9am – 6pm</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-foreground/10 pt-8 text-center text-xs text-muted-foreground/60 tracking-wide">
        © 2026 Estique. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
