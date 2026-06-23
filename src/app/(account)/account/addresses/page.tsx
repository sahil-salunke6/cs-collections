"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Plus, Pencil, Trash2, Check, Star } from "lucide-react";
import type { Address } from "@/types";
import { mockAddresses } from "@/data/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [editing, setEditing] = useState<Address | null>(null);
  const [open, setOpen] = useState(false);

  function setDefault(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success("Default address updated");
  }
  function remove(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.message("Address removed");
  }
  function openNew() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(a: Address) {
    setEditing(a);
    setOpen(true);
  }
  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as unknown as Address;
    if (editing) {
      setAddresses((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...data } : a)));
      toast.success("Address updated");
    } else {
      setAddresses((prev) => [
        ...prev,
        { ...data, id: `addr${Date.now()}`, isDefault: prev.length === 0 },
      ]);
      toast.success("Address added");
    }
    setOpen(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Saved Addresses</h2>
        <Button onClick={openNew}>
          <Plus className="size-4" /> Add address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No addresses saved yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className={cn("rounded-2xl border bg-card p-5", a.isDefault ? "border-primary" : "border-border")}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  <span className="font-semibold">{a.label}</span>
                  {a.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      <Star className="size-3" /> Default
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(a)} aria-label="Edit" className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
                    <Pencil className="size-4" />
                  </button>
                  <button onClick={() => remove(a.id)} aria-label="Delete" className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <address className="mt-3 text-sm not-italic leading-relaxed text-muted-foreground">
                {a.fullName}
                <br />
                {a.line1}
                {a.line2 && <>, {a.line2}</>}
                <br />
                {a.city}, {a.state} {a.postalCode}
                <br />
                {a.country} · {a.phone}
              </address>
              {!a.isDefault && (
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setDefault(a.id)}>
                  <Check className="size-3.5" /> Set as default
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit address" : "Add new address"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <F name="label" label="Label" def={editing?.label} placeholder="Home" />
            <F name="fullName" label="Full name" def={editing?.fullName} />
            <F name="line1" label="Address line 1" def={editing?.line1} className="sm:col-span-2" />
            <F name="line2" label="Address line 2" def={editing?.line2} className="sm:col-span-2" required={false} />
            <F name="city" label="City" def={editing?.city} />
            <F name="state" label="State / Region" def={editing?.state} />
            <F name="postalCode" label="Postal code" def={editing?.postalCode} />
            <F name="country" label="Country" def={editing?.country} />
            <F name="phone" label="Phone" def={editing?.phone} className="sm:col-span-2" />
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save changes" : "Add address"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function F({
  name,
  label,
  def,
  className,
  required = true,
  placeholder,
}: {
  name: string;
  label: string;
  def?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      <Input name={name} defaultValue={def} required={required} placeholder={placeholder} />
    </div>
  );
}
