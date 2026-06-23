"use client";

import { toast } from "sonner";
import type { Product } from "@/types";
import { unitPrice } from "@/lib/utils/format";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawer } from "@/store/slices/uiSlice";

export function useCart() {
  const dispatch = useAppDispatch();

  function add(product: Product, size: string, quantity = 1, openDrawer = true) {
    const stock = product.sizes.find((s) => s.size === size)?.stock ?? 0;
    dispatch(
      addItem({
        id: `${product.id}-${size}`,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        team: product.team,
        image: "front",
        size,
        price: unitPrice(product),
        quantity,
        maxStock: stock,
      }),
    );
    toast.success("Added to cart", { description: `${product.name} · Size ${size}` });
    if (openDrawer) dispatch(setCartDrawer(true));
  }

  return { add };
}
