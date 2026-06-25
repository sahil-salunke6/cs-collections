import { Instagram, Heart } from "lucide-react";
import { JerseyVisual } from "@/components/common/JerseyVisual";
import type { CmsInstagramPost } from "@/lib/cms";

const PALETTES: string[][] = [
  ["#FCE000", "#009C3B", "#002776"],
  ["#FFFFFF", "#FEBE10", "#00529F"],
  ["#A50044", "#004D98", "#FFED02"],
  ["#6CABDD", "#FFFFFF", "#1C2C5B"],
  ["#C8102E", "#FFFFFF", "#00B2A9"],
  ["#0A1A3F", "#DA291C", "#FFFFFF"],
  ["#1E3A8A", "#FFFFFF", "#EF4135"],
  ["#111111", "#FFFFFF", "#C9A227"],
];

export function InstagramGallery({ posts }: { posts: CmsInstagramPost[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
      {posts.map((post, i) => (
        <a
          key={post.id}
          href={post.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative aspect-square overflow-hidden rounded-xl border border-border"
        >
          {post.image ? (
            <img
              src={post.image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <JerseyVisual
              colors={PALETTES[i % PALETTES.length]}
              view={i % 3 === 0 ? "detail" : "front"}
            />
          )}
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Instagram className="size-5" />
            <span className="flex items-center gap-1 text-xs font-semibold">
              <Heart className="size-3.5 fill-white" /> {post.likes}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
