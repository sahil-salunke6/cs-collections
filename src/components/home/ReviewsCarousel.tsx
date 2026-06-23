"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Rating } from "@/components/common/Rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TESTIMONIALS = [
  { name: "James W.", location: "London, UK", rating: 5, text: "The quality is unreal — feels exactly like the on-pitch version. Shipping was lightning fast." },
  { name: "Camila S.", location: "São Paulo, BR", rating: 5, text: "My Brazil retro shirt is stunning. The detailing and fabric are top tier. Will buy again." },
  { name: "Tariq A.", location: "Dubai, UAE", rating: 5, text: "Best jersey store I've used. Authentic, beautifully packaged, and the fit guide was spot on." },
  { name: "Noah L.", location: "Berlin, DE", rating: 4, text: "Great selection of clubs and nations. The limited editions sell out fast — grab them quick!" },
];

export function ReviewsCarousel() {
  return (
    <div className="no-scrollbar -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
      {TESTIMONIALS.map((t, i) => (
        <motion.figure
          key={t.name}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="flex w-[78vw] shrink-0 snap-start flex-col rounded-2xl border border-border bg-card p-6 sm:w-[44vw] lg:w-auto"
        >
          <Quote className="size-7 text-accent/40" />
          <Rating value={t.rating} className="mt-3" />
          <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">“{t.text}”</blockquote>
          <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
            <Avatar className="size-9">
              <AvatarFallback>{t.name.split(" ").map((w) => w[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.location}</p>
            </div>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
