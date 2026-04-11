"use client";

import React from "react";
import { Icon } from "../Icon";
import { Rating } from "../Other/Rating";

import { PriceTiers, SpecsTable, ProtectionWarranty } from "./ProductDetailSpecs";

const ProductDetailsInfo = () => {
  const priceTiers = [
    { price: "$98.00", range: "50-100 pcs", isActive: true },
    { price: "$90.00", range: "100-700 pcs" },
    { price: "$78.00", range: "700+ pcs" },
  ];

  const specs = [
    { label: "Price:", value: "Negotiable" },
    { label: "Type:", value: "Classic shoes" },
    { label: "Material:", value: "Plastic material" },
    { label: "Design:", value: "Modern nice" },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col gap-3">
         <div className="flex items-center gap-2 text-[#00B517]">
            <Icon name="check" size="sm" />
            <span className="text-sm font-medium">In stock</span>
         </div>
         <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Mens Long Sleeve T-shirt Cotton Base Layer Slim Muscle
         </h1>
         <div className="flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
               <Rating value={4} />
               <span className="text-orange-500 font-medium">4.0</span>
            </div>
            <div className="flex items-center gap-2">
               <Icon name="chat" size="xs" />
               <span>88 reviews</span>
            </div>
            <div className="flex items-center gap-2">
               <Icon name="shopping_basket" size="xs" />
               <span>154 orders</span>
            </div>
         </div>
      </div>

      <PriceTiers tiers={priceTiers} />
      <SpecsTable specs={specs} />
      <ProtectionWarranty />
    </div>
  );
};

export { ProductDetailsInfo };
