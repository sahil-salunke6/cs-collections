import { cn } from "@/lib/utils/cn";

type View = "front" | "back" | "detail";

interface Props {
  colors: string[]; // [shirt, secondary, accent]
  view?: View;
  name?: string; // back nameset
  number?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Brand-consistent generated jersey artwork (no external image assets).
 * Renders front / back / detail views from a team's colour palette.
 */
export function JerseyVisual({ colors, view = "front", name = "CS", number = 10, className }: Props) {
  const [shirt, secondary = "#ffffff", accent = "#111111"] = colors;
  const gid = `${shirt}${secondary}${view}`.replace(/[^a-z0-9]/gi, "");

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden", className)}>
      <svg viewBox="0 0 400 400" className="size-full" role="img" aria-label="Jersey artwork">
        <defs>
          <linearGradient id={`bg${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--muted)" />
            <stop offset="1" stopColor="var(--secondary)" />
          </linearGradient>
          <linearGradient id={`sh${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={shirt} />
            <stop offset="1" stopColor={shade(shirt, -14)} />
          </linearGradient>
        </defs>

        <rect width="400" height="400" fill={`url(#bg${gid})`} />

        {view === "detail" ? (
          <DetailWeave shirt={shirt} secondary={secondary} accent={accent} />
        ) : (
          <g transform="translate(200 206)">
            {/* sleeves */}
            <path d="M-118 -78 L-150 6 L-104 28 L-78 -52 Z" fill={secondary} />
            <path d="M118 -78 L150 6 L104 28 L78 -52 Z" fill={secondary} />
            {/* body */}
            <path
              d="M-78 -64
                 C-60 -86 -34 -96 0 -96
                 C34 -96 60 -86 78 -64
                 L96 -30 L78 0
                 L78 150
                 C78 162 70 168 58 168
                 L-58 168
                 C-70 168 -78 162 -78 150
                 L-78 0 L-96 -30 Z"
              fill={`url(#sh${gid})`}
            />
            {/* collar */}
            <path d="M-30 -90 C-14 -72 14 -72 30 -90 L22 -70 C8 -58 -8 -58 -22 -70 Z" fill={accent} />
            {/* center stripe accent */}
            <rect x="-6" y="-58" width="12" height="220" fill={accent} opacity="0.16" />

            {view === "back" ? (
              <>
                <text x="0" y="-30" textAnchor="middle" fontSize="22" fontWeight="800" fill={accent} fontFamily="var(--font-display)">
                  {name.toUpperCase().slice(0, 10)}
                </text>
                <text x="0" y="86" textAnchor="middle" fontSize="120" fontWeight="800" fill={accent} fontFamily="var(--font-display)">
                  {number}
                </text>
              </>
            ) : (
              <>
                {/* crest */}
                <circle cx="-44" cy="-26" r="14" fill={accent} />
                <circle cx="-44" cy="-26" r="14" fill="none" stroke="#fff" strokeOpacity="0.5" />
                {/* maker mark */}
                <circle cx="44" cy="-26" r="6" fill="#fff" opacity="0.85" />
                <rect x="-26" y="120" width="52" height="8" rx="4" fill={accent} opacity="0.5" />
              </>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}

function DetailWeave({ shirt, secondary, accent }: { shirt: string; secondary: string; accent: string }) {
  return (
    <g>
      <rect width="400" height="400" fill={shirt} />
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={i} x1={i * 22 - 40} y1="0" x2={i * 22 + 120} y2="400" stroke={shade(shirt, -10)} strokeWidth="6" opacity="0.5" />
      ))}
      <circle cx="120" cy="150" r="46" fill={accent} />
      <circle cx="120" cy="150" r="46" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="2" />
      <rect x="220" y="250" width="120" height="14" rx="7" fill={secondary} opacity="0.85" />
      <rect x="220" y="276" width="80" height="10" rx="5" fill={secondary} opacity="0.6" />
    </g>
  );
}

function shade(hex: string, percent: number) {
  const h = hex.replace("#", "");
  if (h.length !== 6) return hex;
  const num = parseInt(h, 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
