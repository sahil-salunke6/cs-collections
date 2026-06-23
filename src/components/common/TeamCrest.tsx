import { cn } from "@/lib/utils/cn";

interface Props {
  name: string;
  color: string;
  className?: string;
}

/** Generated monogram crest used in place of licensed club/nation badges. */
export function TeamCrest({ name, color, className }: Props) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  const gid = (name + color).replace(/[^a-z0-9]/gi, "");

  return (
    <svg viewBox="0 0 100 110" className={cn("h-full w-full", className)} role="img" aria-label={`${name} crest`}>
      <defs>
        <linearGradient id={`c${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path
        d="M50 2 L94 16 V60 C94 86 74 100 50 108 C26 100 6 86 6 60 V16 Z"
        fill={`url(#c${gid})`}
        stroke="#ffffff"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path d="M50 2 L94 16 V60 C94 86 74 100 50 108 V2 Z" fill="#000" fillOpacity="0.08" />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="30"
        fontWeight="800"
        fill="#ffffff"
        fontFamily="var(--font-display)"
      >
        {initials}
      </text>
    </svg>
  );
}
