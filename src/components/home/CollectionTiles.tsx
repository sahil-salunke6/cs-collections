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
};

type TileConfig = {
  bg: string;          // tailwind gradient classes
  accent: string;      // hex — top accent line + glow
  primary: JerseySpec; // large centered jersey
  secondary: JerseySpec; // smaller background jersey
};

const TILE_CONFIG: Record<string, TileConfig> = {
  "national-teams": {
    bg: "from-[#070E1F] to-[#0D1B3E]",
    accent: "#FCE000",
    primary:   { colors: ["#FCE000", "#009C3B", "#002776"], view: "front" },
    secondary: { colors: ["#75AADB", "#FFFFFF", "#003087"], view: "front" },
  },
  "club-teams": {
    bg: "from-[#06091A] to-[#0A1040]",
    accent: "#A50044",
    primary:   { colors: ["#A50044", "#004D98", "#FFED02"], view: "front" },
    secondary: { colors: ["#FFFFFF", "#FEBE10", "#00529F"], view: "back", name: "Madrid", number: 7 },
  },
  retro: {
    bg: "from-[#120A03] to-[#2C1510]",
    accent: "#C8860A",
    primary:   { colors: ["#003399", "#FFFFFF", "#CC0000"], view: "front" },
    secondary: { colors: ["#FCE000", "#009C3B", "#002776"], view: "back" },
  },
  "new-arrivals": {
    bg: "from-[#070E1F] to-[#1A0B00]",
    accent: "#FF6200",
    primary:   { colors: ["#FF6300", "#FFFFFF", "#003DA5"], view: "front" },
    secondary: { colors: ["#000000", "#FFFFFF", "#CC0000"], view: "front" },
  },
};

const FALLBACK: TileConfig = {
  bg: "from-[#0A0A0A] to-[#1A1A1A]",
  accent: "#FF6200",
  primary:   { colors: ["#FCE000", "#009C3B", "#002776"], view: "front" },
  secondary: { colors: ["#FFFFFF", "#FF6200", "#000000"], view: "front" },
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
              "group relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl bg-gradient-to-b",
              cfg.bg,
            )}
          >
            {/* Top accent line — glows in team color */}
            <div
              className="absolute inset-x-0 top-0 h-[2px] transition-opacity duration-500 group-hover:opacity-100 opacity-70"
              style={{ background: `linear-gradient(90deg, transparent 0%, ${cfg.accent} 40%, ${cfg.accent} 60%, transparent 100%)` }}
            />

            {/* Subtle scanline texture — futuristic depth */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:repeating-linear-gradient(0deg,#fff_0px,#fff_1px,transparent_1px,transparent_4px)]" />

            {/* Corner bracket — top-left */}
            <svg className="absolute left-3 top-3 size-5 opacity-30 transition-opacity group-hover:opacity-60" viewBox="0 0 20 20" fill="none">
              <path d="M1 10 L1 1 L10 1" stroke={cfg.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            {/* Corner bracket — top-right */}
            <svg className="absolute right-3 top-3 size-5 opacity-30 transition-opacity group-hover:opacity-60" viewBox="0 0 20 20" fill="none">
              <path d="M10 1 L19 1 L19 10" stroke={cfg.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            {/* Background jersey — ghosted, right-side */}
            <div
              className="pointer-events-none absolute right-[-8%] top-[8%] w-[58%] opacity-15 transition-all duration-700 ease-out group-hover:opacity-25 group-hover:translate-x-1"
              style={{ filter: `drop-shadow(0 0 20px ${cfg.secondary.colors[0]}88)` }}
            >
              <JerseyVisual
                colors={cfg.secondary.colors}
                view={cfg.secondary.view}
                name={cfg.secondary.name}
                number={cfg.secondary.number}
                transparent
              />
            </div>

            {/* Glow blob behind primary jersey */}
            <div
              className="pointer-events-none absolute left-[50%] top-[36%] size-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-700 group-hover:size-[62%]"
              style={{ background: cfg.accent, opacity: 0.18 }}
            />

            {/* Primary jersey — centered hero */}
            <div
              className="absolute left-[50%] top-[36%] w-[72%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              style={{ filter: `drop-shadow(0 12px 32px ${cfg.accent}55)` }}
            >
              <JerseyVisual
                colors={cfg.primary.colors}
                view={cfg.primary.view}
                name={cfg.primary.name}
                number={cfg.primary.number}
                transparent
              />
            </div>

            {/* Bottom overlay + text */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-14">
              {/* Thin separator */}
              <div
                className="mb-2.5 h-px w-8 opacity-50"
                style={{ background: cfg.accent }}
              />
              <p
                className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] opacity-55"
                style={{ color: cfg.accent }}
              >
                {c.subtitle}
              </p>
              <div className="mt-1 flex items-end justify-between">
                <span className="font-display text-base font-bold leading-tight text-white sm:text-lg">
                  {c.title}
                </span>
                <ArrowUpRight
                  className="mb-0.5 size-4 shrink-0 text-white/50 transition-all duration-300 group-hover:text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
