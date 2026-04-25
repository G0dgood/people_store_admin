import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

const recommendedItems = [
  { title: "Luxury Bloom Perfume Gift Set", price: "$145.00", image: "/brandImage/product_1.png" },
  { title: "Advanced Anti-Aging Skincare Kit", price: "$180.00", image: "/brandImage/product_4.png" },
  { title: "Organic Botanical Body Oil", price: "$34.00", image: "/brandImage/product_5.png" },
  { title: "Handcrafted Scented Candle", price: "$28.00", image: "/brandImage/product_8.png" },
  { title: "Travel Size Fragrance Discovery", price: "$45.00", image: "/brandImage/product_12.png" },
  { title: "Rosehip Infused Facial Serum", price: "$52.00", image: "/brandImage/product_7.png" },
  { title: "Silk Sleep Mask & Balm Gift", price: "$65.00", image: "/brandImage/product_3.png" },
  { title: "Essential Oil Diffuser Blend", price: "$18.00", image: "/brandImage/product_6.png" },
];

const RecommendedItems = () => {
  const { addToCart } = useCart();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: `rec-${item.title}`,
      title: item.title,
      price: item.price,
      image: item.image,
    });
    toast.success(`${item.title} added to cart`);
    setIsModalOpen(false);
  };

  return (
    <section className="w-full">
      <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-gray-900">Recommended items</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {recommendedItems?.map((item, idx) => (
          <Link
            key={idx}
            href="/products/detail"
            className="bg-white border border-gray-200 p-5 flex flex-col gap-4 hover:border-brand-gold/20 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-full aspect-square relative mb-2 overflow-hidden bg-gray-50/50">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
              
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
              <span className="font-black text-neutral-900 text-lg tracking-tight">{item.price}</span>
              <p className="text-[13px] text-gray-500 font-medium line-clamp-2 leading-snug group-hover:text-brand-gold transition-colors">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick View Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        {selectedItem && (
          <div className="flex flex-col md:flex-row gap-8 py-2">
            {/* Image Section */}
            <div className="w-full md:w-1/2 aspect-square relative bg-gray-50 border border-gray-100 p-8 rounded-xl">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Boutique Selection</span>
                <h2 className="text-2xl font-outfit font-light uppercase tracking-widest text-gray-900 leading-tight">
                  {selectedItem.title.split(' ').map((word: string, i: number) => 
                    i === selectedItem.title.split(' ').length - 1 ? <span key={i} className="font-bold">{word}</span> : word + ' '
                  )}
                </h2>
                <span className="text-2xl font-black text-gray-900 mt-2">{selectedItem.price}</span>
              </div>

              <div className="h-px w-full bg-gray-100" />

              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Description</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Experience the pinnacle of luxury with this artisanal masterpiece. Crafted with the finest ingredients to ensure an unforgettable sensory journey.
                </p>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <Button 
                  onClick={() => handleAddToCart(selectedItem)}
                  className="w-full bg-black text-white h-12 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-brand-gold transition-all"
                >
                  Add to Cart
                </Button>
                <Link 
                  href="/products/detail"
                  className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-brand-gold transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default RecommendedItems;
