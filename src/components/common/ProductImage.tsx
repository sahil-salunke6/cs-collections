import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { JerseyVisual } from "./JerseyVisual";

type View = "front" | "back" | "detail";
const VIEW_INDEX: Record<View, number> = { front: 0, back: 1, detail: 2 };

interface Props {
  /** product.images — real paths/URLs render as photos; anything else falls back. */
  images?: string[];
  colors: string[];
  view?: View;
  name?: string;
  number?: number;
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/** A value is a "real" image when it's a local path or remote URL.
 *  The mock data uses tokens like "front"/"back"/"detail", which fall back
 *  to the generated <JerseyVisual>. Drop real paths into product.images
 *  (e.g. "/products/brazil-home.jpg") to switch a product to photos. */
function isRealImage(src?: string) {
  return !!src && (src.startsWith("/") || src.startsWith("http"));
}

export function ProductImage({
  images,
  colors,
  view = "front",
  name,
  number,
  alt = "",
  className,
  priority,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: Props) {
  const src = images?.[VIEW_INDEX[view]];

  if (!isRealImage(src)) {
    return <JerseyVisual colors={colors} view={view} name={name} number={number} className={className} />;
  }

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden", className)}>
      <Image src={src!} alt={alt} fill sizes={sizes} className="object-cover" priority={priority} />
    </div>
  );
}
