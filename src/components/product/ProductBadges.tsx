import type { ProductBadge } from "@/types";
import { Badge } from "@/components/ui/badge";

const LABELS: Record<ProductBadge, string> = {
  new: "New",
  bestseller: "Best Seller",
  limited: "Limited",
  retro: "Retro",
  sale: "Sale",
};

export function ProductBadges({ badges, className }: { badges: ProductBadge[]; className?: string }) {
  if (!badges.length) return null;
  return (
    <div className={className}>
      {badges.slice(0, 2).map((b) => (
        <Badge key={b} variant={b}>
          {LABELS[b]}
        </Badge>
      ))}
    </div>
  );
}
