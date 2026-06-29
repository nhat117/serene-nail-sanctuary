// Cloudinary URL helper — builds delivery URLs with smart defaults
// (auto-format, auto-quality) so images are served as AVIF/WebP when the
// browser supports it, with no extra config per call.
//
// Set VITE_CLOUDINARY_CLOUD_NAME in your .env. Defaults to the existing
// Estique cloud so the site still works without a local override.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "dzzoimn4v";

type Options = {
  width?: number;
  height?: number;
  /** Crop mode. Default "fill" with auto gravity. */
  crop?: "fill" | "fit" | "scale" | "thumb" | "limit";
  gravity?: "auto" | "face" | "center";
  /** Override the auto quality. Accepts numbers (1–100) or Cloudinary keywords. */
  quality?: "auto" | "auto:eco" | "auto:good" | "auto:best" | number;
  /** Override the auto format. */
  format?: "auto" | "jpg" | "png" | "webp" | "avif";
  /** Extra raw transforms appended to the end (e.g. "e_colorize:100,co_rgb:CCB68D"). */
  raw?: string;
};

export function cld(publicId: string, opts: Options = {}): string {
  const {
    width,
    height,
    crop = "fill",
    gravity = "auto",
    quality = "auto",
    format = "auto",
    raw,
  } = opts;

  const parts: string[] = [`f_${format}`, `q_${quality}`];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (width || height) parts.push(`c_${crop}`, `g_${gravity}`);
  if (raw) parts.push(raw);

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${parts.join(",")}/${publicId}`;
}

/** The Estique logo, recoloured to the brass primary on the fly. */
export const ESTIQUE_LOGO_URL = cld("v1778645820/estique_logo_transparent_kwyboz.png", {
  raw: "e_colorize:100,co_rgb:B08D57",
});
