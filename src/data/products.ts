import type { Product, ProductBadge, JerseyKit, TeamType } from "@/types";
import teams from "./teams.json";

/* Team colour palettes [shirt, secondary, accent] used by the generated
   <JerseyVisual> so every product has consistent, brand-appropriate art. */
const PALETTE: Record<string, [string, string, string]> = {
  br: ["#FCE000", "#009C3B", "#002776"],
  ar: ["#75AADB", "#FFFFFF", "#0F3D7A"],
  fr: ["#1E3A8A", "#FFFFFF", "#EF4135"],
  en: ["#FFFFFF", "#CE1124", "#1E3A8A"],
  pt: ["#C8102E", "#1B5E20", "#FFD700"],
  es: ["#C60B1E", "#1A1A1A", "#FFC400"],
  de: ["#FFFFFF", "#1A1A1A", "#DD0000"],
  rma: ["#FFFFFF", "#FEBE10", "#00529F"],
  fcb: ["#A50044", "#004D98", "#FFED02"],
  mci: ["#6CABDD", "#FFFFFF", "#1C2C5B"],
  lfc: ["#C8102E", "#FFFFFF", "#00B2A9"],
  "fcb-de": ["#DC052D", "#FFFFFF", "#0066B2"],
  psg: ["#0A1A3F", "#DA291C", "#FFFFFF"],
  int: ["#0068A8", "#1A1A1A", "#FFFFFF"],
  juv: ["#111111", "#FFFFFF", "#C9A227"],
};

const teamById = Object.fromEntries(teams.map((t) => [t.id, t]));

interface Seed {
  t: string;
  k: JerseyKit;
  s: string;
  b: string;
  p: number;
  sale?: number;
  badges?: ProductBadge[];
  type?: TeamType;
  limited?: boolean;
  featured?: boolean;
}

const SEEDS: Seed[] = [
  { t: "br", k: "home", s: "2024/25", b: "Nike", p: 94.99, badges: ["bestseller"], featured: true },
  { t: "br", k: "away", s: "2024/25", b: "Nike", p: 94.99 },
  { t: "br", k: "home", s: "2002", b: "Nike", p: 119.99, type: "retro", limited: true, badges: ["retro", "limited"] },
  { t: "ar", k: "home", s: "2024/25", b: "adidas", p: 99.99, badges: ["new", "bestseller"], featured: true },
  { t: "ar", k: "away", s: "2024/25", b: "adidas", p: 94.99 },
  { t: "ar", k: "home", s: "1986", b: "adidas", p: 119.99, type: "retro", badges: ["retro"] },
  { t: "fr", k: "home", s: "2024/25", b: "Nike", p: 94.99, badges: ["bestseller"] },
  { t: "fr", k: "away", s: "2024/25", b: "Nike", p: 89.99, sale: 69.99, badges: ["sale"] },
  { t: "en", k: "home", s: "2024/25", b: "Nike", p: 94.99, badges: ["new"] },
  { t: "pt", k: "home", s: "2024/25", b: "Nike", p: 94.99 },
  { t: "es", k: "home", s: "2024/25", b: "adidas", p: 94.99 },
  { t: "de", k: "home", s: "2024/25", b: "adidas", p: 94.99, badges: ["bestseller"] },
  { t: "rma", k: "home", s: "2024/25", b: "adidas", p: 109.99, badges: ["bestseller", "new"], featured: true },
  { t: "rma", k: "away", s: "2024/25", b: "adidas", p: 104.99 },
  { t: "rma", k: "home", s: "2001/02", b: "adidas", p: 129.99, type: "retro", limited: true, badges: ["retro", "limited"] },
  { t: "fcb", k: "home", s: "2024/25", b: "Nike", p: 109.99, badges: ["bestseller"], featured: true },
  { t: "fcb", k: "away", s: "2024/25", b: "Nike", p: 104.99, badges: ["new"] },
  { t: "fcb", k: "home", s: "2008/09", b: "Nike", p: 129.99, type: "retro", badges: ["retro"] },
  { t: "mci", k: "home", s: "2024/25", b: "Puma", p: 104.99, badges: ["new"], featured: true },
  { t: "mci", k: "away", s: "2024/25", b: "Puma", p: 99.99, sale: 79.99, badges: ["sale"] },
  { t: "lfc", k: "home", s: "2024/25", b: "Nike", p: 104.99, badges: ["bestseller"], featured: true },
  { t: "lfc", k: "away", s: "2024/25", b: "Nike", p: 99.99 },
  { t: "psg", k: "home", s: "2024/25", b: "Nike", p: 109.99, limited: true, badges: ["limited", "new"], featured: true },
  { t: "psg", k: "away", s: "2024/25", b: "Nike", p: 104.99 },
  { t: "fcb-de", k: "home", s: "2024/25", b: "adidas", p: 104.99, badges: ["bestseller"] },
  { t: "int", k: "home", s: "2024/25", b: "Nike", p: 104.99 },
  { t: "juv", k: "home", s: "2024/25", b: "adidas", p: 104.99, badges: ["new"] },
  { t: "juv", k: "home", s: "1995/96", b: "Kappa", p: 124.99, type: "retro", badges: ["retro"] },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];
