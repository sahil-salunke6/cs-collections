"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Truck, CheckCircle2, Package, Clock } from "lucide-react";
import { useOrder } from "@/lib/hooks/queries";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { JerseyVisual } from "@/components/common/JerseyVisual";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate, formatPrice } from "@/lib/utils/format";

const TIMELINE = [
  { key: "processing", label: "Order placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Package },
];
const ORDER_RANK: Record<string, number> = { processing: 0, confirmed: 1, shipped: 2, delivered: 3, cancelled: -1 };

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) return <Skeleton className="h-96 w-full rounded-2xl" />;
  if (!order)
    return (
      <EmptyState
        icon={Package}
        title="Order not found"
        action={
          <Button asChild variant="outline">
            <Link href="/account/orders">Back to orders</Link>
          </Button>
        }
      />
    );

  const rank = ORDER_RANK[order.status];

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">{order.number}</h2>
          <p className="text-sm text-muted-foreground">Placed {formatDate(order.date)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Tracking timeline */}
      {order.status !== "cancelled" && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            {TIMELINE.map((t, i) => {
              const done = i <= rank;
              return (
                <div key={t.key} className="flex flex-1 flex-col items-center last:flex-none">
                  <div className="flex w-full items-center">
                    {i > 0 && <div className={`h-0.5 flex-1 ${i <= rank ? "bg-primary" : "bg-border"}`} />}
                    <span className={`flex size-9 items-center justify-center rounded-full ${done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                      <t.icon className="size-4" />
                    </span>
                    {i < TIMELINE.length - 1 && <div className={`h-0.5 flex-1 ${i < rank ? "bg-primary" : "bg-border"}`} />}
                  </div>
                  <span className={`mt-2 text-center text-xs ${done ? "font-medium text-foreground" : "text-muted-foreground"}`}>{t.label}</span>
                </div>
              );
            })}
          </div>
          {order.trackingNumber && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Tracking: <span className="font-mono font-semibold text-foreground">{order.trackingNumber}</span>
            </p>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold">Items</h3>
          <div className="divide-y divide-border">
            {order.items.map((it, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <span className="size-16 shrink-0 overflow-hidden rounded-lg border border-border">
                  <JerseyVisual colors={["#0F5132", "#fff", "#FF2D75"]} view="front" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{it.name}</p>
                  <p className="text-xs text-muted-foreground">Size {it.size} · Qty {it.quantity}</p>
                </div>
                <span className="text-sm font-semibold">{formatPrice(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-3 font-semibold">Summary</h3>
            <div className="space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(order.subtotal)} />
              <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatPrice(order.shipping)} />
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-2 font-semibold">Shipping address</h3>
            <address className="text-sm not-italic leading-relaxed text-muted-foreground">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && <>, {order.shippingAddress.line2}</>}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
