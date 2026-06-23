import type { Banner, Collection, InstagramPost } from "@/types";

export const banners: Banner[] = [
  {
    id: "b1",
    eyebrow: "2024/25 On-Pitch Collection",
    title: "Wear the Badge.\nOwn the Moment.",
    subtitle:
      "Authentic national and club jerseys, engineered for matchday and built to last.",
    cta: "Shop New Arrivals",
    href: "/new-arrivals",
    image: "pitch",
    align: "left",
  },
  {
    id: "b2",
    eyebrow: "Limited Edition",
    title: "Retro Reissues",
    subtitle: "Iconic kits from the archive — back for a limited run.",
    cta: "Explore Retro",
    href: "/retro",
    image: "retro",
    align: "left",
  },
];

export const collections: Collection[] = [
  { id: "c1", slug: "national-teams", title: "National Teams", subtitle: "Represent your nation", image: "national", href: "/national-teams" },
  { id: "c2", slug: "club-teams", title: "Club Teams", subtitle: "Club colours, worldwide", image: "club", href: "/club-teams" },
  { id: "c3", slug: "retro", title: "Retro Jerseys", subtitle: "Heritage classics reissued", image: "retro", href: "/retro" },
  { id: "c4", slug: "new-arrivals", title: "New Arrivals", subtitle: "Freshly dropped", image: "new", href: "/new-arrivals" },
];

export const instagram: InstagramPost[] = Array.from({ length: 8 }, (_, i) => ({
  id: `ig${i + 1}`,
  image: `ig-${i + 1}`,
  href: "https://instagram.com",
  likes: 420 + i * 137,
}));
