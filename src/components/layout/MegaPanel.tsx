import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Team } from "@/types";
import teamsData from "@/data/teams.json";
import { TeamCrest } from "@/components/common/TeamCrest";

const teams = teamsData as Team[];

export function MegaPanel({ type, onNavigate }: { type: "national" | "club"; onNavigate?: () => void }) {
  const list = teams.filter((t) => t.type === type);
  const root = type === "national" ? "/national-teams" : "/club-teams";

  return (
    <div className="w-[min(46rem,90vw)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {type === "national" ? "Shop by Nation" : "Shop by Club"}
        </p>
        <Link href={root} onClick={onNavigate} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
          View all <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {list.map((team) => (
          <Link
            key={team.id}
            href={`/products?team=${team.slug}`}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-secondary"
          >
            <span className="size-9 shrink-0">
              <TeamCrest name={team.name} color={team.primaryColor} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">{team.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{team.league ?? team.confederation}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
