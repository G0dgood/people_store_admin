"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "../Badge";
import { Button } from "../Button/Button";
import { Icon } from "../Icon";
import { Pagination } from "../Navigation/Pagination";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useApiError } from "@/app/hooks/useApiError";
import { StatusBadge } from "../StatusBadge";

import { useGetMyOrdersQuery } from "@/lib/redux/services/orderApi";
import { OrderSkeleton } from "../Skeleton/OrderSkeleton";
import { OrderDetailModal } from "./OrderDetailModal";

export const OrdersList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const itemsPerPage = 5;
  const router = useRouter();
  const { addToCart } = useCart();

  const { data: response, isLoading, isError, error, refetch } = useGetMyOrdersQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  useApiError(isError, error, "Failed to load orders", { hideInAdmin: true });

  const orders = response?.data?.orders || [];
  const totalPages = response?.data?.pagination?.totalPages || 0;

  const handleReorder = (order: any) => {
    // Reorder curation based on previous order
    order.items.forEach((item: any) => {
      addToCart({
        id: item.product._id,
        title: item.product.name,
        price: `₦${item.price}`,
        image: item.product.productImage || "/images/camera.jpg",
      });
    });
    toast.success(`Items from order ${order.orderId} added to curation`);
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };


  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        {/* Skeleton Toolbar */}
        <div className="bg-white p-6 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="h-3 bg-gray-100 w-20" />
            <div className="h-6 bg-gray-100 w-48" />
          </div>
          <div className="w-full md:w-96 h-12 bg-gray-100" />
        </div>

        {/* Skeleton List */}
        <div className="flex flex-col gap-5">
          {[...Array(itemsPerPage)].map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center gap-8 bg-white border border-dashed border-red-200">
        <div className="text-red-500">
          <Icon name="error" size="lg" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-outfit font-light text-gray-900 uppercase tracking-widest">Failed to load orders</h3>
          <Button onClick={() => refetch()} variant="outline" className="mt-4">Retry Sync</Button>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((order: any) =>
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* List Toolbar */}
      <div className="bg-white p-6 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-gray-400">Inventory</span>
          <h2 className="text-xl font-outfit font-light text-gray-900 uppercase tracking-widest">
            All <span className="font-bold">Purchases</span>
          </h2>
        </div>

        <div className="w-full md:w-96 relative group">
          <Icon name="search" size="sm" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-gold transition-colors" />
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-brand-gold transition-all text-gray-900"
          />
        </div>
      </div>

      {/* Orders Map */}
      <div className="flex flex-col gap-5">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => (
            <div key={order._id} className="bg-white border border-gray-200 p-4 md:p-6 flex flex-col md:flex-row gap-6 transition-all group relative">

              {/* Product Representation Image */}
              <div className="w-24 h-24 md:w-48 md:h-48 flex-shrink-0 border border-gray-200 flex items-center justify-center p-4 bg-white overflow-hidden relative">
                {order.items?.[0]?.product?.productImage ? (
                  <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110">
                    <Image src={order.items[0].product.productImage} alt={`Order ${order.orderId}`} fill className="object-contain" sizes="(max-width: 768px) 100vw, 200px" />
                  </div>
                ) : (
                  <Icon name="perfume_empty" size="lg" className="text-gray-200" />
                )}
              </div>

              {/* Order Context */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-brand-gold">{order.status}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-outfit font-bold text-base md:text-lg text-gray-900 tracking-tight">{order.orderId}</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <div className="w-1.5 h-1.5 bg-gray-200" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {order.items.length} {order.items.length === 1 ? 'Magnificent Piece' : 'Artisanal Pieces'}
                  </span>
                </div>

                <div className="mt-auto pt-4 flex items-center gap-6">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="text-black hover:text-brand-gold font-bold text-[10px] uppercase tracking-widest cursor-pointer flex items-center gap-2 transition-all border-b border-black/0 hover:border-brand-gold pb-0.5"
                  >
                    View details
                  </button>
                  <button
                    className="text-gray-400 font-bold text-[10px] uppercase tracking-widest cursor-pointer flex items-center gap-2"
                    onClick={() => toast.info("Invoice generation coming soon")}
                  >
                    Download Invoice
                  </button>
                </div>
              </div>

              {/* Price & Primary Actions */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-between py-1 min-w-[180px] border-t md:border-t-0 md:border-l border-gray-200 md:pl-8 pt-4 md:pt-0">
                <div className="flex flex-col md:items-end gap-1">
                  <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-gray-400">Total Selection</span>
                  <span className="font-outfit font-bold text-lg md:text-xl text-gray-900">₦{order.totalAmount.toLocaleString()}</span>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto md:items-end">
                  <StatusBadge module="order" value={order.status} size="md" />
                  {order.refund && (
                    <div className="flex flex-col items-start md:items-end gap-1.5 p-2 bg-rose-50/30 rounded border border-rose-100/50">
                      <span className="text-[7px] uppercase tracking-[0.15em] font-black text-rose-500/70">Refund Request</span>
                      <StatusBadge module="refund" value={order.refund.status} size="sm" />
                    </div>
                  )}
                </div>
                  <Button
                    onClick={() => handleReorder(order)}
                    variant="primary"
                    className="w-full md:w-36 bg-black text-white hover:bg-brand-gold font-bold shadow-none rounded-none text-[10px] uppercase tracking-widest h-11 transition-all active:scale-95"
                  >
                    Reorder Curation
                  </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center gap-8 bg-white border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 flex items-center justify-center text-gray-300">
              <Icon name="perfume_empty" size="xl" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-outfit font-light text-gray-900 uppercase tracking-widest">No order history found</h3>
              <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Time to begin your curated journey</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 pt-8 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};
