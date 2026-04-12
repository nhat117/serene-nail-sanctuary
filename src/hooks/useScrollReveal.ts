import { useEffect, useRef } from "react";

const REVEAL_SELECTORS = [
  ".scroll-reveal",
  ".scroll-reveal-left",
  ".scroll-reveal-right",
  ".scroll-reveal-scale",
  ".img-reveal",
  ".line-expand",
].join(",");

export function useScrollReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const elements = container.querySelectorAll(REVEAL_SELECTORS);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}
