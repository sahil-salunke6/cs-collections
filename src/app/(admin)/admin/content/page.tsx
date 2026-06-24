"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Save, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { CmsData, CmsHeroStat, CmsHeroTile, CmsCollection } from "@/lib/cms";

type Tab = "announcement" | "hero" | "heroImages" | "limitedBanner" | "collections";

export default function AdminContentPage() {
  const [tab, setTab] = useState<Tab>("announcement");
  const [data, setData] = useState<CmsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/cms")
      .then((r) => r.json())
      .then(setData);
  }, []);

  async function save() {
    if (!data) return;
    setSaving(true);
    await fetch("/api/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        announcement: data.announcement,
        hero: data.hero,
        heroTiles: data.heroTiles,
        limitedBanner: data.limitedBanner,
        collections: data.collections,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "announcement", label: "Announcement Bar" },
    { id: "hero", label: "Hero Text" },
    { id: "heroImages", label: "Hero Images" },
    { id: "limitedBanner", label: "Limited Banner" },
    { id: "collections", label: "Collections" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Content Editor</h1>
          <p className="text-sm text-muted-foreground">Edit homepage content, banners, and hero images.</p>
        </div>
        <Button onClick={save} disabled={saving} size="sm">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saved ? "Saved!" : "Save changes"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "announcement" && (
        <AnnouncementEditor
          value={data.announcement}
          onChange={(v) => setData({ ...data, announcement: v })}
        />
      )}

      {tab === "hero" && (
        <HeroEditor
          value={data.hero}
          onChange={(v) => setData({ ...data, hero: v })}
        />
      )}

      {tab === "heroImages" && (
        <HeroImagesEditor
          value={data.heroTiles ?? []}
          onChange={(v) => setData({ ...data, heroTiles: v })}
        />
      )}

      {tab === "limitedBanner" && (
        <LimitedBannerEditor
          value={data.limitedBanner}
          onChange={(v) => setData({ ...data, limitedBanner: v })}
        />
      )}

      {tab === "collections" && (
        <CollectionsEditor
          value={data.collections ?? []}
          onChange={(v) => setData({ ...data, collections: v })}
        />
      )}
    </div>
  );
}

function AnnouncementEditor({
  value,
  onChange,
}: {
  value: CmsData["announcement"];
  onChange: (v: CmsData["announcement"]) => void;
}) {
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-semibold">Announcement Bar</h2>
      <p className="text-sm text-muted-foreground -mt-3">
        The thin banner at the top of every page. Good for shipping updates, sale announcements, etc.
      </p>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={value.enabled}
          onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
          className="size-4 accent-primary"
        />
        <span className="text-sm font-medium">Show announcement bar</span>
        <Badge variant={value.enabled ? "default" : "muted"} className="text-xs">
          {value.enabled ? "Visible" : "Hidden"}
        </Badge>
      </label>

      <Field label="Announcement text">
        <Input
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          placeholder="e.g. Free shipping on orders over ₹2000"
        />
      </Field>

      <Field label="Link URL (optional)" hint="Leave empty for no link">
        <Input
          value={value.link ?? ""}
          onChange={(e) => onChange({ ...value, link: e.target.value || null })}
          placeholder="https://..."
        />
      </Field>

      <Preview>
        {value.enabled && (
          <div className="rounded-lg bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground">
            {value.text || <span className="opacity-50">No text set</span>}
          </div>
        )}
        {!value.enabled && (
          <p className="text-center text-xs text-muted-foreground">Bar is hidden</p>
        )}
      </Preview>
    </div>
  );
}

