"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, ArrowRight, Tag } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { QtyStepper } from "@/components/common/QtyStepper";
import { JerseyVisual } from "@/components/common/JerseyVisual";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPrice } from "@/lib/utils/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeItem, updateQuantity } from "@/store/slices/cartSlice";
import { selectCartItems, selectCartTotals } from "@/store/selectors";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const { subtotal, shipping, total } = useAppSelector(selectCartTotals);

  return (
    <Container className="py-10">
      <h1 className="font-display text-3xl font-bold tracking-tight">Shopping Bag</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Looks like you haven't added anything yet."
          className="py-24"
          action={
            <Button asChild size="lg">
              <Link href="/new-arrivals">Start Shopping</Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div className="divide-y divide-border">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-4 py-5 sm:gap-6"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="size-24 shrink-0 overflow-hidden rounded-xl border border-border sm:size-28"
                  >
                    <JerseyVisual colors={["#0F5132", "#fff", "#FF2D75"]} view="front" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <div>
                        <Link href={`/products/${item.slug}`} className="font-semibold hover:text-primary">
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.team} · Size {item.size}
                        </p>
                      </div>
                      <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QtyStepper
                        value={item.quantity}
                        max={item.maxStock}
                        onChange={(q) => dispatch(updateQuantity({ id: item.id, quantity: q }))}
                      />
                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="size-4" /> Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-lg font-semibold">Order Summary</h2>
            <div className="mt-4 flex gap-2">
              <Input placeholder="Promo code" className="h-10" />
              <Button variant="outline" className="shrink-0">
                <Tag className="size-4" /> Apply
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2.5 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? "—" : formatPrice(shipping)} />
              <p className="text-xs text-muted-foreground">
                Flat ₹100 shipping across India · Express available at checkout.
              </p>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Button asChild size="lg" className="mt-5 w-full">
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link href="/new-arrivals">Continue shopping</Link>
            </Button>
          </aside>
        </div>
      )}
    </Container>
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
