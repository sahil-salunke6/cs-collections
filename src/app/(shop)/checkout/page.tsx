"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, CreditCard, Truck, MapPin, ShieldCheck, PartyPopper } from "lucide-react";
import { PaymentMethods, type PayMethod } from "@/components/checkout/PaymentMethods";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { JerseyVisual } from "@/components/common/JerseyVisual";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { selectCartItems, selectCartTotals } from "@/store/selectors";

const STEPS = [
  { id: "address", label: "Address", icon: MapPin },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "review", label: "Review", icon: ShieldCheck },
] as const;

const DELIVERY = [
  { id: "standard", label: "Standard", desc: "3–5 business days", price: 100 },
  { id: "express", label: "Express", desc: "1–2 business days", price: 199 },
];

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const { subtotal, total } = useAppSelector(selectCartTotals);
  const [step, setStep] = useState(0);
  const [delivery, setDelivery] = useState("standard");
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [placed, setPlaced] = useState<string | null>(null);

  const deliveryFee = DELIVERY.find((d) => d.id === delivery)?.price ?? 0;
  const grandTotal = subtotal + deliveryFee;

  if (placed) {
    return (
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-10 text-center"
        >
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PartyPopper className="size-8" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold">Order confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for your order. A confirmation has been sent to your email.
          </p>
          <p className="mt-4 rounded-lg bg-secondary px-4 py-2 font-mono text-sm font-semibold">{placed}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link href="/account/orders">View Orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/new-arrivals">Keep Shopping</Link>
            </Button>
          </div>
        </motion.div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-10">
        <EmptyState
          icon={CreditCard}
          title="Nothing to check out"
          description="Your bag is empty."
          className="py-24"
          action={
            <Button asChild size="lg">
              <Link href="/new-arrivals">Shop Jerseys</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  function placeOrder() {
    const num = `CS-${100400 + Math.floor(Math.random() * 600)}`;
    dispatch(clearCart());
    setPlaced(num);
  }

  return (
    <Container className="py-10">
      <h1 className="font-display text-3xl font-bold tracking-tight">Checkout</h1>

      {/* Stepper */}
      <div className="mt-8 flex items-center">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                  i < step
                    ? "border-primary bg-primary text-primary-foreground"
                    : i === step
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground",
                )}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </span>
              <span className={cn("hidden text-sm font-medium sm:block", i <= step ? "text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className={cn("mx-3 h-px flex-1", i < step ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          {step === 0 && (
            <Card title="Shipping Address">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" defaultValue="Alex" />
                <Field label="Last name" defaultValue="Morgan" />
                <Field label="Email" type="email" defaultValue="alex.morgan@example.com" className="sm:col-span-2" />
                <Field label="Address" defaultValue="12 MG Road" className="sm:col-span-2" />
                <Field label="City" defaultValue="Mumbai" />
                <Field label="Postal code" defaultValue="400001" />
                <Field label="Country" defaultValue="India" />
                <Field label="Phone" defaultValue="+91 86579 73913" />
              </div>
            </Card>
          )}

          {step === 1 && (
            <Card title="Delivery Method">
              <RadioGroup value={delivery} onValueChange={setDelivery} className="gap-3">
                {DELIVERY.map((d) => (
                  <label
                    key={d.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                      delivery === d.id ? "border-primary bg-primary/5" : "border-border",
                    )}
                  >
                    <RadioGroupItem value={d.id} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{d.label}</p>
                      <p className="text-xs text-muted-foreground">{d.desc}</p>
                    </div>
                    <span className="text-sm font-semibold">{d.price === 0 ? "Free" : formatPrice(d.price)}</span>
                  </label>
                ))}
              </RadioGroup>
            </Card>
          )}

          {step === 2 && (
            <Card title="Payment">
              <PaymentMethods method={payMethod} onMethodChange={setPayMethod} />
            </Card>
          )}

          {step === 3 && (
            <Card title="Review Your Order">
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3">
                    <span className="size-14 shrink-0 overflow-hidden rounded-lg border border-border">
                      <JerseyVisual colors={["#0F5132", "#fff", "#FF2D75"]} view="front" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Size {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
            ) : (
              <Button variant="accent" size="lg" onClick={placeOrder}>
                <ShieldCheck className="size-4" /> Place Order
              </Button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-semibold">Summary</h2>
          <Separator className="my-4" />
          <div className="space-y-2.5 text-sm">
            <Row label={`Subtotal (${items.length})`} value={formatPrice(subtotal)} />
            <Row label="Delivery" value={deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)} />
            <Separator className="my-2" />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-5 font-display text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, className, ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>{label}</Label>
      <Input {...props} />
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
