"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QtyStepper } from "@/components/common/QtyStepper";
import { JerseyVisual } from "@/components/common/JerseyVisual";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPrice } from "@/lib/utils/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCartDrawer } from "@/store/slices/uiSlice";
import { removeItem, updateQuantity } from "@/store/slices/cartSlice";
import { selectCartItems, selectCartTotals } from "@/store/selectors";

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.cartDrawerOpen);
  const items = useAppSelector(selectCartItems);
  const { subtotal, shipping, total } = useAppSelector(selectCartTotals);

  return (
    <Sheet open={open} onOpenChange={(o) => dispatch(setCartDrawer(o))}>
      <SheetContent side="right" className="w-full p-0 sm:max-w-md" aria-describedby={undefined}>
        <SheetHeader className="border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" /> Your Bag ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your bag is empty"
            description="Add some jerseys to get started."
            className="flex-1"
            action={
              <Button onClick={() => dispatch(setCartDrawer(false))} asChild>
                <Link href="/new-arrivals">Shop New Arrivals</Link>
              </Button>
            }
          />
        ) : (
          <>
            <p className="bg-secondary px-6 py-2.5 text-center text-xs text-muted-foreground">
              Flat shipping <span className="font-semibold text-foreground">{formatPrice(100)}</span> · Pay via UPI, cards &amp; net banking
            </p>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-4 py-4"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={() => dispatch(setCartDrawer(false))}
                      className="size-20 shrink-0 overflow-hidden rounded-lg border border-border"
                    >
                      <JerseyVisual colors={["#0F5132", "#fff", "#FF2D75"]} view="front" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.team} · Size {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => dispatch(removeItem(item.id))}
                          aria-label="Remove"
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <QtyStepper
                          value={item.quantity}
                          max={item.maxStock}
                          onChange={(q) => dispatch(updateQuantity({ id: item.id, quantity: q }))}
                        />
                        <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <SheetFooter className="border-t border-border">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="font-medium text-foreground">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout" onClick={() => dispatch(setCartDrawer(false))}>
                  Checkout <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/cart" onClick={() => dispatch(setCartDrawer(false))}>
                  View full bag
                </Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
