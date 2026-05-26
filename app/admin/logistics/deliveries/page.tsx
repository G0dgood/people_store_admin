"use client";

import React, { useState, useEffect } from "react";
import { useGetOrdersQuery, useUpdateOrderStatusMutation, useAssignDriverToOrderMutation } from "@/lib/redux/services/orderApi";
import { useGetAllDriversQuery } from "@/lib/redux/services/driverApi";
import { TabFilter } from "../../../components/Admin/TabFilter";
import { Pagination } from "../../../components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { Input } from "../../../components/Form/Inputs";
import { Icon } from "../../../components/Icon";
import { StatusBadge } from "../../../components/StatusBadge";
import { Avatar } from "../../../components/Other/Avatar";
import { AssignDriverDrawer } from "../../../components/Admin/AssignDriverDrawer";
import { DeliveryDetailDrawer } from "../../../components/Admin/DeliveryDetailDrawer";
import { SVGLoaderFetch, NoRecordFound } from "@/app/components/Options";
import { formatPrice } from "@/app/utils/formatPrice";
import { Tooltip } from "@/app/components/Tooltip";
import { toast } from "sonner";
import moment from "moment";
import { motion } from "framer-motion";
import { FiTruck, FiPackage, FiCheckCircle, FiClock, FiUserPlus, FiChevronRight, FiEye } from "react-icons/fi";
import { HiArrowPath } from "react-icons/hi2";
import { useSocket } from "@/app/context/SocketContext";

