import { cn } from "@/lib/utils/cn";

/** Centered max-width wrapper with responsive padding + ultra-wide cap. */
export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "wide" | "narrow";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full container-px",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-7xl 3xl:max-w-[110rem]",
        size === "wide" && "max-w-[100rem] 3xl:max-w-[120rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}
