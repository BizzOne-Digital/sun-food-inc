const PLACEHOLDER = "/images/placeholder-product.svg";

export function resolveImageUrl(url?: string | null): string {
  if (!url) return PLACEHOLDER;
  if (url.startsWith("/uploads/")) return PLACEHOLDER;
  return url;
}

export default resolveImageUrl;
