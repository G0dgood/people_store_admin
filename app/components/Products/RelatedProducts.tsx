import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuickViewModal } from "./QuickViewModal";
import { formatPrice } from "@/app/utils/formatPrice";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

interface RelatedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  media?: { type: string, url: string }[];
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  const handleQuickView = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: item.id,
      title: item.name,
      price: item.price,
      image: item.image,
    });
    toast.success(`${item.name} added to cart`);
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white border border-gray-200 overflow-hidden mt-16">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Related products</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {products.map((item, idx) => (
          <div key={idx} className="p-6 flex flex-col gap-4 hover:bg-gray-50 transition-colors group cursor-pointer border-r border-b last:border-r-0 border-gray-100">
            <Link
              href={`/products/detail?id=${item.id}`}
              className="w-full flex flex-col gap-4"
            >
              <div className="w-full aspect-square relative bg-white border border-gray-200 flex items-center justify-center p-8 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain scale-90 group-hover:scale-95 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 15vw"
                />

                {/* Quick View Button Overlay */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                  <button
                    onClick={(e) => handleQuickView(e, item)}
                    className="w-full py-2.5 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-brand-gold transition-all"
                  >
                    Quick View
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-gray-900">{item.price}</span>
                  <p className="text-gray-500 text-[13px] leading-tight line-clamp-2 group-hover:text-brand-gold transition-colors">{item.name}</p>
                </div>
              </div>
            </Link>
            <Button
              onClick={(e) => handleAddToCart(e, item)}
              variant="secondary"
              size="md"
              className="w-full font-bold hover:bg-brand-gold hover:text-white shadow-none justify-center mt-auto"
              iconLeft={<Icon name="shopping_cart" size="sm" />}
            >
              Add to cart
            </Button>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedItem}
      />
    </section>
  );
};
