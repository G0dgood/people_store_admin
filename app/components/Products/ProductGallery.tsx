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
    <div className="flex flex-col gap-5 w-full max-w-[560px]">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center p-4">
        <Image
          src={activeImage}
          alt="Product View"
          fill
          className="object-contain p-2"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`
               relative w-14 h-14 flex-shrink-0 border rounded-md overflow-hidden bg-white p-1 transition-all
               ${activeImage === img ? "border-brand-blue" : "border-gray-200 hover:border-gray-300"}
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
