"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Package, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/store/hooks";
import { selectUser, selectWishlistCount } from "@/store/selectors";
import { mockOrders } from "@/data/account";

export default function ProfilePage() {
  const user = useAppSelector(selectUser);
  const wishCount = useAppSelector(selectWishlistCount);

  const stats = [
    { label: "Orders", value: mockOrders.length, icon: Package, href: "/account/orders" },
    { label: "Wishlist", value: wishCount, icon: Heart, href: "/account/wishlist" },
    { label: "Addresses", value: user?.addresses.length ?? 0, icon: MapPin, href: "/account/addresses" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <s.icon className="size-5" />
            </span>
            <div>
              <p className="font-display text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Personal Information</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Profile updated");
          }}
          className="mt-5 grid gap-4 sm:grid-cols-2"
        >
          <Field label="First name" defaultValue={user?.firstName} />
          <Field label="Last name" defaultValue={user?.lastName} />
          <Field label="Email" type="email" defaultValue={user?.email} className="sm:col-span-2" />
          <Field label="Phone" defaultValue={user?.phone} className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, className, ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      <Input {...props} />
    </div>
  );
}
