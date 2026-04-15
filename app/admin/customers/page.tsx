"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { Input } from "../../components/Form/Inputs";
import { motion, AnimatePresence } from "framer-motion";
import { CustomerSideCard } from "../../components/Admin/CustomerSideCard";
import { ConfirmationModal } from "../../components/Admin/ConfirmationModal";
import { CustomerMessageDrawer } from "../../components/Admin/CustomerMessageDrawer";
import { AdminChart } from "../../components/Admin/AdminChart";

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
  Active: "text-blue-500",
  Inactive: "text-rose-500",
  VIP: "text-amber-500",
};

const statusDots = {
  Active: "bg-blue-500",
  Inactive: "bg-rose-500",
  VIP: "bg-amber-500",
};

export default function CustomersListing() {
  const [chartTab, setChartTab] = useState("This week");
  const [activeTab, setActiveTab] = useState("All customer (240)");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerToDelete, setCustomerToDelete] = useState<any>(null);
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [customerToMessage, setCustomerToMessage] = useState<any>(null);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12 overflow-hidden">
      {/* Top Section: Sidebar Stats & Overview Chart */}
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="flex flex-col gap-3 w-full xl:w-[280px]">
          <StatCard title="Total Customers" value="11,040" trendValue="14.4%" trendIsUp={true} />
          <StatCard title="New Customers" value="2,370" trendValue="20%" trendIsUp={true} />
          <StatCard title="Visitor" value="250k" trendValue="20%" trendIsUp={true} />
        </div>

        <div className="flex-1 bg-white rounded-[6px] border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#1D3557]">Customer Overview</h3>
            <div className="flex gap-2">
              <TabFilter
                tabs={["This week", "Last week"]}
                activeTab={chartTab}
                onChange={setChartTab}
              />
              <Input
                type="text"
                placeholder="Search customer..."
                containerClassName="flex-1 lg:w-96"
                className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
                suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
              />
              <button className="p-1.5 text-gray-300 hover:text-gray-600 transition-colors">
                <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start border-b border-gray-50 pb-4">
            <div className="flex flex-col gap-1 border-r border-gray-100 pr-4">
              <span className="text-2xl font-bold text-[#1D3557]">25k</span>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Active Customers</span>
              <div className="h-0.5 bg-blue-500 w-full mt-2 rounded-full"></div>
            </div>
            <div className="flex flex-col gap-1 border-r border-gray-100 pr-4">
              <span className="text-2xl font-bold text-[#1D3557]">5.6k</span>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Repeat Customers</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-gray-100 pr-4">
              <span className="text-2xl font-bold text-[#1D3557]">250k</span>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Shop Visitor</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-[#1D3557]">5.5%</span>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Conversion Rate</span>
            </div>
          </div>

          <div className="h-64 w-full mt-2">
            <AdminChart
              type="line"
              data={{
                labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                datasets: [{
                  label: 'Revenue',
                  data: [18, 18.5, 17, 16, 11, 12, 11],
                  borderColor: '#2196F3',
                  borderWidth: 3,
                  fill: true,
                  backgroundColor: 'rgba(33, 150, 243, 0.05)',
                  tension: 0.4,
                  pointRadius: (context: any) => context.dataIndex === 4 ? 6 : 0,
                  pointBackgroundColor: '#2196F3',
                  pointBorderColor: '#fff',
                  pointBorderWidth: 2,
                }]
              }}
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 50,
                    ticks: {
                      stepSize: 10,
                      callback: (value: string | number) => `${value}k`
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start overflow-hidden">
        {/* Table Column */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`bg-white rounded-[6px] border border-gray-100 shadow-sm overflow-hidden flex flex-col ${selectedCustomer ? "flex-1" : "w-full"}`}
        >
          <div className="admin-table-container">
            <table>
              <thead>
                <tr>
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
                    className={`group ${selectedCustomer?.id === customer.id ? "bg-gray-50/40" : ""}`}
                  >
                    <td>
                      <span className="text-sm font-semibold text-gray-900">{customer.id}</span>
                    </td>
                    <td className="whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-700">{customer.name}</span>
                    </td>
                    <td className="text-sm font-medium text-gray-500 whitespace-nowrap">{customer.phone}</td>
                    <td className="text-sm font-bold text-gray-900 text-center">{customer.orderCount}</td>
                    <td className="text-sm font-bold text-gray-900">{customer.totalSpend}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDots[customer.status as keyof typeof statusDots]}`}></span>
                        <span className={`text-sm font-bold ${statusStyles[customer.status as keyof typeof statusStyles]}`}>
                          {customer.status}
                        </span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2 px-2 transition-opacity">
                        <button
                          className="p-1.5 rounded-[6px] text-gray-400 hover:text-brand-blue hover:bg-brand-blue-light transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomerToMessage(customer);
                            setIsMessageDrawerOpen(true);
                          }}
                        >
                          <Icon name="tabler_message" folder="dashboardIcon" size="sm" />
                        </button>
                        <button
                          className="p-1.5 rounded-[6px] text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomerToDelete(customer);
                          }}
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

      <CustomerMessageDrawer
        isOpen={isMessageDrawerOpen}
        onClose={() => setIsMessageDrawerOpen(false)}
        customer={customerToMessage}
      />
    </div>
  );
}
