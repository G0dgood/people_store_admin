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
  editingColorIndex: number | null;
  setEditingColorIndex: (index: number | null) => void;
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
  editingColorIndex,
  setEditingColorIndex,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Upload Media */}
      <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
        <h3 className="text-base font-bold text-[#1D3557]">Upload Product Image</h3>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#1D3557]">Product Image</label>
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
                className="bg-white/90 backdrop-blur-sm shadow-sm py-2 px-6 text-[10px]"
                iconLeft={<HiPhoto />}
                onClick={() => setIsUploadModalOpen(true)}
              >
                {stagedMedia.length > 0 ? "Change Primary" : "Browse"}
              </Button>
              <Button shape="rounded-sm" variant="outline"
                className="bg-white/90 backdrop-blur-sm shadow-sm py-2 px-6 text-[10px]"
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
            <div key={idx + 1} className="relative aspect-square rounded-[6px] border border-gray-200 overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 group/thumb">
              {(media.file?.type?.startsWith("video") || media.url?.match(/\.(mp4|webm|ogg)$/i)) ? (
                <video src={media.url} className="w-full h-full object-cover" />
              ) : (
                <img src={media.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                <button
                  onClick={() => makePrimary(idx + 1)}
                  className="w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-emerald-500 hover:text-emerald-600 transition-colors shadow-sm"
                  title="Make Primary"
                >
                  <HiPhoto className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => removeMedia(idx + 1)}
                  className="w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors shadow-sm"
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
            <label className="text-[11px] font-bold text-[#1D3557]">Product Categories</label>
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
            <label className="text-[11px] font-bold text-[#1D3557]">Product Brand</label>
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
            <label className="text-[11px] font-bold text-[#1D3557]">Product Tag</label>
            <Select
              shape="rounded-sm"
              value={formData.tag}
              onChange={(val) => handleInputChange("tag", val as string)}
              placeholder="Select your product"
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

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-[#1D3557]">
                {editingColorIndex !== null ? "Edit selected color" : "Select your color"}
              </label>
              <button
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  if (showColorPicker) setEditingColorIndex(null);
                }}
                className="text-[10px] font-bold text-brand-gold hover:underline"
              >
                {showColorPicker ? "Close Picker" : editingColorIndex !== null ? "Change Color" : "Open Custom Picker"}
              </button>
            </div>

            {showColorPicker && (
              <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-[6px] p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium text-gray-400">Modern Presets</span>
                  <div className="flex flex-wrap gap-2">
                    {["#1D3557", "#457B9D", "#A8DADC", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51", "#264653"].map((preset) => (
                      <button
                        key={preset}
                        className="w-6 h-6 rounded-full border border-white shadow-sm transition-transform hover:scale-125"
                        style={{ backgroundColor: preset }}
                        onClick={() => {
                          if (editingColorIndex !== null) {
                            const newColors = [...formData.colors];
                            newColors[editingColorIndex] = preset;
                            handleInputChange("colors", newColors);
                          } else if (!formData.colors.includes(preset)) {
                            handleInputChange("colors", [...formData.colors, preset]);
                          }
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
                        value={editingColorIndex !== null ? formData.colors[editingColorIndex] : "#000000"}
                        className="w-8 h-8 rounded-[4px] cursor-pointer border-none bg-transparent"
                        onChange={(e) => {
                          const newColor = e.target.value.toUpperCase();
                          if (editingColorIndex !== null) {
                            const newColors = [...formData.colors];
                            newColors[editingColorIndex] = newColor;
                            handleInputChange("colors", newColors);
                          } else if (!formData.colors.includes(newColor)) {
                            handleInputChange("colors", [...formData.colors, newColor]);
                          }
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={editingColorIndex !== null ? formData.colors[editingColorIndex] : ""}
                      placeholder="#000000"
                      className="flex-1 h-8 bg-white border border-gray-200 rounded-[4px] px-2 text-[10px] font-mono text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-100"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.match(/^#[0-9A-F]{6}$/i)) {
                          const newColor = val.toUpperCase();
                          if (editingColorIndex !== null) {
                            const newColors = [...formData.colors];
                            newColors[editingColorIndex] = newColor;
                            handleInputChange("colors", newColors);
                          } else if (!formData.colors.includes(newColor)) {
                            handleInputChange("colors", [...formData.colors, newColor]);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.colors.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50/50 rounded-[6px] border border-gray-100">
                {formData.colors.map((color: string, index: number) => (
                  <div
                    key={index}
                    className={`group relative flex items-center gap-1.5 px-2 py-1 rounded-full border transition-all ${editingColorIndex === index ? "border-brand-gold bg-brand-gold/5 ring-2 ring-brand-gold/20" : "border-gray-200 bg-white hover:border-gray-300"}`}
                  >
                    <div
                      className="w-3 h-3 rounded-full border border-black/5 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{color}</span>
                    <div className="flex items-center ml-1">
                      <button
                        onClick={() => {
                          setEditingColorIndex(index);
                          setShowColorPicker(true);
                        }}
                        className="p-0.5 text-gray-300 hover:text-brand-gold transition-colors"
                      >
                        <HiPencil size={10} />
                      </button>
                      <button
                        onClick={() => {
                          const newColors = formData.colors.filter((_: any, i: number) => i !== index);
                          handleInputChange("colors", newColors);
                          if (editingColorIndex === index) {
                            setEditingColorIndex(null);
                            setShowColorPicker(false);
                          }
                        }}
                        className="p-0.5 text-gray-300 hover:text-rose-500 transition-colors"
                      >
                        <HiXCircle size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
