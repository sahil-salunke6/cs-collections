import "server-only";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { revalidatePath } from "next/cache";
import type { Product, Team } from "@/types";
import { products as baseProducts } from "@/data/products";

const CMS_PATH = join(process.cwd(), "src", "data", "cms.json");
export const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

export interface CmsAnnouncement {
  enabled: boolean;
  text: string;
  link: string | null;
}

export interface CmsHeroStat {
  value: string;
  label: string;
}

export interface CmsHero {
  badge: string;
  line1: string;
  line2: string;
  subtext: string;
  cta1Text: string;
  cta1Href: string;
  cta2Text: string;
  cta2Href: string;
  stats: CmsHeroStat[];
}

export interface CmsHeroTile {
  image: string | null;  // uploaded URL; null = use JerseyVisual fallback
  colors: string[];
  view: "front" | "back";
  name?: string;
  number?: number;
}

export interface CmsLimitedBanner {
  eyebrow: string;
  headline: string;
  subtext: string;
  ctaText: string;
  ctaHref: string;
}

export interface CmsCollection {
  slug: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface CmsFeaturedTeams {
  national: string[]; // team slugs, display order
  club: string[];
}

export interface CmsReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  text: string;
}

export interface CmsInstagramPost {
  id: string;
  image: string | null;
  href: string;
  likes: number;
}

export interface CmsData {
  announcement: CmsAnnouncement;
  hero: CmsHero;
  heroTiles: CmsHeroTile[];
  limitedBanner: CmsLimitedBanner;
  collections: CmsCollection[];
  featuredTeams: CmsFeaturedTeams;
  customTeams: Team[];
  teamOverrides: Record<string, Partial<Team>>;
  removedTeamIds: string[];
  reviews: CmsReview[];
  instagramPosts: CmsInstagramPost[];
  productOverrides: Record<string, Partial<Product>>;
  newProducts: Product[];
}

const DEFAULT: CmsData = {
  announcement: {
    enabled: true,
    text: "100% Authentic Football Jerseys · Shipping across India · Pay via UPI, Cards & Net Banking",
    link: null,
  },
  hero: {
    badge: "2024/25 On-Pitch Collection",
    line1: "Wear the Badge.",
    line2: "Own the Moment.",
    subtext:
      "Authentic national & club jerseys — engineered for matchday and built to last. Premium, fast, and 100% genuine.",
    cta1Text: "Shop New Arrivals",
    cta1Href: "/new-arrivals",
    cta2Text: "Explore Retro",
    cta2Href: "/retro",
    stats: [
      { value: "100%", label: "Authentic" },
      { value: "Pan-India", label: "Fast delivery" },
      { value: "4.9★", label: "Customer rating" },
    ],
  },
  heroTiles: [
    { image: null, colors: ["#FCE000", "#009C3B", "#002776"], view: "front" },
    { image: null, colors: ["#FFFFFF", "#FEBE10", "#00529F"], view: "back", name: "Madrid", number: 7 },
    { image: null, colors: ["#A50044", "#004D98", "#FFED02"], view: "front" },
    { image: null, colors: ["#6CABDD", "#FFFFFF", "#1C2C5B"], view: "front" },
  ],
  limitedBanner: {
    eyebrow: "Limited Edition",
    headline: "Rare kits. Limited runs. Gone fast.",
    subtext: "Special-edition and limited drops you won't find anywhere else. Secure yours before they sell out.",
    ctaText: "Shop Limited Edition",
    ctaHref: "/products?badge=limited",
  },
  collections: [
    { slug: "national-teams", title: "National Teams", subtitle: "Represent your nation", href: "/national-teams" },
    { slug: "club-teams", title: "Club Teams", subtitle: "Club colours, worldwide", href: "/club-teams" },
    { slug: "retro", title: "Retro Jerseys", subtitle: "Heritage classics reissued", href: "/retro" },
    { slug: "new-arrivals", title: "New Arrivals", subtitle: "Freshly dropped", href: "/new-arrivals" },
  ],
  featuredTeams: {
    national: ["brazil", "argentina", "france", "england"],
    club: ["real-madrid", "barcelona", "manchester-city", "liverpool", "paris-saint-germain"],
  },
  customTeams: [],
  teamOverrides: {},
  removedTeamIds: [],
  reviews: [
    { id: "r1", author: "James W.", location: "London, UK", rating: 5, text: "The quality is unreal — feels exactly like the on-pitch version. Shipping was lightning fast." },
    { id: "r2", author: "Camila S.", location: "São Paulo, BR", rating: 5, text: "My Brazil retro shirt is stunning. The detailing and fabric are top tier. Will buy again." },
    { id: "r3", author: "Tariq A.", location: "Dubai, UAE", rating: 5, text: "Best jersey store I've used. Authentic, beautifully packaged, and the fit guide was spot on." },
    { id: "r4", author: "Noah L.", location: "Berlin, DE", rating: 4, text: "Great selection of clubs and nations. The limited editions sell out fast — grab them quick!" },
  ],
  instagramPosts: [
    { id: "ig1", image: null, href: "https://instagram.com/_cs_collections_", likes: 420 },
    { id: "ig2", image: null, href: "https://instagram.com/_cs_collections_", likes: 557 },
    { id: "ig3", image: null, href: "https://instagram.com/_cs_collections_", likes: 694 },
    { id: "ig4", image: null, href: "https://instagram.com/_cs_collections_", likes: 831 },
    { id: "ig5", image: null, href: "https://instagram.com/_cs_collections_", likes: 968 },
    { id: "ig6", image: null, href: "https://instagram.com/_cs_collections_", likes: 1105 },
    { id: "ig7", image: null, href: "https://instagram.com/_cs_collections_", likes: 1242 },
    { id: "ig8", image: null, href: "https://instagram.com/_cs_collections_", likes: 1379 },
  ],
  productOverrides: {},
  newProducts: [],
};

