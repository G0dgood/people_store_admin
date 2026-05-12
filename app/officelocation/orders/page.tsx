"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CustomerHeader } from "../../components/customer-header";
import { useUserInfo } from "../../contexts/UserInfoContext";
import { useSelector } from "react-redux";
import { selectCustomer } from "@/lib/redux/slices/authSlice";
import { useGetCurrentCustomerOrdersQuery } from "@/lib/redux/services/ordersApi";
import { EmptyState } from "../../components/empty-state";
import { CustomerOrdersSkeleton } from "../../components/Skeleton/CustomerOrdersSkeleton";
import { getStoreUrl, getShopUrl } from "../../utils/storeUtils";
import { GoBackButton } from "../../components/go-back-button";
import Image from "next/image";
import CustomerOrderDetailModal from "../../components/Modal/CustomerOrderDetailModal";

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const { storeContext } = useUserInfo();
  const customer = useSelector(selectCustomer);
  const subdomain = searchParams.get("subdomain") || storeContext?.subdomain;

  const { data: ordersData, isLoading: isLoadingOrders } = useGetCurrentCustomerOrdersQuery(
    undefined,
    { skip: !customer }
  );

  const orders = ordersData?.data || [];

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const visibleOrders = orders;

  const [businessInfo, setBusinessInfo] = useState<import("@/lib/redux/services/businessesApi").Business | null>(null);
  useEffect(() => {
    if (subdomain) {
      const savedBusiness = localStorage.getItem(`tecnova_business_${subdomain}`);
      if (savedBusiness) {
        setBusinessInfo(JSON.parse(savedBusiness));
      }
    }
  }, [subdomain]);

  const businessLogo = businessInfo?.logo?.fileUrl || businessInfo?.BusinessDocuments?.[0]?.fileUrl;

  if (isLoadingOrders) return <CustomerOrdersSkeleton />;

  return (
    <div className="min-h-screen bg-white">
      <CustomerHeader
        businessName={businessInfo?.name}
        businessDescription={businessInfo?.description}
        logoUrl={businessLogo}
        showSearch={false}
      />

      <section className="mx-auto max-w-[1440px] px-6 pt-12 pb-32 md:pb-12 md:px-12">
        <div className="mb-12 flex items-center justify-between">
          <GoBackButton href={getStoreUrl(subdomain || "")} />
          <div />
        </div>

        {!customer ? (
          <div className="flex flex-col items-center justify-center py-20">
            <EmptyState
              iconName="NOProduct"
              title="Sign in to view orders"
              description="You need to be logged in to view your order history."
              href={getShopUrl("/customer/signin", subdomain)}
              linkLabel="Sign In"
            />
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <EmptyState
              iconName="orders"
              title="No orders found"
              description="You haven't placed any orders yet."
              href={getStoreUrl(subdomain || "")}
              linkLabel="Start Shopping"
            />
          </div>
        ) : (
          <>
            <h1 className="mb-8 font-sans font-normal text-[14px] leading-[42px] tracking-[-0.03em] text-[#1F1F1F]">
              My Orders <span className="text-[#808080]">({visibleOrders.length} items)</span>
            </h1>

            <div className="space-y-6">
              {visibleOrders.map((order) => {
                const firstItem = order.items?.[0]?.officeInventory?.product;
                const orderName = firstItem?.name || order.name || "Unnamed Order";
                const orderImage = firstItem?.ProductImages?.[0]?.filePath || firstItem?.images?.[0]?.filePath || "/genericProduct.jpg";

                return (
                  <div
                    key={order.id}
                    className="group flex flex-col gap-6 border-b border-[#F4F4F4] pb-8 transition-all hover:opacity-90 md:flex-row md:items-start md:justify-between md:border-none md:bg-white md:p-6 md:rounded-2xl md:border md:border-gray-100 md:hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50 p-1.5 md:h-24 md:w-24 md:p-2">
                        <Image
                          src={orderImage}
                          alt={orderName}
                          fill
                          className="object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate font-sans text-base font-semibold text-gray-900 md:text-xl">
                          {orderName}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 md:text-sm">
                          <span>{new Date(order.createdAt || "").toLocaleDateString()}</span>
                          <span className="hidden h-1 w-1 rounded-full bg-gray-300 md:block" />
                          <span className="font-semibold text-[#156BB6]">
                            ₦ {order.totalAmount?.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium md:px-2.5 md:text-xs ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                            {order.status || "PENDING"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-4 md:pt-4">
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className="w-full rounded-full border border-gray-200 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 md:w-auto md:px-6"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      <CustomerOrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={selectedOrderId || ""}
      />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<CustomerOrdersSkeleton />}>
      <OrdersPageContent />
    </Suspense>
  );
}
