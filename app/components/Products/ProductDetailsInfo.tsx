"use client";

import React from "react";
import { Icon } from "../Icon";
import { Rating } from "../Other/Rating";

import { PriceTiers, SpecsTable, ProtectionWarranty } from "./ProductDetailSpecs";

const ProductDetailsInfo = () => {
  const sizes = [
    { label: "50ml", price: "₦98,000.00", isActive: false },
    { label: "100ml", price: "₦155,000.00", isActive: true },
    { label: "200ml", price: "₦210,000.00", isActive: false },
  ];

  const specs = [
    { label: "Brand:", value: "Gucci" },
    { label: "Type:", value: "Eau de Parfum" },
    { label: "Category:", value: "Signature Fragrance" },
    { label: "Scent:", value: "Floral & Oriental" },
  ];

  return (
    <div className="flex-1 flex flex-col gap-8">
      {/* Header Info */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-brand-gold">
          <Icon name="check" size="sm" />
          <span className="text-[10px] font-bold uppercase tracking-widest">In Stock & Ready to Ship</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-outfit font-light text-gray-900 leading-tight uppercase tracking-tight">
          Gucci <span className="font-bold">Guilty</span> Intense Pour Femme
        </h1>
        <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-2">
            <Rating value={4.5} />
            <span className="text-brand-gold">4.5 Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="chat" size="xs" />
            <span>124 reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="shopping_basket" size="xs" />
            <span>Authentic Product</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-200 pb-2">Select Size</h3>
        <div className="flex flex-wrap gap-4">
          {sizes.map((size, idx) => (
            <button
              key={idx}
              className={`px-8 py-4 border transition-all duration-300 flex flex-col items-center gap-1 rounded-none
                ${size.isActive
                  ? "border-brand-gold bg-black text-white shadow-xl scale-105"
                  : "border-gray-200 hover:border-brand-gold text-gray-500 hover:text-gray-900"}`}
            >
              <span className="text-xs font-bold uppercase tracking-widest">{size.label}</span>
              <span className={`text-[10px] font-medium ${size.isActive ? "text-brand-gold" : "text-gray-400"}`}>{size.price}</span>
            </button>
          ))}
        </div>
      </div>

      <SpecsTable specs={specs} />

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <button className="flex-1 bg-black text-white h-14 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-brand-gold transition-all shadow-xl active:scale-95">
            Add to Bag
          </button>
          <button className="w-14 h-14 border border-gray-200 flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all group">
            <Icon name="favorite_border" size="sm" className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <button className="w-full border-2 border-brand-gold text-brand-gold h-14 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-brand-gold hover:text-white transition-all active:scale-95">
          Buy Now
        </button>
      </div>

      <ProtectionWarranty />
    </div>
  );
};

export { ProductDetailsInfo };
