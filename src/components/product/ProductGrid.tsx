import type { Product } from "@/types";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  className,
  cols = "default",
}: {
  products: Product[];
  className?: string;
  cols?: "default" | "compact";
}) {
  return (
    <div
      className={cn(
        "grid gap-x-5 gap-y-8",
        cols === "default"
          ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6",
        className,
      )}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}
