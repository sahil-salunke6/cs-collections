import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { JerseyKit, ProductSort } from "@/types";

export interface FiltersState {
  brand: string[];
  kit: JerseyKit[];
  size: string[];
  league: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  sort: ProductSort;
  page: number;
}

const initialState: FiltersState = {
  brand: [],
  kit: [],
  size: [],
  league: null,
  minPrice: null,
  maxPrice: null,
  sort: "featured",
  page: 1,
};

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleBrand: (s, a: PayloadAction<string>) => {
      s.brand = toggle(s.brand, a.payload);
      s.page = 1;
    },
    toggleKit: (s, a: PayloadAction<JerseyKit>) => {
      s.kit = toggle(s.kit, a.payload);
      s.page = 1;
    },
    toggleSize: (s, a: PayloadAction<string>) => {
      s.size = toggle(s.size, a.payload);
      s.page = 1;
    },
    setLeague: (s, a: PayloadAction<string | null>) => {
      s.league = a.payload;
      s.page = 1;
    },
    setPriceRange: (s, a: PayloadAction<{ min: number | null; max: number | null }>) => {
      s.minPrice = a.payload.min;
      s.maxPrice = a.payload.max;
      s.page = 1;
    },
    setSort: (s, a: PayloadAction<ProductSort>) => {
      s.sort = a.payload;
      s.page = 1;
    },
    setPage: (s, a: PayloadAction<number>) => {
      s.page = a.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  toggleBrand,
  toggleKit,
  toggleSize,
  setLeague,
  setPriceRange,
  setSort,
  setPage,
  resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;
