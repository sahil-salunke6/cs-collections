import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils/cn";

const STYLES: Record<OrderStatus, string> = {
  processing: "bg-warning/15 text-warning",
  confirmed: "bg-primary/15 text-primary",
  shipped: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-destructive/15 text-destructive",
};

const LABELS: Record<OrderStatus, string> = {
  processing: "Processing",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", STYLES[status], className)}>
      {LABELS[status]}
    </span>
  );
}
