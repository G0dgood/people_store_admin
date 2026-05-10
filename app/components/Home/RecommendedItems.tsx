import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { FavoriteButton } from "../Other";
import { useCart } from "@/app/context/CartContext";
import { QuickViewModal } from "../Products/QuickViewModal";
import { useRecentlyViewed } from "@/app/context/RecentlyViewedContext";
import { toast } from "sonner";
import { useGetRecommendedProductsQuery } from "@/lib/redux/services/productApi";
import { RecommendedItemsSkeleton } from "../Skeleton/RecommendedItemsSkeleton";
import { EmptyState } from "../Admin/EmptyState";
import { HiOutlineSparkles } from "react-icons/hi2";
import { Icon } from "../Icon";
import { StockWarning } from "../StockWarning";

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
      description: p.description,
      isUnlimited: p.isUnlimited,
      stock: p.stock
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
      stock: item.stock,
      isUnlimited: item.isUnlimited,
    });
    toast.success(`${item.title} added to cart`);
    setIsModalOpen(false);
  };

  if (isLoading) return <RecommendedItemsSkeleton />;

  if (items.length === 0) {
    return (
      <section className="w-full border border-gray-200 overflow-hidden bg-white mt-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Recommended items</h3>
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
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Recommended items</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-6 flex flex-col gap-4 hover:bg-gray-50 transition-colors group cursor-pointer border-b border-gray-100 last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0 lg:border-r border-gray-100"
          >
            <Link
              href={`/products/detail?id=${item.id}`}
              className="flex flex-col gap-4"
              onClick={() => addToRecentlyViewed({
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image,
                isUnlimited: item.isUnlimited,
                stock: item.stock
              })}
            >
              <div className="w-full aspect-square relative bg-white border border-gray-200 flex items-center justify-center p-14 md:p-10 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain scale-75 group-hover:scale-80 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 25vw, 20vw"
                />

                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                  <button
                    onClick={(e) => handleQuickView(e, item)}
                    className="w-full py-2 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold tracking-[0.2em] hover:bg-brand-gold transition-all"
                  >
                    Quick View
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{item.price}</span>

                  <StockWarning
                    stock={item.stock}
                    quantity={0}
                    isUnlimited={item.isUnlimited}
                  />
                </div>
                <p className="text-gray-500 text-sm leading-tight line-clamp-2 group-hover:text-brand-gold transition-colors font-medium">
                  {item.title}
                </p>
              </div>
            </Link>

            <div className="flex flex-row gap-2 mt-auto">
              <Button
                onClick={() => handleAddToCart(item)}
                variant="secondary"
                size="sm"
                className="flex-1 font-bold hover:bg-brand-gold hover:text-white shadow-none justify-center text-[10px] h-10"
                iconLeft={<Icon name="shopping_cart" size="xs" />}
              >
                Add to Cart
              </Button>
              <FavoriteButton
                item={{
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  image: item.image,
                } as any}
                variant="outline"
                size="sm"
                className="!w-10 !h-10 border-gray-200 shrink-0"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedItem}
        subtitle="Boutique Selection"
        description={selectedItem?.description || "Experience the pinnacle of luxury with this artisanal masterpiece."}
      />
    </section>
  );
};

export default RecommendedItems;
