"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { JerseyKit } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleBrand,
  toggleKit,
  toggleSize,
  setPriceRange,
  resetFilters,
} from "@/store/slices/filtersSlice";

const BRANDS = ["Nike", "adidas", "Puma", "Kappa"];
const KITS: { value: JerseyKit; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "away", label: "Away" },
  { value: "third", label: "Third" },
];
const SIZES = ["S", "M", "L", "XL", "XXL"];
const MAX = 1500;

export function FilterSidebar({ onClose }: { onClose?: () => void }) {
  const dispatch = useAppDispatch();
  const f = useAppSelector((s) => s.filters);
  const [range, setRange] = useState<[number, number]>([f.minPrice ?? 0, f.maxPrice ?? MAX]);

  const activeCount =
    f.brand.length + f.kit.length + f.size.length + (f.minPrice != null || f.maxPrice != null ? 1 : 0);

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Filters {activeCount > 0 && `(${activeCount})`}</h2>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button onClick={() => dispatch(resetFilters())} className="text-xs font-medium text-accent hover:underline">
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} aria-label="Close filters" className="lg:hidden">
              <X className="size-5" />
            </button>
          )}
        </div>
      </div>

      <FilterGroup title="Brand">
        {BRANDS.map((b) => (
          <label key={b} className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
            <Checkbox checked={f.brand.includes(b)} onCheckedChange={() => dispatch(toggleBrand(b))} />
            {b}
          </label>
        ))}
      </FilterGroup>

      <Separator />

      <FilterGroup title="Kit">
        {KITS.map((k) => (
          <label key={k.value} className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
            <Checkbox checked={f.kit.includes(k.value)} onCheckedChange={() => dispatch(toggleKit(k.value))} />
            {k.label}
          </label>
        ))}
      </FilterGroup>

      <Separator />

      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => dispatch(toggleSize(s))}
              className={cn(
                "flex h-10 min-w-10 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors",
                f.size.includes(s) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      <Separator />

      <FilterGroup title="Price">
        <Slider
          value={range}
          min={0}
          max={MAX}
          step={50}
          onValueChange={(v) => setRange([v[0], v[1]] as [number, number])}
          onValueCommit={(v) => dispatch(setPriceRange({ min: v[0] || null, max: v[1] >= MAX ? null : v[1] }))}
        />
        <div className="mt-3 flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(range[0])}</span>
          <span>{range[1] >= MAX ? `${formatPrice(MAX)}+` : formatPrice(range[1])}</span>
        </div>
      </FilterGroup>

      {onClose && (
        <Button className="w-full lg:hidden" onClick={onClose}>
          Show results
        </Button>
      )}
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}
