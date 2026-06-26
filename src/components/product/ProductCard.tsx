"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, X } from "lucide-react";
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
  const hasStock = product.sizes.some((s) => s.stock > 0);
  const [picking, setPicking] = useState(false);
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

        {/* Quick Add — slides up from bottom on hover; tap reveals a size picker */}
        {hasStock && !picking && (
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-full bg-[#111111] py-2.5 text-sm font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-white dark:text-[#111111]"
          >
            <ShoppingBag className="size-4" />
            Quick add
          </button>
        )}

        {/* Size picker — choose a size, then it's added to the cart */}
        {hasStock && picking && (
          <div className="absolute inset-x-3 bottom-3 rounded-xl bg-[#111111]/95 p-2.5 shadow-lg backdrop-blur dark:bg-white/95">
            <div className="mb-2 flex items-center justify-between px-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/80 dark:text-[#111111]/80">
                Select size
              </span>
              <button
                type="button"
                onClick={() => setPicking(false)}
                aria-label="Close size picker"
                className="text-white/70 hover:text-white dark:text-[#111111]/70 dark:hover:text-[#111111]"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((s) => {
                const out = s.stock === 0;
                return (
                  <button
                    key={s.size}
                    type="button"
                    disabled={out}
                    onClick={() => {
                      add(product, s.size);
                      setPicking(false);
                    }}
                    className={cn(
                      "min-w-9 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors",
                      out
                        ? "cursor-not-allowed text-white/30 line-through dark:text-[#111111]/30"
                        : "bg-white/10 text-white hover:bg-white hover:text-[#111111] dark:bg-[#111111]/10 dark:text-[#111111] dark:hover:bg-[#111111] dark:hover:text-white",
                    )}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
          </div>
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
