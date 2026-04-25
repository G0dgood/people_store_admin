"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { Input } from "../../components/Form/Inputs";
import { motion, AnimatePresence } from "framer-motion";
import { CustomerSideCard } from "../../components/Admin/CustomerSideCard";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { HiUser } from "react-icons/hi2";
import { CustomerMessageDrawer } from "../../components/Admin/CustomerMessageDrawer";
import { AdminChart } from "../../components/Admin/AdminChart";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { Button } from "../../components/Button";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import { CustomerMetrics, MetricType } from "../../components/Admin/CustomerMetrics";
import { useGetAllCustomersQuery, useDeleteCustomerMutation } from "@/lib/redux/services/customerApi";
import { toast } from "sonner";

export default function CustomersListing() {
  const { data: customersResponse, isLoading: isFetching } = useGetAllCustomersQuery(undefined);
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  const customersData = customersResponse?.data || [];

  const [activeMetric, setActiveMetric] = useState<MetricType>("active");
  const [chartTab, setChartTab] = useState("This week");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("All customer");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerToDelete, setCustomerToDelete] = useState<any>(null);
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [customerToMessage, setCustomerToMessage] = useState<any>(null);

  const handleDelete = async () => {
    if (!customerToDelete) return;
    try {
      await deleteCustomer(customerToDelete._id).unwrap();
      toast.success("Customer Deleted", {
        description: `${customerToDelete.fullName} has been removed successfully.`
      });
      setCustomerToDelete(null);
    } catch (err: any) {
      toast.error("Deletion Failed", {
        description: err?.data?.message || "Could not delete customer."
      });
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === customersData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(customersData.map((c: any) => c._id));
    }
  };

 const toggleItem = (id: string) => {
  setSelectedIds(prev =>
   prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
  );
 };

 const chartDataMap: Record<MetricType, number[]> = {
  active: [18, 18.5, 17, 16, 11, 12, 11],
  repeat: [5.2, 6.8, 8.5, 7.2, 5.6, 9.1, 10.4],
  visitor: [120, 150, 180, 250, 210, 230, 250],
  conversion: [2.5, 3.8, 4.2, 5.5, 4.8, 5.2, 5.8],
 };

 const chartLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
 const currentChartDataset = chartDataMap[activeMetric];

 return (
  <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12 overflow-hidden">
   {/* Top Section: Sidebar Stats & Overview Chart */}
   <div className="flex flex-col xl:flex-row gap-4">
    <div className="flex flex-col gap-3 w-full xl:w-[280px]">
     <StatCard title="Total Customers" value="11,040" trendValue="14.4%" trendIsUp={true} />
     {/* <StatCard title="New Customers" value="2,370" trendValue="20%" trendIsUp={true} /> */}
     <StatCard title="Visitor" value="250k" trendValue="20%" trendIsUp={true} />
    </div>

    <div className="flex-1 bg-white rounded-[6px] border border-[#1C1C1C1A] p-6 flex flex-col gap-5">
     <div className="flex justify-between items-center">
      <h3 className="text-lg font-bold text-brand-charcoal">Customer Overview</h3>
      <div className="flex items-center gap-2">
       <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 border border-gray-200 rounded-[6px] h-10 flex items-center bg-gray-50/30">
        {chartTab}
       </span>
      </div>
     </div>

     <CustomerMetrics
      activeMetric={activeMetric}
      onMetricClick={setActiveMetric}
     />

     <div className="h-64 w-full mt-2">
      <AdminChart
       type="line"
       data={{
        labels: chartLabels,
        datasets: [{
         label: activeMetric.replace(/^\w/, (c) => c.toUpperCase()) + (activeMetric === 'conversion' ? '' : ' Count'),
         data: currentChartDataset,
         borderColor: '#C5A028',
         borderWidth: 3,
         fill: true,
         backgroundColor: 'rgba(197, 160, 40, 0.05)',
         tension: 0.4,
         pointRadius: (context: any) => context.dataIndex === 4 ? 6 : 0,
         pointBackgroundColor: '#C5A028',
         pointBorderColor: '#fff',
         pointBorderWidth: 2,
        }]
       }}
       options={{
        scales: {
         y: {
          min: 0,
          max: activeMetric === 'visitor' ? 300 : activeMetric === 'conversion' ? 10 : 50,
          ticks: {
           stepSize: activeMetric === 'visitor' ? 50 : activeMetric === 'conversion' ? 2 : 10,
           callback: (value: string | number) => activeMetric === 'conversion' ? `${value}%` : (activeMetric === 'visitor' ? `${value}k` : `${value}k`)
          }
         }
        }
       }}
      />
     </div>
    </div>
   </div>

   <div className="flex flex-col lg:flex-row gap-6 items-start overflow-hidden border border-[#1C1C1C1A] rounded-[6px]">
    {/* Table Column */}
    <motion.div
     layout
     transition={{ type: "spring", stiffness: 300, damping: 30 }}
     className={`bg-white   overflow-hidden flex flex-col ${selectedCustomer ? "flex-1" : "w-full"}`}
    >
     <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className=" w-full flex flex-col md:flex-row justify-between items-center gap-2">
       <TabFilter
        tabs={["This week", "Last week"]}
        activeTab={chartTab}
        onChange={setChartTab} id={""} />

       <div className="flex items-center gap-2">
        <Input shape="rounded-sm" 
         type="text"
         placeholder="Search customer..."
         containerClassName="flex-1 lg:w-72"
         className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
         suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
        />
        <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
        <Button shape="rounded-sm" variant="outline"
         className="!p-1.5 text-gray-300">
         <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
        </Button>
       </div>
      </div>
     </div>
     <div className="admin-table-container ">
      <table>
       <thead>
        <tr>
         <th className="w-10 pl-6">
          <Checkbox
           checked={selectedIds.length === customersData.length && customersData.length > 0}
           onChange={toggleAll}
          />
         </th>
         <th>Customer Id</th>
         <th>Customer</th>
         <th>Phone</th>
         <th className="text-center">Order Count</th>
         <th>Total Spend</th>
         <th>Status</th>
          <th className="text-right">Action</th>
        </tr>
       </thead>
       <tbody>
        {customersData.map((customer: any, idx: number) => (
         <tr
          key={customer._id}
          onClick={() => setSelectedCustomer(customer)}
          className={`group cursor-pointer ${selectedCustomer?._id === customer._id ? "bg-gray-50/40" : ""}`}
         >
          <td className="w-10 pl-6" onClick={(e) => e.stopPropagation()}>
           <Checkbox
            checked={selectedIds.includes(customer._id)}
            onChange={() => toggleItem(customer._id)}
           />
          </td>
          <td>
           <span className="text-sm font-semibold text-gray-900">#{customer._id.slice(-6).toUpperCase()}</span>
          </td>
          <td className="whitespace-nowrap">
           <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
             {customer.avatar ? (
              <img src={customer.avatar} alt={customer.fullName} className="w-full h-full object-cover" />
             ) : (
              <HiUser className="text-gray-300 w-6 h-6" />
             )}
            </div>
            <div className="flex flex-col">
             <span className="text-sm font-black text-brand-charcoal">{customer.fullName}</span>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{customer.email}</span>
            </div>
           </div>
          </td>
          <td>{customer.phoneNumber || "N/A"}</td>
          <td>{customer.orderCount || 0}</td>
          <td>{customer.totalSpend || "0.00"}</td>
          <td>
           <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full bg-brand-gold`}></span>
            <span className={`text-sm font-bold text-brand-gold`}>
             Active
            </span>
           </div>
          </td>
          <td className="text-right">
           <div className="flex justify-end gap-2 px-2">
            <Button shape="rounded-sm" variant="outline"
             className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
             onClick={(e) => {
              e.stopPropagation();
              setCustomerToMessage(customer);
              setIsMessageDrawerOpen(true);
             }}
            >
             <Icon name="tabler_message" folder="dashboardIcon" size="sm" />
            </Button>
            <Button shape="rounded-sm" variant="outline"
             className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
             onClick={(e) => {
              e.stopPropagation();
              setCustomerToDelete(customer);
             }}
            >
             <Icon name="Delete" folder="dashboardIcon" size="sm" />
            </Button>
           </div>
          </td>
         </tr>
        ))}
       </tbody>
      </table>
     </div>

     <Pagination
      currentPage={currentPage}
      totalPages={1}
      onPageChange={setCurrentPage}
     />
    </motion.div>

    {/* Customer Details Side Card */}
    <AnimatePresence mode="popLayout">
     {selectedCustomer && (
      <CustomerSideCard
       customer={selectedCustomer}
       onClose={() => setSelectedCustomer(null)}
      />
     )}
    </AnimatePresence>
   </div>

   <ConfirmationModal
    isOpen={!!customerToDelete}
    onClose={() => setCustomerToDelete(null)}
    onConfirm={handleDelete}
    isLoading={isDeleting}
    title="Delete Customer"
    message={`Are you sure you want to delete ${customerToDelete?.fullName}? This will remove all their data from the platform permanently.`}
    confirmText="Yes, delete customer"
    type="danger"
   />

   <BulkActionsDrawer
    isOpen={selectedIds.length > 0}
    onClose={() => setSelectedIds([])}
    selectedIds={selectedIds}
    items={customersData}
    onClearSelection={() => setSelectedIds([])}
    title="Customers Selected"
    actions={[
     {
      id: "message",
      title: "Message Selected",
      icon: "tabler_message",
      folder: "dashboardIcon",
      onClick: () => {
       console.log("Messaging selected customers...");
       setIsMessageDrawerOpen(true);
      },
     },
     {
      id: "delete",
      title: "Delete All Selected",
      icon: "Delete",
      folder: "dashboardIcon",
      variant: "danger",
      onClick: () => {
        console.log("Bulk deleting customers:", selectedIds);
        toast.info("Bulk delete coming soon", {
          description: "We are currently orchestrating this high-fidelity feature."
        });
      },
     },
    ]}
   />

   <CustomerMessageDrawer
    isOpen={isMessageDrawerOpen}
    onClose={() => setIsMessageDrawerOpen(false)}
    customer={customerToMessage}
   />
  </div>
 );
}
