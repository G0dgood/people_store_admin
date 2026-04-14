"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Input } from "../../components/Form/Inputs";
import { motion, AnimatePresence } from "framer-motion";

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

export default function CustomersPage() {
  const [chartTab, setChartTab] = useState("This week");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12 overflow-hidden">
      {/* Top Section: Sidebar Stats & Overview Chart */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex flex-col gap-6 w-full xl:w-[320px]">
          <StatCard title="Total Customers" value="11,040" trendValue="14.4%" trendIsUp={true} />
          <StatCard title="New Customers" value="2,370" trendValue="20%" trendIsUp={true} />
          <StatCard title="Visitor" value="250k" trendValue="20%" trendIsUp={true} />
        </div>

        <div className="flex-1 bg-white rounded-[6px] border border-gray-100 shadow-sm p-6 flex flex-col gap-8">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start border-b border-gray-50 pb-6">
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

          <div className="relative h-[200px] w-full mt-2">
            <svg viewBox="0 0 800 200" className="w-full h-full">
              <path
                d="M 0,160 Q 50,160 100,120 T 200,80 T 300,60 T 400,60 T 500,100 T 600,20 T 700,80 T 800,40 V 200 H 0 Z"
                fill="url(#chartGradient)"
                className="opacity-20"
              />
              <path
                d="M 0,160 Q 50,160 100,120 T 200,80 T 300,60 T 400,60 T 500,100 T 600,20 T 700,80 T 800,40"
                fill="none"
                stroke="#2196F3"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line x1="450" y1="180" x2="450" y2="60" stroke="#2196F3" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="450" cy="60" r="4" fill="white" stroke="#2196F3" strokeWidth="2" />

              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2196F3" />
                  <stop offset="100%" stopColor="white" />
                </linearGradient>
              </defs>

              <g className="text-[10px] fill-gray-400 font-medium">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                  <text key={day} x={80 + i * 110} y="195" textAnchor="middle" className={day === "Wed" ? "fill-gray-900 font-bold" : ""}>
                    {day}
                  </text>
                ))}
              </g>
            </svg>

            <div className="absolute top-[20px] left-[52%] -translate-x-1/2 bg-[#BCE4D8] px-3 py-1.5 rounded-[6px] shadow-lg flex flex-col items-center">
              <span className="text-[10px] text-[#1D3557] font-bold">Thursday</span>
              <span className="text-[12px] text-[#1D3557] font-black">25,409</span>
            </div>
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
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-blue-light border-b border-gray-50">
                  <th className="px-6 py-4 text-[11px] font-bold text-[#1D3557] uppercase tracking-wider">Customer Id</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#1D3557] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#1D3557] uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#1D3557] uppercase tracking-wider text-center">Order Count</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#1D3557] uppercase tracking-wider">Total Spend</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#1D3557] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#1D3557] uppercase tracking-wider text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customersData.map((customer, idx) => (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`hover:bg-gray-50/50 transition-all group cursor-pointer ${selectedCustomer?.id === customer.id ? "bg-gray-50/40" : ""}`}
                  >
                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-gray-900">{customer.id}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-700">{customer.name}</span>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-500 whitespace-nowrap">{customer.phone}</td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-900 text-center">{customer.orderCount}</td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-900">{customer.totalSpend}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDots[customer.status as keyof typeof statusDots]}`}></span>
                        <span className={`text-sm font-bold ${statusStyles[customer.status as keyof typeof statusStyles]}`}>
                          {customer.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right pr-6">
                      <div className="flex justify-end gap-2 px-2 transition-opacity">
                        <button className="p-1.5 rounded-[6px] text-gray-400 hover:text-brand-blue hover:bg-brand-blue-light transition-all">
                          <Icon name="tabler_message" folder="dashboardIcon" size="sm" />
                        </button>
                        <button className="p-1.5 rounded-[6px] text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                          <Icon name="Delete" folder="dashboardIcon" size="sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 flex justify-between items-center bg-white border-t border-gray-50">
            <Button
              variant="outline"
              shape="rounded-sm"
              iconLeft={<Icon name="arrow-left" folder="dashboardIcon" size="xs" />}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, "...", 24].map((page, i) => (
                <button
                  key={i}
                  className={`w-9 h-9 rounded-[6px] flex items-center justify-center text-sm font-bold transition-all ${page === 1 ? "bg-brand-blue-light text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              shape="rounded-sm"
              iconRight={<Icon name="arrow-right" folder="dashboardIcon" size="xs" />}
            >
              Next
            </Button>
          </div>
        </motion.div>

        {/* Customer Details Side Card */}
        <AnimatePresence mode="popLayout">
          {selectedCustomer && (
            <motion.div
              key="details-sidebar"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full lg:w-[380px] bg-white rounded-[6px] border border-gray-100 shadow-xl p-6 flex flex-col gap-8 sticky top-6 z-10"
            >
              <div className="flex flex-col items-start gap-4">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-blue-light bg-brand-blue-light">
                      <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#1D3557]">{selectedCustomer.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-400">{selectedCustomer.email}</span>
                        <button className="text-gray-300 hover:text-brand-blue transition-colors">
                          <Icon name="link-external" folder="dashboardIcon" size="sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-[6px] transition-all"
                  >
                    <Icon name="menu-close" folder="dashboardIcon" size="sm" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Customer Info</span>
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-50 rounded-[6px] shadow-sm">
                  <Icon name="ic_round-phone" folder="dashboardIcon" size="sm" className="text-gray-900" />
                  <span className="text-sm font-semibold text-gray-700">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-50 rounded-[6px] shadow-sm">
                  <Icon name="mdi_location (1)" folder="dashboardIcon" size="sm" className="text-gray-900" />
                  <span className="text-sm font-semibold text-gray-700">{selectedCustomer.address}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Social Media</span>
                <div className="flex items-center gap-3">
                  {["facebook", "whatsapp", "x", "linkedin", "instagram"].map((social) => (
                    <button key={social} className="w-9 h-9 rounded-[6px] flex items-center justify-center border border-gray-50 hover:bg-gray-50 hover:border-blue-100 transition-all text-[#1D3557]">
                      <Icon name={social} folder="dashboardIcon" size="sm" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Activity</span>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-baseline p-2.5 bg-gray-50/30 rounded-[6px]">
                    <span className="text-xs font-medium text-gray-400">Registration:</span>
                    <span className="text-xs font-bold text-gray-700">{selectedCustomer.registration}</span>
                  </div>
                  <div className="flex justify-between items-baseline p-2.5 bg-gray-50/30 rounded-[6px]">
                    <span className="text-xs font-medium text-gray-400">Last purchase:</span>
                    <span className="text-xs font-bold text-gray-700">{selectedCustomer.lastPurchase}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-auto">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Order overview</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white border border-gray-50 rounded-[6px] flex flex-col items-center gap-1 shadow-sm">
                    <span className="text-lg font-bold text-[#1D3557]">150</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Total order</span>
                  </div>
                  <div className="p-3 bg-white border border-gray-50 rounded-[6px] flex flex-col items-center gap-1 shadow-sm border-brand-blue-light">
                    <span className="text-lg font-bold text-blue-500">140</span>
                    <span className="text-[9px] font-bold text-blue-500/60 uppercase text-center">Completed</span>
                  </div>
                  <div className="p-3 bg-white border border-gray-50 rounded-[6px] flex flex-col items-center gap-1 shadow-sm border-rose-50">
                    <span className="text-lg font-bold text-rose-500">10</span>
                    <span className="text-[9px] font-bold text-rose-500/60 uppercase">Canceled</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
