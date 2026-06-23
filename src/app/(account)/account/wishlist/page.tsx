"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { products } from "@/data/products";
import { useAppSelector } from "@/store/hooks";
import { selectWishlistIds } from "@/store/selectors";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const ids = useAppSelector(selectWishlistIds);
  const items = products.filter((p) => ids.includes(p.id));

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Tap the heart on any jersey to save it here for later."
        action={
          <Button asChild>
            <Link href="/new-arrivals">Find your kit</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Saved Jerseys ({items.length})</h2>
      </div>
      <ProductGrid products={items} cols="compact" />
    </div>
  );
}
