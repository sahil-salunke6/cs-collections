import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";

export function Price({
  price,
  salePrice,
  currency = "INR",
  className,
  size = "md",
}: {
  price: number;
  salePrice?: number;
  currency?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const onSale = salePrice != null && salePrice < price;
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  } as const;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-foreground", sizes[size])}>
        {formatPrice(onSale ? salePrice! : price, currency)}
      </span>
      {onSale && (
        <span className={cn("text-muted-foreground line-through", size === "lg" ? "text-base" : "text-xs")}>
          {formatPrice(price, currency)}
        </span>
      )}
    </div>
  );
}
