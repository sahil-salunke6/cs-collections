"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { JerseyVisual } from "@/components/common/JerseyVisual";

const float = {
  animate: { y: [0, -14, 0] },
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-card theme-transition">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 size-[34rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-32 bottom-0 size-[28rem] rounded-full bg-accent/15 blur-3xl" />
      </div>

      <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            <Sparkles className="size-3.5" /> 2024/25 On-Pitch Collection
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Wear the Badge.
            <br />
            <span className="text-primary">Own the Moment.</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
            Authentic national &amp; club jerseys — engineered for matchday and built to last. Premium, fast, and 100% genuine.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="xl">
              <Link href="/new-arrivals">
                Shop New Arrivals <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/retro">Explore Retro</Link>
            </Button>
          </div>
          <div className="mt-10 flex gap-8">
            {[
              { k: "100%", v: "Authentic" },
              { k: "90+", v: "Countries shipped" },
              { k: "4.9★", v: "Customer rating" },
            ].map((s) => (
              <div key={s.v}>
                <p className="font-display text-2xl font-bold text-foreground">{s.k}</p>
                <p className="text-xs text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4">
          <motion.div {...float} className="overflow-hidden rounded-3xl border border-border bg-background shadow-xl">
            <JerseyVisual colors={["#FCE000", "#009C3B", "#002776"]} view="front" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="mt-10 overflow-hidden rounded-3xl border border-border bg-background shadow-xl"
          >
            <JerseyVisual colors={["#FFFFFF", "#FEBE10", "#00529F"]} view="back" name="Madrid" number={7} />
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="-mt-2 overflow-hidden rounded-3xl border border-border bg-background shadow-xl"
          >
            <JerseyVisual colors={["#A50044", "#004D98", "#FFED02"]} view="front" />
          </motion.div>
          <motion.div {...float} className="overflow-hidden rounded-3xl border border-border bg-background shadow-xl">
            <JerseyVisual colors={["#6CABDD", "#FFFFFF", "#1C2C5B"]} view="front" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
