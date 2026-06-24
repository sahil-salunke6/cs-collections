import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JerseyVisual } from "@/components/common/JerseyVisual";
import { cn } from "@/lib/utils/cn";
import type { CmsCollection } from "@/lib/cms";

type JerseySpec = {
  colors: string[];
  view: "front" | "back";
  name?: string;
  number?: number;
  cls: string;
};

type TileConfig = {
  bg: string;
  jerseys: JerseySpec[];
};

const TILE_CONFIG: Record<string, TileConfig> = {
  "national-teams": {
    bg: "from-[#0D1B3E] via-[#17336B] to-[#B87B20]",
    jerseys: [
      {
        colors: ["#FCE000", "#009C3B", "#002776"],
        view: "front",
        cls: "absolute top-4 right-1 w-[46%] rotate-[12deg] drop-shadow-lg",
      },
      {
        colors: ["#75AADB", "#FFFFFF", "#4B0082"],
        view: "front",
        cls: "absolute top-10 right-[38%] w-[38%] rotate-[-8deg] drop-shadow-md opacity-90",
      },
    ],
  },
  "club-teams": {
    bg: "from-[#060C3A] via-[#0F1E6A] to-[#1a0533]",
    jerseys: [
      {
        colors: ["#A50044", "#004D98", "#FFED02"],
        view: "front",
        cls: "absolute top-4 right-1 w-[46%] rotate-[10deg] drop-shadow-lg",
      },
      {
        colors: ["#FFFFFF", "#FEBE10", "#00529F"],
        view: "back",
        name: "Madrid",
        number: 7,
        cls: "absolute top-10 right-[38%] w-[38%] rotate-[-6deg] drop-shadow-md opacity-90",
      },
    ],
  },
  retro: {
    bg: "from-[#1C0F05] via-[#6B3410] to-[#C8860A]",
    jerseys: [
      {
        colors: ["#003399", "#FFFFFF", "#CC0000"],
        view: "front",
        cls: "absolute top-4 right-1 w-[46%] rotate-[8deg] drop-shadow-lg",
      },
      {
        colors: ["#FCE000", "#009C3B", "#002776"],
        view: "back",
        cls: "absolute top-10 right-[38%] w-[38%] rotate-[-10deg] drop-shadow-md opacity-85",
      },
    ],
  },
  "new-arrivals": {
    bg: "from-[#0F1F6A] via-[#D94E00] to-[#0A1545]",
    jerseys: [
      {
        colors: ["#000000", "#FFFFFF", "#CC0000"],
        view: "front",
        cls: "absolute top-4 right-1 w-[46%] rotate-[14deg] drop-shadow-lg",
      },
      {
        colors: ["#FF6300", "#FFFFFF", "#003DA5"],
        view: "front",
        cls: "absolute top-10 right-[38%] w-[38%] rotate-[-5deg] drop-shadow-md opacity-90",
      },
    ],
  },
};

const FALLBACK: TileConfig = {
  bg: "from-primary to-brand-orange-deep",
  jerseys: [
    {
      colors: ["#FCE000", "#009C3B", "#002776"],
      view: "front",
      cls: "absolute top-4 right-2 w-[44%] rotate-[12deg]",
    },
  ],
};

export function CollectionTiles({ collections }: { collections: CmsCollection[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {collections.map((c) => {
        const cfg = TILE_CONFIG[c.slug] ?? FALLBACK;
        return (
          <Link
            key={c.slug}
            href={c.href}
            className={cn(
              "group relative flex aspect-square flex-col overflow-hidden rounded-2xl bg-gradient-to-br sm:rounded-3xl",
              cfg.bg,
            )}
          >
            {/* Jersey visuals — clipped to tile, scale on hover */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {cfg.jerseys.map((j, i) => (
                <div
                  key={i}
                  className={cn(
                    j.cls,
                    "transition-transform duration-500 ease-out will-change-transform group-hover:scale-110",
                  )}
                >
                  <JerseyVisual
                    colors={j.colors}
                    view={j.view}
                    name={j.name}
                    number={j.number}
                  />
                </div>
              ))}
            </div>

            {/* Radial specular highlight */}
            <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.14),transparent_55%)]" />

            {/* Bottom gradient + text */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pb-5 pt-20">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 sm:text-[11px]">
                {c.subtitle}
              </p>
              <div className="mt-0.5 flex items-end justify-between gap-1">
                <span className="font-display text-base font-bold leading-tight text-white sm:text-xl">
                  {c.title}
                </span>
                <ArrowUpRight className="mb-0.5 size-4 shrink-0 text-white/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-5" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
