"use client";

import { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CustomerHeader } from "../components/customer-header";
import { CustomerProductCard } from "../components/customer-product-card";
import { CustomerSubHeader } from "../components/customer-sub-header";
import { useGetBusinessCatalogQuery, CatalogInventoryItem, useGetBusinessFiltersQuery } from "@/lib/redux/services/businessesApi";
import { CustomerPageSkeleton } from "../components/Skeleton/CustomerPageSkeleton";
import { EmptyState } from "../components/empty-state";
import { useUserInfo } from "../contexts/UserInfoContext";
import { parseStoreContextFromUrl } from "../utils/storeUtils";
import { filterOptions, SVGLoaderFetch } from "../components/Options";
import { useVerifyOrderPaymentQuery } from "@/lib/redux/services/ordersApi";
import { useCart } from "../context/CartContext";
import OrderSuccessModal from "../components/Modal/OrderSuccessModal";
import { useApiError } from "../hooks/useApiError";

function CustomerPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { storeContext, user } = useUserInfo();
  const { clearCart } = useCart();
  
  // Initialize state from URL params
  const [activeFilter, setActiveFilter] = useState(searchParams.get("sort") || "newest");
  const [categoryId, setCategoryId] = useState<string | undefined>(searchParams.get("categoryId") || undefined);
  const [officeId, setOfficeId] = useState<string | undefined>(searchParams.get("officeId") || undefined);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [inStockOnly, setInStockOnly] = useState(searchParams.get("inStockOnly") === "true");
  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const processedRef = useRef<string | null>(null);

  // Payment verification logic
  const trxref = searchParams.get("trxref");
  const reference = searchParams.get("reference") || trxref;

  const {
    isLoading: isVerifying,
    isSuccess: isVerified,
    isError: isVerificationError,
    error: verificationError
  } = useVerifyOrderPaymentQuery(reference!, {
    skip: !reference
  });

  useApiError(isVerificationError, verificationError, "Payment verification failed");

  useEffect(() => {
    if (isVerified && reference && processedRef.current !== reference) {
      processedRef.current = reference;
      setOrderStatus("Payment Successful (Order Confirmed)");
      setIsSuccessModalOpen(true);
      clearCart();

      // Clean up URL parameters after verification
      const params = new URLSearchParams(searchParams.toString());
      params.delete("reference");
      params.delete("trxref");
      const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, [isVerified, reference, clearCart, searchParams]);

  // Derive business info from context or URL
  const businessData = useMemo(() => {
    const searchString = searchParams.toString();
    const contextFromUrl = parseStoreContextFromUrl(searchParams, searchString);
    
    return {
      subdomain: contextFromUrl?.subdomain || storeContext?.subdomain || "",
      businessId: contextFromUrl?.businessId || storeContext?.businessId || user?.businessId || "",
      officeId: officeId || contextFromUrl?.officeId || storeContext?.officeId || user?.officeId || undefined,
    };
  }, [searchParams, storeContext, user, officeId]);

  const { data: filtersResponse, isLoading: isLoadingFilters } = useGetBusinessFiltersQuery(
    businessData.subdomain,
    { skip: !businessData.subdomain }
  );

  const offices = useMemo(() => filtersResponse?.data?.offices || [], [filtersResponse]);

  // Sync with global context
  const { updateStoreContext } = useUserInfo();
  useEffect(() => {
    const businessId = filtersResponse?.data?.business?.id;
    
    // 1. Sync businessId if missing
    if (businessId && storeContext && !storeContext.businessId) {
      updateStoreContext({
        ...storeContext,
        businessId: businessId,
      });
      return; // Wait for next cycle after context update
    }

    // 2. Sync office info
    if (!officeId || offices.length === 0) return;
    
    const selectedOffice = offices.find(o => o.id === officeId);
    if (selectedOffice && (storeContext?.officeId !== officeId || storeContext?.officeName !== selectedOffice.name)) {
      updateStoreContext({
        subdomain: businessData.subdomain,
        businessId: businessData.businessId || businessId || "",
        officeId: officeId,
        officeName: selectedOffice.name,
      });
    }
  }, [officeId, offices, businessData.subdomain, businessData.businessId, storeContext, updateStoreContext, filtersResponse]);

  // Auto-select first office if none selected
  useEffect(() => {
    if (!businessData.subdomain || isLoadingFilters) return;
    
    if (!officeId && offices.length > 0) {
      // Priority: URL > SessionStorage > First Office
      const savedData = sessionStorage.getItem(`tecnova_filters_${businessData.subdomain}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.officeId) {
            setOfficeId(parsed.officeId);
            return;
          }
        } catch (e) {}
      }
      setOfficeId(offices[0].id);
    }
  }, [officeId, offices, businessData.subdomain, isLoadingFilters]);

  const { data: catalogResponse, isLoading: isLoadingCatalog } = useGetBusinessCatalogQuery(
    {
      subdomain: businessData.subdomain,
      officeId: officeId || businessData.officeId,
      categoryId: categoryId,
      productId: searchParams.get("productId") || undefined,
      sort: activeFilter,
      filter: activeFilter,
      search: searchQuery || undefined,
      inStockOnly: inStockOnly || undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 12,
    },
    { skip: !businessData.subdomain || isLoadingFilters || !(officeId || businessData.officeId) }
  );

  const inventoryItems = (catalogResponse?.data?.inventory || []) as CatalogInventoryItem[];
  const business = catalogResponse?.data?.business;
  const businessLogo = business?.logo?.fileUrl || business?.BusinessDocuments?.[0]?.fileUrl;

  // Sync state TO URL - Simple and robust
  useEffect(() => {
    if (!businessData.subdomain) return;

    const params = new URLSearchParams(searchParams.toString());
    
    // Standard params
    if (activeFilter !== "newest") params.set("sort", activeFilter); else params.delete("sort");
    if (inStockOnly) params.set("inStockOnly", "true"); else params.delete("inStockOnly");
    if (categoryId) params.set("categoryId", categoryId); else params.delete("categoryId");
    if (officeId) params.set("officeId", officeId); else params.delete("officeId");
    if (searchQuery) params.set("search", searchQuery); else params.delete("search");

    const newSearch = params.toString();
    const currentSearch = searchParams.toString();
    
    // Only update if there's a meaningful change to avoid loops
    if (currentSearch !== newSearch && decodeURIComponent(currentSearch) !== decodeURIComponent(newSearch)) {
      router.replace(`?${newSearch}`, { scroll: false });
    }
    
    // Persistence
    const dataToSave = { categoryId, officeId };
    sessionStorage.setItem(`tecnova_filters_${businessData.subdomain}`, JSON.stringify(dataToSave));
  }, [activeFilter, categoryId, officeId, inStockOnly, searchQuery, businessData.subdomain, router, searchParams]);

  // Sync URL BACK to state (for back button etc)
  useEffect(() => {
    const urlSort = searchParams.get("sort") || "newest";
    const urlCat = searchParams.get("categoryId") || undefined;
    const urlOff = searchParams.get("officeId") || undefined;
    const urlSearch = searchParams.get("search") || "";
    const urlInStock = searchParams.get("inStockOnly") === "true";

    // Only update state if URL params differ from current state
    // Use functional updates or check values before setting to avoid unnecessary renders
    if (urlSort !== activeFilter) setActiveFilter(urlSort);
    if (urlCat !== categoryId) setCategoryId(urlCat);
    if (urlOff !== officeId) setOfficeId(urlOff);
    if (urlSearch !== searchQuery) setSearchQuery(urlSearch);
    if (urlInStock !== inStockOnly) setInStockOnly(urlInStock);
  }, [searchParams]); // ONLY depend on searchParams for syncing BACK to state

  if (isLoadingCatalog && !catalogResponse) {
    return <CustomerPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {isVerifying && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-6 text-center">
          <SVGLoaderFetch text="Verifying your payment..." isTable={false} />
        </div>
      )}

      <CustomerHeader
        businessName={business?.name}
        businessDescription={business?.description}
        logoUrl={businessLogo}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <CustomerSubHeader
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterSelect={setActiveFilter}
        subdomain={businessData.subdomain}
        categoryId={categoryId}
        onCategorySelect={setCategoryId}
        officeId={officeId}
        onOfficeSelect={setOfficeId}
        inStockOnly={inStockOnly}
        onInStockChange={setInStockOnly}
      />

      {/* Product Grid */}
      <section className="px-6 pt-12 pb-32 md:pb-12 md:px-12">
        <div className="mx-auto max-w-[1440px]">
          {inventoryItems.length === 0 ? (
            <div className="py-20">
              <EmptyState
                iconName="NOProduct"
                title={searchQuery ? "No results found" : "No products available"}
                description={searchQuery ? `We couldn't find anything matching "${searchQuery}"` : "This business hasn't added any products yet."}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {inventoryItems.map((item: CatalogInventoryItem) => {
                const product = item?.product;
                const images = product?.images || product?.ProductImages || [];
                const mainImage = images[0]?.filePath || "/genericProduct.jpg";

                const displayStockStatus = (status: string) => {
                  switch (status) {
                    case "in_stock": return "In Stock";
                    case "low_stock": return "Low Stock";
                    case "out_of_stock": return "Out of Stock";
                    default: return "In Stock";
                  }
                };

                // Extract unique colors from variants
                const variants = product?.variants || product?.ProductVariant || [];
                const productColors = Array.from(new Set(
                  variants
                    .map((v: { variant?: { color: string }; color?: string }) => v?.variant?.color || v?.color)
                    .filter((c: string | undefined): c is string => !!c)
                )) as string[];

                return (
                  <CustomerProductCard
                    key={item.id}
                    id={product?.id || item.productId}
                    name={product?.name || "Unnamed Product"}
                    price={`₦ ${product?.price?.toLocaleString()}`}
                    image={mainImage}
                    stockStatus={displayStockStatus(item.stockStatus) as "In Stock" | "Low Stock" | "Out of Stock"}
                    stockCount={item.quantity}
                    colors={productColors}
                    item={item}
                    officeName={storeContext?.officeName || "All Locations"}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        status={orderStatus}
      />
    </div>
  );
}

export default function CustomerPage() {
  return (
    <Suspense fallback={<CustomerPageSkeleton />}>
      <CustomerPageContent />
    </Suspense>
  );
}
