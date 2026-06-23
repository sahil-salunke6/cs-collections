"use client";

import { useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { ProductQuery, TeamType, ProductBadge } from "@/types";
import teamsData from "@/data/teams.json";
import { useProducts } from "@/lib/hooks/queries";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSort, setPage } from "@/store/slices/filtersSlice";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterSidebar } from "./FilterSidebar";
import { SortDropdown } from "./SortDropdown";
import { ProductGrid, ProductGridSkeleton } from "./ProductGrid";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { PackageSearch } from "lucide-react";

interface Props {
  lockType?: TeamType;
  lockBadge?: ProductBadge;
  teamSlug?: string;
  search?: string;
  perPage?: number;
}

export function ProductListing({ lockType, lockBadge, teamSlug, search, perPage = 12 }: Props) {
  const dispatch = useAppDispatch();
  const f = useAppSelector((s) => s.filters);

  const teamId = useMemo(
    () => (teamSlug ? teamsData.find((t) => t.slug === teamSlug)?.id : undefined),
    [teamSlug],
  );

  const query: ProductQuery = {
    type: lockType,
    badge: lockBadge,
    teamId,
    search,
    brand: f.brand.length ? f.brand : undefined,
    kit: f.kit.length ? f.kit : undefined,
    size: f.size.length ? f.size : undefined,
    minPrice: f.minPrice ?? undefined,
    maxPrice: f.maxPrice ?? undefined,
    sort: f.sort,
    page: f.page,
    perPage,
  };

  const { data, isLoading, isFetching } = useProducts(query);

  return (
    <div className="flex gap-10">
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-28">
          <FilterSidebar />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {data ? `${data.total} ${data.total === 1 ? "product" : "products"}` : "Loading…"}
          </p>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="size-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto p-6">
                <FilterSidebar />
              </SheetContent>
            </Sheet>
            <SortDropdown value={f.sort} onChange={(s) => dispatch(setSort(s))} />
          </div>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={perPage} />
        ) : data && data.items.length > 0 ? (
          <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
            <ProductGrid products={data.items} />
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={(p) => {
                dispatch(setPage(p));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mt-12"
            />
          </div>
        ) : (
          <EmptyState
            icon={PackageSearch}
            title="No products found"
            description="Try adjusting your filters or search terms."
          />
        )}
      </div>
    </div>
  );
}
