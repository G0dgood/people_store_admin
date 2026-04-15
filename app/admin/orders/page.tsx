"use client";

import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import Link from "next/link";
import { useState } from "react";
import { AddOrderModal } from "../../components/Admin/AddOrderModal";
import { OrdersMoreActionsDrawer } from "../../components/Admin/OrdersMoreActionsDrawer";
import { ConfirmationModal } from "../../components/Admin/ConfirmationModal";

const ordersData = [
 {
  id: "#ORD0001",
  product: "Wireless Bluetooth Headphones", image: "/dashboardImage/Headphones.png", date: "01-01-2025", price: "49.99", payment: "Paid", status: "Delivered"
 },
 {
  id: "#ORD0001",
  product: "Men's T-Shirt", image: "/dashboardImage/T-Shirt.png", date: "01-01-2025", price: "14.99", payment: "Unpaid", status: "Pending"
 },
 {
  id: "#ORD0001",
  product: "Men's Leather Wallet", image: "/dashboardImage/Wallet.png", date: "01-01-2025", price: "49.99", payment: "Paid", status: "Delivered"
 },
 {
  id: "#ORD0001",
  product: "Memory Foam Pillow", image: "/dashboardImage/Pillow.png", date: "01-01-2025", price: "39.99", payment: "Paid", status: "Shipped"
 },
 {
  id: "#ORD0001",
  product: "Adjustable Dumbbells",
  image: "/dashboardImage/Dumbbells.png",
  date: "01-01-2025",
  price: "14.99",
  payment: "Unpaid",
  status: "Pending"
 },
 {
  id: "#ORD0001",
  product: "Coffee Maker",
  image: "/dashboardImage/Coffee Maker.png",
  date: "01-01-2025",
  price: "79.99",
  payment: "Unpaid",
  status: "Cancelled"
 },
 {
  id: "#ORD0001",
  product: "Casual Baseball Cap",
  image: "/dashboardImage/Cap.png",
  date: "01-01-2025",
  price: "49.99",
  payment: "Paid",
  status: "Delivered"
 },
 {
  id: "#ORD0001",
  product: "Full HD Webcam",
  image: "/dashboardImage/Webcam.png",
  date: "01-01-2025",
  price: "39.99",
  payment: "Paid",
  status: "Delivered"
 },
 {
  id: "#ORD0001",
  product: "Smart LED Color Bulb",
  image: "/dashboardImage/Bulb.png",
  date: "01-01-2025",
  price: "79.99",
  payment: "Unpaid",
  status: "Delivered"
 },
 {
  id: "#ORD0001",
  product: "Men's T-Shirt", image: "/dashboardImage/T-Shirt.png", date: "01-01-2025", price: "14.99", payment: "Unpaid", status: "Delivered"
 },
];

const statusConfig = {
 Delivered: { color: "text-blue-500", icon: "Delivered" },
 Shipped: { color: "text-gray-500", icon: "Shipped" },
 Pending: { color: "text-orange-400", icon: "Pending" },
 Cancelled: { color: "text-rose-500", icon: "Cancelled" },
};

