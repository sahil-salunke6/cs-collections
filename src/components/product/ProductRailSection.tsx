"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils/cn";
import { ProductCard } from "./ProductCard";

interface Props {
  eyebrow?: string;
  title?: string;
  href?: string;
  hrefLabel?: string;
  products: Product[];
  className?: string;
  /** "light" = white buttons for use on dark/brand-gradient backgrounds */
  controlVariant?: "default" | "light";
}

/**
 * A complete product rail section: section header (optional), "View all" link, and
 * scroll arrows all in a single header row — so the arrows never overlap the link.
 */
export function ProductRailSection({
  eyebrow,
  title,
  href,
  hrefLabel = "View all",
  products,
  className,
  controlVariant = "default",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  }

  const btnCls = cn(
    "flex size-10 items-center justify-center rounded-full border transition-colors",
    controlVariant === "light"
      ? "border-white/30 text-white hover:bg-white/10"
      : "border-border text-foreground hover:bg-secondary",
  );

  const hasHeader = !!(eyebrow || title);

  return (
    <div className={className}>
      {/* Header row: title/eyebrow on left · "View all" link + arrows on right */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        {hasHeader ? (
          <div className="space-y-2">
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-[2rem]">
                {title}
              </h2>
            )}
          </div>
        ) : (
          <span aria-hidden />
        )}
        <div className="flex shrink-0 items-center gap-3">
          {href && (
            <Link
              href={href}
              className={cn(
                "group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors",
                controlVariant === "light"
                  ? "text-white/90 hover:text-white"
                  : "text-foreground hover:text-primary",
              )}
            >
              {hrefLabel}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scrollBy(-1)} aria-label="Scroll left" className={btnCls}>
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={() => scrollBy(1)} aria-label="Scroll right" className={btnCls}>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable product strip */}
      <div
        ref={ref}
        className={cn(
          "no-scrollbar -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-2",
          hasHeader ? "mt-8" : "mt-4",
        )}
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="w-[60vw] shrink-0 snap-start sm:w-[44vw] md:w-[30vw] lg:w-[23%] 3xl:w-[18%]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
