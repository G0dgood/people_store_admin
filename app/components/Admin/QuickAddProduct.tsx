"use client";

import React from "react";
import { Icon } from "../Icon";
import { MiniChart } from "./MiniChart";
import { motion } from "framer-motion";
import { HiOutlineLightningBolt, HiOutlineShoppingBag, HiOutlineHome } from "react-icons/hi";

interface Category {
  name: string;
  data: number[];
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

interface Product {
  name: string;
  price: string;
  data: number[];
  color: string;
}

interface QuickAddProductProps {
  onAddNew?: () => void;
  onSeeMoreCategories?: () => void;
  onSeeMoreProducts?: () => void;
  onAddProduct?: (productName: string) => void;
}

const defaultCategories: Category[] = [
  { 
    name: "Electronic", 
    data: [40, 60, 45, 80, 50, 95, 60], 
    color: "#2196F3", 
    bgColor: "bg-blue-50/50",
    icon: <HiOutlineLightningBolt className="w-5 h-5 text-blue-500" />
  },
  { 
    name: "Fashion", 
    data: [30, 45, 35, 60, 40, 70, 55], 
    color: "#F43F5E", 
    bgColor: "bg-rose-50/50",
    icon: <HiOutlineShoppingBag className="w-5 h-5 text-rose-500" />
  },
  { 
    name: "Home", 
    data: [20, 35, 30, 45, 50, 40, 60], 
    color: "#F59E0B", 
    bgColor: "bg-amber-50/50",
    icon: <HiOutlineHome className="w-5 h-5 text-amber-600" />
  },
];

const defaultProducts: Product[] = [
  { name: "Smart Fitness Tracker", price: "₦39,990", data: [30, 45, 35, 60, 45, 75, 80], color: "#2196F3" },
  { name: "Leather Wallet", price: "₦19,990", data: [20, 30, 40, 35, 50, 45, 60], color: "#F43F5E" },
  { name: "Electric Hair Trimmer", price: "₦34,990", data: [40, 55, 45, 80, 60, 90, 85], color: "#F59E0B" },
];

export const QuickAddProduct: React.FC<QuickAddProductProps> = ({
  onAddNew,
  onSeeMoreCategories,
  onSeeMoreProducts,
  onAddProduct,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-[6px] border border-[#1C1C1C1A] flex flex-col gap-6 relative overflow-hidden group/card shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
    >
      {/* Instrumentation Backdrop Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#1D3557 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />

      <div className="flex justify-between items-center relative z-10">
        <h3 className="text-[14px] font-black text-[#1D3557] uppercase tracking-[0.2em] opacity-80">Inventory Actions</h3>
        <button 
          onClick={onAddNew}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all duration-300"
        >
          <Icon name="circle-plus" folder="dashboardIcon" size="sm" className="group-hover:rotate-90 transition-transform duration-300" />
          Add New
        </button>
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1 opacity-70">Top Categories</p>
        <div className="grid grid-cols-1 gap-3">
          {defaultCategories.map((cat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-transparent ${cat.bgColor} hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-white border border-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-black text-[#1D3557]">{cat.name}</span>
                  <div className="w-16 h-4 opacity-40 group-hover:opacity-100 transition-opacity">
                    <MiniChart type="bar" data={cat.data} color={cat.color} height={16} />
                  </div>
                </div>
              </div>
              <Icon name="chevron_right" size="xs" className="text-gray-300 group-hover:text-[#1D3557] group-hover:translate-x-1 transition-all" />
            </motion.div>
          ))}
        </div>
        <button 
          onClick={onSeeMoreCategories}
          className="text-[10px] font-black text-brand-blue/40 uppercase mt-2 self-center hover:text-brand-blue transition-colors tracking-widest"
        >
          Explore Categories
        </button>
      </div>

      <div className="flex flex-col gap-6 pt-6 border-t border-gray-200 mt-2 relative z-10">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 opacity-70 font-black">Frequent Drafts</p>
        <div className="flex flex-col gap-4">
          {defaultProducts.map((p, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="flex items-center justify-between group/row"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <div className="w-12 h-10 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden group-hover/row:border-brand-blue/20 transition-colors">
                    <MiniChart type="sparkline" data={p.data} color={p.color} height={40} />
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-black text-[#1D3557] leading-tight truncate max-w-[140px] group-hover/row:text-brand-blue transition-all">{p.name}</span>
                  <span className={`text-[10px] font-black w-fit px-1.5 py-0.5 rounded mt-1 bg-opacity-10`} style={{ color: p.color, backgroundColor: `${p.color}15` }}>
                    {p.price}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => onAddProduct?.(p.name)}
                className="flex items-center gap-1.5 px-4 h-9 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase hover:bg-brand-blue transition-all shadow-md active:scale-95"
              >
                <Icon name="circle-plus" folder="dashboardIcon" size="xs" /> Add
              </button>
            </motion.div>
          ))}
        </div>
        <button 
          onClick={onSeeMoreProducts}
          className="text-[10px] font-black text-brand-blue/40 uppercase mt-1 self-center hover:text-brand-blue transition-colors tracking-widest"
        >
          View More Items
        </button>
      </div>
    </motion.div>
  );
};
