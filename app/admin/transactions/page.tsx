"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";

const transactionsData = [
  { custId: "#CUST001", name: "John Doe", date: "01-01-2025", total: "₦2,904", method: "CC", status: "Complete" },
  { custId: "#CUST001", name: "John Doe", date: "01-01-2025", total: "₦2,904", method: "PayPal", status: "Complete" },
  { custId: "#CUST001", name: "John Doe", date: "01-01-2025", total: "₦2,904", method: "CC", status: "Complete" },
  { custId: "#CUST001", name: "John Doe", date: "01-01-2025", total: "₦2,904", method: "Bank", status: "Complete" },
  { custId: "#CUST001", name: "Jane Smith", date: "01-01-2025", total: "₦2,904", method: "CC", status: "Canceled" },
  { custId: "#CUST001", name: "Emily Davis", date: "01-01-2025", total: "₦2,904", method: "PayPal", status: "Pending" },
  { custId: "#CUST001", name: "Jane Smith", date: "01-01-2025", total: "₦2,904", method: "Bank", status: "Canceled" },
  { custId: "#CUST001", name: "John Doe", date: "01-01-2025", total: "₦2,904", method: "CC", status: "Complete" },
  { custId: "#CUST001", name: "Emily Davis", date: "01-01-2025", total: "₦2,904", method: "PayPal", status: "Pending" },
  { custId: "#CUST001", name: "Jane Smith", date: "01-01-2025", total: "₦2,904", method: "Bank", status: "Canceled" },
];

