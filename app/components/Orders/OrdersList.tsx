"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Icon } from "../Icon";

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
    status: "Delivered"
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
                <span className="font-bold text-lg md:text-xl text-brand-blue">${order.total.toFixed(2)}</span>
                {getStatusBadge(order.status)}
              </div>

              {/* Actions */}
              <div className="flex gap-3 md:flex-col mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-50 md:border-t-0 md:border-l border-gray-100 md:pl-6 w-full md:w-auto flex-shrink-0">
                <Button variant="primary" className="flex-1 md:w-[130px] h-10 md:h-11 text-sm font-bold shadow-none rounded-lg">
                  Reorder
                </Button>
                <Button variant="ghost" className="flex-1 md:w-[130px] h-10 md:h-11 text-sm font-bold border border-gray-200 text-gray-700 hover:text-brand-blue shadow-none rounded-lg focus:ring-0 transition-colors">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-brand-blue hover:border-brand-blue active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            <Icon name="chevron_left" size="sm" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all active:scale-95 ${
                  currentPage === page 
                    ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' 
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-brand-blue hover:border-brand-blue'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-brand-blue hover:border-brand-blue active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            <Icon name="chevron_right" size="sm" />
          </button>
        </div>
      )}
    </div>
  );
};
