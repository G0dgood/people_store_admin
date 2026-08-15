"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Select } from "@/app/components/Form/Select";
import { Switch } from "@/app/components/Form/Switch";
import { Input, Textarea } from "@/app/components/Form/Inputs";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import Modal from "@/app/components/Modal/Modal";
import ModalBody from "@/app/components/Modal/ModalBody";
import ModalFooter from "@/app/components/Modal/ModalFooter";
import { useRouter, useSearchParams } from "next/navigation";
import { UploadMediaModal } from "@/app/components/Admin/UploadMediaModal";
import { ProductMediaMetaSidebar } from "@/app/components/Admin/ProductMediaMetaSidebar";
import { ProductPricingSection } from "@/app/components/Admin/ProductPricingSection";
import { PRODUCT_SIZE_OPTIONS } from "@/lib/constants/product-options";
import Checkbox from "@/app/components/Checkbox";
import { HiPhoto, HiArrowPath, HiXCircle, HiXMark, HiPencil, HiCheckCircle, HiTicket, HiArrowLeft } from "react-icons/hi2";
import { Tooltip } from "@/app/components/Tooltip";
import { AISettingsModal } from "@/app/components/Admin/AISettingsModal";
import { useAddProductMutation, useGetProductsQuery } from "@/lib/redux/services/productApi";
import { useGetCategoriesQuery, useGetCategoryCustomAttributesQuery } from "@/lib/redux/services/categoryApi";
import { toast } from "sonner";
import { useSocket } from "@/app/context/SocketContext";
import { useApiError } from "@/app/hooks/useApiError";
import { useGetBrandsQuery } from "@/lib/redux/services/brandApi";
import { useGetOfficesQuery } from "@/lib/redux/services/officeApi";


