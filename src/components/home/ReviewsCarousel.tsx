"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Rating } from "@/components/common/Rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { CmsReview } from "@/lib/cms";

export function ReviewsCarousel({ reviews }: { reviews: CmsReview[] }) {
  return (
    <div className="no-scrollbar -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
      {reviews.map((t, i) => (
        <motion.figure
          key={t.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="flex w-[78vw] shrink-0 snap-start flex-col rounded-2xl border border-border bg-card p-6 sm:w-[44vw] lg:w-auto"
        >
          <Quote className="size-7 text-accent/40" />
          <Rating value={t.rating} className="mt-3" />
          <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">"{t.text}"</blockquote>
          <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
            <Avatar className="size-9">
              <AvatarFallback>{t.author.split(" ").map((w) => w[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{t.author}</p>
              <p className="text-xs text-muted-foreground">{t.location}</p>
            </div>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
