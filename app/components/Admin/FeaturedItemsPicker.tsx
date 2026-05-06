import React from "react";
import { AdvertConfig, AdvertItem } from "@/lib/redux/services/advertApi";
import Dropdown from "../Form/Dropdown";
import { TabFilter } from "./TabFilter";
import Checkbox from "../Checkbox";

interface FeaturedItemsPickerProps {
  config: AdvertConfig;
  activeVisualIndex: number | null;
  activeFeaturedItems: AdvertItem[];
  productsData: AdvertItem[];
  setConfig: React.Dispatch<React.SetStateAction<AdvertConfig | null>>;
  toggleProductSelection: (product: AdvertItem) => void;
  setActiveVisualIndex: (index: number | null) => void;
}

export const FeaturedItemsPicker: React.FC<FeaturedItemsPickerProps> = ({
  config,
  activeVisualIndex,
  activeFeaturedItems,
  productsData,
  setConfig,
  toggleProductSelection,
  setActiveVisualIndex,
}) => {
  return (
    <section className="bg-white p-8 rounded-[6px] border border-gray-200   flex flex-col gap-6 xl:col-span-2">
      <h3 className="text-lg font-black text-[#1D3557] flex flex-col gap-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-brand-gold">
            <span className="w-8 h-8 rounded-[4px] bg-brand-gold/10 flex items-center justify-center text-xs">03</span>
            Featured Inventory
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end gap-1.5 ">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none italic">Targeting Atmosphere</span>
              <Dropdown
                options={[
                  { value: "global", label: "Global Sequence (Default)" },
                  ...config.backgroundImages.map((bg, i) => ({ value: i.toString(), label: `Atmosphere ${i + 1}` }))
                ]}
                value={activeVisualIndex === null ? "global" : activeVisualIndex.toString()}
                onChange={(val) => setActiveVisualIndex(val === "global" ? null : parseInt(val))}
                size="sm"
                className="min-w-[180px]"
              />
            </div>
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest leading-tight">{activeFeaturedItems.length} Selected</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {activeVisualIndex === null ? "Global Display Preset" : `Atmosphere ${activeVisualIndex + 1} Layout Override`}
            </span>
            {activeVisualIndex !== null && config.backgroundImages[activeVisualIndex].inventoryLayout && (
              <span className="text-[9px] font-bold text-brand-gold-light uppercase tracking-widest bg-brand-gold/5 px-2 py-0.5 rounded-[4px]">Active Override</span>
            )}
          </div>
          <TabFilter
            id="inventory-display-presets"
            tabs={activeVisualIndex === null
              ? ["Cinematic List", "Asset Grid", "Scrolling Strip"]
              : ["Default", "Cinematic List", "Asset Grid", "Scrolling Strip"]
            }
            activeTab={
              activeVisualIndex === null
                ? (config.inventoryLayout === "list" ? "Cinematic List" : config.inventoryLayout === "grid" ? "Asset Grid" : "Scrolling Strip")
                : (config.backgroundImages[activeVisualIndex].inventoryLayout === "list" ? "Cinematic List" :
                  config.backgroundImages[activeVisualIndex].inventoryLayout === "grid" ? "Asset Grid" :
                    config.backgroundImages[activeVisualIndex].inventoryLayout === "strip" ? "Scrolling Strip" : "Default")
            }
            onChange={(tab) => {
              const layout = tab === "Cinematic List" ? "list" : tab === "Asset Grid" ? "grid" : tab === "Scrolling Strip" ? "strip" : undefined;
              if (activeVisualIndex === null) {
                setConfig({ ...config, inventoryLayout: layout || "list" });
              } else {
                const newBgs = [...config.backgroundImages];
                newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], inventoryLayout: layout };
                setConfig({ ...config, backgroundImages: newBgs });
              }
            }}
          />
        </div>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {Array.isArray(productsData) && productsData.map((product: AdvertItem) => {
          const isSelected = activeFeaturedItems.some(p => p._id === product._id);
          return (
            <button
              key={product._id}
              onClick={() => toggleProductSelection(product)}
              className={`p-3 rounded-[4px] border transition-all flex flex-col gap-3 group relative
                          ${isSelected ? "border-brand-gold bg-brand-gold/5" : "border-gray-50 bg-white hover:border-brand-gold/30"}
                        `}
            >
              <div className="relative aspect-square rounded-[6px] bg-white border border-gray-50 flex items-center justify-center overflow-hidden">
                <img src={product.productImage || product.image} alt={product.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" />
                <div className="absolute top-2 right-2 z-10">
                  <Checkbox checked={isSelected} onChange={() => { }} size="md" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-[#1D3557] truncate">{product.name}</span>
                <span className="text-[9px] font-black text-brand-gold uppercase">
                  {typeof product.category === 'string' ? product.category : product.category?.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
