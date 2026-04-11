import { useRef, useEffect, useState } from "react";

/**
 * Returns a ref to attach to an element and a Y offset value
 * that updates on scroll for a parallax effect.
 * @param speed - Parallax speed factor (0.1 = subtle, 0.5 = dramatic). Default 0.15
 */
export function useParallax(speed = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const windowH = window.innerHeight;
            // Element center relative to viewport center
            const center = rect.top + rect.height / 2 - windowH / 2;
            setOffset(center * speed);
          }
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial position
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return { ref, offset };
}
