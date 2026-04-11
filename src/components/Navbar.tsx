import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = ["Home", "About", "Services", "Gallery", "Pricing", "Contact"];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id.toLowerCase());
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Left links — desktop */}
        <ul className="hidden lg:flex items-center gap-6">
          {navLinks.slice(0, 3).map((l) => (
            <li key={l}>
              <button onClick={() => scrollTo(l)} className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors">
                {l}
              </button>
            </li>
          ))}
        </ul>

        {/* Logo */}
        <button onClick={() => scrollTo("home")} className="flex flex-col items-center gap-0.5">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-serif text-2xl tracking-widest font-semibold text-foreground" style={{ fontFamily: "'Noto Serif', serif" }}>
            Estique.
          </span>
        </button>

        {/* Right links — desktop */}
        <ul className="hidden lg:flex items-center gap-6">
          {navLinks.slice(3).map((l) => (
            <li key={l}>
              <button onClick={() => scrollTo(l)} className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors">
                {l}
              </button>
            </li>
          ))}
          <li>
            <Button onClick={() => scrollTo("contact")} className="rounded-full px-6">
              Book Online
            </Button>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background px-4 pb-4">
          <ul className="flex flex-col gap-3 pt-3">
            {navLinks.map((l) => (
              <li key={l}>
                <button onClick={() => scrollTo(l)} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors w-full text-left">
                  {l}
                </button>
              </li>
            ))}
            <li>
              <Button onClick={() => scrollTo("contact")} className="rounded-full w-full mt-2">
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
