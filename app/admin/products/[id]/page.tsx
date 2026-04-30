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
import { ProductMediaMetaSidebar } from "../../../components/Admin/ProductMediaMetaSidebar";
import { PRODUCT_SIZE_OPTIONS } from "@/lib/constants/product-options";
import Checkbox from "@/app/components/Checkbox";
import { HiArrowPath, HiXMark, HiArrowLeft, HiCheckCircle, HiArchiveBox } from "react-icons/hi2";
import { Tooltip } from "../../../components/Tooltip";
import { AISettingsModal } from "../../../components/Admin/AISettingsModal";
import { useUpdateProductMutation, useGetProductByIdQuery } from "@/lib/redux/services/productApi";
import { useGetCategoriesQuery } from "@/lib/redux/services/categoryApi";
import { toast } from "sonner";
import { useApiError } from "../../../hooks/useApiError";
import { useSocket } from "@/app/context/SocketContext";
import { SVGLoaderFetch } from "@/app/components/Options";
import { EditProductSkeleton } from "@/app/components/Admin/EditProductSkeleton";
import { useGetBrandsQuery } from "@/lib/redux/services/brandApi";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();
  const productId = id as string;

  const { data: productResponse, isLoading: isLoadingProduct, isError: isProductError, error: productError } = useGetProductByIdQuery(productId);
  const [updateProduct, { isLoading: isSubmitting, isError: isUpdateError, error: updateError }] = useUpdateProductMutation();
  const { data: categoriesResponse, isLoading: isLoadingCategories, isError: isCategoriesError, error: categoriesError } = useGetCategoriesQuery();
  const { data: brandsResponse } = useGetBrandsQuery();
  const { emit } = useSocket();

  useApiError(isProductError, productError, "Failed to load product details");
  useApiError(isCategoriesError, categoriesError, "Failed to load categories");
  useApiError(isUpdateError, updateError, "Failed to update product");

  const product = productResponse?.data;
  const categories = categoriesResponse?.data || [];
  const brands = brandsResponse?.data || [];

  // Unified Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
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
    colors: [] as string[],
    size: [] as string[],
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
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price?.toString() || "",
        discountPrice: product?.discountPrice?.toString() || "",
        category: (typeof product?.category === 'object' ? product?.category?.name : product?.category) || "",
        brand: (typeof product?.brand === 'object' ? product?.brand?._id : product?.brand) || "",
        tag: product?.tags?.[0] || "",
        stockStatus: product?.stockStatus || "In Stock",
        stockQuantity: product?.stock?.toString() || "0",
        isUnlimited: product?.isUnlimited || false,
        isFeatured: product?.isFeatured || false,
        taxIncluded: product?.taxIncluded || true,
        expiryStart: product?.expiryStart ? new Date(product?.expiryStart).toISOString().split('T')[0] : "",
        expiryEnd: product?.expiryEnd ? new Date(product?.expiryEnd).toISOString().split('T')[0] : "",
        sku: product?.sku || "",
        variants: product?.variants || [],
        colors: product?.colors || [],
        size: (() => {
          const raw = product?.size || product?.volume || [];
          if (Array.isArray(raw)) return raw.flat();
          if (typeof raw === "string") return raw.split(",").map(s => s.trim()).filter(Boolean);
          return [];
        })(),
        gender: product?.gender || "Unisex"
      });

      if (product?.media && product?.media.length > 0) {
        setStagedMedia(product.media.map((m: any) => ({
          url: m.url,
          isExisting: true
        })));
      } else if (product?.productImage) {
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
        name, description, price, category, discountPrice,
        stockStatus, stockQuantity, isUnlimited, isFeatured,
        taxIncluded, expiryStart, expiryEnd, tag, colors,
        size, gender
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
      if (formData.brand) postData.append("brand", formData.brand);
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
      postData.append("size", JSON.stringify(size));
      postData.append("gender", gender);
      postData.append("sku", formData.sku);
      postData.append("variants", JSON.stringify(formData.variants));

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
      // Error handled by hook
    }
  };

  if (isLoadingProduct) return <EditProductSkeleton />;

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

            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-[#1D3557]">Product SKU <span className="text-gray-400 font-medium">(Unique Identifier)</span></label>
              <Input shape="rounded-sm" type="text"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value.toUpperCase())}
                className="bg-gray-50/80 border-gray-50 text-sm font-bold text-gray-900 uppercase"
                placeholder="e.g. PRD-001"
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

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2.5">
                  <label className="text-xs font-bold text-[#1D3557]">Available Sizes</label>
                  <Select
                    isMulti
                    searchable
                    placeholder="Select sizes..."
                    shape="rounded-sm"
                    options={PRODUCT_SIZE_OPTIONS}
                    value={formData.size}
                    onChange={(val) => handleInputChange("size", val)}
                  />
                  <p className="text-[9px] text-gray-400 font-medium">Select one or more available sizes for this product</p>
                </div>

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

          {/* Product Variants */}
          <div className="bg-white rounded-sm shadow-sm p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1D3557]">Product Variants</h3>
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
                      color: formData.colors[0] || "",
                      size: formData.size[0] || ""
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
                        <label className="text-xs font-bold text-[#1D3557]">Variant SKU</label>
                        <Input
                          shape="rounded-sm"
                          value={variant.sku}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[vIdx] = { ...variant, sku: e.target.value.toUpperCase() };
                            handleInputChange("variants", newVariants);
                          }}
                          className="bg-white border-gray-200 text-xs font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#1D3557]">Price Override</label>
                        <Input
                          shape="rounded-sm"
                          type="number"
                          value={variant.price}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[vIdx] = { ...variant, price: e.target.value };
                            handleInputChange("variants", newVariants);
                          }}
                          className="bg-white border-gray-200 text-xs font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#1D3557]">Stock</label>
                        <Input
                          shape="rounded-sm"
                          type="number"
                          value={variant.stock}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[vIdx] = { ...variant, stock: e.target.value };
                            handleInputChange("variants", newVariants);
                          }}
                          className="bg-white border-gray-200 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {variant.attributes && Object.entries(variant.attributes).map(([attr, val], aIdx) => (
                        <div key={aIdx} className="flex flex-col gap-1.5 min-w-[120px]">
                          <label className="text-xs font-bold text-[#1D3557]">{attr}</label>
                          {attr.toLowerCase() === 'color' ? (
                            <div className="flex items-center gap-2">
                              <div className="relative w-8 h-8 rounded-[4px] overflow-hidden border border-gray-200 shadow-sm shrink-0">
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
                                className="bg-white border-gray-200 text-[10px] font-mono h-8"
                              />
                            </div>
                          ) : attr.toLowerCase() === 'size' ? (
                            <Select
                              isMulti
                              options={PRODUCT_SIZE_OPTIONS}
                              value={Array.isArray(val) ? val : (val ? [val as string] : [])}
                              onChange={(selectedVal) => {
                                const newVariants = [...formData.variants];
                                newVariants[vIdx] = {
                                  ...variant,
                                  attributes: { ...variant.attributes, [attr]: selectedVal as string[] }
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
                        color: formData.colors[0] || "",
                        size: formData.size[0] ? [formData.size[0]] : []
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
        <ProductMediaMetaSidebar
          formData={formData}
          handleInputChange={handleInputChange}
          stagedMedia={stagedMedia}
          removeMedia={removeMedia}
          makePrimary={makePrimary}
          setIsUploadModalOpen={setIsUploadModalOpen}
          categories={categories || []}
          brands={brands || []}
          showColorPicker={showColorPicker}
          setShowColorPicker={setShowColorPicker}
          editingColorIndex={editingColorIndex}
          setEditingColorIndex={setEditingColorIndex}
        />
      </div>

      <ConfirmationModal
        isOpen={isPublishConfirmOpen}
        onClose={() => setIsPublishConfirmOpen(false)}
        onConfirm={() => handleSubmit("Published")}
        title="Confirm Update"
        message="Are you sure you want to update this product? The storefront will reflect these changes immediately."
        confirmText="Yes, update catalog"
        type="success"
        isLoading={isSubmitting}
      />

      <Modal
        isOpen={isPublishSuccessOpen}
        onClose={() => {
          setIsPublishSuccessOpen(false);
          router.push("/admin/products");
        }}
        size="sm"
      >
        <ModalBody className="flex flex-col items-center text-center p-8">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 animate-bounce">
            <HiCheckCircle size={60} />
          </div>
          <h2 className="text-xl font-bold text-[#1D3557] mb-2">Product Updated!</h2>
          <p className="text-sm text-gray-500">Your changes have been successfully saved and the product is now updated in the catalog.</p>
        </ModalBody>
        <ModalFooter className="flex justify-center pb-8 border-t-0">
          <Button shape="rounded-sm" variant="primary" onClick={() => router.push("/admin/products")}>
            Back to Inventory
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={isDraftSuccessOpen}
        onClose={() => {
          setIsDraftSuccessOpen(false);
          router.push("/admin/products");
        }}
        size="sm"
      >
        <ModalBody className="flex flex-col items-center text-center p-8">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6 animate-pulse">
            <HiArchiveBox size={60} />
          </div>
          <h2 className="text-xl font-bold text-[#1D3557] mb-2">Draft Updated</h2>
          <p className="text-sm text-gray-500">The draft has been updated successfully. You can continue editing or return to the product list.</p>
        </ModalBody>
        <ModalFooter className="flex flex-col gap-3 pb-8 border-t-0 px-8">
          <Button shape="rounded-sm"
            variant="primary"
            className="w-full"
            onClick={() => {
              setIsDraftSuccessOpen(false);
              router.push("/admin/products");
            }}
          >
            Back to Inventory
          </Button>
          <Button shape="rounded-sm"
            variant="ghost"
            className="w-full text-xs font-bold text-gray-400"
            onClick={() => setIsDraftSuccessOpen(false)}
          >
            Continue editing
          </Button>
        </ModalFooter>
      </Modal>

      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
        tone={aiTone}
        onToneChange={setAiTone}
      />

      <UploadMediaModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleMediaUpload}
        onlyStaging
      />
    </div>
  );
}
