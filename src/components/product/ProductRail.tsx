"use client";

import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

/** Bare horizontal scrollable product strip — no header or controls.
 *  Use <ProductRailSection> when you need a title + "View all" link + arrows. */
export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-2">
      {products.map((p) => (
        <div key={p.id} className="w-[60vw] shrink-0 snap-start sm:w-[44vw] md:w-[30vw] lg:w-[23%] 3xl:w-[18%]">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
