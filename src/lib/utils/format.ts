export function formatPrice(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Effective unit price (sale-aware). */
export function unitPrice(p: { price: number; salePrice?: number }) {
  return p.salePrice ?? p.price;
}

export function discountPct(p: { price: number; salePrice?: number }) {
  if (!p.salePrice) return 0;
  return Math.round(((p.price - p.salePrice) / p.price) * 100);
}
