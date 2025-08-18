import graphicAssetsManifest from "@/data/graphic-assets-manifest.json";

export interface FocusPoint {
  x: number;
  y: number;
}

export interface ManifestEntry {
  width: number;
  height: number;
  type: string;
  focus: FocusPoint | null;
}

/**
 * Get the focus point (face coordinates) for an image from the manifest
 * @param src - The image src path (e.g., "/photos/portraits/abraham-feder.webp")
 * @returns FocusPoint object with x,y coordinates (0-1 range) or null if no focus point
 */
export function getFocusPoint(src: string): FocusPoint | null {
  // Normalize the src path to match manifest keys
  const normalizedSrc = src.startsWith("/") ? src : `/${src}`;

  const manifestEntry = graphicAssetsManifest[normalizedSrc as keyof typeof graphicAssetsManifest] as
    | ManifestEntry
    | undefined;

  return manifestEntry?.focus || null;
}

/**
 * Convert focus point coordinates (0-1 range) to percentage strings for CSS
 * @param focus - FocusPoint object with x,y coordinates
 * @returns Object with xPercent and yPercent as percentage strings
 */
export function focusToPercent(focus: FocusPoint): { xPercent: string; yPercent: string } {
  return {
    xPercent: `${(focus.x * 100).toFixed(1)}%`,
    yPercent: `${(focus.y * 100).toFixed(1)}%`,
  };
}

/**
 * Get the image dimensions from the manifest
 * @param src - The image src path
 * @returns Object with width and height or null if not found
 */
export function getImageDimensions(src: string): { width: number; height: number } | null {
  const normalizedSrc = src.startsWith("/") ? src : `/${src}`;
  const manifestEntry = graphicAssetsManifest[normalizedSrc as keyof typeof graphicAssetsManifest] as
    | ManifestEntry
    | undefined;

  if (!manifestEntry) return null;

  return {
    width: manifestEntry.width,
    height: manifestEntry.height,
  };
}
