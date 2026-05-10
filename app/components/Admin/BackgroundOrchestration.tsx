import React from "react";
import { Reorder } from "framer-motion";
import { Icon } from "../Icon";
import { Button } from "../Button";
import Dropdown from "../Form/Dropdown";
import { LuPencilLine, LuArrowLeftRight } from "react-icons/lu";
import { AdvertConfig, AdvertItem } from "@/lib/redux/services/advertApi";
import { CategoryLinkSelector } from "./CategoryLinkSelector";

interface BackgroundOrchestrationProps {
 config: AdvertConfig;
 productsData: AdvertItem[];
 categoriesData: any[];
 setConfig: React.Dispatch<React.SetStateAction<AdvertConfig | null>>;
 setIsBackgroundModalOpen: (open: boolean) => void;
 setReplacingAssetIndex: (index: number | null) => void;
 setIsRefineModalOpen: (open: boolean) => void;
 setRefiningAssetIndex: (index: number | null) => void;
 handleReorderBackgrounds: (newOrder: any[]) => void;
 toggleBackgroundSelection: (bgUrl: string) => void;
}

export const BackgroundOrchestration: React.FC<BackgroundOrchestrationProps> = ({
 config,
 productsData,
 categoriesData,
 setConfig,
 setIsBackgroundModalOpen,
 setReplacingAssetIndex,
 setIsRefineModalOpen,
 setRefiningAssetIndex,
 handleReorderBackgrounds,
 toggleBackgroundSelection,
}) => {
 return (
  <section className="bg-white p-8 rounded-[6px] border border-gray-200   flex flex-col gap-6">
   <div className="flex justify-between items-center">
    <h3 className="text-lg font-black text-[#121212] flex items-center gap-2">
     <span className="w-8 h-8 rounded-[4px] bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xs">02</span>
     Atmospheric Visuals
    </h3>
    <Button shape="rounded-sm" variant="outline"
     onClick={() => setIsBackgroundModalOpen(true)}
     iconLeft={<Icon name="material-symbols_image-outline" folder="dashboardIcon" size="xs" />}
     className="text-xs py-2"
    >
     Manage Background Library ({config.backgroundImages.length})
    </Button>
   </div>

   <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar">
    <Reorder.Group
     axis="x"
     values={config.backgroundImages}
     onReorder={handleReorderBackgrounds}
     className="flex gap-4"
    >
     {config.backgroundImages.map((bg, i) => {
      const categories: string[] = categoriesData.map(c => c.name).filter(Boolean);

      return (
       <Reorder.Item
        key={bg.url}
        value={bg}
        className="flex flex-col gap-3 min-w-[240px] cursor-grab active:cursor-grabbing"
       >
        <div className="relative aspect-[16/10] rounded-[6px] overflow-hidden border border-gray-200   group">
         <img
          src={bg.url}
          alt="Visual"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
          style={{ objectPosition: `${bg.positionX}% ${bg.positionY}%` }}
         />

         {/* Drag Handle */}
         <div className="absolute top-2 left-2 flex items-center gap-1.5 z-20">
          <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg">
           {i + 1}
          </div>
          <div className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400   opacity-0 group-hover:opacity-100 transition-opacity">
           <Icon name="drag_indicator" folder="icon" size="xs" />
          </div>
         </div>

         {bg.linkedCategory && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 rounded-[4px] text-[8px] font-black text-white shadow-lg uppercase tracking-widest z-10 animate-in fade-in zoom-in duration-300">
           {bg.linkedCategory}
          </div>
         )}
         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-10">
          <div className="flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
           <button
            onClick={() => {
             setRefiningAssetIndex(i);
             setIsRefineModalOpen(true);
            }}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#121212] hover:bg-brand-gold hover:text-white transition-all shadow-lg text-lg"
            title="Edit Focal Point"
           >
            <LuPencilLine />
           </button>
           <button
            onClick={() => {
             setReplacingAssetIndex(i);
             setIsBackgroundModalOpen(true);
            }}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#121212] hover:bg-brand-gold hover:text-white transition-all shadow-lg text-lg"
            title="Replace Image"
           >
            <LuArrowLeftRight />
           </button>
           <button
            onClick={() => {
             setRefiningAssetIndex(i);
             setIsRefineModalOpen(true);
            }}
            className="px-4 py-1.5 bg-white rounded-[4px] text-[10px] font-black uppercase tracking-widest text-[#121212] hover:bg-brand-gold hover:text-white transition-all shadow-lg"
           >
            Edit Visual
           </button>
          </div>
          <button
           onClick={() => toggleBackgroundSelection(bg.url)}
           className="text-[9px] font-bold text-white/70 hover:text-rose-400 transition-colors uppercase tracking-widest mt-1"
          >
           Remove
          </button>
         </div>
        </div>

        <CategoryLinkSelector
         categories={categories}
         value={bg.linkedCategory || ""}
         onChange={(val) => {
          const newBackgrounds = [...config.backgroundImages];
          newBackgrounds[i] = { ...newBackgrounds[i], linkedCategory: val || undefined };
          setConfig({ ...config, backgroundImages: newBackgrounds });
         }}
        />
       </Reorder.Item>
      );
     })}
    </Reorder.Group>
    <button
     onClick={() => setIsBackgroundModalOpen(true)}
     className="min-w-[240px] h-[150px] aspect-[16/10] rounded-[4px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-brand-gold/30 transition-colors bg-brand-gold/5 group mt-0"
    >
     <Icon name="circle-plus" folder="dashboardIcon" size="md" className="text-gray-300 group-hover:text-brand-gold transition-colors" />
     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-brand-gold transition-colors">Add Visual</span>
    </button>
   </div>
  </section>
 );
};
