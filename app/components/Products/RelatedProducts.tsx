import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuickViewModal } from "./QuickViewModal";

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

  const handleQuickView = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <section className="flex flex-col gap-8 w-full mt-16 pt-16 border-t border-gray-200">
      <h3 className="text-xl md:text-2xl font-outfit font-light uppercase tracking-widest text-gray-900">Related <span className="font-bold">products</span></h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {products.map((item, idx) => (
          <Link
            key={idx}
            href={`/products/detail?id=${item.id}`}
            className="bg-white flex flex-col gap-4 transition-all cursor-pointer group"
          >
            <div className="w-full aspect-square relative bg-white border border-gray-200 flex items-center justify-center p-6 group-hover:border-brand-gold transition-colors overflow-hidden">
              <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-110">
                <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
              </div>

              {/* Quick View Button Overlay - Positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                <button
                  onClick={(e) => handleQuickView(e, item)}
                  className="w-full py-3 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-brand-gold transition-all"
                >
                  Quick View
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[11px] uppercase tracking-wider text-gray-900 line-clamp-2 group-hover:text-brand-gold transition-colors">{item.name}</span>
              <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{item.price}</span>
            </div>
          </Link>
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
