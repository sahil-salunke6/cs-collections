/* ============================================================================
   CS Collections — Shared domain types
   These mirror the shape the future REST API will return, so the mock `lib/api`
   layer can be swapped for real endpoints without touching components.
============================================================================ */

export type TeamType = "national" | "club" | "retro";
export type ProductBadge = "new" | "bestseller" | "limited" | "retro" | "sale";
export type JerseyKit = "home" | "away" | "third" | "goalkeeper" | "training" | "special";

export interface SizeStock {
  size: string; // S, M, L, XL, XXL or numeric
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  team: string;
  teamId: string;
  type: TeamType;
  kit: JerseyKit;
  season: string; // "2024/25"
  brand: string; // Nike, adidas, Puma...
  category: string; // "Mens", "Womens", "Kids", "Retro"
  league?: string;
  confederation?: string;
  price: number;
  salePrice?: number;
  currency: string; // "USD"
  images: string[];
  video?: string;
  sizes: SizeStock[];
  colors: string[]; // hex chips
  rating: number; // 0..5
  reviewCount: number;
  tags: string[];
  badges: ProductBadge[];
  shortDescription: string;
  description: string;
  teamInfo: string;
  seasonInfo: string;
  isFeatured: boolean;
  isLimited: boolean;
  createdAt: string; // ISO
}

export interface Team {
  id: string;
  slug: string;
  name: string;
  type: TeamType;
  crest: string; // /teams/...svg
  country?: string;
  league?: string;
  confederation?: string;
  primaryColor: string;
  productCount: number;
  featured: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  body: string;
  date: string; // ISO
  verified: boolean;
  helpfulCount: number;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export interface Banner {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  align: "left" | "center" | "right";
}

export interface InstagramPost {
  id: string;
  image: string;
  href: string;
  likes: number;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

/* ---- User / commerce ---- */

export interface Address {
  id: string;
  label: string; // Home, Work
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  phone?: string;
  addresses: Address[];
}

export interface CartItem {
  id: string; // composite: productId + size
  productId: string;
  slug: string;
  name: string;
  team: string;
  image: string;
  size: string;
  price: number; // unit (sale-aware)
  quantity: number;
  maxStock: number;
}

export type OrderStatus =
  | "processing"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  team: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  number: string; // "CS-100245"
  date: string; // ISO
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  trackingNumber?: string;
}

/* ---- Listing query/result ---- */

export interface ProductQuery {
  type?: TeamType;
  teamId?: string;
  league?: string;
  brand?: string[];
  kit?: JerseyKit[];
  size?: string[];
  badge?: ProductBadge;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: ProductSort;
  page?: number;
  perPage?: number;
}

export type ProductSort =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "bestselling";

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
