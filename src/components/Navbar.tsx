import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { BookOnlineButton } from "@/components/BookingDialog";
import { ESTIQUE_LOGO_URL } from "@/lib/cloudinary";

const leftLinks = ["Home", "About", "Services", "Gallery", "Location"];
const routeLinks: Record<string, string> = {
  Home: "/",
  About: "/about",
  Services: "/services",
  Gallery: "/gallery",
  Location: "/studio",
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const last = lastYRef.current;
      const delta = y - last;
      if (Math.abs(delta) < 6) return;
      if (delta > 0 && y > 80) {
        setHidden(true);
      } else if (delta < 0) {
        setHidden(false);
      }
      lastYRef.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) setHidden(false);
  }, [open]);

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id.toLowerCase());
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#" + id.toLowerCase());
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-border/50 transition-transform duration-300 ease-out will-change-transform ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto relative flex items-center justify-between px-6 py-1 min-h-[5rem] md:min-h-[6rem] lg:min-h-[7rem]">
        {/* Left nav links — desktop */}
        <ul className="hidden lg:flex items-center gap-10 flex-1">
          {leftLinks.map((l) => (
            <li key={l}>
              {routeLinks[l] ? (
                <Link
                  to={routeLinks[l]}
                  className="text-lg font-medium tracking-wider text-foreground/70 hover:text-primary transition-colors duration-300"
                >
                  {l}
                </Link>
              ) : (
                <button
                  onClick={() => scrollTo(l.toLowerCase())}
                  className="text-lg font-medium tracking-wider text-foreground/70 hover:text-primary transition-colors duration-300"
                >
                  {l}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Center Logo */}
        <Link
          to="/"
          className="flex items-center mx-auto lg:mx-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 px-8 py-1 md:py-1.5"
          aria-label="ESTIQUE"
        >
          <img
            src={ESTIQUE_LOGO_URL}
            alt="ESTIQUE"
            className="h-16 md:h-20 lg:h-24 w-auto object-contain"
          />
        </Link>

        {/* Right nav links + CTA — desktop */}
        <div className="hidden lg:flex items-center gap-10 flex-1 justify-end">
          <button
            onClick={() => scrollTo("contact")}
            className="text-lg font-medium tracking-wider text-foreground/70 hover:text-primary transition-colors duration-300"
          >
            Contact
          </button>
          <BookOnlineButton className="h-auto text-base px-9 py-5" />

        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground absolute right-4 top-1/2 -translate-y-1/2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border/50 bg-white/90 backdrop-blur-md px-4 pb-6">
          <ul className="flex flex-col gap-1 pt-4">
            {[...leftLinks, "Contact"].map((l) => (
              <li key={l}>
                {routeLinks[l] ? (
                  <Link
                    to={routeLinks[l]}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors w-full text-left py-2.5 px-2 rounded-lg hover:bg-accent/50 block"
                  >
                    {l}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollTo(l.toLowerCase())}
                    className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors w-full text-left py-2.5 px-2 rounded-lg hover:bg-accent/50"
                  >
                    {l}
                  </button>
                )}
              </li>
            ))}
            <li className="pt-2" onClick={() => setOpen(false)}>
              <BookOnlineButton fullWidth />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
