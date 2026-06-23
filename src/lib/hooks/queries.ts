"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { ProductQuery } from "@/types";
import * as api from "@/lib/api";

export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => api.getProducts(query),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(slug: string) {
  return useQuery({ queryKey: ["product", slug], queryFn: () => api.getProductBySlug(slug) });
}

export function useTeams(type?: "national" | "club" | "retro") {
  return useQuery({ queryKey: ["teams", type ?? "all"], queryFn: () => api.getTeams(type) });
}

export function useReviews(productId: string) {
  return useQuery({ queryKey: ["reviews", productId], queryFn: () => api.getReviews(productId) });
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => api.searchProducts(query),
    enabled: query.trim().length > 1,
  });
}

export function useFaqs() {
  return useQuery({ queryKey: ["faqs"], queryFn: api.getFaqs });
}

export function useOrders() {
  return useQuery({ queryKey: ["orders"], queryFn: api.getOrders });
}

export function useOrder(id: string) {
  return useQuery({ queryKey: ["order", id], queryFn: () => api.getOrderById(id) });
}
