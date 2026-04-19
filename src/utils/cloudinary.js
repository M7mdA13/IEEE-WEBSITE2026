/**
 * Transform a Cloudinary URL to serve an auto-format, auto-quality image
 * at the specified max width. Falls through unchanged for non-Cloudinary URLs.
 */
export function cloudinaryUrl(src, width = 800) {
  if (!src || !src.includes('res.cloudinary.com')) return src;
  // Skip if transformation params already present (f_auto, q_auto, w_800 etc.)
  // Transform params: letter + underscore. Version strings: v + digits (no underscore).
  if (/\/upload\/[a-z]_/.test(src)) return src;
  return src.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}
