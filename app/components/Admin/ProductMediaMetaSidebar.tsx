"use client";

import React from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { Select } from "../Form";
import { HiPhoto, HiArrowPath, HiXCircle, HiPencil } from "react-icons/hi2";

interface ProductMediaMetaSidebarProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  stagedMedia: any[];
  removeMedia: (index: number) => void;
  makePrimary: (index: number) => void;
  setIsUploadModalOpen: (open: boolean) => void;
  categories: any[];
  brands: any[];
  showColorPicker: boolean;
  setShowColorPicker: (show: boolean) => void;
}

export const ProductMediaMetaSidebar: React.FC<ProductMediaMetaSidebarProps> = ({
  formData,
  handleInputChange,
  stagedMedia,
  removeMedia,
  makePrimary,
  setIsUploadModalOpen,
  categories,
  brands,
  showColorPicker,
  setShowColorPicker,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Upload Media */}
      <div className="bg-white rounded-[6px] border border-gray-200   p-8 flex flex-col gap-6">
        <h3 className="text-base font-bold text-[#121212]">Upload Product Image</h3>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#121212]">Product Image</label>
            {stagedMedia.length > 0 && (
              <button
                onClick={() => removeMedia(0)}
                className="text-[10px] font-bold text-red-500 hover:underline"
              >
                Remove Primary
              </button>
            )}
          </div>
          <div className="relative aspect-square w-full rounded-[6px] bg-gray-50/50 border border-gray-200 overflow-hidden group">
            {stagedMedia.length > 0 ? (
              (stagedMedia[0].file?.type?.startsWith("video") || stagedMedia[0].url?.match(/\.(mp4|webm|ogg)$/i)) ? (
                <video
                  src={stagedMedia[0].url}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={stagedMedia[0].url}
                  alt="Preview"
                  className="w-full h-full object-contain p-4"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50/50 text-gray-300">
                <HiPhoto className="w-20 h-20" />
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2">
              <Button shape="rounded-sm" variant="outline"
                className="bg-white/90 backdrop-blur-sm   py-2 px-6 text-[10px]"
                iconLeft={<HiPhoto />}
                onClick={() => setIsUploadModalOpen(true)}
              >
                {stagedMedia.length > 0 ? "Change Primary" : "Browse"}
              </Button>
              <Button shape="rounded-sm" variant="outline"
                className="bg-white/90 backdrop-blur-sm   py-2 px-6 text-[10px]"
                iconLeft={<HiArrowPath />}
                onClick={() => setIsUploadModalOpen(true)}
              >
                Replace All
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stagedMedia.slice(1).map((media, idx) => (
            <div key={idx + 1} className="relative aspect-square rounded-[6px] border border-gray-200 overflow-hidden bg-white   ring-1 ring-gray-100 group/thumb">
              {(media.file?.type?.startsWith("video") || media.url?.match(/\.(mp4|webm|ogg)$/i)) ? (
                <video src={media.url} className="w-full h-full object-cover" />
              ) : (
                <img src={media.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                <button
                  onClick={() => makePrimary(idx + 1)}
                  className="w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-emerald-500 hover:text-emerald-600 transition-colors  "
                  title="Make Primary"
                >
                  <HiPhoto className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => removeMedia(idx + 1)}
                  className="w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors  "
                  title="Remove"
                >
                  <HiXCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div
            className="aspect-square border-2 border-dashed border-brand-gold/30 rounded-[6px] flex flex-col items-center justify-center gap-2 bg-brand-gold/5 hover:bg-brand-gold/10 transition-all cursor-pointer group"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
              <Icon name="circle-plus" folder="dashboardIcon" size="xs" />
            </div>
            <span className="text-[10px] font-bold text-brand-gold">Add More</span>
          </div>
        </div>

        <div className="h-px bg-gray-50 my-2" />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-bold text-[#121212]">Product Categories</label>
            <Select
              shape="rounded-sm"
              value={formData.category}
              onChange={(val) => handleInputChange("category", val as string)}
              placeholder="Select your product"
              options={categories?.map(c => ({
                label: c?.name?.toUpperCase(),
                value: c?.name
              }))}
              searchable
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-bold text-[#121212]">Product Brand</label>
            <Select
              shape="rounded-sm"
              value={formData.brand}
              onChange={(val) => handleInputChange("brand", val as string)}
              placeholder="Select brand"
              options={brands?.map(b => ({
                label: b?.name?.toUpperCase(),
                value: b?._id
              }))}
              searchable
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-bold text-[#121212]">Product Tag</label>
            <Select
              shape="rounded-sm"
              value={formData.tag}
              onChange={(val) => handleInputChange("tag", val as string)}
              placeholder="Select your product tag"
              options={[
                { label: "New Arrival", value: "New Arrival" },
                { label: "Best Seller", value: "Best Seller" },
                { label: "Limited Edition", value: "Limited Edition" },
                { label: "Hot", value: "Hot" },
                { label: "Flash Sale", value: "Flash Sale" },
                { label: "Exclusive", value: "Exclusive" },
                { label: "Discount", value: "Discount" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-bold text-[#121212]">Scent Family</label>
            <Select
              shape="rounded-sm"
              value={formData.scentFamily}
              onChange={(val) => handleInputChange("scentFamily", val as string)}
              placeholder="Select scent family"
              options={[
                { label: "Floral", value: "Floral" },
                { label: "Woody", value: "Woody" },
                { label: "Oriental", value: "Oriental" },
                { label: "Fresh", value: "Fresh" },
                { label: "Citrus", value: "Citrus" },
                { label: "Spicy", value: "Spicy" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-bold text-[#121212]">Collections</label>
            <Select
              shape="rounded-sm"
              value={formData.collections[0] || ""} // Assuming single for now, or could use MultiSelect if available
              onChange={(val) => handleInputChange("collections", [val as string])}
              placeholder="Select collection"
              options={[
                { label: "Best Sellers", value: "Best Sellers" },
                { label: "New Arrivals", value: "New Arrivals" },
                { label: "Niche Perfumes", value: "Niche Perfumes" },
                { label: "Designer Classics", value: "Designer Classics" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-bold text-[#121212]">Gifting</label>
            <Select
              shape="rounded-sm"
              value={formData.gifting}
              onChange={(val) => handleInputChange("gifting", val as string)}
              placeholder="Select gifting type"
              options={[
                { label: "Perfume Gift Sets", value: "Perfume Gift Sets" },
                { label: "Travel Size", value: "Travel Size" },
                { label: "Discovery Sets", value: "Discovery Sets" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-[#121212]">
                {formData.colors ? "Selected Color" : "Select your color"}
              </label>
              <button
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                }}
                className="text-[10px] font-bold text-brand-gold hover:underline"
              >
                {showColorPicker ? "Close Picker" : formData.colors ? "Change Color" : "Open Custom Picker"}
              </button>
            </div>

            {showColorPicker && (
              <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-[6px] p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium text-gray-400">Modern Presets</span>
                  <div className="flex flex-wrap gap-2">
                    {["#121212", "#1a1a1a", "#f3f4f6", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51", "#264653"].map((preset) => (
                      <button
                        key={preset}
                        className={`w-6 h-6 rounded-full border   transition-transform hover:scale-125 ${formData.colors === preset ? "border-brand-gold ring-2 ring-brand-gold/20" : "border-white"}`}
                        style={{ backgroundColor: preset }}
                        onClick={() => {
                          handleInputChange("colors", preset);
                          setShowColorPicker(false);
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10px] font-medium text-gray-300 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-medium text-gray-400">Custom Hex</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="relative group">
                      <input
                        type="color"
                        value={formData.colors || "#000000"}
                        className="w-8 h-8 rounded-[4px] cursor-pointer border-none bg-transparent"
                        onChange={(e) => {
                          handleInputChange("colors", e.target.value.toUpperCase());
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.colors || ""}
                      placeholder="#000000"
                      className="flex-1 h-8 bg-white border border-gray-200 rounded-[4px] px-2 text-[10px] font-mono text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-100"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.match(/^#[0-9A-F]{6}$/i) || val === "") {
                          handleInputChange("colors", val.toUpperCase());
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.colors && (
              <div className="flex items-center gap-2 p-3 bg-gray-50/50 rounded-[6px] border border-gray-100 w-fit">
                <div
                  className="w-4 h-4 rounded-full border border-black/5  "
                  style={{ backgroundColor: formData.colors }}
                />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{formData.colors}</span>
                <button
                  onClick={() => handleInputChange("colors", "")}
                  className="ml-2 text-gray-300 hover:text-rose-500 transition-colors"
                >
                  <HiXCircle size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
