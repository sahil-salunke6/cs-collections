import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./index";

const SHIPPING_FEE = 100; // flat shipping fee (minimum ₹100)

export const selectCartItems = (s: RootState) => s.cart.items;

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((n, i) => n + i.quantity, 0),
);

export const selectCartSubtotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0),
);

export const selectCartShipping = createSelector(selectCartItems, (items) =>
  items.length > 0 ? SHIPPING_FEE : 0,
);

export const selectCartTotals = createSelector(
  [selectCartSubtotal, selectCartShipping],
  (subtotal, shipping) => ({
    subtotal,
    shipping,
    total: subtotal + shipping,
  }),
);

export const selectWishlistIds = (s: RootState) => s.wishlist.ids;
export const selectWishlistCount = createSelector(selectWishlistIds, (ids) => ids.length);
export const selectIsWishlisted = (id: string) => (s: RootState) =>
  s.wishlist.ids.includes(id);

export const selectUser = (s: RootState) => s.auth.user;
export const selectIsAuthenticated = (s: RootState) => s.auth.status === "authenticated";
export const selectIsAdmin = (s: RootState) => s.auth.user?.role === "admin";
