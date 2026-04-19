"use client";

import React, { useState } from "react";
import Image from "next/image";

const ProductGallery = () => {
  const images = [
    "/web_detail_images/image_main.png",
    "/web_detail_images/Image.png",
    "/web_detail_images/Image copy.png",
    "/web_detail_images/Image copy 2.png",
    "/web_detail_images/Image copy 3.png",
    "/web_detail_images/Image copy 4.png",
    "/web_detail_images/Image copy 5.png",
  ];

  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-white border border-gray-100 overflow-hidden flex items-center justify-center p-8 rounded-2xl shadow-sm group">
        <Image
          src={activeImage}
          alt="Product View"
          fill
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`
               relative w-20 h-20 flex-shrink-0 border overflow-hidden bg-white p-2 transition-all duration-300 rounded-xl
               ${activeImage === img ? "border-brand-gold shadow-md" : "border-gray-100 hover:border-brand-gold/30"}
             `}
          >
            <div className="relative w-full h-full">
              <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export { ProductGallery };
