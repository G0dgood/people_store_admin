"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { GoBackButton } from "../../../components/go-back-button";
import HomeDeliveryModal from "../../../components/Modal/HomeDeliveryModal";
import { IoDownloadOutline } from "react-icons/io5";
import { useGetCurrentCustomerOrderByIdQuery } from "@/lib/redux/services/ordersApi";
import { CustomerOrdersSkeleton } from "../../../components/Skeleton/CustomerOrdersSkeleton";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { data: orderResponse, isLoading, error } = useGetCurrentCustomerOrderByIdQuery(orderId);
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "home">("home");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const order = orderResponse?.data;
  const firstItem = order?.items?.[0];
  const product = firstItem?.officeInventory?.product;

  const handleDeliveryChange = (method: "pickup" | "home") => {
    setDeliveryMethod(method);
    if (method === "home") {
      setIsModalOpen(true);
    }
  };

  if (isLoading) return <CustomerOrdersSkeleton />;
  
  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <h2 className="text-xl font-bold text-red-600">Failed to load order details</h2>
        <p className="mt-2 text-gray-500">Please try again later.</p>
        <div className="mt-6">
          <GoBackButton href="/customer/orders" />
        </div>
      </div>
    );
  }

  const productImage = product?.images?.[0]?.filePath || product?.ProductImages?.[0]?.filePath || "/genericProduct.jpg";
  const productImagesCount = (product?.images?.length || 0) + (product?.ProductImages?.length || 0);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-[1000px]">
        {/* Go Back */}
        <div className="mb-8">
          <GoBackButton href="/customer/orders" />
        </div>

        {/* Order ID */}
        <h1 className="mb-8 font-work text-[24px] font-normal text-[#1F1F1F]">
          Order ID : {order.id}
        </h1>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Product Image */}
          <div className="w-full shrink-0 lg:w-[400px]">
            <div className="relative aspect-square w-full overflow-hidden rounded-[32px] bg-[#F4F4F4] p-12">
              <Image
                src={productImage}
                alt={product?.name || "Product Image"}
                fill
                className="object-contain mix-blend-multiply"
              />
            </div>
            {/* Carousel Dots */}
            {productImagesCount > 0 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#156BB6]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#D9D9D9]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#D9D9D9]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#D9D9D9]" />
                <span className="ml-2 text-sm text-[#808080]">(1/{productImagesCount} Images)</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col pt-4">
            <h2 className="mb-4 font-work text-[24px] font-normal text-[#808080]">
              {product?.name || "Unnamed Product"}
            </h2>
            
            <p className="mb-6 max-w-xl font-work text-sm leading-relaxed text-[#808080]">
              {product?.description || "No description available."}
            </p>

            <div className="mb-4">
              <span className="font-work text-[24px] font-medium text-[#808080]">
                ₦ {firstItem?.price?.toLocaleString() || order.totalAmount?.toLocaleString()}
              </span>
            </div>

            <div className="mb-8 border-b border-[#F4F4F4] pb-8">
              <span className="font-work text-base text-[#808080]">
                Quantity ({firstItem?.quantity || 1})
              </span>
            </div>

            {/* Delivery Method Selection */}
            <div>
              <h3 className="mb-4 font-work text-base font-medium text-[#1F1F1F]">
                Delivery Method
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDeliveryChange("pickup")}
                  className={`flex h-[48px] w-[160px] items-center justify-center rounded-[8px] font-work text-sm transition-all ${
                    deliveryMethod === "pickup"
                      ? "bg-[#156BB6] text-white"
                      : "border border-[#F4F4F4] bg-[#FAFAFA] text-[#808080] hover:bg-gray-50"
                  }`}
                >
                  Pick up
                </button>
                <button
                  onClick={() => handleDeliveryChange("home")}
                  className={`flex h-[48px] w-[160px] items-center justify-center rounded-[8px] font-work text-sm transition-all ${
                    deliveryMethod === "home"
                      ? "bg-[#156BB6] text-white"
                      : "border border-[#F4F4F4] bg-[#FAFAFA] text-[#808080] hover:bg-gray-50"
                  }`}
                >
                  Home Delivery
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-20">
          <button className="flex items-center gap-2 text-[#808080] transition-colors hover:text-[#1F1F1F]">
            <IoDownloadOutline size={20} />
            <span className="font-work text-sm">Download Reciept</span>
          </button>
        </div>
      </div>

      <HomeDeliveryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={order.id}
      />
    </div>
  );
}