export default function CreateProduct() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const categoryParam = searchParams.get("category");
 const brandParam = searchParams.get("brand");
 const [addProduct, { isLoading: isSubmitting, isError: isAddError, error: addError }] = useAddProductMutation();
 useApiError(isAddError, addError, "Failed to add product");
 const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetCategoriesQuery();
 const { data: brandsResponse } = useGetBrandsQuery();
 const { data: officesResponse } = useGetOfficesQuery();
 const { emit } = useSocket();


 console.log('categories-------->', categoriesResponse)

 const categories = categoriesResponse?.data && 'categories' in categoriesResponse.data
  ? (categoriesResponse.data as any).categories
  : (Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : []);
 const brands = brandsResponse?.data && 'brands' in brandsResponse.data
  ? (brandsResponse.data as any).brands
  : (Array.isArray(brandsResponse?.data) ? brandsResponse.data : []);
 const offices = officesResponse?.data || [];

 // Unified Form State
 const [formData, setFormData] = useState({
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  category: categoryParam || "",
  subCategory: "",
  brand: "",
  tag: "",
  stockStatus: "In Stock",
  stockQuantity: "10",
  isUnlimited: false,
  isFeatured: false,
  taxIncluded: true,
  expiryStart: "",
  expiryEnd: "",
  sku: "",
  variants: [] as any[],
  colors: "",
  locations: [] as string[],
  attributes: {} as Record<string, string>
 });

 const { data: allProductsResponse } = useGetProductsQuery({ limit: 10000 });

 const { data: customAttributesResponse } = useGetCategoryCustomAttributesQuery(
  formData.category,
  { skip: !formData.category }
 );
 const customAttributes = customAttributesResponse?.data || [];

 const prevCategoryRef = useRef("");
 const prevSubCategoryRef = useRef("");

 const generateSKUSuggestion = (categoryName: string, subCategoryName: string, allProducts: any[]) => {
  if (!categoryName) return "";
  const cleanCat = categoryName.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  const catCode = cleanCat.slice(0, 3);

  let subCatCode = "";
  if (subCategoryName) {
   const cleanSub = subCategoryName.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
   subCatCode = cleanSub.slice(0, 3);
  }

  const prefix = subCatCode ? `${catCode}-${subCatCode}` : catCode;

  let nextIndex = 1;
  let suggestedSku = "";
  let isTaken = true;

  // Loop until we find a SKU that does not exist in any product globally
  while (isTaken) {
   const paddedIndex = String(nextIndex).padStart(3, "0");
   suggestedSku = `${prefix}-${paddedIndex}`;
   isTaken = allProducts.some(p => p.sku?.toUpperCase() === suggestedSku.toUpperCase());
   if (isTaken) {
    nextIndex++;
   }
  }

  return suggestedSku;
 };

 const handleGenerateSKU = () => {
  if (!formData.category) {
   toast.error("Please select a category first.");
   return;
  }
  const allProducts = allProductsResponse?.data && 'products' in allProductsResponse.data
   ? (allProductsResponse.data as any).products
   : (Array.isArray(allProductsResponse?.data) ? allProductsResponse.data : []);
  const suggested = generateSKUSuggestion(formData.category, formData.subCategory, allProducts);
  if (suggested) {
   handleInputChange("sku", suggested);
   toast.success(`SKU generated: ${suggested}`);
  }
 };

 useEffect(() => {
  const catChanged = formData.category !== prevCategoryRef.current;
  const subCatChanged = formData.subCategory !== prevSubCategoryRef.current;

  if (catChanged || subCatChanged) {
   prevCategoryRef.current = formData.category;
   prevSubCategoryRef.current = formData.subCategory;

   const isAutoGeneratedStyle = !formData.sku || /^[A-Z0-9]{3,}(-[A-Z0-9]{3,})?-\d+$/.test(formData.sku);
   if (isAutoGeneratedStyle && formData.category) {
    const allProducts = allProductsResponse?.data && 'products' in allProductsResponse.data
     ? (allProductsResponse.data as any).products
     : (Array.isArray(allProductsResponse?.data) ? allProductsResponse.data : []);
    const suggested = generateSKUSuggestion(formData.category, formData.subCategory, allProducts);
    if (suggested) {
     setFormData(prev => ({ ...prev, sku: suggested }));
    }
   }
  }
 }, [formData.category, formData.subCategory, allProductsResponse]);

 // Set initial brand if brandParam exists and brands are loaded
 useEffect(() => {
  if (brandParam && brands.length > 0) {
   const brand = (brands as any[]).find((b: any) => b.name === brandParam || b._id === brandParam);
   if (brand) {
    setFormData(prev => ({ ...prev, brand: brand._id }));
   }
  }
 }, [brandParam, brands]);

 const getRecommendedStatus = (quantity: string | number) => {
  const q = Number(quantity);
  if (q === 0) return "Out of Stock";
  if (q <= 5) return "Low Stock";
  return "In Stock";
 };

 const [pendingStockStatus, setPendingStockStatus] = useState("");
 const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

 const handleInputChange = (field: string, value: any) => {
  if (field === "stockQuantity") {
   const recommended = getRecommendedStatus(value);
   setFormData(prev => ({
    ...prev,
    stockQuantity: value,
    stockStatus: recommended
   }));
   return;
  }

  if (field === "stockStatus") {
   const recommended = getRecommendedStatus(formData.stockQuantity);
   if (value !== recommended) {
    setPendingStockStatus(value);
    setIsOverrideModalOpen(true);
    return;
   }
  }

  setFormData(prev => ({ ...prev, [field]: value }));
 };

 const handleAttributeChange = (name: string, value: string) => {
  setFormData(prev => ({
   ...prev,
   attributes: {
    ...(prev.attributes || {}),
    [name]: value
   }
  }));
 };

 // UI States (keeping these separate as they don't represent the product data itself)
 const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);
 const [isPublishSuccessOpen, setIsPublishSuccessOpen] = useState(false);
 const [isDraftConfirmOpen, setIsDraftConfirmOpen] = useState(false);
 const [isDraftSuccessOpen, setIsDraftSuccessOpen] = useState(false);
 const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
 const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
 const [stagedMedia, setStagedMedia] = useState<{ file: File, url: string }[]>([]);
 const [showColorPicker, setShowColorPicker] = useState(false);

 const [isRefining, setIsRefining] = useState(false);
 const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
 const [aiTone, setAiTone] = useState("Professional");

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

 const makePrimary = (index: number) => {
  setStagedMedia(prev => {
   const newMedia = [...prev];
   const [selected] = newMedia.splice(index, 1);
   newMedia.unshift(selected);
   return newMedia;
  });
  toast.success("Image set as primary");
 };

 const handleSubmit = async (submitStatus: "Published" | "Draft") => {
  try {
   const {
    name, description, price, discountPrice, category, subCategory,
    stockQuantity, stockStatus, isUnlimited, isFeatured, taxIncluded,
    expiryStart, expiryEnd, tag, colors
   } = formData;

   if (!name || !description || !price || !category) {
    toast.error("Please fill in all required fields (Name, Description, Price, Category)");
    return;
   }

   if (stagedMedia.length === 0) {
    toast.error("Please add at least one product image");
    return;
   }

   const postData = new FormData();
   postData.append("name", name);
   postData.append("description", description);
   postData.append("price", price);
   postData.append("discountPrice", discountPrice || "0");
   postData.append("category", category);
   postData.append("subCategory", subCategory || "");
   if (formData.brand) postData.append("brand", formData.brand);
   postData.append("stock", isUnlimited ? "0" : stockQuantity);
   postData.append("stockStatus", stockStatus);
   postData.append("status", submitStatus);
   postData.append("isUnlimited", String(isUnlimited));
   postData.append("isFeatured", String(isFeatured));
   postData.append("taxIncluded", String(taxIncluded));
   postData.append("expiryStart", expiryStart);
   postData.append("expiryEnd", expiryEnd);
   postData.append("tags", JSON.stringify(tag ? [tag] : []));
   postData.append("colors", colors || "");
   postData.append("sku", formData.sku);
   postData.append("locations", JSON.stringify(formData.locations || []));
   postData.append("attributes", JSON.stringify(formData.attributes || {}));
   const cleanedVariants = formData.variants.map(v => ({
    ...v,
    attributes: Object.fromEntries(
     Object.entries(v.attributes || {}).map(([key, val]) => [
      key,
      Array.isArray(val) ? val.join(", ") : val
     ])
    )
   }));

   postData.append("variants", JSON.stringify(cleanedVariants));

   // Append all media files
   stagedMedia.forEach((item) => {
    postData.append("media", item.file);
   });

   const response = await addProduct(postData).unwrap();

   if (response.success) {
    emit("PRODUCT_UPDATED", { type: "create", product: response.data });
    if (submitStatus === "Published") {
     setIsPublishSuccessOpen(true);
    } else {
     setIsDraftSuccessOpen(true);
    }
    toast.success(`Product ${submitStatus === 'Published' ? 'published' : 'saved as draft'} successfully!`);
   }
  } catch (error: any) {
   console.error("Failed to add product:", error);
   // Error handled by hook
  }
 };



 return (
  <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
   {/* Top Header / Action Bar */}
   <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
    <div className="flex items-center gap-4">
     <Button shape="rounded-sm" variant="ghost" className="!p-2 hover:bg-gray-100" onClick={() => router.back()}>
      <HiArrowLeft size={20} className="text-gray-400" />
     </Button>
     <div className="flex flex-col">
      <h2 className="text-xl font-black text-[#121212]">Add New Product</h2>
      <div className="flex items-center gap-2">
       <p className="text-xs font-bold text-gray-400 tracking-widest">Product Catalog</p>
       {formData.sku && (
        <>
         <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
         <p className="text-[10px] font-black text-brand-gold uppercase tracking-wider">SKU: {formData.sku}</p>
        </>
       )}
      </div>
     </div>
    </div>

    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">


     <div className="flex gap-2">
      <Button shape="rounded-sm" variant="primary"
       size="md"
       isLoading={isSubmitting}
       onClick={() => setIsPublishConfirmOpen(true)}
      >
       Publish Product
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
       Save to draft
      </Button>
      <Tooltip text="Reset Form" position="top">
       <Button shape="rounded-sm" variant="outline"
        className="!p-3"
        onClick={() => setIsResetConfirmOpen(true)}
       >
        <Icon name="arrow-refresh-06" folder="dashboardIcon" size="sm" />
       </Button>
      </Tooltip>

     </div>
    </div>
   </div>

   {/* Main Form Content */}
   <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
    {/* Left Column (Main Details) */}
    <div className="xl:col-span-2 flex flex-col gap-6">
     {/* Basic Details */}

     <div className="bg-white rounded-[6px] border border-gray-200   p-8 flex flex-col gap-6">
      <h3 className="text-base font-bold text-[#121212]">Basic Details</h3>
      <div className="flex flex-col gap-2.5">
       <label className="text-[11px] font-bold text-[#121212]">Product Categories</label>
       <Select
        shape="rounded-sm"
        value={formData.category}
        onChange={(val) => {
         handleInputChange("category", val as string);
         handleInputChange("subCategory", ""); // Reset subcategory when category changes
         setFormData(prev => ({ ...prev, attributes: {} }));
        }}
        placeholder="Select your product"
        options={categories?.map((c: any) => ({
         label: c?.name?.toUpperCase(),
         value: c?.name
        }))}
        searchable
       />
      </div>
      {(() => {
       const selectedCategoryObj = categories.find((c: any) => c.name === formData.category);
       const subCategories = selectedCategoryObj?.subCategories || [];
       if (subCategories.length === 0) return null;
       return (
        <div className="flex flex-col gap-2.5">
         <label className="text-[11px] font-bold text-[#121212]">Product Sub Categories</label>
         <Select
          shape="rounded-sm"
          value={formData.subCategory}
          onChange={(val) => handleInputChange("subCategory", val as string)}
          placeholder="Select sub category"
          options={subCategories.map((sub: any) => {
           const name = typeof sub === 'object' ? sub?.name : sub;
           return {
            label: name?.toUpperCase(),
            value: name
           };
          })}
          searchable
         />
        </div>
       );
      })()}
      <div className="flex flex-col gap-2.5">
       <label className="text-[11px] font-bold text-[#121212]">Product Brand</label>
       <Select
        shape="rounded-sm"
        value={formData.brand}
        onChange={(val) => handleInputChange("brand", val as string)}
        placeholder="Select brand"
        options={brands?.map((b: { name: string; _id: any; }) => ({
         label: b?.name?.toUpperCase(),
         value: b?._id
        }))}
        searchable
       />
      </div>
      <div className="flex flex-col gap-2.5">
       <label className="text-xs font-bold text-[#121212]">Product Name</label>
       <Input shape="rounded-sm" type="text"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        className="bg-gray-50/80 border-gray-50 text-sm font-medium text-gray-700"
        placeholder="Enter product name"
       />
      </div>

      <div className="flex flex-col gap-2.5">
       <label className="text-xs font-bold text-[#121212]">Product SKU <span className="text-gray-400 font-medium">(Unique Identifier)</span></label>
       <Input shape="rounded-sm" type="text"
        value={formData.sku}
        onChange={(e) => handleInputChange("sku", e.target.value.toUpperCase())}
        className="bg-gray-50/80 border-gray-50 text-sm font-bold text-gray-900 uppercase"
        placeholder="e.g. PRD-001"
        suffixElement={
         <button
          type="button"
          onClick={handleGenerateSKU}
          className="text-[10px] font-bold text-brand-gold hover:underline cursor-pointer px-2 py-1 bg-white border border-gray-200 rounded-[4px] hover:bg-gray-50 transition-colors"
         >
          Generate
         </button>
        }
       />
      </div>


      {customAttributes.length > 0 && (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customAttributes.map((attr: any) => (
         <div key={attr.name} className="flex flex-col gap-2.5">
          <label className="text-xs font-bold text-[#121212]">{attr.name?.toUpperCase()}</label>
          <Select
           shape="rounded-sm"
           placeholder={`Select ${attr.name}`}
           value={formData.attributes?.[attr.name] || ""}
           onChange={(val) => handleAttributeChange(attr.name, val as string)}
           options={attr.subAttributes?.map((opt: string) => ({
            label: opt.toUpperCase(),
            value: opt
           })) || []}
          />
         </div>
        ))}
       </div>
      )}

      <div className="flex flex-col gap-2.5 relative">
       <label className="text-xs font-bold text-[#121212]">Product Description</label>
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

     {/* Product Variants */}
     <div className="bg-white rounded-sm   p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
       <h3 className="text-base font-bold text-[#121212]">Product Variants</h3>
       <Button
        shape="rounded-sm"
        variant="outline"
        className="text-[10px] font-bold"
        onClick={() => {
         const newVariant = {
          sku: `${formData.sku || 'SKU'}-${formData.variants.length + 1}`,
          price: formData.price || "0",
          stock: formData.stockQuantity || "0",
          attributes: {
           color: formData.colors || "",
           size: ""
          }
         };
         handleInputChange("variants", [...formData.variants, newVariant]);
        }}
       >
        Add Variant
       </Button>
      </div>

      {formData.variants.length > 0 ? (
       <div className="flex flex-col gap-4">
        {formData.variants.map((variant, vIdx) => (
         <div key={vIdx} className="p-4 bg-gray-50/50 border border-gray-200 rounded-[6px] flex flex-col gap-4 relative group">
          <button
           onClick={() => {
            const newVariants = formData.variants.filter((_, i) => i !== vIdx);
            handleInputChange("variants", newVariants);
           }}
           className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
           <HiXMark size={16} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#121212]">Variant SKU</label>
            <Input
             shape="rounded-sm"
             value={variant.sku}
             onChange={(e) => {
              const newVariants = [...formData.variants];
              newVariants[vIdx] = { ...variant, sku: e.target.value.toUpperCase() };
              handleInputChange("variants", newVariants);
             }}
            />
           </div>
           <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#121212]">Price Override</label>
            <Input
             shape="rounded-sm"
             type="number"
             value={variant.price}
             onChange={(e) => {
              const newVariants = [...formData.variants];
              newVariants[vIdx] = { ...variant, price: e.target.value };
              handleInputChange("variants", newVariants);
             }}
            />
           </div>
           <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#121212]">Stock</label>
            <Input
             shape="rounded-sm"
             type="number"
             value={variant.stock}
             onChange={(e) => {
              const newVariants = [...formData.variants];
              newVariants[vIdx] = { ...variant, stock: e.target.value };
              handleInputChange("variants", newVariants);
             }}
            />
           </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 gap-4">
           {Object.entries(variant.attributes).map(([attr, val], aIdx) => (
            <div key={aIdx} className="flex flex-col gap-1.5 min-w-[120px]">
             <label className="text-xs font-bold text-[#121212]">{attr}</label>
             {attr.toLowerCase() === 'color' ? (
              <div className="flex items-center gap-2">
               <div className="relative w-8 h-8 rounded-[4px] overflow-hidden border border-gray-200   shrink-0">
                <input
                 type="color"
                 value={val as string || "#000000"}
                 onChange={(e) => {
                  const newVariants = [...formData.variants];
                  newVariants[vIdx] = {
                   ...variant,
                   attributes: { ...variant.attributes, [attr]: e.target.value.toUpperCase() }
                  };
                  handleInputChange("variants", newVariants);
                 }}
                 className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] cursor-pointer border-none bg-transparent"
                />
               </div>
               <Input
                shape="rounded-sm"
                value={val as string}
                onChange={(e) => {
                 const newVariants = [...formData.variants];
                 newVariants[vIdx] = {
                  ...variant,
                  attributes: { ...variant.attributes, [attr]: e.target.value.toUpperCase() }
                 };
                 handleInputChange("variants", newVariants);
                }}
                placeholder="#000000"
               />
              </div>
             ) : attr.toLowerCase() === 'size' ? (
              <Select
               options={PRODUCT_SIZE_OPTIONS}
               value={val as string || ""}
               onChange={(selectedVal) => {
                const newVariants = [...formData.variants];
                newVariants[vIdx] = {
                 ...variant,
                 attributes: { ...variant.attributes, [attr]: selectedVal as string }
                };
                handleInputChange("variants", newVariants);
               }}
               placeholder="Size"
               shape="rounded-sm"
               className="h-8"
               searchable
              />
             ) : (
              <Input
               shape="rounded-sm"
               value={val as string}
               onChange={(e) => {
                const newVariants = [...formData.variants];
                newVariants[vIdx] = {
                 ...variant,
                 attributes: { ...variant.attributes, [attr]: e.target.value }
                };
                handleInputChange("variants", newVariants);
               }}
               placeholder={`Enter ${attr}`}
               className="bg-white border-gray-200 text-xs h-8"
              />
             )}
            </div>
           ))}
          </div>
         </div>
        ))}
       </div>
      ) : (
       <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[6px] bg-gray-50/30">
        <p className="text-xs text-gray-400 font-medium">No variants added yet</p>
        <button
         onClick={() => {
          const newVariant = {
           sku: `${formData.sku || 'SKU'}-1`,
           price: formData.price || "0",
           stock: formData.stockQuantity || "0",
           attributes: {
            color: formData.colors || "",
            size: ""
           }
          };
          handleInputChange("variants", [...formData.variants, newVariant]);
         }}
         className="mt-2 text-[10px] font-bold text-brand-gold hover:underline"
        >
         Create your first variant
        </button>
       </div>
      )}
     </div>

     {/* Pricing Section */}
     <div className="bg-white rounded-[6px] border border-gray-200   p-8 flex flex-col">
      <ProductPricingSection
       formData={formData}
       handleInputChange={handleInputChange}
      />
     </div>

     {/* Inventory Section */}
     <div className="bg-white rounded-[6px] border border-gray-200   p-8 flex flex-col gap-6">
      <h3 className="text-sm font-bold text-[#121212]">Inventory</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-[#121212]">Stock Quantity</label>
        <Input shape="rounded-sm"
         type={formData.isUnlimited ? "text" : "number"}
         disabled={formData.isUnlimited}
         value={formData.isUnlimited ? "Unlimited" : formData.stockQuantity}
         onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
         className="bg-gray-50/80 border-gray-50 text-sm font-bold text-gray-900 focus:bg-white transition-colors"
        />
       </div>

       <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-[#121212]">Stock Status</label>
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
        className="bg-white border border-gray-200 text-[#121212] px-6 py-2.5 rounded-[6px] text-xs font-bold hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-50"
        onClick={() => setIsDraftConfirmOpen(true)}
       >
        <Icon name="ticket" folder="dashboardIcon" size="xs" className="opacity-70" />
        {isSubmitting ? "Saving..." : "Save to draft"}
       </button>
       <Button shape="rounded-sm" variant="primary"
        className="px-8 py-2.5"
        isLoading={isSubmitting}
        onClick={() => setIsPublishConfirmOpen(true)}
       >
        Publish Product
       </Button>
      </div>
     </div>
    </div>

    {/* Right Column (Media & Meta) */}
    <ProductMediaMetaSidebar
     formData={formData}
     handleInputChange={handleInputChange}
     stagedMedia={stagedMedia}
     removeMedia={removeMedia}
     makePrimary={makePrimary}
     setIsUploadModalOpen={setIsUploadModalOpen}
     categories={categories || []}
     brands={brands || []}
     offices={offices || []}
     showColorPicker={showColorPicker}
     setShowColorPicker={setShowColorPicker}
     hideOffices={true}
    />
   </div>

   {/* Modals */}
   <UploadMediaModal
    isOpen={isUploadModalOpen}
    onClose={() => setIsUploadModalOpen(false)}
    onUpload={handleMediaUpload}
    maxFiles={10}
   />

   <AISettingsModal
    isOpen={isAISettingsOpen}
    onClose={() => setIsAISettingsOpen(false)}
    tone={aiTone}
    onToneChange={setAiTone}
   />

   <ConfirmationModal
    isOpen={isPublishConfirmOpen}
    onClose={() => setIsPublishConfirmOpen(false)}
    onConfirm={() => {
     setIsPublishConfirmOpen(false);
     handleSubmit("Published");
    }}
    title="Publish Product"
    message="Are you sure you want to publish this product? It will be immediately visible on the boutique."
    confirmText="Yes, Publish"
    type="success"
   />

   <ConfirmationModal
    isOpen={isDraftConfirmOpen}
    onClose={() => setIsDraftConfirmOpen(false)}
    onConfirm={() => {
     setIsDraftConfirmOpen(false);
     handleSubmit("Draft");
    }}
    title="Save as Draft"
    message="Save this product as a draft? You can continue editing it later from the inventory list."
    confirmText="Save Draft"
    type="info"
   />

   <ConfirmationModal
    isOpen={isResetConfirmOpen}
    onClose={() => setIsResetConfirmOpen(false)}
    onConfirm={() => {
     setFormData({
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "",
      subCategory: "",
      brand: "",
      tag: "",
      stockStatus: "In Stock",
      stockQuantity: "10",
      isUnlimited: false,
      isFeatured: false,
      taxIncluded: true,
      expiryStart: "",
      expiryEnd: "",
      sku: "",
      variants: [] as any[],
      colors: "",
      locations: [],
      attributes: {}
     });
     setStagedMedia([]);
     setIsResetConfirmOpen(false);
     toast.info("Form reset");
    }}
    title="Reset Form"
    message="This will clear all entered data and uploaded media. This action cannot be undone."
    confirmText="Reset Everything"
    type="danger"
   />

   {/* Success Modals */}
   <Modal isOpen={isPublishSuccessOpen} onClose={() => {
    setIsPublishSuccessOpen(false);
    router.push("/products");
   }} size="sm">
    <ModalBody className="flex flex-col items-center text-center p-8">
     <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 animate-bounce">
      <HiCheckCircle size={60} />
     </div>
     <h2 className="text-xl font-bold text-[#121212] mb-2">Product Published!</h2>
     <p className="text-sm text-gray-500">Your masterpiece is now live and ready for customers to discover.</p>
    </ModalBody>
    <ModalFooter className="flex justify-center pb-8 border-t-0">
     <Button shape="rounded-sm" variant="primary" onClick={() => router.push("/products")}>
      Back to Inventory
     </Button>
    </ModalFooter>
   </Modal>

   <Modal isOpen={isDraftSuccessOpen} onClose={() => {
    setIsDraftSuccessOpen(false);
    router.push("/products");
   }} size="sm">
    <ModalBody className="flex flex-col items-center text-center p-8">
     <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-brand-gold mb-6 animate-pulse">
      <HiTicket size={60} />
     </div>
     <h2 className="text-xl font-bold text-[#121212] mb-2">Saved to Drafts</h2>
     <p className="text-sm text-gray-500">Product safely stored in your drafts. You can polish it later.</p>
    </ModalBody>
    <ModalFooter className="flex justify-center pb-8 border-t-0">
     <Button shape="rounded-sm" variant="primary" onClick={() => router.push("/products")}>
      Back to Inventory
     </Button>
    </ModalFooter>
   </Modal>

   <ConfirmationModal
    isOpen={isOverrideModalOpen}
    onClose={() => setIsOverrideModalOpen(false)}
    onConfirm={() => {
     setFormData(prev => ({ ...prev, stockStatus: pendingStockStatus }));
     setIsOverrideModalOpen(false);
     toast.info(`Stock status manually overridden to ${pendingStockStatus}`);
    }}
    title="Override Stock Status?"
    message={`The recommended status for ${formData.stockQuantity} units is "${getRecommendedStatus(formData.stockQuantity)}". Are you sure you want to manually set it to "${pendingStockStatus}"?`}
    confirmText="Yes, Override"
    type="warning"
   />
  </div>
 );
}
