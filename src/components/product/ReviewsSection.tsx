"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star, ThumbsUp, CheckCircle2, PenLine } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils/cn";
import { useReviews } from "@/lib/hooks/queries";
import { Rating } from "@/components/common/Rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/format";

export function ReviewsSection({ product }: { product: Product }) {
  const { data: reviews, isLoading } = useReviews(product.id);
  const [writing, setWriting] = useState(false);
  const [rating, setRating] = useState(5);

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews?.filter((r) => r.rating === star).length ?? 0,
  }));
  const total = reviews?.length ?? 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="font-display text-5xl font-bold">{product.rating.toFixed(1)}</p>
          <Rating value={product.rating} className="mt-2 justify-center" size="md" />
          <p className="mt-2 text-sm text-muted-foreground">Based on {product.reviewCount} reviews</p>
        </div>
        <div className="space-y-1.5">
          {dist.map((d) => (
            <div key={d.star} className="flex items-center gap-2 text-sm">
              <span className="flex w-10 items-center gap-1 text-muted-foreground">
                {d.star} <Star className="size-3 fill-warning text-warning" />
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-warning" style={{ width: `${total ? (d.count / total) * 100 : 0}%` }} />
              </div>
              <span className="w-6 text-right text-xs text-muted-foreground">{d.count}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full" onClick={() => setWriting((w) => !w)}>
          <PenLine className="size-4" /> Write a review
        </Button>
      </div>

      <div className="space-y-5">
        {writing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setWriting(false);
              toast.success("Thanks for your review!", { description: "It will appear once approved." });
            }}
            className="space-y-3 rounded-2xl border border-border bg-card p-5"
          >
            <p className="text-sm font-semibold">Your rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                  <Star className={cn("size-6", n <= rating ? "fill-warning text-warning" : "text-border")} />
                </button>
              ))}
            </div>
            <Input required placeholder="Review title" />
            <Textarea required placeholder="Tell others what you think…" />
            <div className="flex gap-2">
              <Button type="submit">Submit review</Button>
              <Button type="button" variant="ghost" onClick={() => setWriting(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)
        ) : (
          reviews?.map((r) => (
            <div key={r.id}>
              <div className="flex items-start gap-3">
                <Avatar className="size-10">
                  <AvatarFallback>{r.author.split(" ").map((w) => w[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{r.author}</span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-xs text-success">
                        <CheckCircle2 className="size-3.5" /> Verified
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">· {formatDate(r.date)}</span>
                  </div>
                  <Rating value={r.rating} className="mt-1" />
                  <p className="mt-2 font-semibold text-foreground">{r.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                  <button className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
                    <ThumbsUp className="size-3.5" /> Helpful ({r.helpfulCount})
                  </button>
                </div>
              </div>
              <Separator className="mt-5" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
