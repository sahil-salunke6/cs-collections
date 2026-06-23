"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, ZoomIn } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils/cn";
import { JerseyVisual } from "@/components/common/JerseyVisual";
import { ProductImage } from "@/components/common/ProductImage";

type View = "front" | "back" | "detail" | "video";

export function ProductGallery({ product }: { product: Product }) {
  const views: View[] = ["front", "back", "detail", ...(product.video ? (["video"] as View[]) : [])];
  const [active, setActive] = useState<View>("front");
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      <div className="flex gap-3 lg:flex-col">
        {views.map((v) => (
          <button
            key={v}
            onClick={() => setActive(v)}
            aria-label={`View ${v}`}
            className={cn(
              "relative size-16 shrink-0 overflow-hidden rounded-xl border bg-card transition-colors lg:size-20",
              active === v ? "border-primary ring-1 ring-primary" : "border-border hover:border-foreground/30",
            )}
          >
            {v === "video" ? (
              <span className="flex size-full items-center justify-center bg-foreground text-background">
                <Play className="size-5 fill-current" />
              </span>
            ) : (
              <ProductImage images={product.images} colors={product.colors} view={v as "front" | "back" | "detail"} number={10} name={product.team} alt={product.name} />
            )}
          </button>
        ))}
      </div>

      <div
        ref={ref}
        onMouseEnter={() => active !== "video" && setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
        className="relative flex-1 overflow-hidden rounded-3xl border border-border bg-card"
      >
        {active === "video" ? (
          <VideoShowcase colors={product.colors} />
        ) : (
          <>
            <motion.div
              animate={{ scale: zoom ? 1.8 : 1 }}
              transition={{ duration: 0.2 }}
              style={{ transformOrigin: origin }}
            >
              <ProductImage images={product.images} colors={product.colors} view={active as "front" | "back" | "detail"} number={10} name={product.team} alt={product.name} priority />
            </motion.div>
            <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <ZoomIn className="size-3.5" /> Hover to zoom
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function VideoShowcase({ colors }: { colors: string[] }) {
  return (
    <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-foreground/[0.03]">
      <motion.div
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d" }}
        className="w-2/3"
      >
        <JerseyVisual colors={colors} view="front" />
      </motion.div>
      <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
        <Play className="size-3.5 fill-current" /> 360° Showcase
      </span>
    </div>
  );
}
