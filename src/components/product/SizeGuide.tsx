"use client";

import { Ruler } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

const ROWS = [
  { size: "S", chest: "36–38", length: "27", eu: "44/46" },
  { size: "M", chest: "39–41", length: "28", eu: "48/50" },
  { size: "L", chest: "42–44", length: "29", eu: "52/54" },
  { size: "XL", chest: "45–47", length: "30", eu: "56/58" },
  { size: "XXL", chest: "48–50", length: "31", eu: "60/62" },
];

export function SizeGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <Ruler className="size-4" /> Size Guide
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
          <DialogDescription>Measurements in inches. Our jerseys have an athletic fit — size up for a relaxed fit.</DialogDescription>
        </DialogHeader>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Size</th>
                <th className="px-4 py-2.5 font-semibold">Chest</th>
                <th className="px-4 py-2.5 font-semibold">Length</th>
                <th className="px-4 py-2.5 font-semibold">EU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ROWS.map((r) => (
                <tr key={r.size}>
                  <td className="px-4 py-2.5 font-semibold">{r.size}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{r.chest}"</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{r.length}"</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{r.eu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Tip: measure around the fullest part of your chest, keeping the tape horizontal.
        </p>
      </DialogContent>
    </Dialog>
  );
}
