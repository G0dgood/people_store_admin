"use client";

export interface AdvertItem {
  id: any;
  _id: string;
  name: string;
  category: any;
  price: number | string;
  productImage: string;
  image?: string; // Fallback for legacy/static data
}

export interface BackgroundAsset {
  url: string;
  positionX: number;
  positionY: number;
  linkedCategory?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  stats?: string;
  duration?: number;
  featuredItems?: AdvertItem[];
  inventoryLayout?: "list" | "grid" | "strip" | "";
}

export interface AdvertConfig {
  _id?: string;
  backgroundImages: BackgroundAsset[];
  featuredItems: AdvertItem[];
  layout: "left-form" | "right-form" | "";
  inventoryLayout: "list" | "grid" | "strip" | "";
  showTitle: boolean;
  showHighlight: boolean;
  showDescription: boolean;
  showStats: boolean;
  title: string;
  titleHighlight: string;
  description: string;
  stats: string;
  cycleDuration: number;
}

const DEFAULT_CONFIG: AdvertConfig = {
  backgroundImages: [],
  featuredItems: [],
  layout: "",
  inventoryLayout: "",
  showTitle: false,
  showHighlight: false,
  showDescription: false,
  showStats: false,
  title: "",
  titleHighlight: "",
  description: "",
  stats: "",
  cycleDuration: 8,
};

export const getAdvertConfig = (): AdvertConfig => {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  const saved = localStorage.getItem("advert_config");
  if (!saved) return DEFAULT_CONFIG;
  
  const parsed = JSON.parse(saved);
  
  // Migration: Handle legacy string array or missing fields
  const backgroundImages = Array.isArray(parsed.backgroundImages) 
    ? parsed.backgroundImages.map((bg: any) => {
        if (typeof bg === "string") return { url: bg, positionX: 50, positionY: 50 };
        return {
          ...bg,
          linkedCategory: bg.linkedCategory,
          title: bg.title,
          titleHighlight: bg.titleHighlight,
          description: bg.description,
          stats: bg.stats,
          duration: bg.duration,
          featuredItems: bg.featuredItems,
          inventoryLayout: bg.inventoryLayout
        };
      })
    : DEFAULT_CONFIG.backgroundImages;

  return {
    ...DEFAULT_CONFIG,
    ...parsed,
    backgroundImages,
    inventoryLayout: parsed.inventoryLayout || DEFAULT_CONFIG.inventoryLayout,
    showTitle: typeof parsed.showTitle === "boolean" ? parsed.showTitle : (typeof parsed.showCopy === "boolean" ? parsed.showCopy : DEFAULT_CONFIG.showTitle),
    showHighlight: typeof parsed.showHighlight === "boolean" ? parsed.showHighlight : (typeof parsed.showCopy === "boolean" ? parsed.showCopy : DEFAULT_CONFIG.showHighlight),
    showDescription: typeof parsed.showDescription === "boolean" ? parsed.showDescription : (typeof parsed.showCopy === "boolean" ? parsed.showCopy : DEFAULT_CONFIG.showDescription),
    showStats: typeof parsed.showStats === "boolean" ? parsed.showStats : (typeof parsed.showCopy === "boolean" ? parsed.showCopy : DEFAULT_CONFIG.showStats)
  };
};

export const saveAdvertConfig = (config: AdvertConfig) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("advert_config", JSON.stringify(config));
  window.dispatchEvent(new Event("advertConfigUpdated"));
};

/**
 * Initializes the local advert state from an API response.
 * This ensures the login page can display live data even if the user hasn't visited the admin dashboard.
 */
export const initializeAdvertConfig = (config: AdvertConfig) => {
  if (typeof window === "undefined") return;
  
  // Optional: Check if the new config is different from the saved one to avoid unnecessary re-renders
  localStorage.setItem("advert_config", JSON.stringify(config));
  window.dispatchEvent(new Event("advertConfigUpdated"));
};
