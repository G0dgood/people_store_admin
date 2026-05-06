"use client";

import React, { useState, useMemo } from "react";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { Input } from "../Form/Inputs";
import Checkbox from "../Checkbox";
import { HiOutlineTag, HiOutlineInformationCircle, HiXMark } from "react-icons/hi2";
import { RiPercentLine } from "react-icons/ri";

import { useGetProductsQuery } from "@/lib/redux/services/productApi";
import { useGetCategoriesQuery } from "@/lib/redux/services/categoryApi";
import { useCreateOrUpdateOfferMutation } from "@/lib/redux/services/dealApi";
import { toast } from "sonner";
import { SVGLoaderFetch } from "../Options";
import { Icon } from "../Icon";

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialSelections?: Record<string, number>;
}

export function CreateOfferModal({ isOpen, onClose, onSave, initialSelections }: CreateOfferModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selections, setSelections] = useState<Record<string, number>>({}); // id: discount
  const [searchQuery, setSearchQuery] = useState("");

  const { data: productsRes, isLoading: isLoadingProducts } = useGetProductsQuery({
    limit: 100,
    category: selectedCategory === "All" ? "" : selectedCategory,
    search: searchQuery
  });
  const { data: categoriesRes } = useGetCategoriesQuery();
  const [createOrUpdateOffer, { isLoading: isSaving }] = useCreateOrUpdateOfferMutation();

  const products = productsRes?.data?.products || [];
  const categories = categoriesRes?.data || [];

  const hasInitialized = React.useRef(false);

  React.useEffect(() => {
    if (isOpen) {
      if (!hasInitialized.current) {
        setSelections(initialSelections || {});
        hasInitialized.current = true;
      }
    } else {
      hasInitialized.current = false;
      setSelections({});
    }
  }, [isOpen, initialSelections]);

  const toggleProduct = (id: string) => {
    setSelections(prev => {
      const next = { ...prev };
      if (next[id] !== undefined) {
        delete next[id];
      } else {
        next[id] = 10; // Default 10% discount
      }
      return next;
    });
  };

  const updateDiscount = (id: string, discount: number) => {
    setSelections(prev => ({ ...prev, [id]: discount }));
  };

  const selectedProductList = products.filter(p => selections[p._id] !== undefined);

  const handleSave = async () => {
    try {
      const promises = Object.entries(selections).map(([productId, discount]) =>
        createOrUpdateOffer({ productId, discount }).unwrap()
      );
      await Promise.all(promises);
      toast.success("Promotions established successfully");
      onSave();
      onClose();
      setSelections({});
    } catch (error) {
      toast.error("Failed to establish promotions");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Discount Offers"
      size="2xl"
      className="!max-w-[100%] !w-[100%]"
    >
      <div className="flex h-[700px] overflow-hidden">
        {/* Left: Categories */}
        <div className="w-64 border-r border-gray-200 flex flex-col pt-2 bg-gray-50/30">
          <div className="px-5 py-4 flex flex-col gap-1">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Filter Categories</h4>
          </div>
          <div className="flex flex-col gap-1 px-3">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`flex items-center justify-between px-4 py-3 rounded-sm transition-all text-xs font-bold
                ${selectedCategory === "All"
                  ? "bg-brand-gold text-white shadow-lg shadow-brand-gold/10"
                  : "text-gray-500 hover:bg-white hover:text-brand-gold"}
              `}
            >
              <span>All Products</span>
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center justify-between px-4 py-3 rounded-sm transition-all text-xs font-bold
                  ${selectedCategory === cat.name
                    ? "bg-brand-gold text-white shadow-lg shadow-brand-gold/10"
                    : "text-gray-500 hover:bg-white hover:text-brand-gold"}
                `}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Middle: Product Selection */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between gap-4">
            <div className="flex flex-col shrink-0">
              <h3 className="text-sm font-black text-[#1D3557]">Selection Area</h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Picking products from {selectedCategory}</span>
            </div>

            <Input
              shape="rounded-sm"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs h-9"
              containerClassName="max-w-[200px] flex-1"
            />

            <span className="text-[11px] font-black text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-sm uppercase shrink-0">
              {products.length} Products Found
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 lg:grid-cols-3 gap-6 custom-scrollbar bg-gray-50/20">
            {isLoadingProducts ? (
              <div className="col-span-full h-full flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanning Catalog...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                <Icon name="search-01" folder="dashboardIcon" size="lg" className="mb-4 text-gray-300" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No products found</p>
                <p className="text-[10px] text-gray-300 mt-2">Try adjusting your filters or search query</p>
              </div>
            ) : products.map((product: any) => (
              <div
                key={product._id}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProduct(product._id);
                }}
                className={`relative flex flex-col h-full p-4 rounded-sm border-2 transition-all cursor-pointer group hover:shadow-md
                  ${selections[product._id] !== undefined
                    ? "border-brand-gold bg-brand-gold/5 ring-1 ring-brand-gold/20"
                    : "border-gray-100 hover:border-brand-gold/30 bg-white"}
                `}
              >
                <div className="w-full aspect-[4/5] bg-white rounded-sm border border-gray-50 p-2 flex items-center justify-center overflow-hidden mb-3">
                  <img
                    src={product.productImage}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <h4 className="text-[11px] font-black text-[#1D3557] line-clamp-2 leading-tight min-h-[2.4em]">{product.name}</h4>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-black text-brand-gold">₦{product.price.toLocaleString()}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">ID: {product._id.slice(-6)}</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${selections[product._id] !== undefined
                      ? "bg-brand-gold border-brand-gold text-white"
                      : "bg-white border-gray-200 group-hover:border-brand-gold/50"}
                  `}>
                    {selections[product._id] !== undefined && <Icon name="check" folder="icon" size="xs" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary & Discounts */}
        <div className="w-80 border-l border-gray-200 flex flex-col bg-gray-50/30">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-sm font-black text-[#1D3557] uppercase tracking-wider">Summary List</h3>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase leading-tight">Apply specific discounts for selected items</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
            {selectedProductList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-4 opacity-40">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                  <HiOutlineTag size={32} />
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">No products selected<br />for this offer feed</p>
              </div>
            ) : (
              selectedProductList.map((p: any) => (
                <div key={p._id} className="bg-white p-4 rounded-sm border border-gray-200   flex flex-col gap-4 group hover:border-brand-gold/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-sm border border-gray-50 p-1 shrink-0 overflow-hidden">
                      <img src={p.productImage} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[10px] font-black text-[#1D3557] truncate leading-tight mb-1">{p.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-gray-400">Orig.</span>
                        <span className="text-[9px] font-black text-gray-400 line-through">₦{p.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleProduct(p._id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                    >
                      <HiXMark size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50/50 p-2.5 rounded-sm border border-gray-100 ring-1 ring-transparent focus-within:ring-brand-gold/20 focus-within:bg-white transition-all">
                    <div className="flex items-center gap-2 px-2 py-1 bg-brand-gold/10 rounded-sm">
                      <RiPercentLine className="text-brand-gold" size={14} />
                      <span className="text-[9px] font-black text-brand-gold uppercase tracking-tighter">Discount</span>
                    </div>
                    <input
                      type="number"
                      value={selections[p._id]}
                      onChange={(e) => updateDiscount(p._id, parseInt(e.target.value) || 0)}
                      className="flex-1 bg-transparent border-none text-[13px] font-black text-[#1D3557] focus:ring-0 p-0 text-right"
                      min="1"
                      max="99"
                    />
                    <span className="text-[11px] font-black text-[#1D3557]">%</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-white flex flex-col gap-4">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500">
              <span>Selected Items:</span>
              <span className="text-brand-gold">{selectedProductList.length}</span>
            </div>
            <Button
              shape="rounded-sm"
              variant="primary"
              disabled={selectedProductList.length === 0 || isSaving}
              isLoading={isSaving}
              className="transition-all duration-300 hover:bg-brand-gold hover:text-white"
              onClick={handleSave}
            >
              {Object.keys(initialSelections || {}).length > 0 ? "Update Promotion" : "Establish Deals"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
