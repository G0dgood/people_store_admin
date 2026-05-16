import React, { useState } from "react";
import Link from "next/link";
import { ProductGridItem } from "./ProductItems";
import { SectionHeaderRich } from "../ui/SectionHeaderRich";
import { QuickViewModal } from "./QuickViewModal";

interface RecommendedProduct {
  isUnlimited: boolean | undefined;
  stock: number;
  id: string;
  title: string;
  price: string;
  image: string;
  media?: { type: string; url: string }[];
  rating?: number;
}

interface RecommendedProductsProps {
  products: RecommendedProduct[];
}

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  if (!products || products.length === 0) return null;

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="flex flex-col mt-8 border border-gray-200 overflow-hidden bg-white mb-12">
        <div className="p-6 border-b border-gray-200">
          <SectionHeaderRich 
            title="You may also like" 
            className="!p-0 !border-0 !mt-0 !mb-0"
            exploreLabel="Explore Boutique"
            exploreHref="/products"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 border-t border-l border-gray-200 -m-[1px]">
          {products.slice(0, 4).map((item) => (
            <ProductGridItem
              key={item.id}
              product={{
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image,
                stock: item.stock,
                isUnlimited: item.isUnlimited ?? false,
                rating: item.rating || 5,
                orders: 0,
                shipping: "Standard",
                description: "",
                media: item.media,
                onQuickView: handleQuickView
              }}
              variant="joined"
            />
          ))}
        </div>
      </div>

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={selectedProduct}
        subtitle="Recommended"
        description="A curated selection of artisanal pieces tailored for you. Explore the height of craftsmanship."
      />
    </>
  );
};
