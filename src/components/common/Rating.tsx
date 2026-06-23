import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Rating({
  value,
  count,
  size = "sm",
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const px = size === "sm" ? "size-3.5" : "size-4";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(value);
          return (
            <Star
              key={i}
              className={cn(px, filled ? "fill-warning text-warning" : "fill-transparent text-border")}
            />
          );
        })}
      </div>
      <span className={cn("font-medium text-foreground", size === "sm" ? "text-xs" : "text-sm")}>
        {value.toFixed(1)}
      </span>
      {count != null && <span className="text-xs text-muted-foreground">({count})</span>}
    </div>
  );
}
