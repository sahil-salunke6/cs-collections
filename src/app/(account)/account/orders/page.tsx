"use client";

import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { useOrders } from "@/lib/hooks/queries";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { JerseyVisual } from "@/components/common/JerseyVisual";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils/format";

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="When you place an order it'll show up here."
        action={
          <Button asChild>
            <Link href="/new-arrivals">Start shopping</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold">{order.number}</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{formatDate(order.date)}</span>
              <span className="font-semibold text-foreground">{formatPrice(order.total)}</span>
              <ChevronRight className="size-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex -space-x-3">
              {order.items.slice(0, 3).map((it, i) => (
                <span
                  key={i}
                  className="size-12 overflow-hidden rounded-lg border-2 border-card bg-card ring-1 ring-border"
                >
                  <JerseyVisual colors={["#0F5132", "#fff", "#FF2D75"]} view="front" />
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {order.items.reduce((n, i) => n + i.quantity, 0)} item(s) ·{" "}
              {order.items.map((i) => i.team).join(", ")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
