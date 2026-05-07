"use client";

import React from "react";
import { CategorySection } from "./CategorySection";
import { useGetPublicProductsQuery } from "@/lib/redux/services/boutiqueApi";

interface BrandCategorySectionProps {
  brand: any;
  index: number;
}

const BrandCategorySection: React.FC<BrandCategorySectionProps> = ({ brand, index }) => {
  const { data: productsData } = useGetPublicProductsQuery({
    brand: brand._id,
    limit: 8
  });

  const formattedProducts = (productsData?.data?.products || []).map((p: any) => ({
    id: p._id,
    name: p.name,
    price: p.price.toString(),
    image: p.productImage || "/placeholder.png",
    stock: p.stock,
    isUnlimited: p.isUnlimited
  }));

  if (formattedProducts.length === 0) return null;

  return (
    <CategorySection
      title={brand.name}
      category={brand.category}
      brandName={brand.name}
      bannerImage={brand.coverImage || brand.logo || "/brandImage/brand_banner.png"}
      products={formattedProducts}
      priority={index === 0}
    />
  );
};

export { BrandCategorySection };