export default function OrderListing() {
 const [activeTab, setActiveTab] = useState("All order (240)");
 const [currentPage, setCurrentPage] = useState(1);
 const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
 const [isMoreActionDrawerOpen, setIsMoreActionDrawerOpen] = useState(false);
 const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

 return (
  <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
   {/* Header Area */}
   <div className="flex justify-end items-center">
    <div className="flex gap-3">
     <Button
      variant="primary"
      shape="rounded-sm"
      iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
      onClick={() => setIsAddOrderModalOpen(true)}
     >
      Add Order
     </Button>
     <Button
      variant="outline"
      shape="rounded-sm"
      iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
      onClick={() => setIsMoreActionDrawerOpen(true)}
     >
      More Action
     </Button>
    </div>
   </div>

   {/* Stats Cards */}
   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <StatCard title="Total Orders" value="1,240" trendValue="14.4%" trendIsUp={true} />
    <StatCard title="New Orders" value="240" trendValue="20%" trendIsUp={true} />
    <StatCard title="Completed Orders" value="960" trendValue="85%" trendIsUp={true} />
    <StatCard title="Canceled Orders" value="87" trendValue="5%" trendIsUp={false} />
   </div>

   <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
    {/* Filter Controls Row */}
    <div className="p-6 flex flex-col xl:flex-row gap-6 items-center justify-between border-b border-gray-50">
     <TabFilter
      tabs={["All order (240)", "Completed", "Pending", "Canceled"]}
      activeTab={activeTab}
      onChange={setActiveTab}
     />

     <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
      <Input
       type="text"
       placeholder="Search order report"
       containerClassName="flex-1 xl:w-96"
       className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
       suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
      />

      <div className="flex gap-2">
       <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
        <Icon name="sort" folder="dashboardIcon" size="sm" />
       </button>
       <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
        <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" />
       </button>
       <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
        <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
       </button>
      </div>
     </div>
    </div>

    {/* Table Area */}
    <div className="admin-table-container">
     <table>
      <thead>
       <tr>
        <th>No.</th>
        <th>Order Id</th>
        <th className="xl:text-left text-center">Product</th>
        <th>Date</th>
        <th>Price</th>
        <th>Payment</th>
        <th>Status</th>
        <th className="text-right">Action</th>
       </tr>
      </thead>
      <tbody>
       {ordersData.map((order, idx) => (
        <tr key={idx} className="group">
         <td>
          <div className="flex items-center gap-3">
           <input
            type="checkbox"
            className="w-4 h-4 rounded-[6px] border-gray-200 text-blue-500 focus:ring-blue-500 transition-all cursor-pointer"
           />
           <span className="text-sm font-medium text-gray-600">{idx + 1}</span>
          </div>
         </td>
         <td>
          <span className="text-sm font-semibold text-gray-900">{order.id}</span>
         </td>
         <td>
          <div className="flex items-center gap-3 min-w-[200px]">
           <div className="w-10 h-10 rounded-[6px] overflow-hidden border border-gray-50 bg-gray-50 flex-shrink-0">
            <img src={order.image} alt={order.product} className="w-full h-full object-cover" />
           </div>
           <span className="text-sm font-semibold text-gray-700 leading-tight">{order.product}</span>
          </div>
         </td>
         <td className="admin-table-td text-sm font-medium text-gray-500">{order.date}</td>
         <td className="admin-table-td text-sm font-bold text-gray-900">{order.price}</td>
         <td>
          <div className="flex items-center gap-2">
           <span className={`w-1.5 h-1.5 rounded-full ${order.payment === "Paid" ? "bg-blue-500" : "bg-rose-500"}`}></span>
           <span className="text-sm font-medium text-gray-700">{order.payment}</span>
          </div>
         </td>
         <td className="admin-table-td">
          <div className={`flex items-center gap-2 font-bold text-sm ${statusConfig[order.status as keyof typeof statusConfig].color}`}>
           <Icon
            name={statusConfig[order.status as keyof typeof statusConfig].icon}
            folder="dashboardIcon"
            size="sm"
           />
           {order.status}
          </div>
         </td>
         <td className="text-right">
          <div className="flex justify-end items-center gap-4 text-gray-400">
           <Link href={`/admin/orders/${order.id.replace("#", "")}`}>
            <button className="hover:text-blue-500 transition-colors">
             <Icon name="view" folder="dashboardIcon" size="sm" />
            </button>
           </Link>
           <button 
             className="hover:text-rose-500 transition-colors"
             onClick={() => setOrderToDelete(order.id)}
           >
            <Icon name="Delete" folder="dashboardIcon" size="sm" />
           </button>
          </div>
         </td>
        </tr>
       ))}
      </tbody>
     </table>
    </div>

    {/* Improved Pagination Footer */}
    <Pagination
     currentPage={currentPage}
     totalPages={24}
     onPageChange={setCurrentPage}
    />
    <AddOrderModal
      isOpen={isAddOrderModalOpen}
      onClose={() => setIsAddOrderModalOpen(false)}
    />

    <OrdersMoreActionsDrawer
      isOpen={isMoreActionDrawerOpen}
      onClose={() => setIsMoreActionDrawerOpen(false)}
    />

    <ConfirmationModal
      isOpen={!!orderToDelete}
      onClose={() => setOrderToDelete(null)}
      onConfirm={() => {
        console.log(`Deleting order ${orderToDelete}...`);
        setOrderToDelete(null);
      }}
      title="Delete Order"
      message={`Are you sure you want to delete order ${orderToDelete}? This action cannot be undone.`}
      confirmText="Yes, delete order"
      type="danger"
    />
   </div>
  </div>
 );
}
