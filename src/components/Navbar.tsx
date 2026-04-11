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
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo — Left */}
        <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-2xl tracking-[0.15em] font-semibold text-foreground" style={{ fontFamily: "'Noto Serif', serif" }}>
            Estique.
          </span>
        </button>

        {/* Center links — desktop */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l}>
              <button
                onClick={() => scrollTo(l)}
                className="text-sm font-medium tracking-wide text-foreground/70 hover:text-primary transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[1.5px] after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {l}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA — Right */}
        <div className="hidden lg:block">
          <Button onClick={() => scrollTo("contact")} className="rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-300">
            Book Online
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-md px-4 pb-6">
          <ul className="flex flex-col gap-1 pt-4">
            {navLinks.map((l) => (
              <li key={l}>
                <button
                  onClick={() => scrollTo(l)}
                  className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors w-full text-left py-2.5 px-2 rounded-lg hover:bg-accent/50"
                >
                  {l}
                </button>
              </li>
            ))}
            <li className="pt-2">
              <Button onClick={() => scrollTo("contact")} className="rounded-full w-full">
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
