import React, { useState } from "react";
import { ProductGridItem } from "./ProductItems";
import { SectionHeaderSimple } from "../ui/SectionHeaderSimple";
import { QuickViewModal } from "./QuickViewModal";

interface RelatedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  stock: number;
  isUnlimited: boolean;
  media?: { type: string, url: string }[];
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  if (!products || products.length === 0) return null;

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <section className="bg-white border border-gray-200 overflow-hidden mt-16">
        <SectionHeaderSimple title="Related products" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-gray-200 -m-[1px]">
          {products.map((item, idx) => (
            <ProductGridItem 
              key={idx} 
              product={{
                id: item.id,
                title: item.name,
                price: item.price,
                image: item.image,
                stock: item.stock,
                isUnlimited: item.isUnlimited,
                rating: 5,
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
      />
    </>
  );
};
