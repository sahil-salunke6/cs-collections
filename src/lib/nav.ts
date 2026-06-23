export interface NavLink {
  label: string;
  href: string;
}

export const primaryNav: NavLink[] = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "National Teams", href: "/national-teams" },
  { label: "Club Teams", href: "/club-teams" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Retro", href: "/retro" },
  { label: "Collections", href: "/collections" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Best Sellers", href: "/best-sellers" },
      { label: "National Teams", href: "/national-teams" },
      { label: "Club Teams", href: "/club-teams" },
      { label: "Retro Jerseys", href: "/retro" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping Info", href: "/faq" },
      { label: "Size Guide", href: "/faq" },
      { label: "Track Order", href: "/account/orders" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Collections", href: "/collections" },
      { label: "Wishlist", href: "/account/wishlist" },
      { label: "My Account", href: "/account/profile" },
    ],
  },
];
