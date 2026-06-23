import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  /** Show the "CS COLLECTIONS" wordmark next to the badge. */
  withWordmark?: boolean;
  className?: string;
  markClassName?: string;
  href?: string | null;
}

/**
 * Brand logo. The badge is theme-agnostic (amber gradient); the wordmark uses
 * `currentColor`, so it adapts automatically to light/dark via text color.
 */
export function Logo({ withWordmark = true, className, markClassName, href = "/" }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("size-9 shrink-0", markClassName)} />
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-extrabold tracking-tight text-foreground">
            CS COLLECTIONS
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Football Jerseys
          </span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="CS Collections home" className="inline-flex">
        {content}
      </Link>
    );
  }
  return content;
}

export function LogoMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/logo.svg"
      alt="CS Collections"
      width={40}
      height={40}
      className={cn(className, "rounded-lg")}
      draggable={false}
    />
  );
}
