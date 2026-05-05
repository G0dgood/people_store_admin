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
import { RecommendedItemsSkeleton } from "../Skeleton/RecommendedItemsSkeleton";
import { EmptyState } from "../Admin/EmptyState";
import { HiOutlineSparkles } from "react-icons/hi2";
import { Icon } from "../Icon";
import { ProductGridItem } from "../Products/ProductItems";
import { StockWarning } from "../StockWarning";


const RecommendedItems = () => {
  const { addToCart } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { data: recommendedData, isLoading } = useGetRecommendedProductsQuery();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = useMemo(() => {
    if (!recommendedData?.data) return [];
    return (recommendedData.data as any[]).map(p => ({
      id: p._id,
      title: p.name,
      price: `\u20A6${p.price.toLocaleString()}`,
      image: p.productImage || "/placeholder.png",
      description: p.description,
      stock: p.stock || 0,
      isUnlimited: p.isUnlimited || false,
      rating: p.ratings || 0,
      orders: p.views || 0,
      shipping: "Free Shipping",
      media: p.media
    }));
  }, [recommendedData]);

  const handleQuickView = (product: any) => {
    setSelectedItem(product);
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

  if (isLoading) return <RecommendedItemsSkeleton />;

  if (products.length === 0) {
    return (
      <section className="w-full border border-gray-200 overflow-hidden bg-white mt-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Recommended Items</h3>
        </div>
        <EmptyState
          icon={<HiOutlineSparkles size={36} />}
          title="No Recommendations"
          description="We are curating a special collection of artisanal pieces just for you. Please check back soon."
        />
      </section>
    );
  }

  return (
    <section className="w-full border border-gray-200 overflow-hidden bg-white mt-8">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight uppercase tracking-widest">Recommended items</h3>
        <Link
          href="/products"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-brand-gold transition-colors flex items-center gap-2 group/view"
        >
          Shop All
          <div className="w-5 h-5 rounded-full border border-gray-100 flex items-center justify-center group-hover/view:border-brand-gold group-hover/view:bg-brand-gold group-hover/view:text-white transition-all duration-300">
            <Icon name="arrow_forward" size="xs" />
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 border-t border-gray-100">
        {products.map((product, idx) => (
          <div key={idx} className="border-r border-b border-gray-100 last:border-r-0 lg:[&:nth-child(4)]:border-r-0 xl:[&:nth-child(5)]:border-r-0">
            <ProductGridItem
              product={{
                ...product,
                onQuickView: handleQuickView
              }}
            />
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
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-black text-gray-900">{selectedItem.price}</span>
                    <StockWarning
                      stock={selectedItem.stock}
                      quantity={0}
                      isUnlimited={selectedItem.isUnlimited}
                    />
                  </div>
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
