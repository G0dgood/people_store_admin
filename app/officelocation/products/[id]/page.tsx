"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { CustomerHeader } from "../../../components/customer-header";
import { GoBackButton } from "../../../components/go-back-button";
import { useCart } from "../../../context/CartContext";
import { QuantitySelector } from "../../../components/QuantitySelector";
import { BranchStockStatus } from "../../../components/BranchStockStatus";
import { BuyProductModal } from "../../../components/BuyProductModal";
import { useGetProductByIdQuery, Product } from "@/lib/redux/services/productsApi";
import { Business, CatalogInventoryItem } from "@/lib/redux/services/businessesApi";
import { CustomerProductDetailSkeleton } from "../../../components/Skeleton/CustomerProductDetailSkeleton";
import { toast } from "sonner";
import { EmptyState } from "@/app/components/empty-state";
import { useUserInfo } from "@/app/contexts/UserInfoContext";
import { getStoreUrl, parseStoreContextFromUrl } from "@/app/utils/storeUtils";
import { useSelector } from "react-redux";
import { selectSelectedInventoryItem } from "@/lib/redux/slices/productSlice";

function ProductDetailsPageContent() {
  const params = useParams();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const { storeContext, updateStoreContext } = useUserInfo();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const searchString = window.location.search.substring(1);
    const context = parseStoreContextFromUrl(searchParams, searchString);

    if (context) {
      // Deep comparison to prevent infinite loop
      // Only update if subdomain changed OR if the URL provides a DIFFERENT non-empty ID
      const isDifferent =
        context.subdomain !== storeContext?.subdomain ||
        (context.businessId && context.businessId !== storeContext?.businessId) ||
        (context.officeId && context.officeId !== storeContext?.officeId);

      if (isDifferent) {
        updateStoreContext({
          subdomain: context.subdomain,
          businessId: context.businessId || storeContext?.businessId || "",
          officeId: context.officeId || storeContext?.officeId,
          officeName: storeContext?.officeName,
        });
      }
    }
  }, [searchParams, updateStoreContext, storeContext]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const baseUrl = getStoreUrl(storeContext?.subdomain, storeContext?.businessId, storeContext?.officeId);
      const [path, existingSearch] = baseUrl.split("?");
      const params = new URLSearchParams(existingSearch || "");
      params.set("search", query);
      params.set("page", "1");
      router.push(`${path}?${params.toString()}`);
    }
  };

  const selectedInventoryItem = useSelector(selectSelectedInventoryItem);

  const { data: productResp, isLoading: isProductLoading } = useGetProductByIdQuery(productId as string, {
    skip: !productId || (selectedInventoryItem?.productId === productId)
  });

  const product = (selectedInventoryItem && selectedInventoryItem.productId === productId)
    ? (selectedInventoryItem.product as Product)
    : productResp?.data;

  // Inventory specific data
  const inventoryData = (selectedInventoryItem && selectedInventoryItem.productId === productId)
    ? (selectedInventoryItem as CatalogInventoryItem)
    : null;

  // Retrieve business data from localStorage
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (storeContext?.subdomain) {
      const savedBusiness = localStorage.getItem(`tecnova_business_${storeContext.subdomain}`);
      if (savedBusiness) {
        const parsedBusiness = JSON.parse(savedBusiness);
        
        // Only set if different
        if (business?.id !== parsedBusiness.id) {
          setBusiness(parsedBusiness);
        }
        
        // Sync businessId if missing
        if (storeContext && !storeContext.businessId && parsedBusiness.id) {
          updateStoreContext({
            ...storeContext,
            businessId: parsedBusiness.id
          });
        }
      }
    }
  }, [storeContext, isProductLoading, updateStoreContext, business?.id]);

  const isLoading = isProductLoading && !product;

  const [selectedColor, setSelectedColor] = useState<string | undefined>(searchParams.get("color") || undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  // Set default color and size when product loads
  useEffect(() => {
    const rawVariants = (product?.variants || product?.ProductVariant || []) as Array<{
      variant?: { color?: string; size?: string };
      color?: string;
      size?: string;
      value?: string;
      price?: number;
      quantity?: number;
    }>;
    const availableColors = Array.from(new Set(
      rawVariants.map((v) => v?.variant?.color || v?.color || v?.value)
        .filter((c): c is string => !!c)
    )) as string[];

    if (availableColors.length > 0 && !selectedColor) {
      const colorFromUrl = searchParams.get("color");
      if (colorFromUrl && availableColors.includes(colorFromUrl)) {
        setSelectedColor(colorFromUrl);
      } else {
        setSelectedColor(availableColors[0]);
      }
    }
  }, [product, selectedColor, searchParams]);

  const rawVariants = (product?.variants || product?.ProductVariant || []) as Array<{
    variant?: { color?: string; size?: string };
    color?: string;
    size?: string;
    value?: string;
    price?: number;
    quantity?: number;
  }>;
  const colors = Array.from(new Set(
    rawVariants.map((v) => v?.variant?.color || v?.color || v?.value)
      .filter((c): c is string => !!c)
  )) as string[];
  const effectiveSelectedColor = selectedColor || (colors.length > 0 ? colors[0] : undefined);

  // Sizes available for the selected color
  const selectedColorVariants = rawVariants.filter(
    (v) => (v?.variant?.color || v?.color || v?.value) === effectiveSelectedColor
  );

  const availableSizes = Array.from(new Set(
    selectedColorVariants.map((v) => v?.variant?.size || v?.size)
      .filter((s): s is string => !!s)
  )) as string[];

  useEffect(() => {
    if (availableSizes.length > 300) { // Safety check
      // No-op
    }
    if (availableSizes.length > 0 && (!selectedSize || !availableSizes.includes(selectedSize))) {
      setSelectedSize(availableSizes[0]);
    }
  }, [effectiveSelectedColor, availableSizes, selectedSize]);

  const effectiveSelectedSize = selectedSize || (availableSizes.length > 0 ? availableSizes[0] : undefined);

  // Identify active variant for price/stock
  const activeVariant = selectedColorVariants.find(
    (v) => (v?.variant?.size || v?.size) === effectiveSelectedSize
  ) || selectedColorVariants[0];

  const currentPrice = activeVariant?.price || product?.price || 0;

  // Aggregate quantity for the selected Color + Size
  const matchingVariants = selectedColorVariants.filter(
    (v) => (v?.variant?.size || v?.size) === effectiveSelectedSize
  );
  const variantQuantity = matchingVariants.reduce((acc: number, v) => acc + (v.quantity || 0), 0);

  const maxUnits = activeVariant ? variantQuantity : (inventoryData?.quantity ?? 100);

  // Cap quantity if it exceeds variant stock
  useEffect(() => {
    if (quantity > maxUnits && maxUnits > 0) {
      setQuantity(maxUnits);
    } else if (maxUnits === 0 && quantity > 0) {
      setQuantity(0);
    }
  }, [maxUnits, quantity]);

  if (isLoading) {
    return <CustomerProductDetailSkeleton />;
  }



  const images = product?.images || product?.ProductImages || [];
  const mainImage = images[activeImageIndex]?.filePath || "/genericProduct.jpg";
  const handleIncrement = () => {
    if (quantity >= maxUnits) {
      toast.info(`Maximum available quantity (${maxUnits}) reached`);
      return;
    }
    setQuantity((prev) => prev + 1);
  };
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    if (!product) return;

    const officeName = storeContext?.officeName || "All Locations";

    addItem({
      id: inventoryData?.id || product.id, // Prefer inventory ID
      name: product.name,
      description: product.description,
      price: currentPrice,
      priceUnit: product.sellingUnit || "/ per unit",
      image: mainImage,
      location: officeName,
      quantity: quantity,
      selectedColor: effectiveSelectedColor,
      selectedSize: effectiveSelectedSize,
      availableColors: colors,
      availableSizes: availableSizes,
      stockCount: maxUnits,
      stockUnit: product.sellingUnit || "units",
      images: images.map(img => img.filePath),
    });
    toast.success("Added to cart successfully!", { position: "bottom-center" });
  };

  // Format price
  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(currentPrice);

  const businessLogo = business?.logo?.fileUrl || business?.BusinessDocuments?.[0]?.fileUrl;

  return (
    <div className="min-h-screen bg-white pb-10">
      <CustomerHeader
        businessName={business?.name}
        businessDescription={business?.description}
        logoUrl={businessLogo}
        showSearch={true}
        searchValue={searchQuery}
        onSearchChange={handleSearch}
      />

      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-[1440px]">
          {/* Top Navigation */}
          <div className="mb-12 flex items-center justify-between">
            <GoBackButton href={getStoreUrl(storeContext?.subdomain, storeContext?.businessId, storeContext?.officeId)} />
            <span className="font-sans font-normal text-[12px]  tracking-[-0.03em] text-[rgba(31,31,31,0.5)]">
              {product?.category?.name || "General"} / {product?.name}
            </span>
            <div />
          </div>

          {!product ? (
            <EmptyState
              iconName="NOProduct"
              title="No System Activity Yet "
              description="Product not found."
            />
          ) : (

            <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">
              {/* Image Section */}
              <div className="w-full lg:w-[350px] shrink-0">
                <div className="mb-4 aspect-square w-full overflow-hidden bg-[#F4F4F4] !p-6 transition-transform duration-300 hover:scale-[1.02] border rounded-[25px] bg-[linear-gradient(180deg,rgba(217,217,217,0.25)_0%,rgba(115,115,115,0.25)_100%)]">
                  <div className="relative h-full w-full">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-contain mix-blend-multiply"
                    />
                  </div>
                </div>

                <div className="mt-3 flex justify-center gap-2">
                  <div className="flex flex-row items-center gap-2">
                    {images.map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${i === activeImageIndex ? "bg-[#156BB6]" : "bg-[#D9D9D9]"}`}
                        onClick={() => setActiveImageIndex(i)}
                      />
                    ))}
                  </div>
                  {images.length > 0 && (
                    <div className="ml-2 font-sans font-normal text-[12px] leading-[28px] tracking-[-0.02em] text-[rgba(31,31,31,0.5)]">
                      ({activeImageIndex + 1}/{images.length} Images)
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col gap-6">
                <div>
                  <h3 className="font-sans font-medium text-[20px] leading-[42px] tracking-[-0.03em] text-black">{product.name}</h3>
                  <p className="max-w-[320px] font-sans font-normal text-[12px] leading-[25px] tracking-[-0.02em] text-[rgba(31,31,31,0.5)]">
                    {product.description}
                  </p>
                </div>

                {/* Location Dropdown */}
                <BranchStockStatus
                  branchName={storeContext?.officeName || "All Locations"}
                  stockStatus={inventoryData?.stockStatus}
                />

                {/* Quantity */}
                <QuantitySelector
                  quantity={quantity}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  availableQuantity={maxUnits}
                  unit={product?.sellingUnit || "Units"}
                />

                {/* Color Selection */}
                {colors.length > 0 && (
                  <div>
                    <p className="mb-3 font-sans font-medium text-[14px] leading-[23px] tracking-[-0.03em] text-black">
                      Choose color: <span className="text-[rgba(31,31,31,0.5)] ml-2 font-normal">{effectiveSelectedColor}</span>
                    </p>

                    <div className="mb-2 flex gap-3">
                      {colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(color)}
                          className={`h-6 w-6 rounded-full border cursor-pointer transition-all ${
                            effectiveSelectedColor === color 
                              ? "scale-110" 
                              : "hover:scale-110"
                          }`}
                          style={{ 
                            backgroundColor: color, 
                            borderColor: color,
                            boxShadow: effectiveSelectedColor === color ? `0 0 0 1px white, 0 0 0 3px ${color}` : 'none'
                          }}
                        />
                      ))}
                    </div>

                  </div>
                )}

                {/* Size Selection */}
                {availableSizes.length > 0 && (
                  <div>
                    <p className="mb-3 font-sans font-medium text-[14px] leading-[23px] tracking-[-0.03em] text-black">Choose size</p>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-[8px] border text-[12px] transition-all ${effectiveSelectedSize === size
                              ? "border-[#156BB6] bg-[#156BB6] text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price & Note */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans font-medium text-[20px] leading-[42px] tracking-[-0.03em] text-black">{formattedPrice}</span>
                    {product.sellingUnit && <span className="font-sans font-normal text-[14px] leading-[30px] tracking-[-0.02em] text-[rgba(31,31,31,0.5)]">/ per {product.sellingUnit}</span>}
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 md:w-[400px]">
                  <button
                    onClick={handleAddToCart}
                    className="h-[50px] w-full rounded-[10px] bg-[#E3F0FF] font-work text-base font-medium text-[#156BB6] transition-colors hover:bg-[#d0e6ff] text-[12px] md:text-[14px]"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setIsBuyModalOpen(true)}
                    className="h-[50px] w-full rounded-[10px] bg-[#156BB6] font-work text-base font-medium text-white transition-colors hover:bg-[#125a9a] text-[12px] md:text-[14px]"
                  >
                    Buy Product
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {product && (
        <BuyProductModal
          isOpen={isBuyModalOpen}
          onClose={() => setIsBuyModalOpen(false)}
          product={{
            name: product.name,
            price: currentPrice,
            image: mainImage,
            quantity: quantity,
            color: effectiveSelectedColor,
            size: effectiveSelectedSize,
            location: storeContext?.officeName || "All Locations",
          }}
        />
      )}
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<CustomerProductDetailSkeleton />}>
      <ProductDetailsPageContent />
    </Suspense>
  );
}
