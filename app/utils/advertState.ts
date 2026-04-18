"use client";

export interface AdvertItem {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
}

export interface BackgroundAsset {
  url: string;
  positionX: number; // 0 to 100 percentage
  positionY: number; // 0 to 100 percentage
  linkedCategory?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  stats?: string;
  duration?: number;
  featuredItems?: AdvertItem[];
  inventoryLayout?: "list" | "grid" | "strip";
}

export interface AdvertConfig {
  backgroundImages: BackgroundAsset[];
  featuredItems: AdvertItem[];
  layout: "left-form" | "right-form";
  inventoryLayout: "list" | "grid" | "strip";
  showTitle: boolean;
  showHighlight: boolean;
  showDescription: boolean;
  showStats: boolean;
  title: string;
  titleHighlight: string;
  description: string;
  stats: string;
  cycleDuration: number; // in seconds
}

const DEFAULT_CONFIG: AdvertConfig = {
  backgroundImages: [{ url: "/images/login-hero.png", positionX: 50, positionY: 50 }],
  featuredItems: [
    { id: 1, name: "Premium Wireless Headphones", category: "Electronics", price: "₦35,000", image: "/dashboardImage/Headphones.png" },
    { id: 2, name: "Smart Fitness Watch", category: "Electronics", price: "₦18,500", image: "/dashboardImage/Electronics.png" },
    { id: 7, name: "Ergonomic Gaming Mouse", category: "Electronics", price: "₦22,000", image: "/dashboardImage/Accessories.png" },
  ],
  layout: "right-form",
  inventoryLayout: "list",
  showTitle: true,
  showHighlight: true,
  showDescription: true,
  showStats: true,
  title: "Master Your",
  titleHighlight: "Command.",
  description: "The ultimate administrative OS for modern e-commerce. Precision control, real-time insights, and infinite scalability.",
  stats: "Currently powering 12,400+ global stores with 99.9% uptime and centralized governance.",
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
