"use client";

import React from "react";
import { Icon } from "../Icon";
import { motion } from "framer-motion";
import { useGetCategoriesQuery } from "@/lib/redux/services/categoryApi";
import { useGetBestSellingProductsQuery } from "@/lib/redux/services/productApi";
import { SVGLoaderFetch } from "../Options";

interface QuickAddProductProps {
  onAddNew?: () => void;
  onSeeMoreCategories?: () => void;
  onSeeMoreProducts?: () => void;
  onAddProduct?: (productName: string) => void;
}

export const QuickAddProduct: React.FC<QuickAddProductProps> = ({
  onAddNew,
  onSeeMoreCategories,
  onSeeMoreProducts,
  onAddProduct,
}) => {
  const { data: categoriesResponse, isLoading: isLoadingCats } = useGetCategoriesQuery();
  const { data: bestSellersResponse, isLoading: isLoadingBestSellers } = useGetBestSellingProductsQuery();

  const categories = categoriesResponse?.data?.slice(0, 3) || [];
  const topPerformers = bestSellersResponse?.data?.slice(0, 3) || [];

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
          {isLoadingCats ? (
            <div className="py-4"><SVGLoaderFetch asTable={false} text="" /></div>
          ) : categories.map((cat: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-transparent bg-blue-50/50 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-white border border-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img src={cat.image} className="w-6 h-6 object-contain" alt="" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-black text-[#1D3557]">{cat.name}</span>
                  <span className="text-[10px] font-bold text-gray-400">View Catalog</span>
                </div>
              </div>
              <Icon name="chevron_right" size="xs" className="text-gray-300 group-hover:text-[#1D3557] group-hover:translate-x-1 transition-all" />
            </motion.div>
          ))}
        </div>
        <button
          onClick={onSeeMoreCategories}
          className="text-[10px] font-black text-brand-gold/40 uppercase mt-2 self-center hover:text-brand-gold transition-colors tracking-widest"
        >
          Explore Categories
        </button>
      </div>

      <div className="flex flex-col gap-6 pt-6 border-t border-gray-200 mt-2 relative z-10">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 opacity-70 font-black">Top Performers</p>
        <div className="flex flex-col gap-4">
          {isLoadingBestSellers ? (
            <div className="py-4">
              <SVGLoaderFetch asTable={false} text="" />
            </div>
          ) : topPerformers.map((item: any, i: number) => {
            const p = item.productDetails;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex items-center justify-between group/row"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <div className="w-12 h-10 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden group-hover/row:border-brand-gold/20 transition-colors p-1">
                      <img src={p.productImage} className="w-full h-full object-contain" alt="" />
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-black text-[#1D3557] leading-tight truncate max-w-[140px] group-hover/row:text-brand-gold transition-all">{p.name}</span>
                    <span className={`text-[10px] font-black w-fit px-1.5 py-0.5 rounded mt-1 bg-brand-gold/10 text-brand-gold`}>
                      ₦{p.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onAddProduct?.(p.name)}
                  className="flex items-center gap-1.5 px-4 h-9 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase hover:bg-brand-gold transition-all shadow-md active:scale-95"
                >
                  <Icon name="circle-plus" folder="dashboardIcon" size="xs" /> Add
                </button>
              </motion.div>
            );
          })}
        </div>
        <button
          onClick={onSeeMoreProducts}
          className="text-[10px] font-black text-brand-gold/40 uppercase mt-1 self-center hover:text-brand-gold transition-colors tracking-widest"
        >
          View More Items
        </button>
      </div>
    </motion.div>
  );
};
