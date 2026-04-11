import { Sparkles, MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="bg-foreground text-primary-foreground py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-10 mb-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xl tracking-widest font-semibold" style={{ fontFamily: "'Noto Serif', serif" }}>Estique.</span>
          </div>
          <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs">
            Your sanctuary for refined nail care and timeless elegance. Experience quiet luxury.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/60">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> 123 Elegance Ave, Suite 100</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> (123) 456-7890</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hello@estique.com</li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Hours</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/60">
            <li>Monday – Friday: 9am – 7pm</li>
            <li>Saturday: 9am – 6pm</li>
            <li>Sunday: Closed</li>
          </ul>
          <div className="flex gap-3 mt-5">
            <a href="#" className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/40">
        © 2026 Estique. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
