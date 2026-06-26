import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Globe2, Heart, Sparkles, ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "About Us" };

const VALUES = [
  { icon: ShieldCheck, title: "Authenticity first", body: "Every jersey is 100% genuine, sourced through official channels. No replicas, ever." },
  { icon: Globe2, title: "Pan-India passion", body: "From Mumbai to Guwahati, we deliver football culture to fans across every corner of India." },
  { icon: Heart, title: "Fan-obsessed", body: "Built by supporters, for supporters. Your matchday matters to us." },
  { icon: Sparkles, title: "Premium experience", body: "Considered design, fast delivery and care in every detail of the journey." },
];

const STATS = [
  { k: "2018", v: "Founded" },
  { k: "28+", v: "States served" },
  { k: "250k+", v: "Jerseys shipped" },
  { k: "4.9★", v: "Avg. rating" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        variant="brand"
        title="More than a jersey store"
        description="CS Collections exists to connect fans with the kits they love — authentic, premium and delivered with care."
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Our story</span>
            <h2 className="font-display text-3xl font-bold tracking-tight">Born from a love of the game.</h2>
            <p className="text-muted-foreground">
              We started CS Collections because finding authentic football jerseys shouldn’t be hard, sketchy, or
              overpriced. What began as a small collection of national team kits has grown into a curated home for
              club and country shirts from every era.
            </p>
            <p className="text-muted-foreground">
              Today we obsess over three things: authenticity, an effortless shopping experience, and getting your
              kit to you fast — wherever you are in the world.
            </p>
            <Button asChild className="mt-2">
              <Link href="/collections">
                Explore collections <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div key={s.v} className="rounded-2xl border border-border bg-card p-6 text-center">
                <p className="font-display text-3xl font-extrabold text-primary">{s.k}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section muted>
        <h2 className="text-center font-display text-3xl font-bold tracking-tight">What we stand for</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-background p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <v.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="overflow-hidden rounded-3xl brand-gradient px-6 py-14 text-center text-white sm:px-12">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to find your kit?</h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">Join thousands of fans across India and wear your colours with pride.</p>
          <Button asChild size="xl" variant="accent" className="mt-6">
            <Link href="/new-arrivals">Shop New Arrivals</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
