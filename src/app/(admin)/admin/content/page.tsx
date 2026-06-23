"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { CmsData, CmsHeroStat } from "@/lib/cms";

type Tab = "announcement" | "hero";

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
      body: JSON.stringify({ announcement: data.announcement, hero: data.hero }),
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
    { id: "hero", label: "Hero Section" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Content Editor</h1>
          <p className="text-sm text-muted-foreground">Edit the announcement bar and hero section text.</p>
        </div>
        <Button onClick={save} disabled={saving} size="sm">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saved ? "Saved!" : "Save changes"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-card p-1 w-fit">
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
