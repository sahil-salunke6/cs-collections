import { Container } from "./Container";
import { cn } from "@/lib/utils/cn";

export function Section({
  children,
  className,
  containerClassName,
  muted,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  muted?: boolean;
  size?: "default" | "wide" | "narrow";
}) {
  return (
    <section className={cn("py-12 sm:py-16 lg:py-20", muted && "bg-card theme-transition", className)}>
      <Container size={size} className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}
