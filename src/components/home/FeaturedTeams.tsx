import Link from "next/link";
import type { Team } from "@/types";
import { TeamCrest } from "@/components/common/TeamCrest";

export function FeaturedTeams({ teams }: { teams: Team[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {teams.map((team) => (
        <Link
          key={team.id}
          href={`/products?team=${team.slug}`}
          className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
        >
          <span className="size-14 overflow-hidden transition-transform group-hover:scale-110">
            {team.crest ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={team.crest} alt={`${team.name} badge`} className="size-full object-contain" />
            ) : (
              <TeamCrest name={team.name} color={team.primaryColor} />
            )}
          </span>
          <span className="text-center text-xs font-medium leading-tight text-foreground">{team.name}</span>
        </Link>
      ))}
    </div>
  );
}
