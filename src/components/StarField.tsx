import { useMemo } from "react";

type StarVariant = "twinkle" | "drift" | "shimmer";

interface Star {
  id: number;
  size: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
  variant: StarVariant;
  shape: "star-shape" | "star-diamond" | "rounded-full";
  opacity: number;
}

interface StarFieldProps {
  /** Number of stars to render */
  count?: number;
  /** Base color class — uses primary by default */
  colorClass?: string;
  /** Extra class on the container */
  className?: string;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const animations: Record<StarVariant, string> = {
  twinkle: "starTwinkle",
  drift: "starDrift",
  shimmer: "starShimmer",
};

const shapes = ["star-shape", "star-diamond", "rounded-full"] as const;
const variants: StarVariant[] = ["twinkle", "drift", "shimmer"];

const StarField = ({
  count = 12,
  colorClass = "bg-primary/20",
  className = "",
}: StarFieldProps) => {
  const stars: Star[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const r = (n: number) => seededRandom(i * 31 + n * 7);
      return {
        id: i,
        size: 3 + r(1) * 5,
        left: `${r(2) * 100}%`,
        top: `${r(3) * 100}%`,
        delay: r(4) * 6,
        duration: 3 + r(5) * 5,
        variant: variants[Math.floor(r(6) * variants.length)],
        shape: shapes[Math.floor(r(7) * shapes.length)],
        opacity: 0.15 + r(8) * 0.35,
      };
    });
  }, [count]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute ${star.shape} ${colorClass}`}
          style={{
            width: star.size,
            height: star.size,
            left: star.left,
            top: star.top,
            opacity: 0,
            animation: `${animations[star.variant]} ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default StarField;
