"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { Product, ProductBadge, JerseyKit, TeamType } from "@/types";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const BADGES: ProductBadge[] = ["new", "bestseller", "limited", "retro", "sale"];
const KITS: JerseyKit[] = ["home", "away", "third", "goalkeeper", "training", "special"];
const TYPES: TeamType[] = ["national", "club", "retro"];

function blankProduct(): Product {
  return {
    id: `new-${Date.now()}`,
    slug: "",
    name: "",
    team: "",
    teamId: "",
    type: "club",
    kit: "home",
    season: "2024/25",
    brand: "",
    category: "Mens",
    league: "",
    confederation: "",
    price: 1100,
    currency: "INR",
    images: [],
    sizes: SIZES.map((size) => ({ size, stock: 10 })),
    colors: [],
    rating: 4.5,
    reviewCount: 0,
    tags: [],
    badges: [],
    shortDescription: "",
    description: "",
    teamInfo: "",
    seasonInfo: "",
    isFeatured: false,
    isLimited: false,
    createdAt: new Date().toISOString(),
  };
}

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";

  const [product, setProduct] = useState<Product | null>(isNew ? blankProduct() : null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [colorDraft, setColorDraft] = useState("#FF6200");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/cms/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) router.push("/admin/products");
        else setProduct(data);
      });
  }, [id, isNew, router]);

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((p) => p && { ...p, [key]: value });
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const r = await fetch("/api/cms/upload", { method: "POST", body: form });
    const { url } = await r.json();
    setUploading(false);
    if (url) setProduct((p) => p && { ...p, images: [...p.images, url] });
  }

  async function save() {
    if (!product) return;
    if (!product.name.trim()) {
      toast.error("Product name is required", { description: "Please fill in the name before saving." });
      return;
    }
    setSaving(true);
    try {
      const res = isNew
        ? await fetch("/api/cms/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...product, slug: product.slug || slugify(product.name) }),
          })
        : await fetch(`/api/cms/products/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
          });
      if (!res.ok) throw new Error("Request failed");

      setSaving(false);
      setSaved(true);
      toast.success(isNew ? "Product created" : "Changes saved", {
        description: isNew
          ? `${product.name} was added to your catalogue.`
          : `${product.name} has been updated.`,
      });
      // Briefly show "Saved!" on the button, then return to the listing.
      setTimeout(() => router.push("/admin/products"), 700);
    } catch {
      toast.error("Couldn't save", { description: "Something went wrong. Please try again." });
      setSaving(false);
    }
  }

  if (!product) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/products")}>
          <ArrowLeft className="size-4" /> Products
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {isNew ? "New Product" : "Edit Product"}
          </h1>
        </div>
        <Button onClick={save} disabled={saving || saved} size="sm">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saved ? "Saved!" : isNew ? "Create" : "Save changes"}
        </Button>
      </div>

      {isNew && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="font-display text-base font-semibold">👋 Adding a new product — quick guide</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Fill in the <strong>Product name</strong> and <strong>Price</strong> — these are the only required fields (marked with a red *).</li>
            <li>Add at least one <strong>photo</strong> in the Images box on the right (upload from your computer).</li>
            <li>Set the <strong>stock</strong> for each size so customers can buy it.</li>
            <li>Everything else is optional but helps customers — fill in what you can.</li>
            <li>Press <strong>Create</strong> at the top-right when you&apos;re done.</li>
          </ol>
          <p className="mt-2 text-xs text-muted-foreground">
            Tip: To save time, go back and use the <strong>Duplicate</strong> button on a similar
            product instead — it copies everything so you only change what&apos;s different.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          <Card title="Basic info">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product name" required hint="The full name shoppers see. Include team, season and kit.">
                <Input
                  value={product.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Brazil 2024/25 Home Jersey"
                />
              </Field>
              <Field label="URL slug" hint="The web address for this product. Leave empty — it fills in automatically from the name.">
                <Input
                  value={product.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder={slugify(product.name) || "e.g. brazil-home-2425"}
                />
              </Field>
              <Field label="Brand" hint="Who makes the jersey.">
                <Input value={product.brand} onChange={(e) => set("brand", e.target.value)} placeholder="e.g. Nike, adidas, Puma" />
              </Field>
              <Field label="Season" hint="Which season this kit is from.">
                <Input value={product.season} onChange={(e) => set("season", e.target.value)} placeholder="e.g. 2024/25" />
              </Field>
              <Field label="Team name" hint="The club or country this jersey belongs to.">
                <Input value={product.team} onChange={(e) => set("team", e.target.value)} placeholder="e.g. Brazil" />
              </Field>
              <Field label="Team ID" hint="Short code that links to the team filter. If unsure, copy the team name in lowercase with dashes.">
                <Input value={product.teamId} onChange={(e) => set("teamId", e.target.value)} placeholder="e.g. br, real-madrid" />
              </Field>
              <Field label="League" hint="Only for club jerseys. Leave empty for national teams.">
                <Input value={product.league ?? ""} onChange={(e) => set("league", e.target.value)} placeholder="e.g. Premier League, LaLiga" />
              </Field>
              <Field label="Confederation" hint="The governing body. Optional.">
                <Input value={product.confederation ?? ""} onChange={(e) => set("confederation", e.target.value)} placeholder="e.g. UEFA, CONMEBOL" />
              </Field>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field label="Type" hint="National team, club, or a retro/classic kit.">
                <select
                  value={product.type}
                  onChange={(e) => set("type", e.target.value as TeamType)}
                  className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Kit" hint="Which version of the kit this is.">
                <select
                  value={product.kit}
                  onChange={(e) => set("kit", e.target.value as JerseyKit)}
                  className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {KITS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </Field>
              <Field label="Category" hint="Who the jersey is sized for.">
                <select
                  value={product.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {["Mens", "Womens", "Kids", "Retro"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
          </Card>

          <Card title="Description">
            <div className="space-y-4">
              <Field label="Short description" hint="One line shown under the product in lists.">
                <Textarea
                  value={product.shortDescription}
                  onChange={(e) => set("shortDescription", e.target.value)}
                  rows={2}
                  placeholder="e.g. Nike Stadium Home shirt — 2024/25 season."
                />
              </Field>
              <Field label="Full description" hint="The main paragraph on the product page. Describe the fabric, fit and any special details.">
                <Textarea
                  value={product.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={4}
                  placeholder="e.g. The official 2024/25 home jersey, made with sweat-wicking fabric and a tailored fit…"
                />
              </Field>
              <Field label="Team info" hint="A sentence about the team. Optional.">
                <Textarea
                  value={product.teamInfo}
                  onChange={(e) => set("teamInfo", e.target.value)}
                  rows={2}
                  placeholder="e.g. Brazil is the most successful nation in World Cup history."
                />
              </Field>
              <Field label="Season info" hint="A sentence about this season's kit. Optional.">
                <Textarea
                  value={product.seasonInfo}
                  onChange={(e) => set("seasonInfo", e.target.value)}
                  rows={2}
                  placeholder="e.g. Worn during the 2024/25 domestic and international campaign."
                />
              </Field>
            </div>
          </Card>

          <Card title="Stock & sizes">
            <p className="mb-3 text-xs text-muted-foreground">
              Set how many units you have for each size. Set a size to 0 to show it as &ldquo;Sold
              out&rdquo;, or remove it with the trash icon if you don&apos;t stock it at all.
            </p>
            <div className="space-y-2">
              {product.sizes.map((s, i) => (
                <div key={s.size} className="flex items-center gap-3">
                  <span className="w-12 shrink-0 text-sm font-medium">{s.size}</span>
                  <Input
                    type="number"
                    min={0}
                    value={s.stock}
                    onChange={(e) => {
                      const sizes = product.sizes.map((sz, idx) =>
                        idx === i ? { ...sz, stock: Number(e.target.value) } : sz,
                      );
                      set("sizes", sizes);
                    }}
                    className="w-24"
                  />
                  <span className="text-xs text-muted-foreground">units</span>
                  <button
                    className="ml-auto text-muted-foreground hover:text-destructive"
                    onClick={() => set("sizes", product.sizes.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => {
                  const existing = new Set(product.sizes.map((s) => s.size));
                  const next = SIZES.find((s) => !existing.has(s)) ?? "Custom";
                  set("sizes", [...product.sizes, { size: next, stock: 0 }]);
                }}
              >
                <Plus className="size-3.5" /> Add size
              </Button>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Card title="Pricing">
            <div className="space-y-4">
              <Field label="Price (₹)" required hint="Normal selling price. Numbers only — don't type the ₹ symbol.">
                <Input
                  type="number"
                  min={0}
                  value={product.price}
                  onChange={(e) => set("price", Number(e.target.value))}
                  placeholder="1100"
                />
              </Field>
              <Field label="Sale price (₹)" hint="Discounted price, shown crossed-out next to the original. Leave empty if not on sale.">
                <Input
                  type="number"
                  min={0}
                  value={product.salePrice ?? ""}
                  onChange={(e) =>
                    set("salePrice", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="e.g. 899"
                />
              </Field>
            </div>
          </Card>

          <Card title="Images">
            <p className="mb-3 text-xs text-muted-foreground">
              The first image is the main photo customers see. Upload photos from your computer, or
              paste an image link and press Enter.
            </p>
            <div className="space-y-3">
              {product.images.map((url, i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="aspect-square w-full object-cover" />
                  <button
                    onClick={() => set("images", product.images.filter((_, idx) => idx !== i))}
                    className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}

              <Field label="Add image link (optional)" hint="Paste a web image address and press Enter, or use the upload button below.">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const v = (e.target as HTMLInputElement).value.trim();
                        if (v) {
                          set("images", [...product.images, v]);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                </div>
              </Field>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file);
                  e.target.value = "";
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                Upload image
              </Button>
            </div>
          </Card>

          <Card title="Badges & flags">
            <div className="space-y-4">
              <Field label="Badges" hint="Small coloured labels shown on the product (e.g. on a corner). Click to turn each on or off.">
                <div className="flex flex-wrap gap-2">
                  {BADGES.map((b) => {
                    const on = product.badges.includes(b);
                    return (
                      <button
                        key={b}
                        onClick={() =>
                          set(
                            "badges",
                            on
                              ? product.badges.filter((x) => x !== b)
                              : [...product.badges, b],
                          )
                        }
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium transition-colors capitalize",
                          on
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50",
                        )}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <div>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={product.isFeatured}
                    onChange={(e) => set("isFeatured", e.target.checked)}
                    className="size-4 accent-primary"
                  />
                  <span className="text-sm font-medium">Featured product</span>
                </label>
                <p className="ml-[26px] mt-1 text-xs text-muted-foreground">Highlights it in featured spots around the store.</p>
              </div>
              <div>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={product.isLimited}
                    onChange={(e) => set("isLimited", e.target.checked)}
                    className="size-4 accent-primary"
                  />
                  <span className="text-sm font-medium">Limited edition</span>
                </label>
                <p className="ml-[26px] mt-1 text-xs text-muted-foreground">Shows it in the homepage &ldquo;Limited Edition&rdquo; banner.</p>
              </div>
            </div>
          </Card>

          <Card title="Colors">
            <p className="mb-3 text-xs text-muted-foreground">
              The kit&apos;s main colours. These power the generated jersey artwork when there&apos;s
              no photo. Pick a colour to add it; click a circle to remove it.
            </p>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    title={c}
                    onClick={() => set("colors", product.colors.filter((_, idx) => idx !== i))}
                    className="relative size-8 rounded-full border-2 border-border transition-transform hover:scale-110 group"
                    style={{ backgroundColor: c }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 text-[10px]">✕</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  aria-label="Choose a colour"
                  className="h-9 w-12 cursor-pointer p-1"
                  value={colorDraft}
                  onChange={(e) => setColorDraft(e.target.value)}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (!product.colors.includes(colorDraft)) {
                      set("colors", [...product.colors, colorDraft]);
                    }
                  }}
                >
                  <Plus className="size-3.5" /> Add colour
                </Button>
                <span className="text-xs text-muted-foreground">Pick a colour, then press Add</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 font-display text-base font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
