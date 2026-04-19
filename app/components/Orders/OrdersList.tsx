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

interface OrderData {
  id: string;
  date: string;
  items: number;
  total: number;
  status: "Shipped" | "Processing" | "Delivered" | "Cancelled";
  image?: string;
}

const MOCK_ORDERS: OrderData[] = [
  {
    id: "#ORD-99321",
    date: "Oct 24, 2026",
    items: 3,
    total: 1045.50,
    status: "Delivered",
    image: "/images/headphone.jpg"
  },
  {
    id: "#ORD-99322",
    date: "Oct 22, 2026",
    items: 1,
    total: 39.99,
    status: "Shipped",
    image: "/images/laptop.jpg"
  },
  {
    id: "#ORD-99323",
    date: "Oct 19, 2026",
    items: 5,
    total: 2110.00,
    status: "Processing",
    image: "/images/watch.jpg"
  },
  {
    id: "#ORD-99324",
    date: "Sep 05, 2026",
    items: 2,
    total: 154.20,
    status: "Cancelled",
    image: "/images/camera.jpg"
  },
  {
    id: "#ORD-99325",
    date: "Aug 12, 2026",
    items: 4,
    total: 820.00,
    status: "Delivered",
    image: "/images/headphone.jpg"
  },
  {
    id: "#ORD-99326",
    date: "Aug 02, 2026",
    items: 2,
    total: 120.00,
    status: "Delivered",
    image: "/images/headphone.jpg"
  },
  {
    id: "#ORD-99327",
    date: "Jul 21, 2026",
    items: 1,
    total: 890.00,
    status: "Cancelled",
    image: "/images/laptop.jpg"
  },
  {
    id: "#ORD-99328",
    date: "Jul 05, 2026",
    items: 8,
    total: 1240.20,
    status: "Processing",
    image: "/images/watch.jpg"
  }
];

export const OrdersList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const router = useRouter();
  const { addToCart } = useCart();

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredOrders = MOCK_ORDERS.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReorder = (order: OrderData) => {
    // In a real app, we would fetch the order items and add them all.
    // For this mock, we'll add the primary item representing the order.
    addToCart({
      id: `reorder-${order.id}`,
      title: `Items from ${order.id}`,
      price: `₦${order.total / order.items}`,
      image: order.image || "/images/camera.jpg",
    });
    toast.success(`Items from order ${order.id} added to cart`);
  };

  const handleViewDetails = (orderId: string) => {
    // Navigate directly to product details as requested
    router.push(`/products/detail`);
    toast.info(`Viewing details for ${orderId}`);
  };

  const getStatusBadge = (status: OrderData["status"]) => {
    switch (status) {
      case "Delivered":
        return <Badge variant="success">{status}</Badge>;
      case "Shipped":
        return <Badge variant="info">{status}</Badge>;
      case "Processing":
        return <Badge variant="warning">{status}</Badge>;
      case "Cancelled":
        return <Badge variant="error">{status}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* List Toolbar */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-gray-900 leading-none">All Orders</h2>

        <div className="w-full sm:w-80 relative">
          <Icon name="search" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-blue focus:bg-white transition-colors text-gray-900"
          />
        </div>
      </div>

      {/* Orders Map */}
      <div className="flex flex-col gap-4">
        {paginatedOrders.length > 0 ? (
          paginatedOrders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-6">
              
              {/* Thumbnail */}
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative flex-shrink-0 p-2 flex items-center justify-center">
                {order.image ? (
                  <Image src={order.image} alt={`Order ${order.id}`} fill className="object-contain" />
                ) : (
                  <Icon name="inventory_2" size="lg" className="text-gray-300 opacity-60" />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 gap-1">
                <span className="font-bold text-base md:text-lg text-gray-900 tracking-tight">{order.id}</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium">Placed on {order.date}</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium mt-1">
                  Contains {order.items} {order.items === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Price & Status */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:w-32 lg:w-48">
                <span className="font-bold text-lg md:text-xl text-brand-blue">₦{order.total.toLocaleString()}</span>
                {getStatusBadge(order.status)}
              </div>

              {/* Actions */}
              <div className="flex gap-3 md:flex-col mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-50 md:border-t-0 md:border-l border-gray-200 md:pl-6 w-full md:w-auto flex-shrink-0">
                <Button 
                  onClick={() => handleReorder(order)}
                  variant="primary" 
                  className="flex-1 md:w-[130px] h-10 md:h-11 text-sm font-bold shadow-none rounded-lg active:scale-95 transition-all"
                >
                  Reorder
                </Button>
                <Button 
                  onClick={() => handleViewDetails(order.id)}
                  variant="secondary" 
                  className="flex-1 md:w-[130px] h-10 md:h-11 text-sm font-bold border border-gray-200 text-gray-700 hover:text-brand-blue shadow-none rounded-lg focus:ring-0 transition-colors active:scale-95 transition-all"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-xl">
            <Icon name="inventory_2" size="lg" className="mb-2 opacity-50" />
            <p className="font-medium text-gray-500">No orders found.</p>
          </div>
        )}
      </div>

      {/* Pagination component replaces manual buttons */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-2">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};
