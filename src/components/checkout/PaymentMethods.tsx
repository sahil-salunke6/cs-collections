"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Building2, Wallet, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PayMethod = "card" | "upi" | "netbanking" | "wallet";

const METHODS: { id: PayMethod; label: string; icon: typeof CreditCard; hint: string }[] = [
  { id: "card", label: "Card", icon: CreditCard, hint: "Credit / Debit" },
  { id: "upi", label: "UPI", icon: Smartphone, hint: "GPay, PhonePe…" },
  { id: "netbanking", label: "Net Banking", icon: Building2, hint: "All major banks" },
  { id: "wallet", label: "Wallet", icon: Wallet, hint: "Paytm, Amazon Pay" },
];

const UPI_APPS = ["Google Pay", "PhonePe", "Paytm", "BHIM"];
const BANKS = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra", "Punjab National Bank"];
const WALLETS = ["Paytm", "PhonePe", "Amazon Pay", "Mobikwik"];

export function PaymentMethods({
  method,
  onMethodChange,
}: {
  method: PayMethod;
  onMethodChange: (m: PayMethod) => void;
}) {
  const [upiApp, setUpiApp] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
        <Lock className="size-3.5" /> Secure checkout — this is a demo, no real payment is processed.
      </div>

      {/* Method selector (Razorpay-style) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {METHODS.map((m) => {
          const active = method === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onMethodChange(m.id)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors",
                active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-secondary",
              )}
            >
              <m.icon className={cn("size-5", active ? "text-primary" : "text-muted-foreground")} />
              <span className="text-sm font-semibold">{m.label}</span>
              <span className="text-[11px] text-muted-foreground">{m.hint}</span>
            </button>
          );
        })}
      </div>

      {/* Method-specific fields */}
      <div className="rounded-xl border border-border p-4">
        {method === "card" && (
          <div className="grid gap-4">
            <Field label="Card number" defaultValue="4242 4242 4242 4242" inputMode="numeric" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry" defaultValue="12 / 28" />
              <Field label="CVC" defaultValue="123" inputMode="numeric" />
            </div>
            <Field label="Name on card" defaultValue="Alex Morgan" />
          </div>
        )}

        {method === "upi" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {UPI_APPS.map((app) => (
                <Chip key={app} active={upiApp === app} onClick={() => setUpiApp(app)}>
                  {app}
                </Chip>
              ))}
            </div>
            <div className="relative text-center text-xs text-muted-foreground">
              <span className="bg-card px-2">or pay with UPI ID</span>
            </div>
            <Field label="UPI ID" placeholder="yourname@upi" defaultValue="" />
          </div>
        )}

        {method === "netbanking" && (
          <div className="space-y-2">
            <Label>Select your bank</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose a bank" />
              </SelectTrigger>
              <SelectContent>
                {BANKS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="pt-1 text-xs text-muted-foreground">
              You’ll be redirected to your bank’s secure portal to complete payment.
            </p>
          </div>
        )}

        {method === "wallet" && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {WALLETS.map((w) => (
              <Chip key={w} active={wallet === w} onClick={() => setWallet(w)}>
                {w}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
        active ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-secondary",
      )}
    >
      {active && <Check className="size-3.5" />}
      {children}
    </button>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  );
}
