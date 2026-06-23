import { Container } from "./Container";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { cn } from "@/lib/utils/cn";

export function PageHeader({
  title,
  description,
  crumbs,
  variant = "default",
  className,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  variant?: "default" | "brand";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-b border-border theme-transition",
        variant === "brand" ? "brand-gradient text-white" : "bg-card",
        className,
      )}
    >
      <Container className="py-10 lg:py-14">
        {crumbs && (
          <Breadcrumbs
            items={crumbs}
            className={cn("mb-4", variant === "brand" && "[&_*]:!text-white/70 [&_.text-foreground]:!text-white")}
          />
        )}
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem]">{title}</h1>
        {description && (
          <p className={cn("mt-3 max-w-2xl text-sm sm:text-base", variant === "brand" ? "text-white/80" : "text-muted-foreground")}>
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}