const kitLabel: Record<JerseyKit, string> = {
  home: "Home",
  away: "Away",
  third: "Third",
  goalkeeper: "Goalkeeper",
  training: "Training",
  special: "Special Edition",
};

// deterministic pseudo-random in [0,1) from a string seed
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function buildProducts(): Product[] {
  return SEEDS.map((seed, i) => {
    const team = teamById[seed.t];
    const type: TeamType = seed.type ?? team.type as TeamType;
    const isRetro = type === "retro";
    const slug = `${team.slug}-${seed.s.replace("/", "-")}-${seed.k}${isRetro ? "-retro" : ""}`;
    const name = isRetro
      ? `${team.name} ${seed.s} Retro Jersey`
      : `${team.name} ${seed.s} ${kitLabel[seed.k]} Jersey`;

    const base = PALETTE[seed.t] ?? ["#0F5132", "#FFFFFF", "#FF2D75"];
    const colors = seed.k === "away" ? [base[1], base[0], base[2]] : base;

    const r = rng(slug);
    const rating = Math.round((4.1 + r * 0.85) * 10) / 10;
    const reviewCount = 18 + Math.floor(r * 460);

    // newest products first; "new" badge => most recent
    const created = new Date(2026, 5, 15);
    created.setDate(created.getDate() - i * 9);

    const sizes = SIZES.map((size) => ({
      size,
      stock: size === "XXL" && r > 0.7 ? 0 : 4 + Math.floor(rng(slug + size) * 40),
    }));

    const badges = seed.badges ?? [];

    return {
      id: `p${(i + 1).toString().padStart(3, "0")}`,
      slug,
      name,
      team: team.name,
      teamId: team.id,
      type,
      kit: seed.k,
      season: seed.s,
      brand: seed.b,
      category: "Mens",
      league: team.league,
      confederation: team.confederation,
      price: 1100,
      salePrice: seed.sale != null ? 999 : undefined,
      currency: "INR",
      images: ["front", "back", "detail"],
      video: seed.limited || seed.featured ? "showcase" : undefined,
      sizes,
      colors,
      rating,
      reviewCount,
      tags: [team.name, seed.b, kitLabel[seed.k], seed.s, type],
      badges,
      shortDescription: `${seed.b} ${isRetro ? "Heritage" : "Stadium"} ${kitLabel[seed.k]} shirt — ${seed.s} season.`,
      description:
        `The official ${team.name} ${seed.s} ${isRetro ? "retro " : ""}${kitLabel[seed.k].toLowerCase()} jersey by ${seed.b}. ` +
        `Engineered with sweat-wicking performance fabric and a tailored athletic fit, finished with the club crest, ` +
        `manufacturer mark and authentic detailing. ${isRetro ? "A faithful reissue of a fan-favourite classic." : "Built for matchday and everyday wear."}`,
      teamInfo:
        `${team.name} competes in ${team.league ?? team.confederation}. ` +
        `Recognised worldwide for an iconic identity, the ${colors.length ? "" : ""}club/nation colours are a global symbol of the game.`,
      seasonInfo: isRetro
        ? `A heritage reissue celebrating the ${seed.s} campaign — one of the most collectible kits in the archive.`
        : `Part of the ${seed.s} on-pitch collection, worn by the first team in domestic and international competition.`,
      isFeatured: !!seed.featured,
      isLimited: !!seed.limited,
      createdAt: created.toISOString(),
    } satisfies Product;
  });
}

export const products: Product[] = buildProducts();
