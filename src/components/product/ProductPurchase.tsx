"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart, ShoppingBag, Truck, ShieldCheck, CreditCard, Check } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/common/Rating";
import { Price } from "@/components/common/Price";
import { QtyStepper } from "@/components/common/QtyStepper";
import { ProductBadges } from "./ProductBadges";
import { SizeGuide } from "./SizeGuide";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";

export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const wished = isWishlisted(product.id);

  const maxStock = product.sizes.find((s) => s.size === size)?.stock ?? 0;

  function requireSize() {
    if (!size) {
      toast.error("Please select a size");
      return false;
    }
    return true;
  }

  function handleAdd(openDrawer = true) {
    if (!requireSize()) return false;
    add(product, size!, qty, openDrawer);
    return true;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{product.team}</span>
          <ProductBadges badges={product.badges} className="flex gap-1.5" />
        </div>
        <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight sm:text-3xl">{product.name}</h1>
        <div className="mt-3 flex items-center gap-4">
          <Rating value={product.rating} count={product.reviewCount} size="md" />
          <span className="text-sm text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">{product.brand}</span>
        </div>
      </div>

      <Price price={product.price} salePrice={product.salePrice} size="lg" />

      <p className="text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>

      {/* colour chips */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Colourway:</span>
        <div className="flex gap-1.5">
          {product.colors.map((c) => (
            <span key={c} className="size-6 rounded-full border border-border" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>

      {/* size selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Select Size</span>
          <SizeGuide />
        </div>
        <div className="grid grid-cols-5 gap-2">
          {product.sizes.map((s) => {
            const out = s.stock === 0;
            const selected = size === s.size;
            return (
              <button
                key={s.size}
                disabled={out}
                onClick={() => {
                  setSize(s.size);
                  setQty(1);
                }}
                className={cn(
                  "relative flex h-12 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
                  out && "cursor-not-allowed text-muted-foreground/50 line-through",
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground",
                )}
              >
                {s.size}
              </button>
            );
          })}
        </div>
        {size && maxStock <= 5 && maxStock > 0 && (
          <p className="text-xs font-medium text-warning">Only {maxStock} left in size {size}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold">Quantity</span>
        <QtyStepper value={qty} onChange={setQty} max={Math.max(1, maxStock)} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Button size="xl" className="flex-1" onClick={() => handleAdd(true)}>
            <ShoppingBag className="size-5" /> Add to Cart
          </Button>
          <Button
            size="xl"
            variant="outline"
            aria-label="Add to wishlist"
            onClick={() => toggle(product.id, product.name)}
            className="px-5"
          >
            <Heart className={cn("size-5", wished && "fill-accent text-accent")} />
          </Button>
        </div>
        <Button
          size="xl"
          variant="accent"
          onClick={() => {
            if (handleAdd(false)) router.push("/checkout");
          }}
        >
          Buy Now
        </Button>
      </div>

      <ul className="grid grid-cols-1 gap-2 rounded-2xl border border-border bg-card p-4 text-sm sm:grid-cols-3">
        {[
          { icon: Truck, label: "Flat ₹100 shipping" },
          { icon: ShieldCheck, label: "100% authentic" },
          { icon: CreditCard, label: "UPI · Cards · Net Banking" },
        ].map((b) => (
          <li key={b.label} className="flex items-center gap-2 text-muted-foreground">
            <b.icon className="size-4 text-primary" /> {b.label}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 text-sm text-success">
        <Check className="size-4" /> In stock — ships within 24 hours
      </div>
    </div>
  );
}
