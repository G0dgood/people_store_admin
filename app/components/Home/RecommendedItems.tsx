import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ProductGridItem } from "../Products/ProductItems";
import { QuickViewModal } from "../Products/QuickViewModal";
import { useGetRecommendedProductsQuery } from "@/lib/redux/services/productApi";
import { RecommendedItemsSkeleton } from "../Skeleton/RecommendedItemsSkeleton";
import { EmptyState } from "../Admin/EmptyState";
import { HiOutlineSparkles } from "react-icons/hi2";
import { SectionHeaderSimple } from "../ui/SectionHeaderSimple";

const RecommendedItems = () => {
  const { data: recommendedData, isLoading } = useGetRecommendedProductsQuery();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const items = useMemo(() => {
    if (!recommendedData?.data) return [];
    return (recommendedData.data as any[]).map(p => ({
      id: p._id,
      title: p.name,
      price: `\u20A6${p.price.toLocaleString()}`,
      image: p.productImage || "/placeholder.png",
      description: p.description,
      isUnlimited: p.isUnlimited,
      stock: p.stock,
      media: p.media,
      rating: p.rating
    }));
  }, [recommendedData]);

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  if (isLoading) return <RecommendedItemsSkeleton />;

  if (items.length === 0) {
    return (
      <section className="w-full border border-gray-200 overflow-hidden bg-white mt-8 mb-12">
        <div className="p-6 border-b border-gray-200">
          <SectionHeaderSimple title="Recommended items" className="!p-0 !border-0" />
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
    <>
      <section className="w-full border border-gray-200 overflow-hidden bg-white mt-8 mb-12">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <SectionHeaderSimple title="Recommended items" className="!p-0 !border-0" />
          <Link href="/products" className="text-[10px] font-outfit font-bold tracking-[0.2em] text-brand-gold hover:tracking-[0.3em] transition-all uppercase">
            Explore Boutique
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 border-t border-l border-gray-200 -m-[1px]">
          {items.slice(0, 5).map((item, idx) => (
            <ProductGridItem
              key={idx}
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
                description: item.description,
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
        subtitle="Boutique Selection"
        description={selectedProduct?.description || "Experience the pinnacle of luxury with this artisanal masterpiece."}
      />
    </>
  );
};

export default RecommendedItems;
