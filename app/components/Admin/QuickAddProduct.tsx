"use client";

import React from "react";
import { Icon } from "../Icon";
import { MiniChart } from "./MiniChart";

interface Category {
  name: string;
  data: number[];
}

interface Product {
  name: string;
  price: string;
  data: number[];
}

interface QuickAddProductProps {
  onAddNew?: () => void;
  onSeeMoreCategories?: () => void;
  onSeeMoreProducts?: () => void;
  onAddProduct?: (productName: string) => void;
}

const defaultCategories: Category[] = [
  { name: "Electronic", data: [40, 60, 45, 80, 50, 95, 60] },
  { name: "Fashion", data: [30, 45, 35, 60, 40, 70, 55] },
  { name: "Home", data: [20, 35, 30, 45, 50, 40, 60] },
];

const defaultProducts: Product[] = [
  { name: "Smart Fitness Tracker", price: "₦39.99", data: [30, 45, 35, 60, 45, 75, 80] },
  { name: "Leather Wallet", price: "₦19.99", data: [20, 30, 40, 35, 50, 45, 60] },
  { name: "Electric Hair Trimmer", price: "₦34.99", data: [40, 55, 45, 80, 60, 90, 85] },
];

export const QuickAddProduct: React.FC<QuickAddProductProps> = ({
  onAddNew,
  onSeeMoreCategories,
  onSeeMoreProducts,
  onAddProduct,
}) => {
  return (
    <div className="bg-white p-8 rounded-[6px] border border-gray-100 shadow-sm flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[16px] font-black text-[#1D3557]">Add New Product</h3>
        <button 
          onClick={onAddNew}
          className="text-brand-blue flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
        >
          <Icon name="circle-plus" folder="dashboardIcon" size="sm" /> Add New
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1">Categories</p>
        {defaultCategories.map((cat, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-[6px] border border-gray-50 hover:border-brand-blue/30 hover:bg-gray-50/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-11 h-8 shrink-0">
                <MiniChart type="bar" data={cat.data} color="#2196F3" height={32} />
              </div>
              <span className="text-[13px] font-black text-[#1D3557]">{cat.name}</span>
            </div>
            <Icon name="chevron_right" size="xs" className="text-gray-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
          </div>
        ))}
        <button 
          onClick={onSeeMoreCategories}
          className="text-[11px] font-black text-brand-blue/60 uppercase mt-2 self-center hover:text-brand-blue transition-colors"
        >
          See more
        </button>
      </div>

      <div className="flex flex-col gap-6 pt-6 border-t border-gray-100 mt-2">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Product</p>
        {defaultProducts.map((p, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-11 h-8 shrink-0">
                <MiniChart type="sparkline" data={p.data} color="#2196F3" height={32} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black text-[#1D3557] leading-tight truncate max-w-[120px]">{p.name}</span>
                <span className="text-[11px] font-black text-brand-blue mt-1">{p.price}</span>
              </div>
            </div>
            <button 
              onClick={() => onAddProduct?.(p.name)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-[6px] bg-[#E3F2FD] text-brand-blue text-[10px] font-black uppercase hover:bg-brand-blue hover:text-white transition-all shadow-sm"
            >
              <Icon name="add" size="xs" /> Add
            </button>
          </div>
        ))}
        <button 
          onClick={onSeeMoreProducts}
          className="text-[11px] font-black text-brand-blue/60 uppercase mt-1 self-center hover:text-brand-blue transition-colors"
        >
          See more
        </button>
      </div>
    </div>
  );
};
