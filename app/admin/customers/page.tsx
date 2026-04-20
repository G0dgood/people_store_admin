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
import { CustomerMessageDrawer } from "../../components/Admin/CustomerMessageDrawer";
import { AdminChart } from "../../components/Admin/AdminChart";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { Button } from "../../components/Button";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import { CustomerMetrics, MetricType } from "../../components/Admin/CustomerMetrics";

const customersData = [
 {
  id: "#CUST001",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  address: "123 Main St, NY",
  orderCount: 25,
  totalSpend: "3,450.00",
  status: "Active",
  registration: "15.01.2025",
  lastPurchase: "10.01.2025"
 },
 {
  id: "#CUST002",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  phone: "+1234567890",
  address: "456 Oak Ave, CA",
  orderCount: 5,
  totalSpend: "250.00",
  status: "Inactive",
  registration: "12.01.2025",
  lastPurchase: "08.01.2025"
 },
 {
  id: "#CUST003",
  name: "Emily Davis",
  email: "emily.davis@example.com",
  phone: "+1234567890",
  address: "789 Pine Rd, TX",
  orderCount: 30,
  totalSpend: "4,600.00",
  status: "VIP",
  registration: "20.12.2024",
  lastPurchase: "12.01.2025"
 },
 {
  id: "#CUST004",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  address: "123 Main St, NY",
  orderCount: 25,
  totalSpend: "3,450.00",
  status: "Active",
  registration: "15.01.2025",
  lastPurchase: "10.01.2025"
 },
 {
  id: "#CUST005",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  address: "123 Main St, NY",
  orderCount: 25,
  totalSpend: "3,450.00",
  status: "Active",
  registration: "15.01.2025",
  lastPurchase: "10.01.2025"
 },
 {
  id: "#CUST006",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  address: "123 Main St, NY",
  orderCount: 25,
  totalSpend: "3,450.00",
  status: "Active",
  registration: "15.01.2025",
  lastPurchase: "10.01.2025"
 },
 {
  id: "#CUST007",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  address: "123 Main St, NY",
  orderCount: 25,
  totalSpend: "3,450.00",
  status: "Active",
  registration: "15.01.2025",
  lastPurchase: "10.01.2025"
 },
];

const statusStyles = {
 Active: "text-brand-gold",
 Inactive: "text-rose-500",
 VIP: "text-amber-500",
};

const statusDots = {
 Active: "bg-brand-gold",
 Inactive: "bg-rose-500",
 VIP: "bg-amber-500",
};

export default function CustomersListing() {
 const [activeMetric, setActiveMetric] = useState<MetricType>("active");
 const [chartTab, setChartTab] = useState("This week");
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [selectedIds, setSelectedIds] = useState<string[]>([]);
 const [activeTab, setActiveTab] = useState("All customer (240)");
 const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
 const [currentPage, setCurrentPage] = useState(1);
 const [customerToDelete, setCustomerToDelete] = useState<any>(null);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
 const [customerToMessage, setCustomerToMessage] = useState<any>(null);

 const toggleAll = () => {
  if (selectedIds.length === customersData.length) {
   setSelectedIds([]);
  } else {
   setSelectedIds(customersData.map(c => c.id));
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
         <th>Name</th>
         <th>Phone</th>
         <th className="text-center">Order Count</th>
         <th>Total Spend</th>
         <th>Status</th>
         <th className="text-right">Action</th>
        </tr>
       </thead>
       <tbody>
        {customersData.map((customer, idx) => (
         <tr
          key={customer.id}
          onClick={() => setSelectedCustomer(customer)}
          className={`group cursor-pointer ${selectedCustomer?.id === customer.id ? "bg-gray-50/40" : ""}`}
         >
          <td className="w-10 pl-6" onClick={(e) => e.stopPropagation()}>
           <Checkbox
            checked={selectedIds.includes(customer.id)}
            onChange={() => toggleItem(customer.id)}
           />
          </td>
          <td>
           <span className="text-sm font-semibold text-gray-900">{customer.id}</span>
          </td>
          <td className="whitespace-nowrap">
           <span className="text-sm font-semibold text-gray-700">{customer.name}</span>
          </td>
          <td>{customer.phone}</td>
          <td>{customer.orderCount}</td>
          <td>{customer.totalSpend}</td>
          <td>
           <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${statusDots[customer.status as keyof typeof statusDots]}`}></span>
            <span className={`text-sm font-bold ${statusStyles[customer.status as keyof typeof statusStyles]}`}>
             {customer.status}
            </span>
           </div>
          </td>
          <td className="text-right">
           <div className="flex justify-end gap-2 px-2">
            <Button shape="rounded-sm" variant="outline"
             className="!p-1.5 text-gray-400 hover:text-brand-gold hover:bg-gray-50 transition-all"
             onClick={(e) => {
              e.stopPropagation();
              setCustomerToMessage(customer);
              setIsMessageDrawerOpen(true);
             }}
            >
             <Icon name="tabler_message" folder="dashboardIcon" size="sm" />
            </Button>
            <Button shape="rounded-sm" variant="outline"
             className="!p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
             onClick={(e) => {
              e.stopPropagation();
              setCustomerToDelete(customer);
              setIsDeleteModalOpen(true);
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
      totalPages={24}
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
    onConfirm={() => {
     console.log(`Deleting customer ${customerToDelete?.name}...`);
     setCustomerToDelete(null);
    }}
    title="Delete Customer"
    message={`Are you sure you want to delete ${customerToDelete?.name}? This will remove all their data from the platform permanently.`}
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
      onClick: () => setIsDeleteModalOpen(true),
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
