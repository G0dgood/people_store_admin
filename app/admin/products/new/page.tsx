"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icon } from "../../../components/Icon";
import { Button } from "../../../components/Button";
import { Select } from "../../../components/Form/Select";
import { Switch } from "../../../components/Form/Switch";
import { Input, Textarea } from "../../../components/Form/Inputs";
import { ConfirmationModal } from "../../../components/Admin/ConfirmationModal";
import Modal from "../../../components/Modal/Modal";
import ModalBody from "../../../components/Modal/ModalBody";
import ModalFooter from "../../../components/Modal/ModalFooter";
import { useRouter } from "next/navigation";
import { UploadMediaModal } from "../../../components/Admin/UploadMediaModal";
import Checkbox from "@/app/components/Checkbox";
import { HiPhoto, HiArrowPath, HiXCircle, HiXMark, HiPencil, HiArrowUturnLeft, HiChatBubbleLeftRight, HiTrash, HiCog8Tooth, HiPencilSquare, HiCalendarDays } from "react-icons/hi2";

export default function CreateProduct() {
 const router = useRouter();
 const [stockStatus, setStockStatus] = useState("In Stock");
 const [category, setCategory] = useState("");
 const [tag, setTag] = useState("");
 const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);
 const [isPublishSuccessOpen, setIsPublishSuccessOpen] = useState(false);
 const [isDraftConfirmOpen, setIsDraftConfirmOpen] = useState(false);
 const [isDraftSuccessOpen, setIsDraftSuccessOpen] = useState(false);
 const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
 const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
 const [stagedMedia, setStagedMedia] = useState<{ file: File, url: string }[]>([]);
 const [productColors, setProductColors] = useState<string[]>(["#D2E8C4", "#EAC7CC", "#D3DBE0", "#E8E5CB", "#3D4144"]);
 const [isFeatured, setIsFeatured] = useState(true);
 const [showColorPicker, setShowColorPicker] = useState(false);
 const [editingColorIndex, setEditingColorIndex] = useState<number | null>(null);
 const colorInputRef = useRef<HTMLInputElement>(null);

 // Cleanup effect for preview URLs
 useEffect(() => {
  return () => {
   stagedMedia.forEach(item => URL.revokeObjectURL(item.url));
  };
 }, [stagedMedia]);

 const handleMediaUpload = (files: File[]) => {
  const newMedia = files.map(file => ({
   file,
   url: URL.createObjectURL(file)
  }));
  setStagedMedia(prev => [...prev, ...newMedia]);
 };

 const removeMedia = (index: number) => {
  setStagedMedia(prev => {
   const itemToRemove = prev[index];
   if (itemToRemove) URL.revokeObjectURL(itemToRemove.url);
   return prev.filter((_, i) => i !== index);
  });
 };

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
       onClick={() => setIsPublishConfirmOpen(true)}
      >
       Publish Product
      </Button>
      <Button
       variant="outline"
       shape="rounded-sm"
       size="md"
       iconLeft={<Icon name="ticket" folder="dashboardIcon" size="xs" className="opacity-70" />}
       onClick={() => setIsDraftConfirmOpen(true)}
      >
       Save to draft
      </Button>
      <Button
       variant="outline"
       shape="rounded-sm"
       className="px-2"
       onClick={() => setIsResetConfirmOpen(true)}
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
         <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-[6px] cursor-pointer shadow-sm">
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
         type="date"
         placeholder="Start"
         className="bg-gray-50/80 border-gray-50 text-xs font-bold text-gray-400"
         suffixElement={<HiCalendarDays className="text-gray-300 w-3.5 h-3.5 mr-1" />}
        />
        <Input
         type="date"
         placeholder="End"
         className="bg-gray-50/80 border-gray-50 text-xs font-bold text-gray-400"
         suffixElement={<HiCalendarDays className="text-gray-300 w-3.5 h-3.5 mr-1" />}
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

        <Checkbox
          checked={isFeatured}
          onChange={setIsFeatured}
          className="w-fit pt-2"
        >
          <span className="text-xs font-bold text-gray-400 underline underline-offset-4 decoration-gray-200">Highlight this product in a featured section.</span>
        </Checkbox>
      </div>

      <div className="flex gap-3 justify-end mt-4 pt-6 border-t border-gray-50">
       <button
        type="button"
        className="bg-white border border-gray-100 text-[#1D3557] px-6 py-2.5 rounded-[6px] text-xs font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
        onClick={() => setIsDraftConfirmOpen(true)}
       >
        <Icon name="ticket" folder="dashboardIcon" size="xs" className="opacity-70" />
        Save to draft
       </button>
       <Button
        variant="primary"
        shape="rounded-sm"
        className="px-8 py-2.5"
        onClick={() => setIsPublishConfirmOpen(true)}
       >
        Publish Product
       </Button>
      </div>
     </div>
    </div>

    {/* Right Column (Media & Meta) */}
    <div className="flex flex-col gap-6">
     {/* Upload Media */}
     <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
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
       <div className="relative aspect-square w-full rounded-[6px] bg-gray-50/50 border border-gray-100 overflow-hidden group">
        {stagedMedia.length > 0 ? (
         stagedMedia[0].file.type.startsWith("video") ? (
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
         <Button
          variant="outline"
          shape="rounded-sm"
          className="bg-white/90 backdrop-blur-sm shadow-sm py-2 px-6 text-[10px]"
          iconLeft={<HiPhoto />}
          onClick={() => setIsUploadModalOpen(true)}
         >
          {stagedMedia.length > 0 ? "Change Primary" : "Browse"}
         </Button>
         <Button
          variant="outline"
          shape="rounded-sm"
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
        <div key={idx + 1} className="relative aspect-square rounded-[6px] border border-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 group/thumb">
         {media.file.type.startsWith("video") ? (
          <video src={media.url} className="w-full h-full object-cover" />
         ) : (
          <img src={media.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
         )}
         <button
          onClick={() => removeMedia(idx + 1)}
          className="absolute top-1 right-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors shadow-sm opacity-0 group-hover/thumb:opacity-100"
         >
          <HiXCircle className="w-4 h-4" />
         </button>
        </div>
       ))}

       <div
        className="aspect-square border-2 border-dashed border-blue-200 rounded-[6px] flex flex-col items-center justify-center gap-2 bg-brand-blue-light hover:bg-brand-blue-light transition-all cursor-pointer group"
        onClick={() => setIsUploadModalOpen(true)}
       >
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
         <Icon name="circle-plus" folder="dashboardIcon" size="xs" />
        </div>
        <span className="text-[10px] font-bold text-[#2196F3]">Add More</span>
       </div>
      </div>

      <div className="h-px bg-gray-50 my-2" />

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
        <div className="flex justify-between items-center">
         <label className="text-[11px] font-bold text-[#1D3557]">
          {editingColorIndex !== null ? "Edit selected color" : "Select your color"}
         </label>
         <button
          onClick={() => {
           setShowColorPicker(!showColorPicker);
           if (showColorPicker) setEditingColorIndex(null);
          }}
          className="text-[10px] font-bold text-brand-blue hover:underline"
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
                const newColors = [...productColors];
                newColors[editingColorIndex] = preset;
                setProductColors(newColors);
               } else if (!productColors.includes(preset)) {
                setProductColors([...productColors, preset]);
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
              value={editingColorIndex !== null ? productColors[editingColorIndex] : "#000000"}
              className="w-8 h-8 rounded-[4px] cursor-pointer border-none bg-transparent"
              onChange={(e) => {
               const newColor = e.target.value.toUpperCase();
               if (editingColorIndex !== null) {
                const newColors = [...productColors];
                newColors[editingColorIndex] = newColor;
                setProductColors(newColors);
               } else if (!productColors.includes(newColor)) {
                setProductColors([...productColors, newColor]);
               }
              }}
             />
            </div>
            <input
             type="text"
             value={editingColorIndex !== null ? productColors[editingColorIndex] : ""}
             placeholder="#000000"
             className="flex-1 h-8 bg-white border border-gray-100 rounded-[4px] px-2 text-[10px] font-mono text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-100"
             onChange={(e) => {
              const val = e.target.value;
              if (val.match(/^#[0-9A-F]{6}$/i)) {
               const newColor = val.toUpperCase();
               if (editingColorIndex !== null) {
                const newColors = [...productColors];
                newColors[editingColorIndex] = newColor;
                setProductColors(newColors);
               } else if (!productColors.includes(newColor)) {
                setProductColors([...productColors, newColor]);
               }
              }
             }}
            />
           </div>
          </div>
         </div>
        )}

        <div className="flex flex-wrap gap-3 items-center">
         {productColors.map((color, i) => (
          <div
           key={i}
           onClick={() => {
            setEditingColorIndex(i);
            setShowColorPicker(true);
           }}
           className={`group relative w-10 h-10 rounded-[6px] shadow-sm border transition-all cursor-pointer overflow-hidden ${editingColorIndex === i ? "ring-2 ring-brand-blue border-transparent ring-offset-2" : "border-black/5 hover:scale-110"
            }`}
           style={{ backgroundColor: color }}
          >
           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex transition-opacity">
            <div
             onClick={(e) => {
              e.stopPropagation();
              setEditingColorIndex(i);
              setShowColorPicker(true);
             }}
             className="flex-1 bg-brand-blue/90 hover:bg-brand-blue flex items-center justify-center transition-colors"
             title="Edit color"
            >
             <HiPencil className="text-white w-3.5 h-3.5" />
            </div>
            <div
             onClick={(e) => {
              e.stopPropagation();
              const newColors = productColors.filter((_, idx) => idx !== i);
              setProductColors(newColors);
              if (editingColorIndex === i) setEditingColorIndex(null);
             }}
             className="flex-1 bg-rose-500/90 hover:bg-rose-600 flex items-center justify-center transition-colors border-l border-white/20"
             title="Remove color"
            >
             <HiXMark className="text-white w-3.5 h-3.5" />
            </div>
           </div>
          </div>
         ))}
         <button
          onClick={() => {
           setEditingColorIndex(null);
           setShowColorPicker(!showColorPicker);
          }}
          className={`w-10 h-10 rounded-[6px] border-2 border-dashed flex items-center justify-center transition-all group ${showColorPicker && editingColorIndex === null
           ? "border-brand-blue bg-blue-50 text-brand-blue"
           : "border-gray-200 text-gray-400 hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50/50"
           }`}
          title={showColorPicker ? "Close Picker" : "Add custom color"}
         >
          <Icon
           name="circle-plus"
           folder="dashboardIcon"
           size="xs"
           className={`transition-transform ${showColorPicker && editingColorIndex === null ? "rotate-45" : "group-hover:scale-110"}`}
          />
         </button>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>

   <ConfirmationModal
    isOpen={isPublishConfirmOpen}
    onClose={() => setIsPublishConfirmOpen(false)}
    onConfirm={() => {
     setIsPublishConfirmOpen(false);
     setIsPublishSuccessOpen(true);
    }}
    title="Confirm Publication"
    message="Are you sure you want to publish this product? It will be immediately visible to all customers on the storefront."
    confirmText="Yes, publish now"
    type="success"
   />

   <ConfirmationModal
    isOpen={isDraftConfirmOpen}
    onClose={() => setIsDraftConfirmOpen(false)}
    onConfirm={() => {
     setIsDraftConfirmOpen(false);
     setIsDraftSuccessOpen(true);
    }}
    title="Save as Draft"
    message="Are you sure you want to save this product as a draft? It will be stored in your catalog but hidden from the storefront."
    confirmText="Yes, save draft"
    type="info"
   />

   <ConfirmationModal
    isOpen={isResetConfirmOpen}
    onClose={() => setIsResetConfirmOpen(false)}
    onConfirm={() => {
     console.log("Resetting form...");
     setIsResetConfirmOpen(false);
    }}
    title="Reset Form"
    message="Are you sure you want to clear all fields and start a new product entry? This action will discard your current progress."
    confirmText="Yes, start over"
    type="warning"
   />

   <Modal
    isOpen={isPublishSuccessOpen}
    onClose={() => setIsPublishSuccessOpen(false)}
    title=""
    size="md"
   >
    <ModalBody className="flex flex-col items-center text-center py-10 gap-6">
     <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 shadow-inner">
      <Icon name="task_alt" folder="icon" size="lg" className="w-10 h-10" />
     </div>
     <div className="flex flex-col gap-2">
      <h2 className="text-xl font-black text-[#1D3557]">Product Published!</h2>
      <p className="text-sm font-medium text-gray-400 max-w-[280px] mx-auto leading-relaxed">
       Your new product has been successfully uploaded and is now live on the storefront.
      </p>
     </div>
    </ModalBody>
    <ModalFooter className="flex flex-col gap-3 pb-8">
     <Button
      variant="primary"
      className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
      onClick={() => {
       setIsPublishSuccessOpen(false);
       router.push("/admin/products");
      }}
     >
      Done, back to products
     </Button>
     <Button
      variant="ghost"
      className="w-full h-12 text-[11px] font-bold text-gray-400"
      onClick={() => setIsPublishSuccessOpen(false)}
     >
      View live product
     </Button>
    </ModalFooter>
   </Modal>

   <Modal
    isOpen={isDraftSuccessOpen}
    onClose={() => setIsDraftSuccessOpen(false)}
    title=""
    size="md"
   >
    <ModalBody className="flex flex-col items-center text-center py-10 gap-6">
     <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue shadow-inner border border-blue-100">
      <Icon name="drafts" folder="icon" size="lg" className="w-10 h-10" />
     </div>
     <div className="flex flex-col gap-2">
      <h2 className="text-xl font-black text-[#1D3557]">Saved to Drafts</h2>
      <p className="text-sm font-medium text-gray-400 max-w-[280px] mx-auto leading-relaxed">
       The product has been securely stored. You can find it in the "Draft" tab of the product listing.
      </p>
     </div>
    </ModalBody>
    <ModalFooter className="flex flex-col gap-3 pb-8">
     <Button
      variant="primary"
      className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
      onClick={() => {
       setIsDraftSuccessOpen(false);
       router.push("/admin/products");
      }}
     >
      Back to catalog
     </Button>
     <Button
      variant="ghost"
      className="w-full h-12 text-[11px] font-bold text-gray-400"
      onClick={() => setIsDraftSuccessOpen(false)}
     >
      Continue editing
     </Button>
    </ModalFooter>
   </Modal>

   <UploadMediaModal
    isOpen={isUploadModalOpen}
    onClose={() => setIsUploadModalOpen(false)}
    onUploadSuccess={handleMediaUpload}
   />
  </div >
 );
}
