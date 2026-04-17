"use client";

import React from "react";
import { Icon } from "../Icon";
import { MiniChart } from "./MiniChart";

interface TopProduct {
  name: string;
  itemCode: string;
  price: string;
  data: number[];
}

interface TopProductsProps {
  onViewAll?: () => void;
  products?: TopProduct[];
}

const defaultProducts: TopProduct[] = [
  { name: "Apple iPhone 13", itemCode: "FXZ-4567", price: "₦999.00", data: [40, 70, 45, 90, 65, 85, 90] },
  { name: "Nike Air Jordan", itemCode: "FXZ-4567", price: "₦72.40", data: [20, 40, 30, 60, 45, 75, 80] },
  { name: "T-shirt", itemCode: "FXZ-4567", price: "₦35.40", data: [60, 50, 80, 55, 90, 65, 70] },
  { name: "Assorted Cross Bag", itemCode: "FXZ-4567", price: "₦80.00", data: [30, 45, 35, 60, 40, 70, 55] },
];

export const TopProducts: React.FC<TopProductsProps> = ({ 
  onViewAll, 
  products = defaultProducts 
}) => {
  return (
    <div className="bg-white p-8 rounded-[6px] border border-gray-100 shadow-sm flex flex-col gap-6">
      <div className="flex justify-between items-baseline">
        <h3 className="text-[16px] font-black text-[#1D3557]">Top Products</h3>
        <button 
          onClick={onViewAll}
          className="text-[11px] font-black text-brand-blue uppercase hover:underline"
        >
          All product
        </button>
      </div>

      <div className="flex items-center bg-[#F8F9FA] rounded-[6px] px-4 py-3 group focus-within:ring-2 focus-within:ring-brand-blue/10 transition-all border border-transparent focus-within:bg-white focus-within:border-gray-200">
        <Icon name="search-01" folder="dashboardIcon" size="xs" className="text-gray-500 group-focus-within:text-brand-blue" />
        <input 
          type="text" 
          placeholder="Search" 
          className="bg-transparent border-none focus:outline-none text-[12px] font-bold text-[#1D3557] w-full px-3 placeholder:text-gray-500" 
        />
      </div>

      <div className="flex flex-col gap-6">
        {products.map((p, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-10 shrink-0">
                <MiniChart type="sparkline" data={p.data} color="#2196F3" height={40} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-black text-[#1D3557] truncate max-w-[120px] group-hover:text-brand-blue transition-colors">{p.name}</span>
                <span className="text-[10px] font-bold text-gray-500 mt-0.5">Item: #{p.itemCode}</span>
              </div>
            </div>
            <span className="text-[13px] font-black text-[#1D3557]">{p.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
