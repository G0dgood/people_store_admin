"use client";

import React from "react";
import Image from "next/image";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../Table/Table";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface OrderData {
  id: string;
  date: string;
  items: number;
  total: number;
  status: "Shipped" | "Processing" | "Delivered" | "Cancelled";
  image: string;
}

const MOCK_ORDERS: OrderData[] = [
  {
    id: "#ORD-99321",
    date: "Oct 24, 2026",
    items: 3,
    total: 1045.50,
    status: "Delivered",
    image: "/web_images/image 34.png"
  },
  {
    id: "#ORD-99322",
    date: "Oct 22, 2026",
    items: 1,
    total: 39.99,
    status: "Shipped",
    image: "/web_images/image 33.png"
  },
  {
    id: "#ORD-99323",
    date: "Oct 19, 2026",
    items: 5,
    total: 2110.00,
    status: "Processing",
    image: "/web_images/image 32.png"
  },
  {
    id: "#ORD-99324",
    date: "Sep 05, 2026",
    items: 2,
    total: 154.20,
    status: "Cancelled",
    image: "/web_images/image 28.png"
  }
];

export const OrdersList: React.FC = () => {
  const getStatusBadge = (status: OrderData["status"]) => {
    switch(status) {
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* List Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900 leading-none">Order History</h2>
        
        <div className="w-full sm:w-64 relative">
          <Icon name="search" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID..."
            className="w-full h-10 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-brand-blue transition-colors text-gray-900"
          />
        </div>
      </div>

      <Table>
        <TableHeader className="bg-gray-50 border-b border-gray-200">
          <tr>
            <TableCell isHeader align="left" className="w-[120px]">Order ID</TableCell>
            <TableCell isHeader align="left">Details</TableCell>
            <TableCell isHeader align="center">Date</TableCell>
            <TableCell isHeader align="right">Total</TableCell>
            <TableCell isHeader align="center">Status</TableCell>
            <TableCell isHeader align="right">Actions</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {MOCK_ORDERS.map((order) => (
            <TableRow key={order.id} className="hover:bg-gray-50 group transition-colors">
              <TableCell className="font-bold text-gray-900">{order.id}</TableCell>
              
              <TableCell>
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-md border border-gray-200 bg-white overflow-hidden flex-shrink-0 relative">
                     {/* Fallback to gray box if dynamic payload missing */}
                     <Image src={order.image} alt="Product" fill className="object-cover" />
                   </div>
                   <span className="text-sm text-gray-500 font-medium">
                     {order.items} {order.items === 1 ? 'Item' : 'Items'}
                   </span>
                </div>
              </TableCell>

              <TableCell align="center" className="text-gray-500">
                {order.date}
              </TableCell>

              <TableCell align="right" className="font-bold text-gray-900">
                ${order.total.toFixed(2)}
              </TableCell>

              <TableCell align="center">
                <div className="flex justify-center">
                  {getStatusBadge(order.status)}
                </div>
              </TableCell>

              <TableCell align="right">
                 <Button variant="ghost" className="h-9 px-4 text-sm font-bold text-brand-blue border border-gray-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                   View Details
                 </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
