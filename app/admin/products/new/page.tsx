"use client";

import React, { useState } from "react";
import { Icon } from "../../../components/Icon";
import { Button } from "../../../components/Button";
import { Select } from "../../../components/Form/Select";
import { Switch } from "../../../components/Form/Switch";
import { Input, Textarea } from "../../../components/Form/Inputs";

export default function CreateProduct() {
  const [stockStatus, setStockStatus] = useState("In Stock");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Top Header / Action Bar */}
      <div className="flex flex-col xl:flex-row justify-end items-start xl:items-center gap-4">

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <Input
            type="text"
            placeholder="Search product for add"
            containerClassName="flex-1 xl:w-96"
            className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
            suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
          />

          <div className="flex gap-2">
            <Button
              variant="primary"
              shape="rounded-sm"
              size="md"
            >
              Publish Product
            </Button>
            <Button
              variant="outline"
              shape="rounded-sm"
              size="md"
              iconLeft={<Icon name="ticket" folder="dashboardIcon" size="xs" className="opacity-70" />}
            >
              Save to draft
            </Button>
            <Button
              variant="outline"
              shape="rounded-sm"
              className="px-2"
            >
              <Icon name="circle-plus" folder="dashboardIcon" size="sm" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Column (Main Details) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Basic Details */}
          <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-base font-bold text-[#1D3557]">Basic Details</h3>

            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-[#1D3557]">Product Name</label>
              <Input
                type="text"
                defaultValue="iPhone 15"
                className="bg-gray-50/80 border-gray-50 text-sm font-medium text-gray-700"
              />
            </div>

            <div className="flex flex-col gap-2.5 relative">
              <label className="text-xs font-bold text-[#1D3557]">Product Description</label>
              <div className="relative group">
                <Textarea
                  rows={6}
                  defaultValue="The iPhone 15 delivers cutting-edge performance with the A16 Bionic chip, an immersive Super Retina XDR display, advanced dual-camera system, and exceptional battery life, all encased in stunning aerospace-grade aluminum."
                  className="bg-gray-50/80 border-gray-50 text-sm font-medium text-gray-700 resize-none leading-relaxed"
                />
                <div className="absolute bottom-4 right-4 flex gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-gray-100 rounded-[6px]"><Icon name="settings" folder="dashboardIcon" size="xs" /></button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-[6px]"><Icon name="star" folder="dashboardIcon" size="xs" /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-base font-bold text-[#1D3557]">Pricing</h3>

            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-[#1D3557]">Product Price</label>
              <Input
                type="text"
                defaultValue="$999.89"
                className="bg-gray-50/80 border-gray-50 text-sm font-bold text-gray-900"
                suffixElement={
                  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-[6px] cursor-pointer shadow-sm">
                    <img src="/dashboardIcon/usa.svg" alt="USA" className="w-5 h-3 object-cover rounded-[1px]" />
                    <Icon name="material-symbols_arrow-downward-rounded" folder="dashboardIcon" size="xs" className="text-gray-400" />
                  </div>
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-gray-400">Discounted Price <span className="text-gray-300 font-medium">(Optional)</span></label>
                <div className="bg-gray-50/80 border border-gray-50 rounded-[6px] px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400">$</span>
                    <span className="text-sm font-bold text-gray-900">99</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 italic">Sale= $900.89</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-[#1D3557]">Tax Included</label>
                <div className="flex items-center gap-6 py-3">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border-2 border-brand-blue flex items-center justify-center p-0.5">
                      <div className="w-full h-full bg-brand-blue rounded-full"></div>
                    </div>
                    <span className="text-xs font-bold text-[#1D3557]">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border border-gray-200 group-hover:border-gray-300"></div>
                    <span className="text-xs font-bold text-gray-400">No</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-[#1D3557]">Expiration</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  placeholder="Start"
                  className="bg-gray-50/80 border-gray-50 text-xs font-bold text-gray-400"
                  suffixElement={<Icon name="ticket" folder="dashboardIcon" size="xs" className="text-gray-300 mr-1" />}
                />
                <Input
                  type="text"
                  placeholder="End"
                  className="bg-gray-50/80 border-gray-50 text-xs font-bold text-gray-400"
                  suffixElement={<Icon name="ticket" folder="dashboardIcon" size="xs" className="text-gray-300 mr-1" />}
                />
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-sm font-bold text-[#1D3557]">Inventory</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-[#1D3557]">Stock Quantity</label>
                <Input
                  type="text"
                  defaultValue="Unlimited"
                  className="bg-gray-50/80 border-gray-50 text-sm font-bold text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-[#1D3557]">Stock Status</label>
                <Select
                  value={stockStatus}
                  onChange={(val) => setStockStatus(val as string)}
                  options={[
                    { label: "In Stock", value: "In Stock" },
                    { label: "Out of Stock", value: "Out of Stock" },
                  ]}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center justify-between w-full max-w-[200px]">
                <Switch checked={true} readOnly label={<span className="text-xs font-bold text-gray-900">Unlimited</span>} />
              </div>

              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div className="w-4 h-4 rounded-[3px] border border-blue-500 bg-blue-500 flex items-center justify-center">
                  <Icon name="Delivered" folder="dashboardIcon" size="xs" className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-400 underline underline-offset-4 decoration-gray-200">Highlight this product in a featured section.</span>
              </label>
            </div>

            <div className="flex gap-3 justify-end mt-4 pt-6 border-t border-gray-50">
              <button className="bg-white border border-gray-100 text-[#1D3557] px-6 py-2.5 rounded-[6px] text-xs font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
                <Icon name="ticket" folder="dashboardIcon" size="xs" className="opacity-70" />
                Save to draft
              </button>
              <button className="bg-[#56A881] text-white px-8 py-2.5 rounded-[6px] text-xs font-bold hover:bg-[#4a9370] transition-all shadow-md">
                Publish Product
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Media & Meta) */}
        <div className="flex flex-col gap-6">
          {/* Upload Media */}
          <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-base font-bold text-[#1D3557]">Upload Product Image</h3>

            <div className="flex flex-col gap-4">
              <label className="text-xs font-bold text-[#1D3557]">Product Image</label>
              <div className="relative aspect-square w-full rounded-[6px] bg-gray-50/50 border border-gray-100 overflow-hidden group">
                <img src="/dashboardImage/Frame 4259 copy.png" alt="Preview" className="w-full h-full object-contain p-8" />

                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-100 py-2 rounded-[6px] text-[10px] font-bold text-gray-700 hover:bg-white transition-all shadow-sm">
                    <Icon name="Picture" folder="dashboardIcon" size="xs" />
                    Browse
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-100 py-2 rounded-[6px] text-[10px] font-bold text-gray-700 hover:bg-white transition-all shadow-sm">
                    <Icon name="arrow-refresh-06" folder="dashboardIcon" size="xs" />
                    Replace
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="relative aspect-square rounded-[6px] border border-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-100">
                  <img src="/dashboardImage/Frame 4259 copy.png" alt="Thumb" className="w-full h-full object-contain p-2" />
                  <button className="absolute top-1 right-1 w-4 h-4 bg-white/80 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500">
                    <Icon name="menu-close" folder="dashboardIcon" size="xs" />
                  </button>
                </div>
                <div className="relative aspect-square rounded-[6px] border border-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-100">
                  <img src="/dashboardImage/Frame 4259 copy.png" alt="Thumb" className="w-full h-full object-contain p-2 opacity-60" />
                  <button className="absolute top-1 right-1 w-4 h-4 bg-white/80 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500">
                    <Icon name="menu-close" folder="dashboardIcon" size="xs" />
                  </button>
                </div>
                <div className="aspect-square border-2 border-dashed border-blue-200 rounded-[6px] flex flex-col items-center justify-center gap-2 bg-brand-blue-light hover:bg-brand-blue-light transition-all cursor-pointer group">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                    <Icon name="circle-plus" folder="dashboardIcon" size="xs" />
                  </div>
                  <span className="text-[10px] font-bold text-[#2196F3]">Add Image</span>
                </div>
              </div>
            </div>
          </div>

          {/* Categorization */}
          <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-base font-bold text-[#1D3557]">Categories</h3>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <label className="text-[11px] font-bold text-[#1D3557]">Product Categories</label>
                <Select
                  value={category}
                  onChange={(val) => setCategory(val as string)}
                  placeholder="Select your product"
                  options={[
                    { label: "Electronics", value: "Electronics" },
                    { label: "Smartphone", value: "Smartphone" },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-[11px] font-bold text-[#1D3557]">Product Tag</label>
                <Select
                  value={tag}
                  onChange={(val) => setTag(val as string)}
                  placeholder="Select your product"
                  options={[
                    { label: "New Arrival", value: "New Arrival" },
                    { label: "Best Seller", value: "Best Seller" },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-[11px] font-bold text-[#1D3557]">Select your color</label>
                <div className="flex flex-wrap gap-3">
                  {["#D2E8C4", "#EAC7CC", "#D3DBE0", "#E8E5CB", "#3D4144"].map((color, i) => (
                    <button
                      key={i}
                      style={{ backgroundColor: color }}
                      className="w-10 h-10 rounded-[6px] shadow-inner border border-black/5 hover:scale-110 transition-transform"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
