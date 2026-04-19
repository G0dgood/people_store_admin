"use client";

import React from "react";
import { Icon } from "../Icon";
import { MiniChart } from "./MiniChart";
import { SearchInput } from "../Form";
import { motion } from "framer-motion";

interface TopProduct {
  name: string;
  itemCode: string;
  price: string;
  data: number[];
  growth: string;
}

interface TopProductsProps {
  onViewAll?: () => void;
  products?: TopProduct[];
}

const defaultProducts: TopProduct[] = [
  { name: "Apple iPhone 13", itemCode: "FXZ-4567", price: "₦999,000", data: [40, 70, 45, 90, 65, 85, 90], growth: "+24% ^" },
  { name: "Nike Air Jordan", itemCode: "FXZ-4588", price: "₦72,400", data: [20, 40, 30, 60, 45, 75, 80], growth: "+18% ^" },
  { name: "T-shirt Premium", itemCode: "FXZ-4592", price: "₦35,400", data: [60, 50, 80, 55, 90, 65, 70], growth: "+12% ^" },
  { name: "Assorted Cross Bag", itemCode: "FXZ-4610", price: "₦80,000", data: [30, 45, 35, 60, 40, 70, 55], growth: "-5% v" },
];

export const TopProducts: React.FC<TopProductsProps> = ({
  onViewAll,
  products = defaultProducts
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 border border-[#1C1C1C1A] rounded-[6px] flex flex-col gap-6 relative overflow-hidden group/card"
    >
      {/* Instrumentation Backdrop Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#1D3557 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

      <div className="flex justify-between items-center relative z-10">
        <h3 className="text-[14px] font-black text-[#1D3557] uppercase tracking-[0.2em] opacity-80">Top Performers</h3>
        <button
          onClick={onViewAll}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue/5 text-brand-blue text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all duration-300"
        >
          Inventory
          <Icon name="arrow_forward" size="xs" className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Glass Search Bar */}
      <div className="relative z-10">
        <SearchInput
          placeholder="Quick product lookup..."
          containerClassName="w-full"
        />
      </div>

      <div className="flex flex-col gap-5 relative z-10">
        {products.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className="flex items-center justify-between group cursor-pointer p-3 -mx-3 rounded-2xl hover:bg-gray-50/80 transition-all duration-300"
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Rank & MiniChart Container */}
              <div className="relative">
                <div className="w-16 h-12 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-1 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <MiniChart type="sparkline" data={p.data} color={i === 0 ? "#1D3557" : "#2196F3"} height={32} />
                </div>
                {/* Rank Badge */}
                <div className={`absolute -top-2 -left-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border shadow-sm z-10 ${i === 0 ? "bg-[#1D3557] text-white border-[#1D3557]" : "bg-white text-gray-400 border-gray-200"
                  }`}>
                  {i + 1}
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-black text-[#1D3557] truncate max-w-[150px] transition-colors leading-tight">{p.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter tabular-nums">ID: {p.itemCode}</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${p.growth.includes('+') ? "text-emerald-500 bg-emerald-50" : "text-rose-500 bg-rose-50"
                    }`}>
                    {p.growth}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[13px] font-black text-[#1D3557] tabular-nums">{p.price}</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest opacity-60">Revenue</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl group-hover/card:bg-brand-blue/10 transition-colors pointer-events-none" />
    </motion.div>
  );
};
