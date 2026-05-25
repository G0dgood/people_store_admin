export interface FilterState {
  category: string;
  subCategory: string;
  brand: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  condition: string;
  status: string;
  search: string;
  rating: number;
}

export type ViewMode = "grid" | "list";

export const DEFAULT_FILTERS: FilterState = {
  category: "",
  subCategory: "",
  brand: "",
  minPrice: undefined,
  maxPrice: undefined,
  condition: "",
  status: "All",
  search: "",
  rating: 0,
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