export default function DeliveriesManagement() {
 const [activeTab, setActiveTab] = useState("All Deliveries");
 const [searchQuery, setSearchQuery] = useState("");
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [currentPage, setCurrentPage] = useState(1);

 // Modals & Drawers state
 const [selectedOrder, setSelectedOrder] = useState<any>(null);
 const [isDetailOpen, setIsDetailOpen] = useState(false);
 const [isAssignOpen, setIsAssignOpen] = useState(false);

 const { socket } = useSocket();

 // Fetch Drivers and Orders
 const { data: driversResponse } = useGetAllDriversQuery({ limit: 100 });
 const liveDrivers = driversResponse?.data?.drivers || [];

 // Determine the status filter based on the active tab
 let statusFilter = "";
 if (activeTab === "Pending Dispatch") {
  statusFilter = "Processing"; 
 } else if (activeTab === "In Transit") {
  statusFilter = "Shipped";
 } else if (activeTab === "Delivered") {
  statusFilter = "Delivered";
 }

 const {
  data: ordersResponse,
  isLoading: isLoadingOrders,
  refetch: refetchOrders,
  isFetching: isFetchingOrders,
 } = useGetOrdersQuery({
  page: currentPage,
  limit: rowsPerPage,
  status: statusFilter,
  search: searchQuery,
 });

 const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
 const [assignDriverToOrder, { isLoading: isAssigningDriver }] = useAssignDriverToOrderMutation();

 const orders = ordersResponse?.data?.orders || [];
 const pagination = ordersResponse?.data?.pagination || { totalPages: 1, total: 0 };

 const displayOrders = orders.filter((o) => {
  return true;
 });

 // Handle Driver Assignment
 const handleAssignDriver = async (orderId: string, driver: any) => {
  try {
   await assignDriverToOrder({ id: orderId, driverId: driver._id }).unwrap();

   // Find the current order details to send via socket
   const order = orders.find((o) => o._id === orderId);
   if (socket && order) {
    socket.emit("assign_delivery", {
     driverEmail: driver.email,
     orderId: order._id,
     orderDetails: {
      refId: order.orderId || order._id,
      customer: order.customer?.fullName || "Guest",
      pickup: "People Store Warehouse, Lagos",
      delivery: order.shippingAddress || "Lagos, Nigeria",
      sending: order.items?.map((item: any) => `${item.product?.name || 'Item'} x${item.quantity}`).join(", ") || "Package Items",
      phone: order.customer?.phoneNumber || "+2348012345678"
     }
    });
   }

   toast.success(`Courier ${driver.fullName} assigned to order`);
  } catch (err: any) {
   toast.error(err?.data?.message || "Failed to assign driver");
  }
 };

 // Handle Status updates
 const handleUpdateStatus = async (orderId: string, newStatus: string) => {
  try {
   await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
   toast.success(`Order status updated to ${newStatus}`);
  } catch (err: any) {
   toast.error(err?.data?.message || "Failed to update status");
  }
 };

 // Helper to resolve assigned driver
 const getAssignedDriver = (order: any) => {
  if (!order?.driver || typeof order.driver === "string") return null;
  const live = liveDrivers.find((d) => d._id === order.driver._id);
  return live ? { ...order.driver, ...live } : order.driver;
 };

 // Logistics metrics (calculated from local storage and api stats if available, or just mock stats to ensure premium look)
 // Let's compute them dynamically where possible.
 const stats = [
  {
   label: "Total Deliveries",
   value: pagination.total || 0,
   icon: <FiTruck size={20} />,
   gradient: "from-blue-500 to-indigo-600",
   bg: "bg-blue-50",
   color: "text-blue-600",
  },
  {
   label: "Pending Dispatch",
   value: orders.filter((o) => o.status === "Pending" || o.status === "Processing").length || 0,
   icon: <FiPackage size={20} />,
   gradient: "from-amber-400 to-orange-500",
   bg: "bg-amber-50",
   color: "text-amber-600",
  },
  {
   label: "In Transit",
   value: orders.filter((o) => o.status === "Shipped").length || 0,
   icon: <FiClock size={20} />,
   gradient: "from-indigo-500 to-purple-600",
   bg: "bg-indigo-50",
   color: "text-indigo-600",
  },
  {
   label: "Delivered",
   value: orders.filter((o) => o.status === "Delivered").length || 0,
   icon: <FiCheckCircle size={20} />,
   gradient: "from-emerald-400 to-teal-500",
   bg: "bg-emerald-50",
   color: "text-emerald-600",
  },
 ];

 return (
  <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-12">
   {/* Header Area */}
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div className="flex flex-col gap-1">
     <h1 className="text-2xl font-black text-[#121212] tracking-tight">Logistics & Shipments</h1>
     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
      Dispatch Management, Courier Assignment & Active GPS Tracking
     </p>
    </div>
    <div className="flex gap-3">
     <Tooltip text="Refresh Deliveries">
      <button
       className="bg-white border border-gray-200 text-gray-500 h-10 px-4 rounded-[6px] flex items-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50 group shadow-sm"
       onClick={() => refetchOrders()}
       disabled={isLoadingOrders || isFetchingOrders}
      >
       <HiArrowPath
        size={16}
        className={`${isFetchingOrders ? "animate-spin text-brand-gold" : "text-gray-400 group-hover:text-brand-gold"} transition-colors`}
       />
       <span className="text-[10px] font-black uppercase tracking-widest">
        {isFetchingOrders ? "Refreshing..." : "Refresh"}
       </span>
      </button>
     </Tooltip>
    </div>
   </div>

   {/* KPI Cards */}
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((stat, i) => (
     <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08 }}
      key={stat.label}
      className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group flex justify-between items-center relative overflow-hidden"
     >
      <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500" />
      <div className="flex flex-col gap-1 relative z-10">
       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        {stat.label}
       </span>
       <span className="text-2xl font-black text-[#121212]">{stat.value}</span>
      </div>
      <div
       className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform`}
      >
       {stat.icon}
      </div>
     </motion.div>
    ))}
   </div>

   {/* Filter and Table Container */}
   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
    {/* Table Filters */}
    <div className="p-5 flex flex-col xl:flex-row gap-4 items-center justify-between border-b border-gray-50 bg-gray-50/20">
     <TabFilter
      tabs={["All Deliveries", "Pending Dispatch", "In Transit", "Delivered"]}
      activeTab={activeTab}
      onChange={(tab) => {
       setActiveTab(tab);
       setCurrentPage(1);
      }}
      id="deliveries-filter"
     />

     <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
      {/* Search Input */}
      <Input
       shape="rounded-sm"
       type="text"
       placeholder="Search by Order ID..."
       value={searchQuery}
       onChange={(e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
       }}
       containerClassName="flex-1 xl:w-80"
       className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium focus:ring-brand-gold/20 focus:border-brand-gold"
       suffixElement={
        <Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />
       }
      />
      {/* Rows Per Page */}
      <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
     </div>
    </div>

    {/* Table Content */}
    <div className="overflow-x-auto min-h-[400px]">
     {isLoadingOrders ? (
      <div className="flex flex-col items-center justify-center h-96">
       <SVGLoaderFetch asTable={false} text="Loading deliveries..." />
      </div>
     ) : displayOrders.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-96">
       <NoRecordFound asTable={false} text="No deliveries found" />
      </div>
     ) : (
      <table className="w-full text-left border-collapse">
       <thead>
        <tr className="border-b border-gray-100 bg-neutral-50/50">
         <th>Order ID</th>
         <th>Customer & Destination</th>
         <th>Date Ordered</th>
         <th> Courier / Driver</th>
         <th> Value</th>
         <th>Delivery Status</th>
         <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
          Actions
         </th>
        </tr>
       </thead>
       <tbody className="divide-y divide-gray-50">
        {displayOrders.map((order) => {
         const driver = getAssignedDriver(order);
         const isAvailableForAssign =
          order.status !== "Cancelled" && order.status !== "Delivered";

         return (
          <tr
           key={order._id}
           className="hover:bg-neutral-50/40 transition-colors group"
          >
           {/* Order ID */}
           <td className="p-4">
            <button
             onClick={() => {
              setSelectedOrder(order);
              setIsDetailOpen(true);
             }}
             className="text-xs font-black text-[#121212] hover:text-brand-gold transition-colors flex items-center gap-1.5"
            >
             {order.orderId || order._id}
             <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold" />
            </button>
           </td>

           {/* Customer & Destination */}
           <td className="p-4">
            <div className="flex flex-col gap-0.5 max-w-[200px]">
             <span className="text-xs font-bold text-[#121212]">
              {order.customer?.fullName || "Guest"}
             </span>
             <span className="text-[10px] text-gray-400 truncate font-medium">
              {order.shippingAddress || "In Store Pickup"}
             </span>
            </div>
           </td>

           {/* Date Ordered */}
           <td className="p-4 text-xs font-bold text-gray-500">
            {moment(order.createdAt).format("MMM DD, YYYY")}
            <span className="block text-[9px] text-gray-400 font-medium">
             {moment(order.createdAt).fromNow()}
            </span>
           </td>

           {/* Courier / Driver */}
           <td className="p-4">
            {driver ? (
             <div className="flex items-center gap-2">
              <Avatar
               src={
                driver.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                 driver.fullName
                )}&background=C5A028&color=fff`
               }
               name={driver.fullName}
               size="sm"
              />
              <div className="flex flex-col">
               <span className="text-xs font-bold text-[#121212]">
                {driver.fullName}
               </span>
               <span className="text-[9px] text-gray-400 font-medium">
                {driver.vehicleType}
               </span>
              </div>
             </div>
            ) : isAvailableForAssign ? (
             <button
              onClick={() => {
               setSelectedOrder(order);
               setIsAssignOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-white border border-brand-gold/30 hover:bg-brand-gold/5 text-brand-gold rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-all"
             >
              <FiUserPlus size={10} />
              Assign Driver
             </button>
            ) : (
             <span className="text-[10px] text-gray-400 italic font-bold">—</span>
            )}
           </td>

           {/* Value */}
           <td className="p-4 text-xs font-black text-[#121212]">
            {formatPrice(order.totalAmount)}
           </td>

           {/* Delivery Status */}
           <td className="p-4">
            <StatusBadge module="order" value={order.status} />
           </td>

           {/* Actions */}
           <td className="p-4">
            <div className="flex justify-center items-center gap-2">
             <Tooltip text="View Shipment details">
              <button
               onClick={() => {
                setSelectedOrder(order);
                setIsDetailOpen(true);
               }}
               className="p-1.5 border border-gray-100 rounded bg-white hover:border-brand-gold/30 hover:text-brand-gold text-gray-400 transition-colors"
              >
               <FiEye size={14} />
              </button>
             </Tooltip>

             {isAvailableForAssign && (
              <>
               <Tooltip text="Reassign Courier">
                <button
                 onClick={() => {
                  setSelectedOrder(order);
                  setIsAssignOpen(true);
                 }}
                 className="p-1.5 border border-gray-100 rounded bg-white hover:border-brand-gold/30 hover:text-brand-gold text-gray-400 transition-colors"
                >
                 <FiUserPlus size={14} />
                </button>
               </Tooltip>

               {order.status === "Processing" && (
                <Tooltip text="Mark as Shipped (In Transit)">
                 <button
                  onClick={() => handleUpdateStatus(order._id, "Shipped")}
                  className="px-2 py-1 text-[9px] font-black uppercase tracking-widest border border-blue-200 bg-blue-50/50 text-blue-600 hover:bg-blue-50 rounded transition-all"
                 >
                  Ship
                 </button>
                </Tooltip>
               )}

               {order.status === "Shipped" && (
                <Tooltip text="Mark as Delivered (Completed)">
                 <button
                  onClick={() => handleUpdateStatus(order._id, "Delivered")}
                  className="px-2 py-1 text-[9px] font-black uppercase tracking-widest border border-emerald-200 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                 >
                  Deliver
                 </button>
                </Tooltip>
               )}
              </>
             )}
            </div>
           </td>
          </tr>
         );
        })}
       </tbody>
      </table>
     )}
    </div>

    {/* Pagination Control */}
    <div className="p-4 border-t border-gray-50 flex items-center justify-end flex-wrap gap-4">
     <Pagination
      currentPage={currentPage}
      totalPages={pagination.totalPages}
      onPageChange={setCurrentPage}
     />
    </div>
   </div>

   {/* Drawers */}
   {selectedOrder && (
    <>
     <AssignDriverDrawer
      isOpen={isAssignOpen}
      onClose={() => {
       setIsAssignOpen(false);
       setSelectedOrder(null);
      }}
      onAssign={(driver) => handleAssignDriver(selectedOrder._id, driver)}
      currentlyAssignedId={selectedOrder?.driver?._id || selectedOrder?.driver}
     />

     <DeliveryDetailDrawer
      isOpen={isDetailOpen}
      onClose={() => {
       setIsDetailOpen(false);
       setSelectedOrder(null);
      }}
      order={selectedOrder}
      assignedDriver={getAssignedDriver(selectedOrder)}
     />
    </>
   )}
  </div>
 );
}
