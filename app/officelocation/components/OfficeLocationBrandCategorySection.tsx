"use client";

import React from "react";
import { CategorySection } from "@/app/components/Home/CategorySection";
import { useGetProductsByOfficeQuery } from "@/lib/redux/services/officeLocationApi";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";

interface OfficeLocationBrandCategorySectionProps {
  brand: any;
  index: number;
  productDetailPath?: string;
  products?: any[];
}

const OfficeLocationBrandCategorySection: React.FC<OfficeLocationBrandCategorySectionProps> = ({ 
  brand, 
  index, 
  productDetailPath,
  products: initialProducts 
}) => {
  const { storeContext } = useOfficeLocationInfo();
  
  // Fetch products for this brand that are available at this office (if not provided)
  const { data: productsData } = useGetProductsByOfficeQuery({
    officeId: storeContext.officeId || "",
    brand: brand._id
  }, {
    skip: !!initialProducts || !storeContext.officeId
  });

  const rawProducts = initialProducts || productsData?.data || [];
  const formattedProducts = rawProducts.map((p: any) => ({
    id: p._id,
    name: p.name,
    price: p.price.toString(),
    image: p.productImage || "/placeholder.png",
    stock: p.stock,
    isUnlimited: p.isUnlimited,
    media: p.media
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
      productDetailPath={productDetailPath}
    />
  );
};

export { OfficeLocationBrandCategorySection };
