import type { Review } from "@/types";
import { products } from "./products";

const AUTHORS = [
  "Marcus T.", "Sofia R.", "Liam K.", "Amara O.", "Diego F.", "Yuki N.",
  "Hannah B.", "Omar S.", "Chloe W.", "Rohan P.", "Elena V.", "Noah D.",
];
const TITLES = [
  "Exactly what I wanted", "Premium quality", "Perfect fit", "Matchday ready",
  "Better than expected", "A collector's dream", "Crisp detailing", "Fast and authentic",
];
const BODIES = [
  "Fabric feels genuinely premium and the print is razor sharp. True to size.",
  "Shipping was quick and the packaging felt high-end. Crest and badges are immaculate.",
  "Wore it to the match and got so many compliments. Breathable and comfortable.",
  "The colours pop even more in person. Stitching is clean throughout.",
  "Sizing guide was spot on. Fits like a proper athletic jersey, not boxy.",
  "Been collecting for years and this is one of the best reissues I've owned.",
];

function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export const reviews: Review[] = products.flatMap((p) => {
  const count = 2 + Math.floor(rng(p.id) * 3); // 2-4 reviews each
  return Array.from({ length: count }, (_, j) => {
    const r = rng(p.id + j);
    const d = new Date(2026, 4, 20);
    d.setDate(d.getDate() - Math.floor(r * 180));
    return {
      id: `${p.id}-r${j + 1}`,
      productId: p.id,
      author: AUTHORS[Math.floor(rng(p.id + "a" + j) * AUTHORS.length)],
      rating: r > 0.85 ? 4 : 5,
      title: TITLES[Math.floor(rng(p.id + "t" + j) * TITLES.length)],
      body: BODIES[Math.floor(rng(p.id + "b" + j) * BODIES.length)],
      date: d.toISOString(),
      verified: r > 0.2,
      helpfulCount: Math.floor(r * 40),
    } satisfies Review;
  });
});
