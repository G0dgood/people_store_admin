"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Button } from "@/app/components/Button";
import { Input } from "../../components/Form/Inputs";

const categories = [
  { name: "Electronics", image: "/dashboardImage/Electronics.png" },
  { name: "Fashion", image: "/dashboardImage/Fashion.png" },
  { name: "Accessories", image: "/dashboardImage/Accessories.png" },
  { name: "Home & Kitchen", image: "/dashboardImage/Home & Kitchen.png" },
  { name: "Sports & Outdoors", image: "/dashboardImage/Sports & Outdoors.png" },
  { name: "Toys & Games", image: "/dashboardImage/Toys & Games.png" },
  { name: "Health & Fitness", image: "/dashboardImage/Health & Fitness.png" },
  { name: "Books", image: "/dashboardImage/Books.png" },
];

const products = [
  { id: 1, name: "Wireless Bluetooth Headphones", image: "/dashboardImage/Headphones.png", date: "01-01-2025", order: 25 },
  { id: 2, name: "Men's T-Shirt", image: "/dashboardImage/T-Shirt.png", date: "01-01-2025", order: 20 },
  { id: 3, name: "Men's Leather Wallet", image: "/dashboardImage/Wallet.png", date: "01-01-2025", order: 35 },
  { id: 4, name: "Memory Foam Pillow", image: "/dashboardImage/Pillow.png", date: "01-01-2025", order: 40 },
  { id: 5, name: "Coffee Maker", image: "/dashboardImage/Coffee Maker.png", date: "01-01-2025", order: 45 },
  { id: 6, name: "Casual Baseball Cap", image: "/dashboardImage/Cap.png", date: "01-01-2025", order: 55 },
  { id: 7, name: "Full HD Webcam", image: "/dashboardImage/Webcam.png", date: "01-01-2025", order: 20 },
  { id: 8, name: "Smart LED Color Bulb", image: "/dashboardImage/Bulb.png", date: "01-01-2025", order: 16 },
  { id: 9, name: "Men's T-Shirt", image: "/dashboardImage/T-Shirt.png", date: "01-01-2025", order: 10 },
  { id: 10, name: "Men's Leather Wallet", image: "/dashboardImage/Wallet.png", date: "01-01-2025", order: 35 },
];

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState("All Product (145)");

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Section */}
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
          <Button
            variant="primary"
            shape="rounded-sm"
            iconLeft={<Icon name="add" folder="icon" size="xs" />}
          >
            Add Product
          </Button>
          <Button
            variant="outline"
            shape="rounded-sm"
            iconRight={<Icon name="more_vert" folder="icon" size="xs" />}
          >
            More Action
          </Button>
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="relative group">
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          {categories.map((cat, i) => (
            <div key={i} className="flex-shrink-0 w-[220px] bg-white border border-gray-100 p-3 rounded-[6px] flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 rounded-[6px] overflow-hidden bg-gray-50 flex items-center justify-center p-1">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-sm font-bold text-[#1D3557]">{cat.name}</span>
            </div>
          ))}
        </div>
        <button className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-lg text-gray-400 hover:text-gray-900 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Icon name="chevron_right" folder="icon" size="sm" />
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm flex flex-col pt-4">
        {/* Fill Tabs & Controls */}
        <div className="px-6 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <TabFilter
            tabs={["All Product (145)", "Featured Products", "On Sale", "Out of Stock"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Search your product"
              containerClassName="flex-1 md:w-96"
              className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />
            <button className="p-2 border border-gray-100 rounded-[6px] text-gray-400 hover:bg-gray-50">
              <Icon name="sort" folder="dashboardIcon" size="sm" />
            </button>
            <button className="p-2 border border-gray-100 rounded-[6px] text-gray-400 hover:bg-gray-50">
              <Icon name="circle-plus" folder="dashboardIcon" size="sm" />
            </button>
            <button className="p-2 border border-gray-100 rounded-[6px] text-gray-400 hover:bg-gray-50">
              <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[gray-50]/50 border-y border-gray-50">
                <th className="pl-6 py-4 w-12">
                  <input type="checkbox" className="rounded-[4px] border-gray-300 text-[#2196F3] focus:ring-[#2196F3]" />
                </th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#1D3557] uppercase tracking-wider">No.</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1D3557] uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1D3557] uppercase tracking-wider">Created Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1D3557] uppercase tracking-wider text-center">Order</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1D3557] uppercase tracking-wider text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-500">
              {products.map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="pl-6 py-4">
                    <input type="checkbox" className="rounded-[4px] border-gray-300 text-[#2196F3] focus:ring-[#2196F3]" />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-bold text-gray-900">1</span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[6px] overflow-hidden bg-gray-50 border border-gray-100 p-1">
                      <img src={p.image} alt="" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 leading-tight block truncate max-w-[200px]">{p.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{p.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-center">{p.order}</td>
                  <td className="px-6 py-4 text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 border border-gray-50 rounded-[6px] text-gray-400 hover:text-brand-blue hover:bg-brand-blue-light transition-all">
                        <Icon name="create" folder="icon" size="sm" />
                      </button>
                      <button className="p-1.5 border border-gray-50 rounded-[6px] text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                        <Icon name="delete_outline" folder="icon" size="sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-8 flex justify-between items-center bg-white border-t border-gray-50">
          <button className="flex items-center gap-2 px-4 py-2 rounded-[6px] border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Icon name="arrow_back" folder="icon" size="xs" />
            Previous
          </button>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, "...", 24].map((page, i) => (
              <button
                key={i}
                className={`w-9 h-9 rounded-[6px] flex items-center justify-center text-sm font-bold transition-all ${page === 1 ? "bg-[#2196F3]/20 text-[#2196F3]" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-[6px] border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
            Next
            <Icon name="arrow_forward" folder="icon" size="xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
