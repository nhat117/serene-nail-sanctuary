import { useParallax } from "@/hooks/useParallax";
import StarField from "@/components/StarField";

interface ParallaxDividerProps {
  image: string;
  alt?: string;
  height?: string;
  overlay?: string;
  quote?: string;
  author?: string;
}

const ParallaxDivider = ({
  image,
  alt = "",
  height = "h-64 md:h-80",
  overlay = "bg-foreground/40",
  quote,
  author,
}: ParallaxDividerProps) => {
  const p = useParallax(0.25);

  return (
    <div ref={p.ref} className={`relative ${height} overflow-hidden`}>
      {/* Parallax background image */}
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 w-full h-[130%] object-cover will-change-transform"
        style={{ transform: `translateY(${p.offset}px)`, top: "-15%" }}
      />

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlay}`} />

      {/* Stars over divider */}
      <StarField count={6} colorClass="bg-primary/30" />

      {/* Optional quote text */}
      {quote && (
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <p
            className="text-background/90 text-lg md:text-2xl lg:text-3xl max-w-2xl leading-relaxed italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            &ldquo;{quote}&rdquo;
          </p>
          {author && (
            <span className="mt-4 text-background/60 text-xs tracking-[0.2em] uppercase font-medium">
              — {author}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ParallaxDivider;
