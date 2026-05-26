import React, { useEffect, useRef, useState } from "react";
import { useGetPublicNewArrivalsQuery } from "@/lib/redux/services/boutiqueApi";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { toast } from "sonner";
import { ProductGridItem } from "../Products/ProductItems";
import { QuickViewModal } from "../Products/QuickViewModal";
import { useCart } from "@/app/context/CartContext";

const blogData = [
  {
    // image: industries,
    title: "Logistics & Supply Chain",
    text: " Optimizing supply chain operations with cutting-edge solutions for warehousing, transportation, and inventory management.",
  },
  {
    // image: Government,
    title: "Government & Public Services",
    text: "Supporting public sector transformation with secure, efficient, and citizen-centric solutions.",
  },
  {
    // image: Business,
    title: "Business Process Outsourcing",
    text: "Streamlining operations and enhancing efficiency through comprehensive BPO solutions and AI.",
  },
  {
    // image: Telecommunication,
    title: "Telecommunication",
    text: "Advanced communication solutions powering next-generation connectivity and network infrastructure.",
  },
  {
    // image: Telemedicine,
    title: "Health & Telemedicine",
    text: "Digital healthcare solutions enabling remote patient care and efficient medical service delivery.",
  },
  {
    // image: Ecommerce,
    title: "E-commerce & Retail",
    text: "Comprehensive digital solutions for modern retail operations and online shopping experiences.",
  },
  {
    // image: Banking,
    title: "Banking",
    text: "Secure and scalable solutions for modern banking operations, risk management, and customer service excellence.",
  },
  {
    // image: Fintech,
    title: "Fintech & Digital Payment",
    text: "Innovative financial technology solutions for secure and seamless digital transactions.",
  },
  {
    // image: Cybersecurity,
    title: "Cybersecurity & AI Solutions",
    text: "Advanced security solutions powered by artificial intelligence and machine learning.",
  },
];

const NewArrivals = () => {
  const { data: newArrivalsData, isLoading } = useGetPublicNewArrivalsQuery({ limit: 10 });
  const products = newArrivalsData?.data?.products || [];
  const { addToCart } = useCart();

  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!marqueeRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - marqueeRef.current.offsetLeft);
    setScrollLeft(marqueeRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !marqueeRef.current) return;
    e.preventDefault();
    const x = e.pageX - marqueeRef.current.offsetLeft;
    const walk = (x - startX) * 5;
    marqueeRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: "left" | "right") => {
    if (!marqueeRef.current) return;
    const scrollAmount = 300;
    marqueeRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
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
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="arrow-button left"
        aria-label="Scroll Left">
        <FiArrowLeft size={20} />
      </button>

      <button
        onClick={() => scroll("right")}
        className="arrow-button right"
        aria-label="Scroll Right">
        <FiArrowRight size={20} />
      </button>

      <div
        className="marquee overflow-x-auto scroll-smooth"
        ref={marqueeRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}>
        <div className="marquee_content flex gap-4">
          <div className="flex w-max">
            {products.map((item: any) => (
              <div key={item._id} className="w-[300px] flex-shrink-0">
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
          id: selectedProduct._id,
          title: selectedProduct.name,
          price: selectedProduct.price.toString(),
          image: selectedProduct.productImage || "/placeholder.png",
          stock: selectedProduct.stock,
          isUnlimited: selectedProduct.isUnlimited,
          rating: 5,
          orders: 0,
          shipping: "Standard",
          description: selectedProduct.description,
          media: selectedProduct.media
        } : null}
        subtitle="New Arrival"
      />
    </div>
  );
};


export default NewArrivals;
