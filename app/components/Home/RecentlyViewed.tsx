import React, { useState } from "react";
import Link from "next/link";
import { useRecentlyViewed } from "@/app/context/RecentlyViewedContext";
import { SectionHeaderRich } from "../ui/SectionHeaderRich";
import { ProductGridItem } from "../Products/ProductItems";
import { QuickViewModal } from "../Products/QuickViewModal";

const RecentlyViewed = () => {
  const { recentlyViewedItems, isLoading } = useRecentlyViewed();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  if (isLoading || recentlyViewedItems.length === 0) return null;

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <section className="w-full border border-gray-200 overflow-hidden bg-white mt-8 mb-12">
        <div className="p-6 border-b border-gray-200">
          <SectionHeaderRich 
            title="Recently Viewed" 
            className="!p-0 !border-0 !mt-0 !mb-0"
            exploreLabel="Explore Boutique"
            exploreHref="/products"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 border-t border-l border-gray-200 -m-[1px]">
          {recentlyViewedItems?.slice(0, 5).map((item) => (
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
      </section>

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={selectedProduct}
        subtitle="Your History"
        description="A sophisticated selection from your history. Re-experience its premium quality and craftsmanship."
      />
    </>
  );
};

export default RecentlyViewed;
