"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils/cn";
import { discountPct } from "@/lib/utils/format";
import { ProductImage } from "@/components/common/ProductImage";
import { Price } from "@/components/common/Price";
import { Rating } from "@/components/common/Rating";
import { ProductBadges } from "./ProductBadges";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useCart } from "@/lib/hooks/useCart";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { isWishlisted, toggle } = useWishlist();
  const { add } = useCart();
  const wished = isWishlisted(product.id);
  const firstSize = product.sizes.find((s) => s.stock > 0)?.size;
  const off = discountPct(product);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className={cn("group relative flex flex-col", className)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          <div className="transition-transform duration-500 ease-out group-hover:scale-[1.04]">
            <ProductImage images={product.images} colors={product.colors} view="front" alt={product.name} />
          </div>
        </Link>

        <ProductBadges badges={product.badges} className="absolute left-3 top-3 flex flex-col gap-1.5" />

        {/* Wishlist — always visible, top-right */}
        <button
          type="button"
          onClick={() => toggle(product.id, product.name)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-border bg-white/90 text-gray-800 shadow-sm backdrop-blur transition-colors hover:bg-white dark:bg-neutral-900/90 dark:text-white dark:hover:bg-neutral-900"
        >
          <Heart className={cn("size-4", wished && "fill-accent text-accent")} />
        </button>

        {/* Sale badge — sits below the heart so they don't overlap */}
        {off > 0 && (
          <span className="absolute right-3 top-14 rounded-full bg-destructive px-2 py-0.5 text-[11px] font-bold text-destructive-foreground">
            -{off}%
          </span>
        )}

        {/* Quick Add — slides up from bottom on hover, no conflict with heart */}
        {firstSize && (
          <button
            type="button"
            onClick={() => add(product, firstSize)}
            className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-full bg-[#111111] py-2.5 text-sm font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-white dark:text-[#111111]"
          >
            <ShoppingBag className="size-4" />
            Quick add
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.team}</span>
          <Rating value={product.rating} size="sm" />
        </div>
        <Link href={`/products/${product.slug}`} className="line-clamp-1 font-semibold text-foreground hover:text-primary">
          {product.name}
        </Link>
        <div className="mt-0.5 flex items-center justify-between">
          <Price price={product.price} salePrice={product.salePrice} />
          <span className="text-xs text-muted-foreground">{product.brand}</span>
        </div>
      </div>
    </motion.article>
  );
}
