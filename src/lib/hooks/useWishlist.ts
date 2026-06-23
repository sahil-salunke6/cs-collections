"use client";

import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlist } from "@/store/slices/wishlistSlice";

export function useWishlist() {
  const dispatch = useAppDispatch();
  const ids = useAppSelector((s) => s.wishlist.ids);

  return {
    ids,
    isWishlisted: (id: string) => ids.includes(id),
    toggle: (id: string, name?: string) => {
      const wasIn = ids.includes(id);
      dispatch(toggleWishlist(id));
      toast[wasIn ? "message" : "success"](
        wasIn ? "Removed from wishlist" : "Added to wishlist",
        name ? { description: name } : undefined,
      );
    },
  };
}
