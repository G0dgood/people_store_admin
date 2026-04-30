"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icon } from "../../../components/Icon";
import { Button } from "../../../components/Button";
import { Select } from "../../../components/Form/Select";
import { Switch } from "../../../components/Form/Switch";
import { Input, Textarea } from "../../../components/Form/Inputs";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import Modal from "../../../components/Modal/Modal";
import ModalBody from "../../../components/Modal/ModalBody";
import ModalFooter from "../../../components/Modal/ModalFooter";
import { useRouter, useParams } from "next/navigation";
import { UploadMediaModal } from "../../../components/Admin/UploadMediaModal";
import Checkbox from "@/app/components/Checkbox";
import { HiPhoto, HiArrowPath, HiXCircle, HiXMark, HiPencil, HiArrowLeft } from "react-icons/hi2";
import { Tooltip } from "../../../components/Tooltip";
import { AISettingsModal } from "../../../components/Admin/AISettingsModal";
import { useUpdateProductMutation, useGetProductByIdQuery } from "@/lib/redux/services/productApi";
import { useGetCategoriesQuery } from "@/lib/redux/services/categoryApi";
import { toast } from "sonner";
import { useSocket } from "@/app/context/SocketContext";
import { SVGLoaderFetch } from "@/app/components/Options";

export default function EditProduct() {
 const router = useRouter();
 const { id } = useParams();
 const productId = id as string;

 const { data: productResponse, isLoading: isLoadingProduct } = useGetProductByIdQuery(productId);
 const [updateProduct, { isLoading: isSubmitting }] = useUpdateProductMutation();
 const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetCategoriesQuery();
 const { emit } = useSocket();

 const product = productResponse?.data;
 const categories = categoriesResponse?.data || [];

 // Unified Form State
 const [formData, setFormData] = useState({
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "",
  tag: "",
  stockStatus: "In Stock",
  stockQuantity: "10",
  isUnlimited: false,
  isFeatured: false,
  taxIncluded: true,
  expiryStart: "",
  expiryEnd: "",
  colors: [] as string[],
  size: "",
  volume: "",
  gender: "Unisex"
 });

 const handleInputChange = (field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
 };

 // UI States
 const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);
 const [isPublishSuccessOpen, setIsPublishSuccessOpen] = useState(false);
 const [isDraftConfirmOpen, setIsDraftConfirmOpen] = useState(false);
 const [isDraftSuccessOpen, setIsDraftSuccessOpen] = useState(false);
 const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
 const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
 const [stagedMedia, setStagedMedia] = useState<{ file?: File, url: string, isExisting?: boolean }[]>([]);
 const [showColorPicker, setShowColorPicker] = useState(false);
 const [editingColorIndex, setEditingColorIndex] = useState<number | null>(null);
 const [isRefining, setIsRefining] = useState(false);
 const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
 const [aiTone, setAiTone] = useState("Professional");
 const [selectedCurrency, setSelectedCurrency] = useState("NGN");
 const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
 const [isDiscountDropdownOpen, setIsDiscountDropdownOpen] = useState(false);

 const currencyDropdownRef = useRef<HTMLDivElement>(null);
 const discountDropdownRef = useRef<HTMLDivElement>(null);

 const currencies = [
  { code: "NGN", label: "Nigeria", symbol: "₦", flag: "/icon/flag.svg" },
  { code: "USD", label: "USA", symbol: "$", flag: "/country/Property 1=US.png" },
  { code: "GBP", label: "UK", symbol: "£", flag: "/country/Property 1=GB.png" },
  { code: "EUR", label: "EU", symbol: "€", flag: "/country/Property 1=FR.png" },
 ];

 // Populate form when product data arrives
 useEffect(() => {
  if (product) {
   setFormData({
    name: product.name || "",
    description: product.description || "",
    price: product.price?.toString() || "",
    discountPrice: product.discountPrice?.toString() || "",
    category: (typeof product.category === 'object' ? product.category?.name : product.category) || "",
    tag: product.tags?.[0] || "",
    stockStatus: product.stockStatus || "In Stock",
    stockQuantity: product.stock?.toString() || "0",
    isUnlimited: product.isUnlimited || false,
    isFeatured: product.isFeatured || false,
    taxIncluded: product.taxIncluded || true,
    expiryStart: product.expiryStart ? new Date(product.expiryStart).toISOString().split('T')[0] : "",
    expiryEnd: product.expiryEnd ? new Date(product.expiryEnd).toISOString().split('T')[0] : "",
    colors: product.colors || [],
    size: product.size || "",
    volume: product.volume || "",
    gender: product.gender || "Unisex"
   });

   if (product.media && product.media.length > 0) {
    setStagedMedia(product.media.map((m: any) => ({
     url: m.url,
     isExisting: true
    })));
   } else if (product.productImage) {
    setStagedMedia([{ url: product.productImage, isExisting: true }]);
   }
  }
 }, [product]);

 // Cleanup effect for preview URLs
 useEffect(() => {
  return () => {
   stagedMedia.forEach(item => {
    if (!item.isExisting) URL.revokeObjectURL(item.url);
   });
  };
 }, [stagedMedia]);

 // Close currency dropdowns on outside click
 useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
   const target = event.target as Node;
   if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(target)) {
    setIsCurrencyDropdownOpen(false);
   }
   if (discountDropdownRef.current && !discountDropdownRef.current.contains(target)) {
    setIsDiscountDropdownOpen(false);
   }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 const handleMediaUpload = (files: File[]) => {
  const newMedia = files.map(file => ({
   file,
   url: URL.createObjectURL(file),
   isExisting: false
  }));
  setStagedMedia(prev => [...prev, ...newMedia]);
 };

 const removeMedia = (index: number) => {
  setStagedMedia(prev => {
   const itemToRemove = prev[index];
   if (itemToRemove && !itemToRemove.isExisting) URL.revokeObjectURL(itemToRemove.url);
   return prev.filter((_, i) => i !== index);
  });
 };

 const handleSubmit = async (submitStatus: "Published" | "Draft") => {
  try {
   const {
    name, description, price, category, discountPrice,
    stockStatus, stockQuantity, isUnlimited, isFeatured,
    taxIncluded, expiryStart, expiryEnd, tag, colors,
    size, volume, gender
   } = formData;

   if (!name || !description || !price || !category) {
    toast.error("Please fill in all required fields (Name, Description, Price, Category)");
    return;
   }

   const postData = new FormData();
   postData.append("name", name);
   postData.append("description", description);
   postData.append("price", price);
   postData.append("discountPrice", discountPrice || "0");
   postData.append("category", category);
   postData.append("stock", isUnlimited ? "0" : stockQuantity);
   postData.append("stockStatus", stockStatus);
   postData.append("status", submitStatus);
   postData.append("isUnlimited", String(isUnlimited));
   postData.append("isFeatured", String(isFeatured));
   postData.append("taxIncluded", String(taxIncluded));
   if (expiryStart) postData.append("expiryStart", expiryStart);
   if (expiryEnd) postData.append("expiryEnd", expiryEnd);
   postData.append("tags", JSON.stringify(tag ? [tag] : []));
   postData.append("colors", JSON.stringify(colors));
   postData.append("size", size);
   postData.append("volume", volume);
   postData.append("gender", gender);

   // Append existing media URLs or IDs if the backend supports it
   // For simplicity, we'll send the new files and the backend can decide what to do
   const newFiles = stagedMedia.filter(m => !m.isExisting && m.file).map(m => m.file as File);
   newFiles.forEach((file) => {
    postData.append("media", file);
   });

   // If the backend needs to know which existing media to keep, we'd add that here
   const existingUrls = stagedMedia.filter(m => m.isExisting).map(m => m.url);
   postData.append("existingMedia", JSON.stringify(existingUrls));

   const response = await updateProduct({
    productId,
    data: postData as any
   }).unwrap();

   if (response.success) {
    emit("PRODUCT_UPDATED", { type: "update", product: response.data });
    setIsPublishConfirmOpen(false);
    setIsDraftConfirmOpen(false);
    if (submitStatus === "Published") {
     setIsPublishSuccessOpen(true);
    } else {
     setIsDraftSuccessOpen(true);
    }
    toast.success(`Product updated and ${submitStatus === 'Published' ? 'published' : 'saved as draft'} successfully!`);
   }
  } catch (error: any) {
   console.error("Failed to update product:", error);
   toast.error(error?.data?.message || "Something went wrong while saving the product");
  }
 };

 if (isLoadingProduct) return (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
   <div className="w-12 h-12 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
   <p className="text-sm font-bold text-gray-400">Fetching product data...</p>
  </div>
 );

 return (
  <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
   {/* Top Header / Action Bar */}
   <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
    <div className="flex items-center gap-4">
      <Button shape="rounded-sm" variant="ghost" className="!p-2 hover:bg-gray-100" onClick={() => router.back()}>
        <HiArrowLeft size={20} className="text-gray-400" />
      </Button>
      <div className="flex flex-col">
        <h2 className="text-xl font-black text-[#1D3557]">Edit {product?.status === 'Draft' ? 'Draft' : 'Product'}</h2>
        <p className="text-xs font-bold text-gray-400">ID: {productId.slice(-8)}</p>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
     <div className="flex gap-2">
      <Button shape="rounded-sm" variant="primary"
       size="md"
       isLoading={isSubmitting}
       onClick={() => setIsPublishConfirmOpen(true)}
      >
       {product?.status === 'Published' ? 'Update Live' : 'Publish Product'}
      </Button>
      <Button shape="rounded-sm"
       variant="outline"
       size="md"
       isLoading={isSubmitting}
       iconLeft={<Icon name="ticket"
        folder="dashboardIcon"
        size="md"
        className="opacity-70" />}
       onClick={() => setIsDraftConfirmOpen(true)}
      >
       {product?.status === 'Draft' ? 'Update Draft' : 'Save as Draft'}
      </Button>
      <Tooltip text="Discard Changes" position="top">
       <Button shape="rounded-sm" variant="outline"
        className="!p-3"
        onClick={() => router.back()}
       >
        <Icon name="arrow-refresh-06" folder="dashboardIcon" size="sm" />
       </Button>
      </Tooltip>
     </div>
    </div>
   </div>

   {/* Main Form Content (Exactly like new/page.tsx) */}
   <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
    {/* Left Column (Main Details) */}
    <div className="xl:col-span-2 flex flex-col gap-6">
     {/* Basic Details */}
     <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
      <h3 className="text-base font-bold text-[#1D3557]">Basic Details</h3>

      <div className="flex flex-col gap-2.5">
       <label className="text-xs font-bold text-[#1D3557]">Product Name</label>
       <Input shape="rounded-sm" type="text"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        className="bg-gray-50/80 border-gray-50 text-sm font-medium text-gray-700"
        placeholder="Enter product name"
       />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-[#1D3557]">Gender <span className="text-red-500">*</span></label>
        <Select
         shape="rounded-sm"
         value={formData.gender}
         onChange={(val) => handleInputChange("gender", val as string)}
         options={[
          { label: "Men", value: "Men" },
          { label: "Women", value: "Women" },
          { label: "Unisex", value: "Unisex" },
          { label: "Kids", value: "Kids" },
         ]}
        />
       </div>

       <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-[#1D3557]">Size</label>
        <Input shape="rounded-sm" type="text"
         value={formData.size}
         onChange={(e) => handleInputChange("size", e.target.value)}
         className="bg-gray-50/80 border-gray-50 text-sm font-medium text-gray-700"
         placeholder="e.g. XL, 42, 10"
        />
       </div>

       <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-[#1D3557]">Volume</label>
        <Input shape="rounded-sm" type="text"
         value={formData.volume}
         onChange={(e) => handleInputChange("volume", e.target.value)}
         className="bg-gray-50/80 border-gray-50 text-sm font-medium text-gray-700"
         placeholder="e.g. 100ml, 50ml"
        />
       </div>
      </div>

      <div className="flex flex-col gap-2.5 relative">
       <label className="text-xs font-bold text-[#1D3557]">Product Description</label>
       <div className="relative group">
        <Textarea shape="rounded-sm"
         placeholder="Enter product description"
         rows={6}
         value={formData.description}
         onChange={(e) => handleInputChange("description", e.target.value)}
         className="bg-gray-50/80 border-gray-50 text-sm font-medium text-gray-700 resize-none leading-relaxed"
        />
        <div className="absolute bottom-4 right-4 flex gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
         <Tooltip text="Description Settings" position="top">
          <button
           type="button"
           className="p-1.5 hover:bg-gray-100 rounded-[6px] transition-colors"
           onClick={() => setIsAISettingsOpen(true)}
          >
           <Icon name="settings" folder="dashboardIcon" size="md" />
          </button>
         </Tooltip>
         <Tooltip text="Magic Polish (AI)" position="top">
          <button
           type="button"
           disabled={isRefining}
           className={`p-1.5 rounded-[6px] transition-all ${isRefining ? "bg-brand-gold/10 text-brand-gold animate-pulse" : "hover:bg-gray-100"}`}
           onClick={() => {
            setIsRefining(true);
            setTimeout(() => {
             handleInputChange("description", formData.description.trim() + " This masterpiece represents the pinnacle of mobile excellence.");
             setIsRefining(false);
            }, 1200);
           }}
          >
           <Icon
            name="star"
            folder="dashboardIcon"
            size="md"
            className={isRefining ? "animate-spin" : ""}
           />
          </button>
         </Tooltip>
        </div>
       </div>
      </div>
     </div>

     {/* Pricing Section */}
     <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
      <h3 className="text-base font-bold text-[#1D3557]">Pricing</h3>

      <div className="flex flex-col gap-2.5">
       <label className="text-xs font-bold text-[#1D3557]">Product Price</label>
       <div className="relative" ref={currencyDropdownRef}>
        <Input shape="rounded-sm" type="number"
         value={formData.price}
         onChange={(e) => handleInputChange("price", e.target.value)}
         placeholder="0.00"
         className="bg-gray-50/80 border-gray-50 text-sm font-bold text-gray-900"
         prefixElement={<span className="text-sm font-bold text-gray-400">{currencies.find(c => c.code === selectedCurrency)?.symbol}</span>}
         suffixElement={
          <div
           className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-[6px] cursor-pointer shadow-sm hover:bg-gray-50 transition-colors"
           onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
          >
           <img src={currencies.find(c => c.code === selectedCurrency)?.flag} alt={selectedCurrency} className="w-5 h-3 object-cover rounded-[1px]" />
           <Icon name="material-symbols_arrow-downward-rounded" folder="dashboardIcon" size="xs" className="text-gray-400" />
          </div>
         }
        />
        {isCurrencyDropdownOpen && (
         <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-[6px] shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {currencies.map((curr) => (
           <div
            key={curr.code}
            className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors ${selectedCurrency === curr.code ? "bg-gray-50" : ""}`}
            onClick={() => {
             setSelectedCurrency(curr.code);
             setIsCurrencyDropdownOpen(false);
            }}
           >
            <img src={curr.flag} alt={curr.label} className="w-5 h-3 object-cover rounded-[1px]" />
            <div className="flex flex-col">
             <span className="text-[11px] font-bold text-gray-700">{curr.label}</span>
             <span className="text-[9px] text-gray-400 font-medium uppercase">{curr.code}</span>
            </div>
            {selectedCurrency === curr.code && (
             <div className="ml-auto w-1.5 h-1.5 bg-brand-gold rounded-full" />
            )}
           </div>
          ))}
         </div>
        )}
       </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-gray-400">Discounted Price <span className="text-gray-300 font-medium">(Optional)</span></label>
        <div className="relative" ref={discountDropdownRef}>
         <Input
          shape="rounded-sm"
          type="number"
          value={formData.discountPrice}
          onChange={(e) => handleInputChange("discountPrice", e.target.value)}
          placeholder="0.00"
          className="bg-gray-50/80 border-gray-50 text-sm font-bold text-gray-900"
          prefixElement={<span className="text-sm font-bold text-gray-400">{currencies.find(c => c.code === selectedCurrency)?.symbol}</span>}
          suffixElement={
           <div
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-[6px] cursor-pointer shadow-sm hover:bg-gray-50 transition-colors"
            onClick={() => setIsDiscountDropdownOpen(!isDiscountDropdownOpen)}
           >
            <img src={currencies.find(c => c.code === selectedCurrency)?.flag} alt={selectedCurrency} className="w-5 h-3 object-cover rounded-[1px]" />
            <Icon name="material-symbols_arrow-downward-rounded" folder="dashboardIcon" size="xs" className="text-gray-400" />
           </div>
          }
          containerClassName="w-full"
         />
         {isDiscountDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-[6px] shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
           {currencies.map((curr) => (
            <div
             key={curr.code}
             className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors ${selectedCurrency === curr.code ? "bg-gray-50" : ""}`}
             onClick={() => {
              setSelectedCurrency(curr.code);
              setIsDiscountDropdownOpen(false);
             }}
            >
             <img src={curr.flag} alt={curr.label} className="w-5 h-3 object-cover rounded-[1px]" />
             <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-700">{curr.label}</span>
              <span className="text-[9px] text-gray-400 font-medium uppercase">{curr.code}</span>
             </div>
             {selectedCurrency === curr.code && (
              <div className="ml-auto w-1.5 h-1.5 bg-brand-gold rounded-full" />
             )}
            </div>
           ))}
          </div>
         )}
        </div>
       </div>

       <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-[#1D3557]">Tax Included</label>
        <div className="flex items-center gap-6 py-3">
         <Checkbox
          checked={formData.taxIncluded}
          onChange={() => handleInputChange("taxIncluded", true)}
          label="Yes"
         />
         <Checkbox
          checked={!formData.taxIncluded}
          onChange={() => handleInputChange("taxIncluded", false)}
          label="No"
         />
        </div>
       </div>
      </div>

      <div className="flex flex-col gap-2.5">
       <label className="text-xs font-bold text-[#1D3557]">Expiration</label>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input shape="rounded-sm"
         type="date"
         value={formData.expiryStart}
         onChange={(e) => handleInputChange("expiryStart", e.target.value)}
         placeholder="Start"
        />
        <Input shape="rounded-sm"
         type="date"
         value={formData.expiryEnd}
         onChange={(e) => handleInputChange("expiryEnd", e.target.value)}
         placeholder="End"
        />
       </div>
      </div>
     </div>

     {/* Inventory Section */}
     <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
      <h3 className="text-sm font-bold text-[#1D3557]">Inventory</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-[#1D3557]">Stock Quantity</label>
        <Input shape="rounded-sm"
         type={formData.isUnlimited ? "text" : "number"}
         disabled={formData.isUnlimited}
         value={formData.isUnlimited ? "Unlimited" : formData.stockQuantity}
         onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
         className="bg-gray-50/80 border-gray-50 text-sm font-bold text-gray-900 focus:bg-white transition-colors"
        />
       </div>

       <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-[#1D3557]">Stock Status</label>
        <Select
         shape="rounded-sm"
         value={formData.stockStatus}
         onChange={(val) => handleInputChange("stockStatus", val as string)}
         options={[
          { label: "In Stock", value: "In Stock" },
          { label: "Out of Stock", value: "Out of Stock" },
          { label: "Low Stock", value: "Low Stock" },
          { label: "Pre-order", value: "Pre-order" },
          { label: "Discontinued", value: "Discontinued" },
         ]}
        />
       </div>
      </div>

      <div className="flex flex-col gap-4 pt-2">
       <div className="flex items-center justify-between w-full max-w-[200px]">
        <Switch
         checked={formData.isUnlimited}
         onChange={(e) => handleInputChange("isUnlimited", e.target.checked)}
         label={<span className="text-xs font-bold text-gray-900">Unlimited</span>}
        />
       </div>

       <Checkbox
        checked={formData.isFeatured}
        onChange={(checked) => handleInputChange("isFeatured", checked)}
        className="w-fit pt-2"
       >
        <span className="text-xs font-bold text-gray-400 underline underline-offset-4 decoration-gray-200">Highlight this product in a featured section.</span>
       </Checkbox>
      </div>

      <div className="flex gap-3 justify-end mt-4 pt-6 border-t border-gray-50">
       <button
        type="button"
        disabled={isSubmitting}
        className="bg-white border border-gray-200 text-[#1D3557] px-6 py-2.5 rounded-[6px] text-xs font-bold hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-50"
        onClick={() => setIsDraftConfirmOpen(true)}
       >
        <Icon name="ticket" folder="dashboardIcon" size="xs" className="opacity-70" />
        {isSubmitting ? "Updating..." : "Update Draft"}
       </button>
       <Button shape="rounded-sm" variant="primary"
        className="px-8 py-2.5"
        isLoading={isSubmitting}
        onClick={() => setIsPublishConfirmOpen(true)}
       >
        {product?.status === 'Published' ? 'Update Catalog' : 'Publish Product'}
       </Button>
      </div>
     </div>
    </div>

    {/* Right Column (Media & Meta) */}
    <div className="flex flex-col gap-6">
     {/* Upload Media */}
     <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
      <h3 className="text-base font-bold text-[#1D3557]">Update Product Images</h3>

      <div className="flex flex-col gap-4">
       <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#1D3557]">Primary Image</label>
        {stagedMedia.length > 0 && (
         <button
          onClick={() => removeMedia(0)}
          className="text-[10px] font-bold text-red-500 hover:underline"
         >
          Remove
         </button>
        )}
       </div>
       <div className="relative aspect-square w-full rounded-[6px] bg-gray-50/50 border border-gray-200 overflow-hidden group">
        {stagedMedia.length > 0 ? (
          <img
           src={stagedMedia[0].url}
           alt="Preview"
           className="w-full h-full object-contain p-4"
          />
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
          Change Primary
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
          <img src={media.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
         <button
          onClick={() => removeMedia(idx + 1)}
          className="absolute top-1 right-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors shadow-sm opacity-0 group-hover/thumb:opacity-100"
         >
          <HiXCircle className="w-4 h-4" />
         </button>
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
         placeholder="Select category"
         options={categories?.map(c => ({
          label: c?.name?.toUpperCase(),
          value: c?.name
         }))}
        />
       </div>

       <div className="flex flex-col gap-2.5">
        <label className="text-[11px] font-bold text-[#1D3557]">Product Tag</label>
        <Select
         shape="rounded-sm"
         value={formData.tag}
         onChange={(val) => handleInputChange("tag", val as string)}
         placeholder="Select tag"
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

        <div className="flex flex-wrap gap-3 items-center">
         {formData.colors?.map((color, i) => (
          <div
           key={i}
           onClick={() => {
            setEditingColorIndex(i);
            setShowColorPicker(true);
           }}
           className={`group relative w-10 h-10 rounded-[6px] shadow-sm border transition-all cursor-pointer overflow-hidden ${editingColorIndex === i ? "ring-2 ring-brand-gold border-transparent ring-offset-2" : "border-black/5 hover:scale-110"
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
             className="flex-1 bg-brand-gold/90 hover:bg-brand-gold flex items-center justify-center transition-colors"
             title="Edit color"
            >
             <HiPencil className="text-white w-3.5 h-3.5" />
            </div>
            <div
             onClick={(e) => {
              e.stopPropagation();
              const newColors = formData.colors.filter((_, idx) => idx !== i);
              handleInputChange("colors", newColors);
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
           ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
           : "border-gray-200 text-gray-400 hover:border-brand-gold hover:text-brand-gold hover:bg-brand-gold/5"
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
    onConfirm={() => handleSubmit("Published")}
    title="Confirm Update"
    message="Are you sure you want to update and publish these changes? The storefront will reflect these changes immediately."
    confirmText="Yes, update catalog"
    type="success"
    isLoading={isSubmitting}
   />

   <ConfirmationModal
    isOpen={isDraftConfirmOpen}
    onClose={() => setIsDraftConfirmOpen(false)}
    onConfirm={() => handleSubmit("Draft")}
    title="Save as Draft"
    message="Are you sure you want to save these changes as a draft? The product will be hidden from the storefront."
    confirmText="Yes, save draft"
    type="info"
    isLoading={isSubmitting}
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
      <h2 className="text-xl font-black text-[#1D3557]">Product Updated!</h2>
      <p className="text-sm font-medium text-gray-400 max-w-[280px] mx-auto leading-relaxed">
       Your changes have been successfully saved and the product is now updated in the catalog.
      </p>
     </div>
    </ModalBody>
    <ModalFooter className="flex flex-col gap-3 pb-8">
     <Button shape="rounded-sm"
      variant="primary"
      className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-gold/20"
      onClick={() => {
       setIsPublishSuccessOpen(false);
       router.push("/admin/products");
      }}
     >
      Done, back to products
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
     <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shadow-inner border border-brand-gold/20">
      <Icon name="drafts" folder="icon" size="lg" className="w-10 h-10" />
     </div>
     <div className="flex flex-col gap-2">
      <h2 className="text-xl font-black text-[#1D3557]">Draft Updated</h2>
      <p className="text-sm font-medium text-gray-400 max-w-[280px] mx-auto leading-relaxed">
       The draft has been updated successfully. You can continue editing or return to the product list.
      </p>
     </div>
    </ModalBody>
    <ModalFooter className="flex flex-col gap-3 pb-8">
     <Button shape="rounded-sm"
      variant="primary"
      className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-gold/20"
      onClick={() => {
       setIsDraftSuccessOpen(false);
       router.push("/admin/products");
      }}
     >
      Back to catalog
     </Button>
     <Button shape="rounded-sm"
      variant="ghost"
      className="w-full h-12 text-[11px] font-bold text-gray-400"
      onClick={() => setIsDraftSuccessOpen(false)}
     >
      Continue editing
     </Button>
    </ModalFooter>
   </Modal>

   <AISettingsModal
    isOpen={isAISettingsOpen}
    onClose={() => setIsAISettingsOpen(false)}
    aiTone={aiTone}
    setAiTone={setAiTone}
   />

   <UploadMediaModal
    isOpen={isUploadModalOpen}
    onClose={() => setIsUploadModalOpen(false)}
    onUploadSuccess={handleMediaUpload}
    onlyStaging
   />
  </div >
 );
}