function HeroEditor({
  value,
  onChange,
}: {
  value: CmsData["hero"];
  onChange: (v: CmsData["hero"]) => void;
}) {
  function updateStat(i: number, patch: Partial<CmsHeroStat>) {
    const stats = value.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    onChange({ ...value, stats });
  }
  function addStat() {
    onChange({ ...value, stats: [...value.stats, { value: "", label: "" }] });
  }
  function removeStat(i: number) {
    onChange({ ...value, stats: value.stats.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-semibold">Hero Section</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Badge text">
          <Input
            value={value.badge}
            onChange={(e) => onChange({ ...value, badge: e.target.value })}
            placeholder="e.g. 2024/25 On-Pitch Collection"
          />
        </Field>
        <div />

        <Field label="Headline — line 1">
          <Input
            value={value.line1}
            onChange={(e) => onChange({ ...value, line1: e.target.value })}
            placeholder="e.g. Wear the Badge."
          />
        </Field>
        <Field label="Headline — line 2 (accent colour)">
          <Input
            value={value.line2}
            onChange={(e) => onChange({ ...value, line2: e.target.value })}
            placeholder="e.g. Own the Moment."
          />
        </Field>
      </div>

      <Field label="Subtext">
        <Textarea
          value={value.subtext}
          onChange={(e) => onChange({ ...value, subtext: e.target.value })}
          rows={3}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary CTA text">
          <Input value={value.cta1Text} onChange={(e) => onChange({ ...value, cta1Text: e.target.value })} />
        </Field>
        <Field label="Primary CTA link">
          <Input value={value.cta1Href} onChange={(e) => onChange({ ...value, cta1Href: e.target.value })} />
        </Field>
        <Field label="Secondary CTA text">
          <Input value={value.cta2Text} onChange={(e) => onChange({ ...value, cta2Text: e.target.value })} />
        </Field>
        <Field label="Secondary CTA link">
          <Input value={value.cta2Href} onChange={(e) => onChange({ ...value, cta2Href: e.target.value })} />
        </Field>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium">Stats</label>
          <Button size="sm" variant="outline" onClick={addStat}>
            <Plus className="size-3.5" /> Add stat
          </Button>
        </div>
        <div className="space-y-2">
          {value.stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                className="w-24 shrink-0"
                value={s.value}
                onChange={(e) => updateStat(i, { value: e.target.value })}
                placeholder="100%"
              />
              <Input
                value={s.label}
                onChange={(e) => updateStat(i, { label: e.target.value })}
                placeholder="Authentic"
              />
              <button
                onClick={() => removeStat(i)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Preview>
        <div className="rounded-lg border border-border bg-background/50 p-4">
          <span className="inline-block rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
            {value.badge || "Badge"}
          </span>
          <h3 className="mt-2 font-display text-xl font-bold">
            {value.line1 || "Line 1"} <span className="text-primary">{value.line2 || "Line 2"}</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{value.subtext}</p>
          <div className="mt-3 flex gap-4 text-xs">
            {value.stats.map((s, i) => (
              <div key={i}>
                <span className="font-bold">{s.value}</span>{" "}
                <span className="text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Preview>
    </div>
  );
}

const TILE_LABELS = ["Top-left tile", "Top-right tile", "Bottom-left tile", "Bottom-right tile"];

function HeroImagesEditor({
  value,
  onChange,
}: {
  value: CmsHeroTile[];
  onChange: (v: CmsHeroTile[]) => void;
}) {
  const tiles: CmsHeroTile[] =
    value.length === 4
      ? value
      : [
          { image: null, colors: ["#FCE000", "#009C3B", "#002776"], view: "front" },
          { image: null, colors: ["#FFFFFF", "#FEBE10", "#00529F"], view: "back", name: "Madrid", number: 7 },
          { image: null, colors: ["#A50044", "#004D98", "#FFED02"], view: "front" },
          { image: null, colors: ["#6CABDD", "#FFFFFF", "#1C2C5B"], view: "front" },
        ];

  function updateTile(i: number, patch: Partial<CmsHeroTile>) {
    onChange(tiles.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <div>
        <h2 className="font-display text-lg font-semibold">Hero Image Tiles</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a real product image for each floating tile. Leave empty to use the jersey visual fallback.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {tiles.map((tile, i) => (
          <TileUploader key={i} label={TILE_LABELS[i]} tile={tile} onUpdate={(p) => updateTile(i, p)} />
        ))}
      </div>
    </div>
  );
}

function TileUploader({
  label,
  tile,
  onUpdate,
}: {
  label: string;
  tile: CmsHeroTile;
  onUpdate: (p: Partial<CmsHeroTile>) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/cms/upload", { method: "POST", body: form });
    const json = await res.json();
    setUploading(false);
    if (json.url) onUpdate({ image: json.url });
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <p className="text-sm font-medium">{label}</p>

      {tile.image ? (
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border">
          <img src={tile.image} alt="" className="h-full w-full object-cover" />
          <button
            onClick={() => onUpdate({ image: null })}
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <div
          className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/60"
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <Upload className="size-5" />
              <span className="text-xs">Upload image</span>
              <span className="text-[10px] opacity-60">JPG, PNG, WebP</span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {!tile.image && (
        <p className="text-[11px] text-muted-foreground">
          Fallback: jersey visual with colors{" "}
          {tile.colors.map((c, ci) => (
            <span key={ci} className="inline-block size-3 rounded-full border border-border align-middle mx-0.5" style={{ backgroundColor: c }} />
          ))}
        </p>
      )}

      {tile.image && (
        <Button size="sm" variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
          <Upload className="size-3.5" /> Replace image
        </Button>
      )}
    </div>
  );
}

function LimitedBannerEditor({
  value,
  onChange,
}: {
  value: CmsData["limitedBanner"];
  onChange: (v: CmsData["limitedBanner"]) => void;
}) {
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <div>
        <h2 className="font-display text-lg font-semibold">Limited Edition Banner</h2>
        <p className="text-sm text-muted-foreground mt-1">
          The gradient banner section on the homepage that promotes limited edition kits.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Eyebrow (small label above headline)">
          <Input
            value={value.eyebrow}
            onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
            placeholder="e.g. Limited Edition"
          />
        </Field>
        <div />
        <Field label="Headline">
          <Input
            value={value.headline}
            onChange={(e) => onChange({ ...value, headline: e.target.value })}
            placeholder="e.g. Rare kits. Limited runs. Gone fast."
          />
        </Field>
      </div>

      <Field label="Subtext">
        <Textarea
          value={value.subtext}
          onChange={(e) => onChange({ ...value, subtext: e.target.value })}
          rows={2}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA button text">
          <Input
            value={value.ctaText}
            onChange={(e) => onChange({ ...value, ctaText: e.target.value })}
            placeholder="e.g. Shop Limited Edition"
          />
        </Field>
        <Field label="CTA link">
          <Input
            value={value.ctaHref}
            onChange={(e) => onChange({ ...value, ctaHref: e.target.value })}
            placeholder="/products?badge=limited"
          />
        </Field>
      </div>

      <Preview>
        <div className="rounded-xl bg-gradient-to-br from-primary to-accent px-5 py-6 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
            {value.eyebrow || "Eyebrow"}
          </p>
          <h3 className="mt-2 font-display text-lg font-bold">{value.headline || "Headline"}</h3>
          <p className="mt-1 text-xs text-white/80">{value.subtext}</p>
          <div className="mt-3 inline-block rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground">
            {value.ctaText || "CTA"}
          </div>
        </div>
      </Preview>
    </div>
  );
}

const SLUG_LABELS: Record<string, string> = {
  "national-teams": "National Teams",
  "club-teams": "Club Teams",
  retro: "Retro Jerseys",
  "new-arrivals": "New Arrivals",
};

function CollectionsEditor({
  value,
  onChange,
}: {
  value: CmsCollection[];
  onChange: (v: CmsCollection[]) => void;
}) {
  function update(slug: string, patch: Partial<CmsCollection>) {
    onChange(value.map((c) => (c.slug === slug ? { ...c, ...patch } : c)));
  }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <div>
        <h2 className="font-display text-lg font-semibold">Shop by Collection Tiles</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Edit the label and link for each collection tile. Jersey visuals are automatic per category.
        </p>
      </div>
      <div className="space-y-3">
        {value.map((c) => (
          <div key={c.slug} className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="muted" className="font-mono text-xs">{c.slug}</Badge>
              <span className="text-sm font-semibold text-foreground">{SLUG_LABELS[c.slug] ?? c.slug}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Title">
                <Input
                  value={c.title}
                  onChange={(e) => update(c.slug, { title: e.target.value })}
                  placeholder="e.g. National Teams"
                />
              </Field>
              <Field label="Subtitle">
                <Input
                  value={c.subtitle}
                  onChange={(e) => update(c.slug, { subtitle: e.target.value })}
                  placeholder="e.g. Represent your nation"
                />
              </Field>
              <Field label="Link URL">
                <Input
                  value={c.href}
                  onChange={(e) => update(c.slug, { href: e.target.value })}
                  placeholder="/national-teams"
                />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function Preview({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-4">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Preview</p>
      {children}
    </div>
  );
}