export function getCmsData(): CmsData {
  try {
    if (!existsSync(CMS_PATH)) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(readFileSync(CMS_PATH, "utf-8")) };
  } catch {
    return DEFAULT;
  }
}

export function saveCmsData(data: CmsData): void {
  writeFileSync(CMS_PATH, JSON.stringify(data, null, 2), "utf-8");
  revalidatePath("/", "layout");
  revalidatePath("/products", "layout");
}

export function ensureUploadsDir(): void {
  if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
}

/** Returns base products merged with any CMS overrides + new admin-created products. */
export function getCmsProductCatalog(base: Product[]): Product[] {
  const cms = getCmsData();
  const merged = base.map((p) =>
    cms.productOverrides[p.id] ? { ...p, ...cms.productOverrides[p.id] } : p,
  );
  return [...merged, ...cms.newProducts];
}

/** Returns base teams (with any CMS overrides applied) merged with admin-created custom teams. */
export function getCmsTeamCatalog(base: Team[]): Team[] {
  const cms = getCmsData();
  const removed = new Set(cms.removedTeamIds ?? []);
  const merged = base
    .filter((t) => !removed.has(t.id))
    .map((t) => (cms.teamOverrides[t.id] ? { ...t, ...cms.teamOverrides[t.id] } : t));
  return [...merged, ...cms.customTeams];
}

/** A single product from the live catalog (base + overrides + new), by slug. */
export function getCmsProductBySlug(slug: string): Product | null {
  return getCmsProductCatalog(baseProducts).find((p) => p.slug === slug) ?? null;
}

export interface StockLine {
  productId: string;
  size: string;
  quantity: number;
}

/**
 * Reduces stock for the given order lines and persists the change.
 * Base products are updated via productOverrides (a full sizes array); admin-created
 * products are updated in place. Returns the lines that could not be fully fulfilled.
 */
export function decrementStock(lines: StockLine[]): void {
  if (!lines?.length) return;
  const cms = getCmsData();

  // Group requested quantities by product → size.
  const byProduct = new Map<string, Map<string, number>>();
  for (const line of lines) {
    if (!line?.productId || !line?.size || !line?.quantity) continue;
    const sizes = byProduct.get(line.productId) ?? new Map<string, number>();
    sizes.set(line.size, (sizes.get(line.size) ?? 0) + line.quantity);
    byProduct.set(line.productId, sizes);
  }

  const productOverrides = { ...cms.productOverrides };
  let newProducts = cms.newProducts;

  for (const [productId, sizeQty] of byProduct) {
    const newIdx = cms.newProducts.findIndex((p) => p.id === productId);
    if (newIdx >= 0) {
      const p = cms.newProducts[newIdx];
      const sizes = p.sizes.map((s) =>
        sizeQty.has(s.size) ? { ...s, stock: Math.max(0, s.stock - sizeQty.get(s.size)!) } : s,
      );
      newProducts = newProducts.map((np, i) => (i === newIdx ? { ...np, sizes } : np));
    } else {
      const base = baseProducts.find((p) => p.id === productId);
      const current = base
        ? productOverrides[productId]
          ? { ...base, ...productOverrides[productId] }
          : base
        : null;
      if (!current?.sizes) continue;
      const sizes = current.sizes.map((s) =>
        sizeQty.has(s.size) ? { ...s, stock: Math.max(0, s.stock - sizeQty.get(s.size)!) } : s,
      );
      productOverrides[productId] = { ...(productOverrides[productId] ?? {}), sizes };
    }
  }

  saveCmsData({ ...cms, productOverrides, newProducts });
}
