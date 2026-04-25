import React from "react";
import { Icon } from "../Icon";
import { Reorder } from "framer-motion";
import { AdvertConfig, AdvertItem } from "@/lib/redux/services/advertApi";

interface ItemArrangementProps {
 config: AdvertConfig;
 activeVisualIndex: number | null;
 activeFeaturedItems: AdvertItem[];
 setConfig: React.Dispatch<React.SetStateAction<AdvertConfig | null>>;
}

export const ItemArrangement: React.FC<ItemArrangementProps> = ({
 config,
 activeVisualIndex,
 activeFeaturedItems,
 setConfig,
}) => {
 return (
  <section className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-6 xl:col-span-1">
   <h3 className="text-lg font-black text-[#1D3557] flex items-center gap-2">
    <span className="w-8 h-8 rounded-[4px] bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xs">04</span>
    Marketing Arrangement
   </h3>
   <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-3">
     {config.showTitle && (
      <div className="flex flex-col gap-1">
       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Main Header</span>
       <div className="p-3 bg-gray-50 border border-gray-200 rounded-[4px] text-xs font-bold text-brand-gold">
        {config.title} <span className="text-brand-gold-light">{config.titleHighlight}</span>
       </div>
      </div>
     )}

     {config.showStats && (
      <div className="flex flex-col gap-1">
       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Global Impact Stats</span>
       <div className="flex bg-gray-50 border border-gray-200 p-4 rounded-[4px] items-center gap-4">
        <Icon name="verified" folder="icon" size="sm" className="text-brand-gold" />
        <span className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-widest">
         {config.stats}
        </span>
       </div>
      </div>
     )}
    </div>

    <div className="flex flex-col gap-2">
     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
      {activeVisualIndex === null ? "Global Inventory Sequence" : `Atmosphere ${activeVisualIndex + 1} Selection`}
     </span>
     <Reorder.Group
      axis="y"
      values={activeFeaturedItems}
      onReorder={(newOrder) => {
       if (activeVisualIndex === null) {
        setConfig({ ...config, featuredItems: newOrder });
       } else {
        const newBgs = [...config.backgroundImages];
        newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], featuredItems: newOrder };
        setConfig({ ...config, backgroundImages: newBgs });
       }
      }}
      className="flex flex-col gap-3"
     >
      {activeFeaturedItems.map((item) => (
       <Reorder.Item
        key={item._id}
        value={item}
        className="p-4 bg-white rounded-[4px] border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing flex items-center justify-between group hover:border-brand-gold transition-colors"
       >
        <div className="flex items-center gap-4">
         <div className="w-10 h-10 rounded-[6px] bg-gray-50 p-1">
          <img src={item.productImage || item.image} alt={item.name} className="w-full h-full object-contain" />
         </div>
         <div className="flex flex-col">
          <span className="text-sm font-bold text-[#1D3557]">{item.name}</span>
         </div>
        </div>
        <Icon name="Frame" folder="dashboardIcon" size="sm" className="text-gray-300 group-hover:text-brand-gold transition-colors" />
       </Reorder.Item>
      ))}
     </Reorder.Group>
    </div>
   </div>
  </section>
 );
};
