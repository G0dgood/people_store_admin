import React, { useState, useRef } from "react";
import Modal from "../Modal/Modal";
import { TabFilter } from "./TabFilter";
import { Icon } from "../Icon";
import { Input } from "../Form";
import { Button } from "../Button";
import Checkbox from "../Checkbox";
import { AdvertConfig, AdvertItem } from "@/lib/redux/services/advertApi";

interface BackgroundLibraryModalProps {
 isOpen: boolean;
 onClose: () => void;
 replacingAssetIndex: number | null;
 availableBackgrounds: string[];
 productsData: AdvertItem[];
 config: AdvertConfig;
 setConfig: React.Dispatch<React.SetStateAction<AdvertConfig | null>>;
 handleSelectBackground: (bgUrl: string) => void;
 toggleBackgroundSelection: (bgUrl: string) => void;
 handleFileUpload: (e: React.ChangeEvent<HTMLInputElement> | FileList) => void;
}

export const BackgroundLibraryModal: React.FC<BackgroundLibraryModalProps> = ({
 isOpen,
 onClose,
 replacingAssetIndex,
 availableBackgrounds,
 productsData,
 config,
 setConfig,
 handleSelectBackground,
 toggleBackgroundSelection,
 handleFileUpload,
}) => {
 const [backgroundModalTab, setBackgroundModalTab] = useState<"ambient" | "products" | "url" | "upload">("ambient");
 const [customUrl, setCustomUrl] = useState("");
 const [isDragging, setIsDragging] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);

 return (
  <Modal
   isOpen={isOpen}
   onClose={onClose}
   title={replacingAssetIndex !== null ? "Replace Atmosphere Visual" : "Atmospheric Visual Library"}
   size="lg"
  >
   <div className="flex flex-col gap-6">
    {/* Tab Navigation */}
    <TabFilter
     id="library-source-filter"
     tabs={["Ambient Gallery", "Store Products", "Custom URL", "Upload Device"]}
     activeTab={
      backgroundModalTab === "ambient" ? "Ambient Gallery" :
       backgroundModalTab === "products" ? "Store Products" :
        backgroundModalTab === "url" ? "Custom URL" : "Upload Device"
     }
     onChange={(tab) => setBackgroundModalTab(
      tab === "Ambient Gallery" ? "ambient" :
       tab === "Store Products" ? "products" :
        tab === "Custom URL" ? "url" : "upload"
     )}
     fullWidth={true}
    />

    {/* Tab Content */}
    <div className="min-h-[400px] flex flex-col gap-6">
     {backgroundModalTab === "ambient" && (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
       {availableBackgrounds.map((bg, i) => {
        const isSelected = config.backgroundImages.some(img => img.url === bg);
        const order = config.backgroundImages.findIndex(img => img.url === bg) + 1;
        return (
         <button
          key={i}
          onClick={() => handleSelectBackground(bg)}
          className={`group relative aspect-[16/10] rounded-[4px] overflow-hidden border-4 transition-all
                          ${isSelected ? "border-brand-gold ring-8 ring-brand-gold/10 scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100 shadow-sm"}
                        `}
         >
          <img src={bg} alt="Background" className="w-full h-full object-cover" />
          {isSelected && (
           <div className="absolute top-3 right-3 p-1.5 bg-brand-gold rounded-[4px] text-white shadow-xl overflow-hidden flex items-center gap-2 px-3">
            <Checkbox checked={true} onChange={() => { }} size="md" className="!p-0" />
            <span className="text-[10px] font-black uppercase">{order}</span>
           </div>
          )}
         </button>
        );
       })}
      </div>
     )}

     {backgroundModalTab === "products" && (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
       {productsData.map((product: AdvertItem) => {
        const imageUrl = product.productImage || product.image || "";
        const isSelected = config.backgroundImages.some(img => img.url === imageUrl);
        const order = config.backgroundImages.findIndex(img => img.url === imageUrl) + 1;
        return (
         <button
          key={product._id}
          onClick={() => handleSelectBackground(imageUrl)}
          className={`group relative aspect-square rounded-[4px] overflow-hidden border-2 transition-all p-2 flex flex-col gap-2
                          ${isSelected ? "border-brand-gold bg-brand-gold/5 ring-4 ring-brand-gold/10" : "border-gray-200 bg-white hover:border-brand-gold/30 shadow-sm"}
                        `}
         >
          <div className="relative flex-1 bg-white rounded-[4px] overflow-hidden flex items-center justify-center p-2">
           <img src={imageUrl} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
           {isSelected && (
            <div className="absolute top-1 right-1 p-1 bg-brand-gold rounded-[4px] text-white shadow-lg overflow-hidden flex items-center gap-1.5 px-2">
             <Checkbox checked={true} onChange={() => { }} size="md" className="!p-0" />
             <span className="text-[9px] font-black uppercase">{order}</span>
            </div>
           )}
          </div>
          <div className="flex flex-col text-left px-1">
           <span className="text-[10px] font-bold text-[#1D3557] truncate">{product.name}</span>
           <span className="text-[8px] font-black text-brand-gold uppercase">
            {typeof product.category === 'string' ? product.category : product.category?.name}
           </span>
          </div>
         </button>
        );
       })}
      </div>
     )}

     {backgroundModalTab === "url" && (
      <div className="flex flex-col gap-8 items-center justify-center py-10 px-6">
       <div className="w-20 h-20 bg-brand-gold/10 rounded-[20px] flex items-center justify-center text-brand-gold mb-2">
        <Icon name="link-external" folder="dashboardIcon" size="lg" />
       </div>
       <div className="flex flex-col gap-2 text-center max-w-sm">
        <h4 className="text-base font-black text-[#1D3557]">Import Remote Visual</h4>
        <p className="text-xs text-gray-400 font-medium">Paste a direct link to a high-resolution image to inject it into your login sequence.</p>
       </div>
       <div className="w-full flex gap-3">
        <Input shape="rounded-sm"
         placeholder="https://images.unsplash.com/photo-..."
         value={customUrl}
         onChange={(e) => setCustomUrl(e.target.value)}
         containerClassName="flex-1"
         className="bg-gray-50 border-gray-200"
        />
        <Button shape="rounded-sm" variant="primary"
         onClick={() => {
          if (customUrl) {
           handleSelectBackground(customUrl);
           setCustomUrl("");
          }
         }}
         className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
         disabled={!customUrl}
        >
         Add to Library
        </Button>
       </div>

       {/* Preview of added URLs */}
       <div className="w-full flex flex-col gap-4 mt-4">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active URL Sources</span>
        <div className="grid grid-cols-2 gap-4">
         {config.backgroundImages.filter(bg => bg.url.startsWith("http")).map((asset, i) => (
          <div key={i} className="relative aspect-[16/6] rounded-[6px] overflow-hidden border border-gray-200 shadow-sm group">
           <img src={asset.url} alt="Custom" className="w-full h-full object-cover" />
           <button
            onClick={() => toggleBackgroundSelection(asset.url)}
            className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
           >
            <Icon name="Delete" folder="dashboardIcon" size="xs" className="text-white" />
           </button>
          </div>
         ))}
        </div>
       </div>
      </div>
     )}

     {backgroundModalTab === "upload" && (
      <div className="flex flex-col gap-8 items-center justify-center py-10 px-6">
       <div
        className={`w-full h-full border-2 border-dashed rounded-[12px] p-10 flex flex-col items-center justify-center gap-4 transition-all
                    ${isDragging
          ? "border-brand-gold bg-brand-gold/10 scale-[1.02] shadow-xl"
          : "border-gray-200 bg-transparent hover:border-brand-gold hover:bg-brand-gold/5 shadow-sm"}
                  `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
       >
        <input
         type="file"
         ref={fileInputRef}
         className="hidden"
         multiple
         accept="image/*"
         onChange={(e) => {
          handleFileUpload(e);
          if (fileInputRef.current) fileInputRef.current.value = "";
         }}
        />
        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-brand-gold transition-all">
         <Icon name="cloud_upload" folder="icon" size="lg" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
         <span className="text-sm font-black text-[#1D3557]">Click or drag to upload from device</span>
         <span className="text-[10px] font-bold text-gray-400 italic">Max 5MB per image recommended</span>
        </div>
       </div>

       {/* Preview of Uploaded Images */}
       <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Device Uploads</span>
         <button
          onClick={() => setConfig({ ...config, backgroundImages: config.backgroundImages.filter(bg => !bg.url.startsWith("data:")) })}
          className="text-[9px] font-bold text-rose-500 hover:underline"
         >
          Clear all uploads
         </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
         {config.backgroundImages.filter(bg => bg.url.startsWith("data:")).map((asset, i) => (
          <div key={i} className="relative aspect-square rounded-[6px] overflow-hidden border border-gray-200 group">
           <img src={asset.url} alt="Upload" className="w-full h-full object-cover" />
           <button
            onClick={() => toggleBackgroundSelection(asset.url)}
            className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
           >
            <Icon name="Delete" folder="dashboardIcon" size="xs" className="text-white" />
           </button>
          </div>
         ))}
        </div>
       </div>
      </div>
     )}
    </div>

    <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
     <button
      onClick={() => setConfig({ ...config, backgroundImages: [{ url: availableBackgrounds[0], positionX: 50, positionY: 50 }] })}
      className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors"
     >
      Reset to Default
     </button>
     <Button variant="primary" shape="rounded-sm"
      onClick={onClose}
      className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
     >
      Confirm Library Selection
     </Button>
    </div>
   </div>
  </Modal>
 );
};
