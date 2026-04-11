import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const leftLinks = ["Home", "About", "Services", "Gallery"];
const rightLinks = ["Pricing", "Contact"];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    setOpen(false);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id.toLowerCase());
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Left nav links — desktop */}
        <ul className="hidden lg:flex items-center gap-8 flex-1">
          {leftLinks.map((l) => (
            <li key={l}>
              {l === "Services" ? (
                <Link
                  to="/services"
                  className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground/60 hover:text-primary transition-colors duration-300"
                >
                  {l}
                </Link>
              ) : (
                <button
                  onClick={() => scrollTo(l.toLowerCase())}
                  className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground/60 hover:text-primary transition-colors duration-300"
                >
                  {l}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Center Logo */}
        <button
          onClick={() => scrollTo("home")}
          className="flex flex-col items-center gap-0.5"
        >
          <span
            className="text-2xl md:text-3xl tracking-[0.25em] font-semibold text-foreground uppercase"
            style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
          >
            Estique
          </span>
          <span className="text-[9px] tracking-[0.35em] text-muted-foreground font-medium uppercase">
            Nails & Beauty Artistry
          </span>
        </button>

        {/* Right nav links + CTA — desktop */}
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
          {rightLinks.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l.toLowerCase())}
              className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground/60 hover:text-primary transition-colors duration-300"
            >
              {l}
            </button>
          ))}
          <Button
            onClick={() => scrollTo("contact")}
            className="rounded-none bg-primary text-primary-foreground text-[11px] tracking-[0.15em] px-7 py-2.5 hover:bg-primary/85 transition-all duration-500"
          >
            Book Online
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-md px-4 pb-6">
          <ul className="flex flex-col gap-1 pt-4">
            {[...leftLinks, ...rightLinks].map((l) => (
              <li key={l}>
                {l === "Services" ? (
                  <Link
                    to="/services"
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors w-full text-left py-2.5 px-2 rounded-lg hover:bg-accent/50 block"
                  >
                    {l}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollTo(l.toLowerCase())}
                    className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors w-full text-left py-2.5 px-2 rounded-lg hover:bg-accent/50"
                  >
                    {l}
                  </button>
                )}
              </li>
            ))}
            <li className="pt-3">
              <Button
                onClick={() => scrollTo("contact")}
                className="rounded-none bg-primary text-primary-foreground w-full tracking-[0.15em] text-sm"
              >
                Book Online
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
