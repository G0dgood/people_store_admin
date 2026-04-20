export interface FilterState {
  category: string | null;
  brands: string[];
  priceRange: [number, number];
  condition: string;
  ratings: number[];
}

export type ViewMode = "grid" | "list";

export const DEFAULT_FILTERS: FilterState = {
  category: null,
  brands: ["Bloom & Mist"],
  priceRange: [150, 850],
  condition: "Any",
  ratings: [],
};

export interface SortOption {
  id: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest Arrivals" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];
