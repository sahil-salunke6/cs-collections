"use client";

import Link from "next/link";
import { Package, ShoppingCart, IndianRupee, Users, ExternalLink } from "lucide-react";
import { useProducts, useOrders } from "@/lib/hooks/queries";
import { formatPrice, formatDate, unitPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { cn } from "@/lib/utils/cn";

export default function AdminDashboard() {
  const { data: productData, isLoading: pLoading } = useProducts({ perPage: 100 });
  const { data: orders, isLoading: oLoading } = useOrders();

  const products = productData?.items ?? [];
  const revenue = (orders ?? []).reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.sizes.reduce((n, s) => n + s.stock, 0) < 20).length;

  const stats = [
    { label: "Products", value: products.length, icon: Package, sub: `${lowStock} low stock` },
    { label: "Orders", value: orders?.length ?? 0, icon: ShoppingCart, sub: "All time" },
    { label: "Revenue", value: formatPrice(revenue), icon: IndianRupee, sub: "From orders" },
    { label: "Customers", value: 1280, icon: Users, sub: "Registered" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your store — products, orders and performance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</span>
              <s.icon className="size-4 text-primary" />
            </div>
            <div className="mt-2 font-display text-2xl font-bold">
              {pLoading || oLoading ? <Skeleton className="h-7 w-20" /> : s.value}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <Section title="Recent Orders" count={orders?.length}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <Tr head>
                <Th>Order</Th>
                <Th>Date</Th>
                <Th>Items</Th>
                <Th>Status</Th>
                <Th className="text-right">Total</Th>
              </Tr>
            </thead>
            <tbody>
              {oLoading
                ? Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} cols={5} />)
                : orders?.map((o) => (
                    <Tr key={o.id}>
                      <Td className="font-mono font-semibold">{o.number}</Td>
                      <Td className="text-muted-foreground">{formatDate(o.date)}</Td>
                      <Td className="text-muted-foreground">{o.items.reduce((n, i) => n + i.quantity, 0)}</Td>
                      <Td><OrderStatusBadge status={o.status} /></Td>
                      <Td className="text-right font-semibold">{formatPrice(o.total)}</Td>
                    </Tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Products table */}
      <Section title="Products" count={products.length}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <Tr head>
                <Th>Product</Th>
                <Th>Team</Th>
                <Th>Type</Th>
                <Th>Stock</Th>
                <Th className="text-right">Price</Th>
                <Th></Th>
              </Tr>
            </thead>
            <tbody>
              {pLoading
                ? Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} cols={6} />)
                : products.map((p) => {
                    const stock = p.sizes.reduce((n, s) => n + s.stock, 0);
                    return (
                      <Tr key={p.id}>
                        <Td className="max-w-[220px]">
                          <span className="block truncate font-medium">{p.name}</span>
                          <span className="text-xs text-muted-foreground">{p.brand} · {p.season}</span>
                        </Td>
                        <Td className="text-muted-foreground">{p.team}</Td>
                        <Td className="capitalize text-muted-foreground">{p.type}</Td>
                        <Td>
                          <span className={cn("font-medium", stock < 20 ? "text-warning" : "text-foreground")}>{stock}</span>
                        </Td>
                        <Td className="text-right font-semibold">{formatPrice(unitPrice(p))}</Td>
                        <Td className="text-right">
                          <Link href={`/products/${p.slug}`} target="_blank" aria-label="View" className="inline-flex text-muted-foreground hover:text-primary">
                            <ExternalLink className="size-4" />
                          </Link>
                        </Td>
                      </Tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </Section>

      <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
        This is a mock admin console (read-only). Create/edit/delete actions arrive with the backend phase, where
        every admin action is authorised server-side.
      </p>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {count != null && <Badge variant="muted">{count}</Badge>}
      </div>
      <div className="p-2 sm:p-4">{children}</div>
    </section>
  );
}

function Tr({ children, head }: { children: React.ReactNode; head?: boolean }) {
  return <tr className={cn("border-b border-border last:border-0", head && "border-b")}>{children}</tr>;
}
function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground", className)}>{children}</th>;
}
function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-3 py-3 align-middle", className)}>{children}</td>;
}
function RowSkeleton({ cols }: { cols: number }) {
  return (
    <Tr>
      {Array.from({ length: cols }).map((_, i) => (
        <Td key={i}><Skeleton className="h-4 w-full" /></Td>
      ))}
    </Tr>
  );
}
