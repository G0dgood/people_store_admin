"use client";

import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { StatCard } from "../../components/Admin/StatCard";
import Dropdown from "../../components/Form/Dropdown";
import { Pagination } from "../../components/Admin/Pagination";
import Link from "next/link";
import { useState } from "react";
import { AddOrderModal } from "../../components/Admin/AddOrderModal";
import { OrdersMoreActionsDrawer } from "../../components/Admin/OrdersMoreActionsDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import Checkbox from "@/app/components/Checkbox";
import { HiOutlineEye, HiArrowPath } from "react-icons/hi2";
import { Tooltip } from "../../components/Tooltip";


import { useGetOrdersQuery, useGetOrderStatsQuery, useUpdateOrderStatusMutation, useDeleteOrderMutation } from "@/lib/redux/services/orderApi";
import { SVGLoaderFetch, NoRecordFound } from "../../components/Options";
import { toast } from "sonner";
import { formatPrice } from "@/app/utils/formatPrice";
import { StatCardSkeleton } from "@/app/components/Skeleton/StatCardSkeleton";

const statusConfig = {
  Delivered: { color: "text-blue-500", icon: "Delivered" },
  Shipped: { color: "text-gray-500", icon: "Shipped" },
  Pending: { color: "text-orange-400", icon: "Pending" },
  Cancelled: { color: "text-rose-500", icon: "Cancelled" },
  Processing: { color: "text-emerald-500", icon: "arrow-refresh-06" },
  Refunded: { color: "text-brand-gold", icon: "arrow-refresh-06" },
};

