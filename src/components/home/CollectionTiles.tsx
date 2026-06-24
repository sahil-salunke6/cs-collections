import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Collection } from "@/types";
import { cn } from "@/lib/utils/cn";

const GRADIENTS: Record<string, string> = {
  "national-teams": "from-primary to-brand-orange-deep",
  "club-teams": "from-[#0F2167] to-[#060C3A]",
  retro: "from-brand-amber to-[#6B3410]",
  "new-arrivals": "from-[#FF6200] to-[#0F2167]",
};

export function CollectionTiles({ collections }: { collections: Collection[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {collections.map((c, i) => (
        <Link
          key={c.id}
          href={c.href}
          className={cn(
            "group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white",
            GRADIENTS[c.slug] ?? "from-primary to-brand-orange-deep",
            i === 0 && "sm:col-span-2 sm:aspect-auto lg:col-span-1 lg:aspect-[4/5]",
          )}
        >
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.4),transparent_45%)]" />
          <span className="relative">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{c.subtitle}</span>
            <span className="mt-1 flex items-center gap-2 font-display text-2xl font-bold">
              {c.title}
              <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
