import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

interface RelatedProduct {
  name: string;
  price: string;
  image: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
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
      id: `rel-${item.name}`,
      title: item.name,
      price: item.price,
      image: item.image,
    });
    toast.success(`${item.name} added to cart`);
    setIsModalOpen(false);
  };

  return (
    <section className="flex flex-col gap-8 w-full mt-12">
      <h3 className="text-xl md:text-2xl font-outfit font-light uppercase tracking-widest text-gray-900">Related <span className="font-bold">products</span></h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {products.map((item, idx) => (
          <Link
            key={idx}
            href="/products/detail"
            className="bg-white flex flex-col gap-4 transition-all cursor-pointer group"
          >
            <div className="w-full aspect-square relative bg-gray-50/50 flex items-center justify-center p-6 group-hover:bg-gray-100 transition-colors overflow-hidden">
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
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        {selectedItem && (
          <div className="flex flex-col md:flex-row gap-8 py-2">
            {/* Image Section */}
            <div className="w-full md:w-1/2 aspect-square relative bg-gray-50 border border-gray-100 p-8 rounded-xl overflow-hidden">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Related Collection</span>
                <h2 className="text-2xl font-outfit font-light uppercase tracking-widest text-gray-900 leading-tight">
                  {selectedItem.name.split(' ').map((word: string, i: number) => 
                    i === selectedItem.name.split(' ').length - 1 ? <span key={i} className="font-bold">{word}</span> : word + ' '
                  )}
                </h2>
                <span className="text-2xl font-black text-gray-900 mt-2">{selectedItem.price}</span>
              </div>

              <div className="h-px w-full bg-gray-100" />

              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">About the scent</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  A harmonious blend of notes that perfectly complements your selected fragrance. Part of our curated artisanal collection for the discerning connoisseur.
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
