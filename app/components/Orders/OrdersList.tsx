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
    <div className="flex flex-col gap-8">
      {/* List Toolbar */}
      <div className="bg-white p-6 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Inventory</span>
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
        {paginatedOrders.length > 0 ? (
          paginatedOrders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 p-4 md:p-6 flex flex-col md:flex-row gap-6 transition-all group relative">
              
              {/* Product Representation Image */}
              <div className="w-24 h-24 md:w-48 md:h-48 flex-shrink-0 border border-gray-200 flex items-center justify-center p-4 bg-white overflow-hidden relative">
                {order.image ? (
                  <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110">
                    <Image src={order.image} alt={`Order ${order.id}`} fill className="object-contain" />
                  </div>
                ) : (
                  <Icon name="perfume_empty" size="lg" className="text-gray-100" />
                )}
              </div>

              {/* Order Context */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold">{order.status}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-outfit font-bold text-xl md:text-2xl text-gray-900 tracking-tight">{order.id}</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Placed on {order.date}</span>
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <div className="w-1.5 h-1.5 bg-gray-200" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {order.items} {order.items === 1 ? 'Magnificent Piece' : 'Artisanal Pieces'}
                  </span>
                </div>

                <div className="mt-auto pt-4 flex items-center gap-6">
                  <button 
                    onClick={() => handleViewDetails(order.id)}
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
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Total Selection</span>
                  <span className="font-outfit font-bold text-2xl md:text-3xl text-gray-900">₦{order.total.toLocaleString()}</span>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto">
                  {getStatusBadge(order.status)}
                  <Button 
                    onClick={() => handleReorder(order)}
                    variant="primary" 
                    className="w-full md:w-36 bg-black text-white hover:bg-brand-gold font-bold shadow-none rounded-none text-[10px] uppercase tracking-widest h-11 transition-all active:scale-95"
                  >
                    Reorder Curation
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center gap-8 bg-white border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 flex items-center justify-center text-gray-200">
              <Icon name="perfume_empty" size="lg" />
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
    </div>
  );
};
