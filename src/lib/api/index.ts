import type {
  Product,
  Team,
  Review,
  FaqItem,
  Order,
  User,
  Paginated,
  ProductQuery,
  ProductSort,
} from "@/types";
import { products } from "@/data/products";
import teamsData from "@/data/teams.json";
import { reviews } from "@/data/reviews";
import faqData from "@/data/faq.json";
import { banners, collections, instagram } from "@/data/content";
import { mockUser, mockOrders } from "@/data/account";
import { unitPrice } from "@/lib/utils/format";

const teams = teamsData as Team[];
const faqs = faqData as FaqItem[];

/* Simulated network latency so the UI is built against realistic async states.
   Swap these functions for `fetch()` calls when the backend lands. */
const delay = (ms = 220) => new Promise((r) => setTimeout(r, ms));

function sortProducts(list: Product[], sort: ProductSort = "featured") {
  const arr = [...list];
  switch (sort) {
    case "newest":
      return arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "price-asc":
      return arr.sort((a, b) => unitPrice(a) - unitPrice(b));
    case "price-desc":
      return arr.sort((a, b) => unitPrice(b) - unitPrice(a));
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating);
    case "bestselling":
      return arr.sort((a, b) => b.reviewCount - a.reviewCount);
    case "featured":
    default:
      return arr.sort(
        (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.rating - a.rating,
      );
  }
}

function applyFilters(list: Product[], q: ProductQuery) {
  return list.filter((p) => {
    if (q.type && p.type !== q.type) return false;
    if (q.teamId && p.teamId !== q.teamId) return false;
    if (q.league && p.league !== q.league) return false;
    if (q.badge && !p.badges.includes(q.badge)) return false;
    if (q.brand?.length && !q.brand.includes(p.brand)) return false;
    if (q.kit?.length && !q.kit.includes(p.kit)) return false;
    if (q.size?.length && !q.size.some((s) => p.sizes.some((ps) => ps.size === s && ps.stock > 0)))
      return false;
    if (q.minPrice != null && unitPrice(p) < q.minPrice) return false;
    if (q.maxPrice != null && unitPrice(p) > q.maxPrice) return false;
    if (q.search) {
      const hay = `${p.name} ${p.team} ${p.brand} ${p.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q.search.toLowerCase())) return false;
    }
    return true;
  });
}

export async function getProducts(q: ProductQuery = {}): Promise<Paginated<Product>> {
  await delay();
  const filtered = applyFilters(products, q);
  const sorted = sortProducts(filtered, q.sort);
  const page = q.page ?? 1;
  const perPage = q.perPage ?? 12;
  const start = (page - 1) * perPage;
  const items = sorted.slice(start, start + perPage);
  return {
    items,
    total: sorted.length,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(sorted.length / perPage)),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  await delay(160);
  return products
    .filter((p) => p.id !== product.id && (p.teamId === product.teamId || p.type === product.type))
    .slice(0, limit);
}

export async function getFeaturedProducts(limit = 8) {
  await delay(160);
  return products.filter((p) => p.isFeatured).slice(0, limit);
}
export async function getNewArrivals(limit = 8) {
  await delay(160);
  return sortProducts(products, "newest").slice(0, limit);
}
export async function getBestSellers(limit = 8) {
  await delay(160);
  return products.filter((p) => p.badges.includes("bestseller")).slice(0, limit);
}
export async function getTrending(limit = 8) {
  await delay(160);
  return sortProducts(products, "bestselling").slice(0, limit);
}
export async function getLimitedEdition(limit = 6) {
  await delay(160);
  return products.filter((p) => p.isLimited).slice(0, limit);
}
export async function getRetro(limit = 8) {
  await delay(160);
  return products.filter((p) => p.type === "retro").slice(0, limit);
}

export async function getTeams(type?: Team["type"]): Promise<Team[]> {
  await delay(140);
  return type ? teams.filter((t) => t.type === type) : teams;
}
export async function getFeaturedTeams(type?: Team["type"]) {
  await delay(140);
  return teams.filter((t) => t.featured && (!type || t.type === type));
}
export async function getTeamsBySlugs(slugs: string[], pool: Team[] = teams): Promise<Team[]> {
  await delay(100);
  return slugs.map((slug) => pool.find((t) => t.slug === slug)).filter(Boolean) as Team[];
}
export async function getTeamBySlug(slug: string): Promise<Team | null> {
  await delay(120);
  return teams.find((t) => t.slug === slug) ?? null;
}

export async function getReviews(productId: string): Promise<Review[]> {
  await delay(140);
  return reviews
    .filter((r) => r.productId === productId)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getFaqs(): Promise<FaqItem[]> {
  await delay(120);
  return faqs;
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(180);
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return products.filter((p) =>
    `${p.name} ${p.team} ${p.brand} ${p.tags.join(" ")}`.toLowerCase().includes(q),
  );
}

export async function getUser(): Promise<User> {
  await delay(120);
  return mockUser;
}
export async function getOrders(): Promise<Order[]> {
  await delay(160);
  return [...mockOrders].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
export async function getOrderById(id: string): Promise<Order | null> {
  await delay(140);
  return mockOrders.find((o) => o.id === id || o.number === id) ?? null;
}

export async function getBanners() {
  await delay(80);
  return banners;
}
export async function getCollections() {
  await delay(80);
  return collections;
}
export async function getInstagram() {
  await delay(80);
  return instagram;
}
