import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { FavoriteButton } from "../Other";
import { useCart } from "@/app/context/CartContext";
import { useRecentlyViewed } from "@/app/context/RecentlyViewedContext";
import { toast } from "sonner";
import { useGetRecommendedProductsQuery } from "@/lib/redux/services/productApi";

const RecommendedItems = () => {
  const { addToCart } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { data: recommendedData, isLoading } = useGetRecommendedProductsQuery();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = useMemo(() => {
    if (!recommendedData?.data) return [];
    return (recommendedData.data as any[]).map(p => ({
      id: p._id,
      title: p.name,
      price: `\u20A6${p.price.toLocaleString()}`,
      image: p.productImage || "/placeholder.png",
      description: p.description
    }));
  }, [recommendedData]);

  const handleQuickView = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
    });
    toast.success(`${item.title} added to cart`);
    setIsModalOpen(false);
  };

  if (isLoading) return (
    <section className="w-full">
      <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-gray-900">Recommended items</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="aspect-[4/5] bg-gray-50 animate-pulse rounded-lg" />
        ))}
      </div>
    </section>
  );

  if (items.length === 0) return null;

  return (
    <section className="w-full">
      <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-gray-900">Recommended items</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
         {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 p-5 flex flex-col gap-4 hover:border-brand-gold/20 transition-all duration-300 cursor-pointer group relative"
          >
            <Link 
              href={`/products/detail?id=${item.id}`} 
              className="flex flex-col gap-4 h-full"
              onClick={() => addToRecentlyViewed({
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image
              })}
            >
              <div className="w-full aspect-square relative mb-2 overflow-hidden bg-gray-50/50">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                />
                
                {/* Quick View Button Overlay */}
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

            {/* Heart Icon Overlay */}
            <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FavoriteButton 
                item={{
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  image: item.image,
                } as any}
                variant="ghost"
                size="sm"
                className="bg-white/60 hover:bg-white backdrop-blur-sm shadow-sm"
              />
            </div>
          </div>
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
            <div className="w-full md:w-1/2 aspect-square relative bg-gray-50 border border-gray-100 p-8 rounded-xl">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Boutique Selection</span>
                <h2 className="text-2xl font-outfit font-light uppercase tracking-widest text-gray-900 leading-tight">
                  {selectedItem.title}
                </h2>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-black text-gray-900">{selectedItem.price}</span>
                  <FavoriteButton 
                    item={{
                      id: selectedItem.id,
                      title: selectedItem.title,
                      price: selectedItem.price,
                      image: selectedItem.image,
                    } as any}
                    variant="outline"
                    className="border-gray-200 !w-auto px-4 h-10 flex items-center gap-2"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">Save for later</span>
                  </FavoriteButton>
                </div>
              </div>

              <div className="h-px w-full bg-gray-100" />

              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Description</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {selectedItem.description || "Experience the pinnacle of luxury with this artisanal masterpiece."}
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
                  href={`/products/detail?id=${selectedItem.id}`}
                  className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-brand-gold transition-colors"
                  onClick={() => {
                    addToRecentlyViewed({
                      id: selectedItem.id,
                      title: selectedItem.title,
                      price: selectedItem.price,
                      image: selectedItem.image
                    });
                    setIsModalOpen(false);
                  }}
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