const statusStyles = {
  Complete: { color: "text-blue-500", bg: "bg-blue-500" },
  Canceled: { color: "text-rose-500", bg: "bg-rose-500" },
  Pending: { color: "text-orange-400", bg: "bg-orange-400" },
};

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("All transactions");

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Page Header */}
      <div className="flex justify-end items-center">
        {/* Placeholder for header buttons if needed, currently empty to match focus of screenshot */}
      </div>

      {/* Top Grid: Stats & Payment Method */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Stats Section (Left 2 columns in a 2x2 grid) */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard 
            title="Total Revenue" 
            value="₦15,045" 
            trendValue="14.4%" 
            trendIsUp={true} 
            periodLabel="Last 7 days"
          />
          <StatCard 
            title="Completed Transactions" 
            value="3,150" 
            trendValue="20%" 
            trendIsUp={true} 
            periodLabel="Last 7 days"
          />
          <StatCard 
            title="Pending Transactions" 
            value="150" 
            trendValue="85%" 
            trendIsUp={true} 
            periodLabel="Last 7 days"
          />
          <StatCard 
            title="Failed Transactions" 
            value="75" 
            trendValue="15%" 
            trendIsUp={false} 
            periodLabel="Last 7 days"
          />
        </div>

        {/* Payment Method Card (Right 2 columns) */}
        <div className="xl:col-span-2 bg-white rounded-[6px] border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#1D3557]">Payment Method</h3>
            <button className="text-gray-300 hover:text-gray-600">
              <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* Visual Card */}
             <div className="relative w-full max-w-[320px] h-[180px] rounded-[16px] overflow-hidden shadow-xl shadow-blue-100 group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2196F3] via-blue-400 to-[#1D3557]"></div>
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('/dashboardImage/image 270.png')] bg-cover"></div>
                
                <div className="relative h-full p-6 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                     <span className="text-xl font-black italic tracking-tighter">Finaci</span>
                     <div className="flex gap-1 items-center">
                        <div className="w-8 h-8 rounded-full bg-white/20"></div>
                        <div className="w-8 h-8 rounded-full bg-white/40 -ml-4"></div>
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                     <p className="text-xs font-medium opacity-70">Card Holder name</p>
                     <p className="text-sm font-bold tracking-widest uppercase">Noman Manzoor</p>
                  </div>

                  <div className="flex justify-between items-end">
                     <div className="flex flex-col gap-1">
                        <p className="text-lg font-bold tracking-[0.2em]">**** **** **** 2345</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] opacity-70">Expiry Date</p>
                        <p className="text-xs font-bold">02/30</p>
                     </div>
                  </div>
                </div>
             </div>

             {/* Metadata Info */}
             <div className="flex-1 flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-3">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">Status:</span>
                      <span className="text-xs font-bold text-blue-500">Active</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">Transactions:</span>
                      <span className="text-xs font-bold text-[#1D3557]">1,250</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">Revenue:</span>
                      <span className="text-xs font-bold text-[#1D3557]">₦50,000</span>
                   </div>
                </div>
                <button className="text-[11px] font-black text-brand-blue uppercase tracking-widest hover:underline text-left mt-2">
                   View Transactions
                </button>
             </div>
          </div>

          <div className="flex gap-3 mt-auto pt-4 border-t border-gray-50">
             <Button 
                variant="secondary" 
                className="flex-1 h-12 rounded-[6px] border-dashed border-gray-200 text-gray-400 hover:text-brand-blue hover:border-brand-blue transition-all"
                iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
             >
                Add Card
             </Button>
             <Button
                variant="rose"
                shape="rounded-sm"
                className="h-12 px-6"
             >
                Deactivate
             </Button>
          </div>
        </div>
      </div>

      {/* Transaction History Card */}
      <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {/* Controls Bar */}
          <div className="p-6 flex flex-col xl:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All transactions", "Completed", "Pending", "Canceled"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input
              type="text"
              placeholder="Search payment history"
              containerClassName="flex-1 xl:w-96"
              className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

              <div className="flex gap-2">
                <Button variant="outline" shape="rounded-sm" className="p-2.5">
                  <Icon name="sort" folder="dashboardIcon" size="sm" />
                </Button>
                <Button variant="outline" shape="rounded-sm" className="p-2.5">
                  <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" />
                </Button>
                <Button variant="outline" shape="rounded-sm" className="p-2.5">
                  <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#E9F4E9]/30 border-b border-gray-50">
                  <th className="px-6 py-5 text-[11px] font-bold text-[#1D3557] uppercase tracking-widest pl-8">Customer Id</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#1D3557] uppercase tracking-widest">Name</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#1D3557] uppercase tracking-widest text-center">Date</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#1D3557] uppercase tracking-widest">Total</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#1D3557] uppercase tracking-widest text-center">Method</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#1D3557] uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#1D3557] uppercase tracking-widest text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactionsData.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-6 py-5 pl-8">
                       <span className="text-xs font-bold text-gray-900">{tx.custId}</span>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-gray-700">{tx.name}</td>
                    <td className="px-6 py-5 text-xs font-bold text-gray-400 text-center">{tx.date}</td>
                    <td className="px-6 py-5 text-xs font-bold text-gray-900">{tx.total}</td>
                    <td className="px-6 py-5 text-xs font-bold text-gray-700 text-center">{tx.method}</td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[tx.status as keyof typeof statusStyles].bg}`}></span>
                          <span className={`text-xs font-bold ${statusStyles[tx.status as keyof typeof statusStyles].color}`}>{tx.status}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right pr-6">
                       <button className="text-[11px] font-black text-brand-blue uppercase hover:underline">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-8 flex justify-between items-center bg-white border-t border-gray-50">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-[6px] border border-gray-100 text-[11px] font-black text-gray-500 hover:bg-gray-50 transition-all group uppercase tracking-widest leading-none">
              <Icon name="material-symbols_arrow-left-alt-rounded" size="xs" className="transition-transform group-hover:-translate-x-1" />
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, "...", 24].map((page, i) => (
                <button
                  key={i}
                  className={`w-9 h-9 rounded-[6px] flex items-center justify-center text-[12px] font-bold transition-all ${
                    page === 1 
                      ? "bg-brand-blue text-white shadow-lg shadow-blue-100" 
                      : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-6 py-2.5 rounded-[6px] border border-gray-100 text-[11px] font-black text-gray-500 hover:bg-gray-50 transition-all group uppercase tracking-widest leading-none">
              Next
              <Icon name="material-symbols_arrow-right-alt-rounded" size="xs" className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
      </div>
    </div>
  );
}
