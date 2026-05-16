import React, { useRef, useState } from "react";
import { useGetPublicNewArrivalsQuery } from "@/lib/redux/services/boutiqueApi";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useCart } from "../context/CartContext";
import { QuickViewModal } from "./Products/QuickViewModal";
import { toast } from "sonner";
import { ProductGridItem } from "./Products/ProductItems";
import { SectionHeaderRich } from "./ui/SectionHeaderRich";



const NewArrivals = () => {
  const { data: newArrivalsData, isLoading } = useGetPublicNewArrivalsQuery({ limit: 10 });
  const products = newArrivalsData?.data?.products || [];
  const { addToCart } = useCart();

  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!marqueeRef.current) return;
    setIsDragging(true);
    setDragMoved(false);
    setStartX(e.pageX - marqueeRef.current.offsetLeft);
    setScrollLeft(marqueeRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    // Small delay to let onClickCapture run before we reset dragMoved
    setTimeout(() => {
      setIsDragging(false);
      setDragMoved(false);
    }, 50);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !marqueeRef.current) return;
    e.preventDefault();
    const x = e.pageX - marqueeRef.current.offsetLeft;
    const walk = (x - startX) * 2;

    if (Math.abs(walk) > 5) {
      setDragMoved(true);
    }

    marqueeRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: "left" | "right") => {
    if (!marqueeRef.current) return;
    const { scrollLeft, clientWidth } = marqueeRef.current;
    const scrollAmount = clientWidth * 0.8;
    marqueeRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    const isOutOfStock = !product.isUnlimited && product.stock <= 0;
    if (isOutOfStock) {
      toast.error("This magnificent piece is currently out of stock");
      return;
    }

    addToCart({
      id: product._id,
      title: product.name,
      price: product.price.toString(),
      image: product.productImage || "/placeholder.png",
      stock: product.stock,
      isUnlimited: product.isUnlimited,
    });
    toast.success("Added to cart");
  };

  if (isLoading || products.length === 0) return null;

  return (
    <div className="relative group/section">
      <SectionHeaderRich
        title="New Arrivals"
        mainHref="/products?search="
        exploreLabel="View All"
        exploreHref="/products?search="
        className="mb-5 !mt-0"
      />
      <button
        onClick={() => scroll("left")}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold shadow-lg"
        aria-label="Scroll Left">
        <HiChevronLeft size={20} />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold shadow-lg"
        aria-label="Scroll Right">
        <HiChevronRight size={20} />
      </button>

      <div
        className={`marquee overflow-x-auto scrollbar-none ${isDragging ? "cursor-grabbing select-none" : "cursor-grab scroll-smooth"}`}
        ref={marqueeRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onDragStart={(e) => e.preventDefault()}
      >
        <div className="marquee_content flex gap-0">
          <div className="flex w-max">
            {products.map((item: any) => (
              <div
                key={item._id}
                className="w-[300px] flex-shrink-0 cursor-inherit pointer-events-auto"
                onClickCapture={(e) => {
                  if (dragMoved) {
                    e.stopPropagation();
                    e.preventDefault();
                  }
                }}
              >
                <ProductGridItem
                  product={{
                    id: item._id,
                    title: item.name,
                    price: `₦${item.price.toLocaleString()}`,
                    image: item.productImage || "/placeholder.png",
                    stock: item.stock,
                    isUnlimited: item.isUnlimited,
                    rating: item.rating || 5,
                    orders: 0,
                    shipping: "Standard",
                    description: item.description || "",
                    media: item.media,
                    onQuickView: handleQuickView
                  }}
                  variant="joined"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={selectedProduct ? {
          id: selectedProduct.id,
          title: selectedProduct.title,
          price: selectedProduct.price,
          image: selectedProduct.image,
          stock: selectedProduct.stock,
          isUnlimited: selectedProduct.isUnlimited,
          rating: selectedProduct.rating || 5,
          orders: selectedProduct.orders || 0,
          shipping: selectedProduct.shipping || "Standard",
          description: selectedProduct.description,
          media: selectedProduct.media
        } : null}
        subtitle="New Arrival"
      />
    </div>
  );
};


export default NewArrivals;
