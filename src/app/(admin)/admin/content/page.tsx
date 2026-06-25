"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, ImagePlus, Loader2, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type {
  CmsCollection,
  CmsData,
  CmsFeaturedTeams,
  CmsHeroStat,
  CmsHeroTile,
  CmsInstagramPost,
  CmsReview,
} from "@/lib/cms";
import type { Team } from "@/types";
import teamsData from "@/data/teams.json";

const BASE_TEAMS = teamsData as Team[];

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type Tab =
  | "announcement"
  | "hero"
  | "heroImages"
  | "limitedBanner"
  | "collections"
  | "featuredTeams"
  | "reviews"
  | "instagram";

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
    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          announcement: data.announcement,
          hero: data.hero,
          heroTiles: data.heroTiles,
          limitedBanner: data.limitedBanner,
          collections: data.collections,
          featuredTeams: data.featuredTeams,
          customTeams: data.customTeams,
          teamOverrides: data.teamOverrides,
          reviews: data.reviews,
          instagramPosts: data.instagramPosts,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      toast.success("Content saved", { description: "Your changes are now live on the site." });
    } catch {
      toast.error("Couldn't save", { description: "Something went wrong. Please try again." });
    } finally {
      setSaving(false);
    }
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
    { id: "featuredTeams", label: "Featured Teams" },
    { id: "reviews", label: "Reviews" },
    { id: "instagram", label: "Instagram" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Content Editor</h1>
          <p className="text-sm text-muted-foreground">Edit homepage content, banners, and media.</p>
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
          onChange={(v) => setData((d) => (d ? { ...d, announcement: v } : d))}
        />
      )}
      {tab === "hero" && (
        <HeroEditor value={data.hero} onChange={(v) => setData((d) => (d ? { ...d, hero: v } : d))} />
      )}
      {tab === "heroImages" && (
        <HeroImagesEditor
          value={data.heroTiles ?? []}
          onChange={(v) => setData((d) => (d ? { ...d, heroTiles: v } : d))}
        />
      )}
      {tab === "limitedBanner" && (
        <LimitedBannerEditor
          value={data.limitedBanner}
          onChange={(v) => setData((d) => (d ? { ...d, limitedBanner: v } : d))}
        />
      )}
      {tab === "collections" && (
        <CollectionsEditor
          value={data.collections ?? []}
          onChange={(v) => setData((d) => (d ? { ...d, collections: v } : d))}
        />
      )}
      {tab === "featuredTeams" && (
        <FeaturedTeamsEditor
          value={data.featuredTeams ?? { national: [], club: [] }}
          onChange={(v) => setData((d) => (d ? { ...d, featuredTeams: v } : d))}
          customTeams={data.customTeams ?? []}
          onCustomTeamsChange={(v) => setData((d) => (d ? { ...d, customTeams: v } : d))}
          teamOverrides={data.teamOverrides ?? {}}
          onTeamOverridesChange={(v) => setData((d) => (d ? { ...d, teamOverrides: v } : d))}
        />
      )}
      {tab === "reviews" && (
        <ReviewsEditor
          value={data.reviews ?? []}
          onChange={(v) => setData((d) => (d ? { ...d, reviews: v } : d))}
        />
      )}
      {tab === "instagram" && (
        <InstagramEditor
          value={data.instagramPosts ?? []}
          onChange={(v) => setData((d) => (d ? { ...d, instagramPosts: v } : d))}
        />
      )}
    </div>
  );
}

// ── Announcement ──────────────────────────────────────────────────

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

// ── Hero ──────────────────────────────────────────────────────────

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