export default function OrderListing() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [isMoreActionDrawerOpen, setIsMoreActionDrawerOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: statsResponse, isLoading: isLoadingStats, refetch: refetchStats, isFetching: isFetchingStats } = useGetOrderStatsQuery();
  const { data: ordersResponse, isLoading: isLoadingOrders, refetch: refetchOrders, isFetching: isFetchingOrders } = useGetOrdersQuery({
    page: currentPage,
    limit: rowsPerPage,
    status: activeTab === "All" ? "" : activeTab,
    search: searchQuery
  });

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const orders = ordersResponse?.data.orders || [];
  const stats = statsResponse?.data;
  const pagination = ordersResponse?.data.pagination;

  const toggleAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o._id));
    }
  };

  const toggleOrder = (id: string) => {
    setSelectedOrders(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteOrder(id).unwrap();
      toast.success("Order deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete order");
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedOrders) {
        await deleteOrder(id).unwrap();
      }
      toast.success(`${selectedOrders.length} orders deleted successfully`);
      setSelectedOrders([]);
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast.error("An error occurred during bulk deletion");
    }
  };

 return (
  <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
   {/* Header Area */}
    <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
     <div className="flex gap-3 w-full sm:w-auto">
      <Tooltip text="Refresh Orders & Stats">
        <button
          className="bg-white border border-gray-200 text-gray-500 h-10 px-4 rounded-[6px] flex items-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50 group"
          onClick={() => { refetchStats(); refetchOrders(); }}
          disabled={isLoadingOrders || isFetchingOrders || isFetchingStats}
        >
          <HiArrowPath size={16} className={`${(isFetchingOrders || isFetchingStats) ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-brand-gold'} transition-colors`} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {(isFetchingOrders || isFetchingStats) ? "Refreshing..." : "Refresh"}
          </span>
        </button>
      </Tooltip>
      <Button shape="rounded-sm" variant="outline"
       className="flex-1 sm:flex-initial"
       iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
       onClick={() => setIsMoreActionDrawerOpen(true)}
      >
       More Action
      </Button>
     </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {isLoadingStats ? (
        <>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </>
      ) : (
        <>
          <StatCard title="Total Orders" value={stats?.totalOrders || "0"} trendValue="14.4%" trendIsUp={true} />
          <StatCard title="Total Revenue" value={formatPrice(stats?.totalRevenue || 0)} trendValue="20%" trendIsUp={true} />
          <StatCard title="Pending Orders" value={stats?.pendingOrders || "0"} trendValue="85%" trendIsUp={true} />
          <StatCard title="Completed Orders" value={stats?.completedOrders || "0"} trendValue="5%" trendIsUp={true} />
        </>
      )}
    </div>

    <div className="bg-white border border-[#1C1C1C1A] rounded-[6px] overflow-hidden flex flex-col">
     {/* Filter Controls Row */}
     <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
       <div className="w-full lg:w-64">
        <Dropdown
         options={[
          { value: "All", label: "All Status" },
          { value: "Pending", label: "Pending" },
          { value: "Processing", label: "Processing" },
          { value: "Shipped", label: "Shipped" },
          { value: "Delivered", label: "Delivered" },
          { value: "Cancelled", label: "Cancelled" },
         ]}
         value={activeTab}
         onChange={setActiveTab}
         getOptionDotColor={(opt) => {
          if (opt.value === "Pending") return "#FB923C";
          if (opt.value === "Processing") return "#10B981";
          if (opt.value === "Shipped") return "#6B7280";
          if (opt.value === "Delivered") return "#3B82F6";
          if (opt.value === "Cancelled") return "#F43F5E";
          return undefined;
         }}
        />
       </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
       <Input shape="rounded-sm"
        type="text"
        placeholder="Search order ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        containerClassName="w-full lg:w-80 xl:w-96"
        className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
        suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
       />

       <div className="flex items-center gap-3 w-full sm:w-auto">
        <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

        <div className="flex gap-2 ml-auto sm:ml-0">
         <Button shape="rounded-sm" variant="outline"
          className="!p-2.5 text-gray-400">
          <Icon name="sort" folder="dashboardIcon" size="sm" />
         </Button>
        </div>
       </div>
      </div>
     </div>

     {/* Table Area */}
     <div className="admin-table-container">
      <table>
       <thead>
        <tr>
         <th className="w-12">
          <Checkbox
           checked={selectedOrders.length === orders.length && orders.length > 0}
           onChange={toggleAll}
          />
         </th>
         <th>Order Id</th>
         <th>Customer</th>
         <th >Product</th>
         <th>Date</th>
         <th>Total</th>
         <th>Payment</th>
         <th>Status</th>
         <th className="text-right">Action</th>
        </tr>
       </thead>
       <tbody>
        {isLoadingOrders ? (
          <SVGLoaderFetch colSpan={9} text="Fetching orders..." />
        ) : orders.length === 0 ? (
          <NoRecordFound colSpan={9} text="No orders found." />
        ) : orders.map((order: any, idx: number) => (
         <tr key={order._id} className="group">
          <td>
           <Checkbox
            checked={selectedOrders.includes(order._id)}
            onChange={() => toggleOrder(order._id)}
           />
          </td>
          <td>
           <span className="text-sm font-semibold text-gray-900">{order.orderId}</span>
          </td>
          <td>
           <div className="flex flex-col">
             <span className="text-sm font-bold text-gray-900">{order.customer?.fullName || "Guest"}</span>
             <span className="text-[10px] text-gray-400">{order.customer?.email}</span>
           </div>
          </td>
          <td>
           <div className="flex items-center gap-3 min-w-[200px]">
            <div className="w-10 h-10 rounded-[6px] overflow-hidden border border-gray-50 bg-gray-50 flex-shrink-0">
             <img src={order.items[0]?.product?.productImage || "/dashboardImage/Headphones.png"} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-700 leading-tight">{order.items[0]?.product?.name || "Product"}</span>
              {order.items.length > 1 && <span className="text-[10px] text-brand-gold">+{order.items.length - 1} more items</span>}
            </div>
           </div>
          </td>

          <td className="admin-table-td text-sm font-medium text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
          <td className="admin-table-td text-sm font-bold text-gray-900">{formatPrice(order.totalAmount)}</td>
          <td>
           <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === "Paid" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
            <span className="text-sm font-medium text-gray-700">{order.paymentStatus}</span>
           </div>
          </td>
          <td className="admin-table-td">
           <div className={`flex items-center gap-2 font-bold text-sm ${statusConfig[order.status as keyof typeof statusConfig]?.color || "text-gray-400"}`}>
            <Icon
             name={statusConfig[order.status as keyof typeof statusConfig]?.icon || "Pending"}
             folder="dashboardIcon"
             size="sm"
            />
            {order.status}
           </div>
          </td>
          <td className="text-right">
           <div className="flex justify-end items-center gap-4">
            <Tooltip text="View Details" position="top">
             <Link href={`/admin/orders/${order._id}`}>
              <Button shape="rounded-sm" variant="outline"
               className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all">
               <HiOutlineEye className="text-lg" />
              </Button>
             </Link>
            </Tooltip>
            <Tooltip text="Delete Order" position="top">
              <Button 
                shape="rounded-sm" 
                variant="outline"
                className="!p-1.5 text-rose-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
                onClick={() => {
                  setOrderToDelete(order.orderId);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Icon name="Delete" folder="dashboardIcon" size="sm" />
              </Button>
            </Tooltip>
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
      totalPages={pagination?.totalPages || 1}
      onPageChange={setCurrentPage}
     />

    <OrdersMoreActionsDrawer
     isOpen={isMoreActionDrawerOpen && selectedOrders.length === 0}
     onClose={() => setIsMoreActionDrawerOpen(false)}
     onBulkPrint={() => console.log("Printing labels...")}
    />

    <BulkActionsDrawer
     isOpen={selectedOrders.length > 0}
     onClose={() => setSelectedOrders([])}
     selectedIds={selectedOrders}
     items={orders}
     onClearSelection={() => setSelectedOrders([])}
     title="Orders Selected"
     actions={[
      {
       id: "print",
       title: "Print Selected Labels",
       icon: "cloud_download",
       folder: "icon",
       onClick: () => console.log("Printing selected labels..."),
      },
      {
       id: "delivered",
       title: "Mark as Delivered",
       icon: "verified",
       folder: "icon",
       onClick: () => console.log("Marking orders as delivered..."),
      },
      {
       id: "delete",
       title: "Delete All Selected",
       icon: "Delete",
       folder: "dashboardIcon",
       variant: "danger",
       onClick: () => setIsDeleteModalOpen(true),
      },
     ]}
    />

    <ConfirmationModal
     isOpen={isDeleteModalOpen}
     onClose={() => { setOrderToDelete(null); setIsDeleteModalOpen(false); }}
     onConfirm={orderToDelete ? () => {
       const orderObj = orders.find(o => o.orderId === orderToDelete);
       if (orderObj) handleDeleteOrder(orderObj._id);
       setIsDeleteModalOpen(false);
       setOrderToDelete(null);
     } : handleBulkDelete}
     isLoading={isDeleting}
     title="Delete Order"
     message={orderToDelete ? `Are you sure you want to delete order ${orderToDelete}? This action cannot be undone.` : `Are you sure you want to delete ${selectedOrders.length} selected orders? This action cannot be undone.`}
     confirmText="Yes, delete order"
     type="danger"
    />
   </div>
  </div>
 );
}

