"use client";

import React, { useState } from "react";
import Image from "next/image";

const ProductGallery = () => {
  const images = [
    "/web_images/royal_oud_front_view_1777031871485.png",
    "/web_images/royal_oud_with_box_view_1777031887393.png",
    "/web_images/royal_oud_cap_closeup_view_1777031904499.png",
    "/web_images/royal_oud_atmospheric_shot_view_1777031932066.png",
  ];

  const [activeImage, setActiveImage] = useState(images[0]);

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
              <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export { ProductGallery };