// ── Hero Images ───────────────────────────────────────────────────

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

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {!tile.image && (
        <p className="text-[11px] text-muted-foreground">
          Fallback: jersey visual with colors{" "}
          {tile.colors.map((c, ci) => (
            <span
              key={ci}
              className="inline-block size-3 rounded-full border border-border align-middle mx-0.5"
              style={{ backgroundColor: c }}
            />
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

// ── Limited Banner ─────────────────────────────────────────────────

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

// ── Collections ────────────────────────────────────────────────────

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

// ── Featured Teams ─────────────────────────────────────────────────

function FeaturedTeamsEditor({
  value,
  onChange,
  customTeams,
  onCustomTeamsChange,
  teamOverrides,
  onTeamOverridesChange,
}: {
  value: CmsFeaturedTeams;
  onChange: (v: CmsFeaturedTeams) => void;
  customTeams: Team[];
  onCustomTeamsChange: (v: Team[]) => void;
  teamOverrides: Record<string, Partial<Team>>;
  onTeamOverridesChange: (v: Record<string, Partial<Team>>) => void;
}) {
  // Base teams with admin overrides applied, then custom teams.
  const baseWithOverrides = BASE_TEAMS.map((t) =>
    teamOverrides[t.id] ? { ...t, ...teamOverrides[t.id] } : t,
  );
  const allTeams = [...baseWithOverrides, ...customTeams];
  const customIds = new Set(customTeams.map((t) => t.id));
  const customSlugs = new Set(customTeams.map((t) => t.slug));

  function toggle(type: "national" | "club", slug: string, add: boolean) {
    if (add) onChange({ ...value, [type]: [...value[type], slug] });
    else onChange({ ...value, [type]: value[type].filter((s) => s !== slug) });
  }

  // Reorder works on the *resolved* featured slugs (only those that map to a real
  // team, in display order), so its indices always line up with the rendered list.
  // Writing the resolved order back also self-heals any dangling slugs.
  function move(type: "national" | "club", orderedSlugs: string[], index: number, dir: -1 | 1) {
    const arr = [...orderedSlugs];
    const ni = index + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[index], arr[ni]] = [arr[ni], arr[index]];
    onChange({ ...value, [type]: arr });
  }

  function addCustomTeam(team: Team) {
    onCustomTeamsChange([...customTeams, team]);
    // Auto-feature the new team in its section so it shows up immediately.
    onChange({ ...value, [team.type]: [...value[team.type as "national" | "club"], team.slug] });
  }

  function deleteCustomTeam(slug: string) {
    if (!confirm("Delete this custom team? It will be removed from the homepage.")) return;
    onCustomTeamsChange(customTeams.filter((t) => t.slug !== slug));
    onChange({
      national: value.national.filter((s) => s !== slug),
      club: value.club.filter((s) => s !== slug),
    });
  }

  // Edit any team — custom teams are updated in place; base teams get an override entry.
  function updateTeam(team: Team, patch: Partial<Team>) {
    if (customIds.has(team.id)) {
      onCustomTeamsChange(customTeams.map((t) => (t.id === team.id ? { ...t, ...patch } : t)));
    } else {
      onTeamOverridesChange({
        ...teamOverrides,
        [team.id]: { ...(teamOverrides[team.id] ?? {}), ...patch },
      });
    }
    // If the category changed, move the team between the featured lists.
    if (patch.type && patch.type !== team.type) {
      const newType = patch.type as "national" | "club";
      const oldType = team.type as "national" | "club";
      const wasFeatured = value[oldType].includes(team.slug);
      const next: CmsFeaturedTeams = {
        national: value.national.filter((s) => s !== team.slug),
        club: value.club.filter((s) => s !== team.slug),
      };
      if (wasFeatured) next[newType] = [...next[newType], team.slug];
      onChange(next);
    }
  }

  function resetTeam(id: string) {
    const next = { ...teamOverrides };
    delete next[id];
    onTeamOverridesChange(next);
  }

  function renderSection(type: "national" | "club", sectionLabel: string) {
    const teamsOfType = allTeams.filter((t) => t.type === type);
    const featured = value[type] ?? [];
    const featuredList = featured
      .map((s) => teamsOfType.find((t) => t.slug === s))
      .filter(Boolean) as Team[];
    // Slugs that actually resolve, in display order — kept in lock-step with featuredList.
    const orderedSlugs = featuredList.map((t) => t.slug);
    const available = teamsOfType.filter((t) => !featured.includes(t.slug));

    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">{sectionLabel}</h3>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Featured on homepage ({featuredList.length})
          </p>
          {featuredList.length === 0 && (
            <p className="rounded-lg border border-dashed border-border py-4 text-center text-sm italic text-muted-foreground">
              No teams featured — add from the list below
            </p>
          )}
          <div className="space-y-2">
            {featuredList.map((team, i) => (
              <div
                key={team.slug}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2"
              >
                <TeamBadgeDot team={team} />
                <span className="flex-1 text-sm font-medium">{team.name}</span>
                {customSlugs.has(team.slug) && (
                  <Badge variant="accent" className="text-[10px]">Custom</Badge>
                )}
                <button
                  onClick={() => move(type, orderedSlugs, i, -1)}
                  disabled={i === 0}
                  className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-25"
                  title="Move up"
                >
                  <ChevronUp className="size-4" />
                </button>
                <button
                  onClick={() => move(type, orderedSlugs, i, 1)}
                  disabled={i === featuredList.length - 1}
                  className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-25"
                  title="Move down"
                >
                  <ChevronDown className="size-4" />
                </button>
                <button
                  onClick={() => toggle(type, team.slug, false)}
                  className="ml-1 text-muted-foreground transition-colors hover:text-destructive"
                  title="Remove from homepage"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {available.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Available (not featured)
            </p>
            <div className="space-y-2">
              {available.map((team) => (
                <div
                  key={team.slug}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2"
                >
                  <TeamBadgeDot team={team} />
                  <span className="flex-1 text-sm text-muted-foreground">{team.name}</span>
                  {customSlugs.has(team.slug) && (
                    <button
                      onClick={() => deleteCustomTeam(team.slug)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      title="Delete custom team"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggle(type, team.slug, true)}
                    className="h-7 text-xs"
                  >
                    <Plus className="size-3" /> Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
      <div>
        <h2 className="font-display text-lg font-semibold">Featured Teams</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose which teams appear in the homepage team sections, control their order, and create
          your own teams with custom badges.
        </p>
      </div>

      <AddTeamForm existingSlugs={new Set(allTeams.map((t) => t.slug))} onAdd={addCustomTeam} />

      <ManageTeamsPanel
        teams={allTeams}
        customIds={customIds}
        overriddenIds={new Set(Object.keys(teamOverrides))}
        onUpdate={updateTeam}
        onReset={resetTeam}
        onDelete={(team) => deleteCustomTeam(team.slug)}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {renderSection("national", "National Teams")}
        {renderSection("club", "Club Teams")}
      </div>
    </div>
  );
}

function ManageTeamsPanel({
  teams,
  customIds,
  overriddenIds,
  onUpdate,
  onReset,
  onDelete,
}: {
  teams: Team[];
  customIds: Set<string>;
  overriddenIds: Set<string>;
  onUpdate: (team: Team, patch: Partial<Team>) => void;
  onReset: (id: string) => void;
  onDelete: (team: Team) => void;
}) {
  const [open, setOpen] = useState(false);
  const customCount = teams.filter((t) => customIds.has(t.id)).length;

  return (
    <div className="rounded-xl border border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold">
          Manage all teams
          <span className="ml-2 font-normal text-muted-foreground">
            ({teams.length} total · {customCount} custom)
          </span>
        </span>
        {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>

      {open && (
        <div className="space-y-2 border-t border-border p-4">
          <p className="text-xs text-muted-foreground">
            Edit any team&apos;s name, badge, category or colour. Built-in teams can be reset to their
            original; teams you created can be deleted.
          </p>
          {teams.map((team) => (
            <TeamRow
              key={team.id}
              team={team}
              isCustom={customIds.has(team.id)}
              isOverridden={overriddenIds.has(team.id)}
              onUpdate={(patch) => onUpdate(team, patch)}
              onReset={() => onReset(team.id)}
              onDelete={() => onDelete(team)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamRow({
  team,
  isCustom,
  isOverridden,
  onUpdate,
  onReset,
  onDelete,
}: {
  team: Team;
  isCustom: boolean;
  isOverridden: boolean;
  onUpdate: (patch: Partial<Team>) => void;
  onReset: () => void;
  onDelete: () => void;
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
    if (json.url) onUpdate({ crest: json.url });
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-background p-3">
      {/* Badge */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-muted-foreground">Badge</label>
        {team.crest ? (
          <div className="relative size-12 overflow-hidden rounded-lg border border-border">
            <img src={team.crest} alt="" className="size-full object-contain" />
            <button
              onClick={() => onUpdate({ crest: "" })}
              className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-bl bg-black/60 text-white hover:bg-black/80"
              title="Remove badge"
            >
              <X className="size-2.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex size-12 items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50"
            title="Upload badge"
          >
            {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <div className="min-w-[140px] flex-1 space-y-1.5">
        <label className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          Name
          {isCustom ? (
            <Badge variant="accent" className="text-[9px]">Custom</Badge>
          ) : isOverridden ? (
            <Badge variant="muted" className="text-[9px]">Edited</Badge>
          ) : null}
        </label>
        <Input value={team.name} onChange={(e) => onUpdate({ name: e.target.value })} />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-muted-foreground">Category</label>
        <select
          value={team.type}
          onChange={(e) => onUpdate({ type: e.target.value as Team["type"] })}
          className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="national">National</option>
          <option value="club">Club</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-muted-foreground">Colour</label>
        <Input
          type="color"
          value={team.primaryColor}
          onChange={(e) => onUpdate({ primaryColor: e.target.value })}
          className="h-10 w-14 cursor-pointer p-1"
        />
      </div>

      {isCustom ? (
        <button
          onClick={onDelete}
          className="mb-1 text-muted-foreground transition-colors hover:text-destructive"
          title="Delete team"
        >
          <Trash2 className="size-4" />
        </button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="mb-0.5 h-8 text-xs"
          disabled={!isOverridden}
          onClick={onReset}
          title={isOverridden ? "Reset to original" : "No changes to reset"}
        >
          Reset
        </Button>
      )}
    </div>
  );
}

function TeamBadgeDot({ team }: { team: Team }) {
  if (team.crest) {
    return (
      <span className="size-7 shrink-0 overflow-hidden rounded-full border border-border bg-background">
        <img src={team.crest} alt="" className="size-full object-contain" />
      </span>
    );
  }
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border/60 text-[10px] font-bold text-white"
      style={{ backgroundColor: team.primaryColor }}
    >
      {team.name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase()}
    </span>
  );
}

function AddTeamForm({
  existingSlugs,
  onAdd,
}: {
  existingSlugs: Set<string>;
  onAdd: (team: Team) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"national" | "club">("national");
  const [color, setColor] = useState("#FF6200");
  const [crest, setCrest] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/cms/upload", { method: "POST", body: form });
    const json = await res.json();
    setUploading(false);
    if (json.url) setCrest(json.url);
    if (fileRef.current) fileRef.current.value = "";
  }

  function uniqueSlug(base: string) {
    let slug = base || "team";
    let n = 2;
    while (existingSlugs.has(slug)) slug = `${base}-${n++}`;
    return slug;
  }

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const slug = uniqueSlug(slugify(trimmed));
    onAdd({
      id: `ct-${Date.now()}`,
      slug,
      name: trimmed,
      type,
      crest: crest ?? "",
      primaryColor: color,
      productCount: 0,
      featured: false,
    });
    setName("");
    setCrest(null);
    setColor("#FF6200");
    setType("national");
  }

  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
      <p className="mb-3 text-sm font-semibold">Add a new team</p>
      <div className="flex flex-wrap items-end gap-4">
        {/* Badge upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Badge (optional)</label>
          {crest ? (
            <div className="relative size-16 overflow-hidden rounded-lg border border-border">
              <img src={crest} alt="" className="size-full object-contain" />
              <button
                onClick={() => setCrest(null)}
                className="absolute right-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X className="size-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex size-16 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-background text-muted-foreground transition-colors hover:border-primary/50"
            >
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        <div className="min-w-[160px] flex-1 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Team name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Netherlands, AC Milan"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Category</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "national" | "club")}
            className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="national">National</option>
            <option value="club">Club</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Colour</label>
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-14 cursor-pointer p-1"
          />
        </div>

        <Button onClick={submit} disabled={!name.trim()} className="h-10">
          <Plus className="size-4" /> Add team
        </Button>
      </div>
      <p className="mt-2.5 text-xs text-muted-foreground">
        No badge image? Leave it empty — a coloured badge with the team&apos;s initials is generated
        automatically. New teams are added to the homepage right away.
      </p>
    </div>
  );
}

// ── Reviews ────────────────────────────────────────────────────────

function ReviewsEditor({
  value,
  onChange,
}: {
  value: CmsReview[];
  onChange: (v: CmsReview[]) => void;
}) {
  function update(id: string, patch: Partial<CmsReview>) {
    onChange(value.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function remove(id: string) {
    onChange(value.filter((r) => r.id !== id));
  }
  function add() {
    const id = `r${Date.now()}`;
    onChange([...value, { id, author: "", location: "", rating: 5, text: "" }]);
  }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Customer Reviews</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Reviews shown in the homepage carousel. Up to 4 show side-by-side on desktop.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={add}>
          <Plus className="size-3.5" /> Add Review
        </Button>
      </div>

      {value.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No reviews yet — add one to get started.
        </p>
      )}

      <div className="space-y-4">
        {value.map((review) => (
          <div key={review.id} className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <StarPicker value={review.rating} onChange={(v) => update(review.id, { rating: v })} />
              <button
                onClick={() => remove(review.id)}
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Author name">
                <Input
                  value={review.author}
                  onChange={(e) => update(review.id, { author: e.target.value })}
                  placeholder="e.g. James W."
                />
              </Field>
              <Field label="Location">
                <Input
                  value={review.location}
                  onChange={(e) => update(review.id, { location: e.target.value })}
                  placeholder="e.g. London, UK"
                />
              </Field>
            </div>
            <Field label="Review text">
              <Textarea
                value={review.text}
                onChange={(e) => update(review.id, { text: e.target.value })}
                rows={2}
                placeholder="What did they say about us?"
              />
            </Field>
          </div>
        ))}
      </div>
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={cn(
            "text-xl leading-none transition-colors",
            n <= value ? "text-yellow-400" : "text-muted-foreground/25 hover:text-yellow-400/50",
          )}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ── Instagram ──────────────────────────────────────────────────────

const DEFAULT_POST_HREF = "https://instagram.com/_cs_collections_";

function InstagramEditor({
  value,
  onChange,
}: {
  value: CmsInstagramPost[];
  onChange: (v: CmsInstagramPost[]) => void;
}) {
  const posts: CmsInstagramPost[] = Array.from({ length: 8 }, (_, i) =>
    value[i] ?? { id: `ig${i + 1}`, image: null, href: DEFAULT_POST_HREF, likes: 0 },
  );

  function update(i: number, patch: Partial<CmsInstagramPost>) {
    onChange(posts.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <div>
        <h2 className="font-display text-lg font-semibold">Instagram Gallery</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage the 8 posts in the homepage Instagram section. Upload screenshots or leave empty for
          jersey placeholders.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post, i) => (
          <PostUploader key={post.id} label={`Post ${i + 1}`} post={post} onUpdate={(p) => update(i, p)} />
        ))}
      </div>
    </div>
  );
}

function PostUploader({
  label,
  post,
  onUpdate,
}: {
  label: string;
  post: CmsInstagramPost;
  onUpdate: (p: Partial<CmsInstagramPost>) => void;
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
    <div className="space-y-2 rounded-xl border border-border p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      {post.image ? (
        <div className="relative aspect-square overflow-hidden rounded-lg border border-border">
          <img src={post.image} alt="" className="h-full w-full object-cover" />
          <button
            onClick={() => onUpdate({ image: null })}
            className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <div
          className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/60"
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Upload className="size-4" />
              <span className="text-[10px]">Upload image</span>
            </>
          )}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <Field label="Instagram link">
        <Input
          value={post.href}
          onChange={(e) => onUpdate({ href: e.target.value })}
          placeholder="https://instagram.com/..."
          className="h-8 text-xs"
        />
      </Field>
      <Field label="Likes count">
        <Input
          type="number"
          value={post.likes}
          onChange={(e) => onUpdate({ likes: Number(e.target.value) })}
          className="h-8 text-xs"
          min={0}
        />
      </Field>

      {post.image && (
        <Button size="sm" variant="outline" className="w-full h-8 text-xs" onClick={() => fileRef.current?.click()}>
          <Upload className="size-3" /> Replace image
        </Button>
      )}
    </div>
  );
}

// ── Shared UI helpers ──────────────────────────────────────────────

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
