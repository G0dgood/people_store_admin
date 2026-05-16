"use client";

import React from "react";
import { CategorySection } from "./CategorySection";
import { useGetPublicProductsQuery } from "@/lib/redux/services/boutiqueApi";

interface BrandCategorySectionProps {
  brand: any;
  index: number;
  productDetailPath?: string;
}

import { SectionHeaderRich } from "../ui/SectionHeaderRich";

const BrandCategorySection: React.FC<BrandCategorySectionProps> = ({ brand, index, productDetailPath }) => {
  const { data: productsData } = useGetPublicProductsQuery({
    brand: brand._id,
    limit: 10
  });

  const formattedProducts = (productsData?.data?.products || []).map((p: any) => ({
    id: p._id,
    name: p.name,
    price: p.price.toLocaleString(),
    image: p.productImage || "/placeholder.png",
    stock: p.stock,
    isUnlimited: p.isUnlimited,
    media: p.media
  }));

  if (formattedProducts.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 mb-10">
      <SectionHeaderRich 
        title={brand.name} 
        mainHref={`/products?brand=${encodeURIComponent(brand.name)}`}
        exploreLabel="View All"
        exploreHref={`/products?brand=${encodeURIComponent(brand.name)}`}
        className="!p-0 !border-0 !mt-0 !mb-0"
      />
      <CategorySection
        title={brand.name}
        category={brand.category}
        brandName={brand.name}
        bannerImage={brand.coverImage || brand.logo || "/brandImage/brand_banner.png"}
        products={formattedProducts}
        priority={index === 0}
        productDetailPath={productDetailPath}
        showBanner={false}
        columns={5}
      />
    </div>
  );
};

export { BrandCategorySection };
