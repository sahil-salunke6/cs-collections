"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { JerseyVisual } from "@/components/common/JerseyVisual";
import { Price } from "@/components/common/Price";
import { useSearch } from "@/lib/hooks/queries";

const SUGGESTIONS = ["Brazil", "Real Madrid", "Retro", "Away kit", "Argentina"];

export function SearchCommand({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const { data, isFetching } = useSearch(q);

  function go(href: string) {
    onOpenChange(false);
    setQ("");
    router.push(href);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-24 max-w-2xl translate-y-0 gap-0 p-0">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && q.trim()) go(`/search?q=${encodeURIComponent(q)}`);
            }}
            placeholder="Search teams, jerseys, brands…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {isFetching && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear">
              <X className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {q.trim().length <= 1 ? (
            <div className="p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <TrendingUp className="size-3.5" /> Popular searches
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQ(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : data && data.length > 0 ? (
            <ul className="divide-y divide-border">
              {data.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.slug}`}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
                  >
                    <span className="size-12 shrink-0 overflow-hidden rounded-md border border-border">
                      <JerseyVisual colors={p.colors} view="front" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.team}</span>
                    </span>
                    <Price price={p.price} salePrice={p.salePrice} size="sm" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-6 text-center text-sm text-muted-foreground">No results for “{q}”.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
