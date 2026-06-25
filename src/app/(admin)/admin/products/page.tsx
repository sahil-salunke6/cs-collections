"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ExternalLink, Loader2, Search, ImagePlus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, unitPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  async function load() {
    const r = await fetch("/api/cms/products");
    setProducts(await r.json());
  }

  useEffect(() => { load(); }, []);

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/cms/products/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  }

  async function duplicateProduct(p: Product) {
    setDuplicating(p.id);
    const stamp = Date.now();
    const copy: Product = {
      ...p,
      id: `new-${stamp}`,
      name: `${p.name} (Copy)`,
      slug: `${p.slug || "product"}-copy-${stamp.toString(36)}`,
      isFeatured: false,
      createdAt: new Date().toISOString(),
    };
    await fetch("/api/cms/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(copy),
    });
    setDuplicating(null);
    toast.success("Product duplicated", { description: "Edit the copy and save your changes." });
    // Jump straight into editing the new copy.
    router.push(`/admin/products/${copy.id}/edit`);
  }

  const filtered = (products ?? []).filter((p) =>
    !query || `${p.name} ${p.team} ${p.brand}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your product catalogue — edit details, images, and pricing.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/products/new/edit">
            <Plus className="size-4" /> Add product
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <Th>Product</Th>
                <Th>Team</Th>
                <Th>Type</Th>
                <Th>Stock</Th>
                <Th className="text-right">Price</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {!products
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.map((p) => {
                    const stock = p.sizes.reduce((n, s) => n + s.stock, 0);
                    const isNew = !p.id.startsWith("p") || p.id.length < 4;
                    return (
                      <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <ProductThumb product={p} />
                            <div className="min-w-0">
                              <p className="truncate font-medium max-w-[180px]">{p.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {p.brand} · {p.season}
                                {isNew && <Badge variant="accent" className="ml-1.5 text-[10px]">New</Badge>}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{p.team}</td>
                        <td className="px-4 py-3 capitalize text-muted-foreground">{p.type}</td>
                        <td className="px-4 py-3">
                          <span className={cn("font-medium", stock < 20 ? "text-warning" : "text-foreground")}>
                            {stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{formatPrice(unitPrice(p))}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button asChild size="icon" variant="ghost" className="size-8">
                              <Link href={`/products/${p.slug}`} target="_blank">
                                <ExternalLink className="size-3.5" />
                              </Link>
                            </Button>
                            <Button asChild size="icon" variant="ghost" className="size-8" title="Edit">
                              <Link href={`/admin/products/${p.id}/edit`}>
                                <Pencil className="size-3.5" />
                              </Link>
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8"
                              title="Duplicate — make an editable copy"
                              onClick={() => duplicateProduct(p)}
                              disabled={duplicating === p.id}
                            >
                              {duplicating === p.id ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <Copy className="size-3.5" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              title="Delete"
                              onClick={() => deleteProduct(p.id)}
                              disabled={deleting === p.id}
                            >
                              {deleting === p.id ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="size-3.5" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
        {products && filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">No products match your search.</p>
        )}
      </div>
    </div>
  );
}

function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground", className)}>
      {children}
    </th>
  );
}

function ProductThumb({ product: p }: { product: Product }) {
  const img = p.images?.[0];
  if (!img) {
    return (
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
        <ImagePlus className="size-4 text-muted-foreground" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={img} alt={p.name} className="size-10 shrink-0 rounded-lg border border-border object-cover" />
  );
}
