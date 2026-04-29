"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images?: string[];
  title?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images = [], title = "Product" }) => {
  const [activeImage, setActiveImage] = useState(images[0] || "/placeholder.png");

  React.useEffect(() => {
    if (images.length > 0) setActiveImage(images[0]);
  }, [images]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-white border border-gray-200 overflow-hidden flex items-center justify-center p-8 group">
        <Image
          src={activeImage}
          alt="Product View"
          fill
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          priority
          loading="eager"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`
               relative w-20 h-20 flex-shrink-0 border overflow-hidden bg-white p-2 transition-all duration-300
               ${activeImage === img ? "border-brand-gold shadow-md" : "border-gray-200 hover:border-brand-gold/30"}
             `}
          >
            <div className="relative w-full h-full">
              <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain" sizes="80px" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export { ProductGallery };
