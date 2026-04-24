"use client";

import React, { useState, useMemo } from "react";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { Input } from "../Form/Inputs";
import Checkbox from "../Checkbox";
import { HiOutlineTag, HiOutlineInformationCircle, HiXMark } from "react-icons/hi2";
import { RiPercentLine } from "react-icons/ri";

const categories = [
  { name: "All", count: 145 },
  { name: "Electronics", count: 42 },
  { name: "Fashion", count: 38 },
  { name: "Home", count: 25 },
  { name: "Accessories", count: 40 },
];

const mockProducts = [
  { id: 1, name: "Premium Wireless Headphones", category: "Electronics", price: 35000, image: "/dashboardImage/Headphones.png" },
  { id: 2, name: "Smart Fitness Watch", category: "Electronics", price: 18500, image: "/dashboardImage/Electronics.png" },
  { id: 3, name: "Organic Cotton T-Shirt", category: "Fashion", price: 4500, image: "/dashboardImage/T-Shirt.png" },
  { id: 4, name: "Leather Travel Bag", category: "Fashion", price: 25000, image: "/dashboardImage/Fashion.png" },
  { id: 5, name: "Minimalist Wall Clock", category: "Home", price: 8900, image: "/dashboardImage/Home & Kitchen.png" },
  { id: 6, name: "Modern Desk Lamp", category: "Home", price: 12000, image: "/dashboardImage/Bulb.png" },
  { id: 7, name: "Ergonomic Gaming Mouse", category: "Electronics", price: 22000, image: "/dashboardImage/Accessories.png" },
  { id: 8, name: "Wireless Charging Pad", category: "Electronics", price: 7500, image: "/dashboardImage/Electronics.png" },
];

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deals: any[]) => void;
  initialSelections?: Record<number, number>;
}

export function CreateOfferModal({ isOpen, onClose, onSave, initialSelections }: CreateOfferModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selections, setSelections] = useState<Record<number, number>>({}); // id: discount

  React.useEffect(() => {
    if (isOpen) {
      if (initialSelections) {
        setSelections(initialSelections);
      } else {
        setSelections({});
      }
    }
  }, [isOpen, initialSelections]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return mockProducts;
    return mockProducts.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const toggleProduct = (id: number) => {
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

  const updateDiscount = (id: number, discount: number) => {
    setSelections(prev => ({ ...prev, [id]: discount }));
  };

  const selectedProductList = useMemo(() => {
    return mockProducts.filter(p => selections[p.id] !== undefined);
  }, [selections]);

  const handleSave = () => {
    const deals = selectedProductList.map(p => ({
      ...p,
      discount: selections[p.id]
    }));
    onSave(deals);
    onClose();
    setSelections({});
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
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center justify-between px-4 py-3 rounded-sm transition-all text-xs font-bold
                  ${selectedCategory === cat.name
                    ? "bg-brand-gold text-white shadow-lg shadow-brand-gold/10"
                    : "text-gray-500 hover:bg-white hover:text-brand-gold"}
                `}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] ${selectedCategory === cat.name ? "text-white/60" : "text-gray-400"}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Middle: Product Selection */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-sm font-black text-[#1D3557]">Selection Area</h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Picking products from {selectedCategory}</span>
            </div>
            <span className="text-[11px] font-black text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-sm uppercase">
              {filteredProducts.length} Products Found
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 gap-6 custom-scrollbar">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                className={`relative flex flex-col gap-3 p-4 rounded-sm border-2 transition-all cursor-pointer group
                  ${selections[product.id] !== undefined
                    ? "border-brand-gold bg-brand-gold/5"
                    : "border-gray-200 hover:border-brand-gold/20 bg-white"}
                `}
              >
                <div className="w-full aspect-square bg-white rounded-xl border border-gray-50 p-2 flex items-center justify-center overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-bold text-[#1D3557] line-clamp-1">{product.name}</h4>
                  <span className="text-[10px] font-black text-brand-gold">₦{product.price.toLocaleString()}</span>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <Checkbox
                    checked={selections[product.id] !== undefined}
                    onChange={() => toggleProduct(product.id)}
                    size="lg"
                  />
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
                <HiOutlineTag size={40} className="text-gray-300" />
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">No products selected for this offer feed</p>
              </div>
            ) : (
              selectedProductList.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-sm p-1 shrink-0">
                      <img src={p.image} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[10px] font-black text-[#1D3557] truncate">{p.name}</span>
                      <span className="text-[9px] font-bold text-gray-400">Orig. ₦{p.price.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => toggleProduct(p.id)}
                      className="text-gray-300 hover:text-rose-500 transition-colors"
                    >
                      <HiXMark size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-sm border border-gray-200">
                    <RiPercentLine className="text-brand-gold" />
                    <input
                      type="number"
                      value={selections[p.id]}
                      onChange={(e) => updateDiscount(p.id, parseInt(e.target.value) || 0)}
                      className="w-full bg-transparent border-none text-xs font-black text-[#1D3557] focus:ring-0 p-0"
                      min="1"
                      max="99"
                    />
                    <span className="text-[10px] font-black text-gray-400 uppercase">Discount</span>
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
              disabled={selectedProductList.length === 0}
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
