"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";

const brandsData = [
  { id: 1, name: "Apple", logo: "/dashboardImage/Electronics.png", category: "Electronics", rating: 4.8, status: "Active" },
  { id: 2, name: "Nike", logo: "/dashboardImage/Fashion.png", category: "Fashion", rating: 4.5, status: "Active" },
  { id: 3, name: "Samsung", logo: "/dashboardImage/Frame 4259 copy.png", category: "Electronics", rating: 4.6, status: "Active" },
  { id: 4, name: "Adidas", logo: "/dashboardImage/T-Shirt.png", category: "Fashion", rating: 4.4, status: "Inactive" },
  { id: 5, name: "Sony", logo: "/dashboardImage/Accessories.png", category: "Electronics", rating: 4.7, status: "Active" },
  { id: 6, name: "Logitech", logo: "/dashboardImage/Webcam.png", category: "Accessories", rating: 4.3, status: "Active" },
  { id: 7, name: "Beats", logo: "/dashboardImage/Headphones.png", category: "Electronics", rating: 4.5, status: "Active" },
  { id: 8, name: "Dyson", logo: "/dashboardImage/Home & Kitchen.png", category: "Home Appliance", rating: 4.9, status: "Inactive" },
];

const statusConfig = {
  Active: "text-blue-500 bg-brand-blue-light",
  Inactive: "text-rose-500 bg-rose-50/50",
};

export default function BrandsListing() {
  const [activeTab, setActiveTab] = useState("All brands");

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
          <Button
            variant="primary"
            shape="rounded-sm"
            iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
          >
            Add Brand
          </Button>
          <Button
            variant="outline"
            shape="rounded-sm"
            iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
          >
            More Action
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filter Controls Row */}
        <div className="p-6 flex flex-col xl:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All brands", "Active", "Inactive"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input
              type="text"
              placeholder="Search brand name"
              containerClassName="flex-1 xl:w-96"
              className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <div className="flex gap-2">
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="sort" folder="dashboardIcon" size="sm" />
              </button>
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" />
              </button>
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">No.</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {brandsData.map((brand, index) => (
                <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors group px-6">
                  <td className="px-6 py-5 text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[6px] border border-gray-100 overflow-hidden bg-white p-1.5 shadow-sm ring-1 ring-gray-100 flex items-center justify-center">
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-sm font-bold text-[#1D3557] group-hover:text-blue-600 transition-colors">
                        {brand.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-500">{brand.category}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <Icon name="star" folder="dashboardIcon" size="xs" className="text-amber-400" />
                      <span className="text-xs font-bold text-[#1D3557]">{brand.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusConfig[brand.status as keyof typeof statusConfig]}`}>
                      {brand.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right pr-6">
                    <div className="flex justify-end items-center gap-4 text-gray-400">
                      <button className="hover:text-[#56A881] transition-colors">
                        <Icon name="settings" folder="dashboardIcon" size="sm" />
                      </button>
                      <button className="hover:text-rose-500 transition-colors">
                        <Icon name="Delete" folder="dashboardIcon" size="sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Area */}
        <div className="p-6 flex items-center justify-between border-t border-gray-50">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-[6px] text-xs font-bold text-[#1D3557] hover:bg-gray-50 transition-all shadow-sm group">
            <Icon name="arrow_back" folder="icon" size="xs" className="transition-transform group-hover:-translate-x-0.5" />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, "...", 24].map((page, i) => (
              <button
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded-[6px] text-xs font-bold transition-all ${page === 1
                    ? "bg-blue-100 text-blue-600 shadow-sm"
                    : "text-gray-400 hover:text-[#1D3557] hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-[6px] text-xs font-bold text-[#1D3557] hover:bg-gray-50 transition-all shadow-sm group">
            Next
            <Icon name="arrow_forward" folder="icon" size="xs" className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
