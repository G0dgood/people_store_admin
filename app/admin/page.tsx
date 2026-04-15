"use client";

import React from "react";
import { StatCard } from "../components/Admin/StatCard";
import { Icon } from "../components/Icon";
import { Button } from "../components/Button";
import { TransactionTable } from "../components/Admin/TransactionTable";
import { BestSellingProductTable } from "../components/Admin/BestSellingProductTable";
import { DashboardInsightsDrawer } from "../components/Admin/DashboardInsightsDrawer";
import { useState } from "react";
import { AdminChart } from "../components/Admin/AdminChart";
import { useRouter } from "next/navigation";
import { MiniChart } from "../components/Admin/MiniChart";
import { DropdownMenu, DropdownItem } from "../components/Dropdown/DropdownMenu";
import { useRef, useEffect } from "react";
import { HiPrinter, HiPhoto, HiCog6Tooth, HiArrowPath, HiPower, HiBell } from "react-icons/hi2";

export default function AdminDashboard() {
  const [activeInsightSection, setActiveInsightSection] = useState<'revenue' | 'funnel' | 'traffic' | null>(null);
  const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);
  const [isRealtimeDropdownOpen, setIsRealtimeDropdownOpen] = useState(false);
  
  const reportDropdownRef = useRef<HTMLDivElement>(null);
  const realtimeDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (reportDropdownRef.current && !reportDropdownRef.current.contains(target)) {
        setIsReportDropdownOpen(false);
      }
      if (realtimeDropdownRef.current && !realtimeDropdownRef.current.contains(target)) {
        setIsRealtimeDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Drawers */}
      <DashboardInsightsDrawer
        isOpen={activeInsightSection !== null}
        onClose={() => setActiveInsightSection(null)}
        activeSection={activeInsightSection}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Sales"
          value="$350K"
          trendLabel="Sales"
          trendValue="10.4%"
          trendIsUp={true}
          previousValue="($235)"
          onViewDetails={() => setActiveInsightSection('revenue')}
        />
        <StatCard
          title="Total Orders"
          value="10.7K"
          trendLabel="order"
          trendValue="14.4%"
          trendIsUp={true}
          previousValue="(7.6k)"
          onViewDetails={() => setActiveInsightSection('funnel')}
        />
        <StatCard
          title="Pending & Canceled"
          value="509"
          trendLabel="user"
          trendValue="204"
          trendIsUp={true}
          previousLabel="Canceled"
          previousValue="94 (-14.4%)"
          onViewDetails={() => setActiveInsightSection('traffic')}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Analytics Overview */}
          <div className="bg-white p-8 rounded-[6px] border border-gray-100 shadow-sm flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <h3 className="text-[20px] font-black text-[#1D3557]">Report for this week</h3>
              <div className="flex items-center gap-4">
                <div className="flex bg-[#F8F9FA] p-1 rounded-[6px] border border-gray-100 scale-90">
                  <button className="px-5 py-2 rounded-[6px] bg-white text-[11px] font-black shadow-sm text-brand-blue">This week</button>
                  <button className="px-5 py-2 rounded-[6px] text-[11px] font-black text-gray-400">Last week</button>
                </div>
                <div className="relative" ref={reportDropdownRef}>
                  <button 
                    className={`p-1 rounded-[6px] transition-all ${isReportDropdownOpen ? "bg-brand-blue-light text-brand-blue shadow-sm" : "text-gray-400 hover:bg-gray-50"}`}
                    onClick={() => setIsReportDropdownOpen(!isReportDropdownOpen)}
                  >
                    <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
                  </button>

                  {isReportDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 z-50">
                      <DropdownMenu width={240} className="shadow-2xl border-gray-100">
                        <DropdownItem 
                          label="Print Detailed Report" 
                          subtext="Generate printer-friendly PDF" 
                          icon={<HiPrinter />} 
                          onSelect={() => { console.log("Print"); setIsReportDropdownOpen(false); }} 
                        />
                        <DropdownItem 
                          label="Export as Image" 
                          subtext="Download chart as PNG" 
                          icon={<HiPhoto />} 
                          onSelect={() => { console.log("Export Image"); setIsReportDropdownOpen(false); }} 
                        />
                        <DropdownItem 
                          label="Report Settings" 
                          subtext="Adjust data visualization" 
                          icon={<HiCog6Tooth />} 
                          onSelect={() => { console.log("Settings"); setIsReportDropdownOpen(false); }} 
                        />
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Customers", val: "52k" },
                { label: "Total Products", val: "3.5k" },
                { label: "Stock Products", val: "2.5k" },
                { label: "Out of Stock", val: "0.5k" },
                { label: "Revenue", val: "250k" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1 border-gray-100 border-l pl-4 first:border-l-0 first:pl-0">
                  <span className="text-[22px] font-black text-[#1D3557] leading-none">{stat.val}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="h-72 w-full mt-4">
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
                    pointRadius: (context: { dataIndex: number; }) => context.dataIndex === 4 ? 6 : 0,
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

          {/* Transaction Table */}
          <TransactionTable />

          {/* Best Selling Product */}
          <BestSellingProductTable />
        </div>

        {/* Sidebar Analytics */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Realtime Users */}
          <div className="bg-white p-8 rounded-[6px] border border-gray-100 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-black text-brand-blue leading-none">Users in last 30 minutes</span>
                <h3 className="text-4xl font-black text-[#1D3557] tracking-tight mt-1">21.5K</h3>
                <p className="text-[11px] font-bold text-gray-500 mt-2">Users per minute</p>
              </div>
              <div className="relative" ref={realtimeDropdownRef}>
                <button 
                  className={`p-1 rounded-[6px] transition-all ${isRealtimeDropdownOpen ? "bg-brand-blue-light text-brand-blue shadow-sm" : "text-gray-400 hover:bg-gray-50"}`}
                  onClick={() => setIsRealtimeDropdownOpen(!isRealtimeDropdownOpen)}
                >
                  <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
                </button>

                {isRealtimeDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 z-50">
                    <DropdownMenu width={220} className="shadow-2xl border-gray-100">
                      <DropdownItem 
                        label="Force Refresh" 
                        subtext="Manual data pull" 
                        icon={<HiArrowPath />} 
                        onSelect={() => { console.log("Refresh"); setIsRealtimeDropdownOpen(false); }} 
                      />
                      <DropdownItem 
                        label="Mute Live Feed" 
                        subtext="Stop realtime updates" 
                        icon={<HiPower />} 
                        onSelect={() => { console.log("Mute"); setIsRealtimeDropdownOpen(false); }} 
                      />
                      <DropdownItem 
                        label="Alert Config" 
                        subtext="Set user spike thresholds" 
                        icon={<HiBell />} 
                        onSelect={() => { console.log("Alerts"); setIsRealtimeDropdownOpen(false); }} 
                      />
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>

            <div className="h-20 w-full mt-2">
              <AdminChart
                type="bar"
                data={{
                  labels: Array(22).fill(''),
                  datasets: [{
                    data: [40, 60, 45, 80, 50, 95, 60, 40, 30, 70, 50, 65, 40, 30, 85, 55, 75, 50, 90, 60, 95, 45, 70],
                    backgroundColor: '#2196F3',
                    borderRadius: 2,
                    hoverBackgroundColor: '#1D3557',
                  }]
                }}
                options={{
                  scales: {
                    x: { display: false },
                    y: { display: false }
                  },
                  plugins: {
                    tooltip: { enabled: false }
                  }
                }}
              />
            </div>

            <div className="flex flex-col gap-6 pt-4 mt-2">
              <div className="flex justify-between items-center px-1">
                <h4 className="text-[13px] font-black text-[#1D3557]">Sales by Country</h4>
                <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest">Sales</span>
              </div>

              {[
                { flag: "🇺🇸", country: "US", val: "30k", perc: 75, trend: "25.8%", isUp: true },
                { flag: "🇧🇷", country: "Brazil", val: "30k", perc: 35, trend: "15.8%", isUp: false },
                { flag: "🇦🇺", country: "Australia", val: "25k", perc: 60, trend: "35.8%", isUp: true },
              ].map((c) => (
                <div key={c.country} className="flex flex-col gap-3">
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl leading-none">{c.flag}</span>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-[#1D3557] leading-none">{c.val}</span>
                        <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-tighter">{c.country}</span>
                      </div>
                    </div>
                    <div className={`flex items-center text-[10px] font-black ${c.isUp ? 'text-brand-blue' : 'text-red-500'}`}>
                      <Icon name={c.isUp ? 'arrow_upward' : 'arrow_downward'} size="xs" className="mr-0.5" />
                      <span>{c.trend}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-[6px] overflow-hidden">
                    <div className="h-full bg-brand-blue rounded-[6px]" style={{ width: `${c.perc}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="w-full text-[11px] font-black uppercase tracking-widest border border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white h-12 rounded-[6px] transition-all mt-4"
              onClick={() => setActiveInsightSection(null)}
            >
              View Insight
            </Button>
          </div>

          {/* Top Products */}
          <div className="bg-white p-8 rounded-[6px] border border-gray-100 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-baseline">
              <h3 className="text-[16px] font-black text-[#1D3557]">Top Products</h3>
              <button className="text-[11px] font-black text-brand-blue uppercase hover:underline">All product</button>
            </div>

            <div className="flex items-center bg-[#F8F9FA] rounded-[6px] px-4 py-3 group focus-within:ring-2 focus-within:ring-brand-blue/10 transition-all border border-transparent focus-within:bg-white focus-within:border-gray-200">
              <Icon name="search-01" folder="dashboardIcon" size="xs" className="text-gray-500 group-focus-within:text-brand-blue" />
              <input type="text" placeholder="Search" className="bg-transparent border-none focus:outline-none text-[12px] font-bold text-[#1D3557] w-full px-3 placeholder:text-gray-500" />
            </div>

            <div className="flex flex-col gap-6">
              {[
                { name: "Apple iPhone 13", itemCode: "FXZ-4567", price: "₦999.00", data: [40, 70, 45, 90, 65, 85, 90] },
                { name: "Nike Air Jordan", itemCode: "FXZ-4567", price: "₦72.40", data: [20, 40, 30, 60, 45, 75, 80] },
                { name: "T-shirt", itemCode: "FXZ-4567", price: "₦35.40", data: [60, 50, 80, 55, 90, 65, 70] },
                { name: "Assorted Cross Bag", itemCode: "FXZ-4567", price: "₦80.00", data: [30, 45, 35, 60, 40, 70, 55] },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-10 shrink-0">
                      <MiniChart type="sparkline" data={p.data} color="#2196F3" height={40} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-black text-[#1D3557] truncate max-w-[120px] group-hover:text-brand-blue transition-colors">{p.name}</span>
                      <span className="text-[10px] font-bold text-gray-500 mt-0.5">Item: #{p.itemCode}</span>
                    </div>
                  </div>
                  <span className="text-[13px] font-black text-[#1D3557]">{p.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Product & Quick List */}
          <div className="bg-white p-8 rounded-[6px] border border-gray-100 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[16px] font-black text-[#1D3557]">Add New Product</h3>
              <button className="text-brand-blue flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                <Icon name="circle-plus" folder="dashboardIcon" size="sm" /> Add New
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1">Categories</p>
              {[
                { name: "Electronic", data: [40, 60, 45, 80, 50, 95, 60] },
                { name: "Fashion", data: [30, 45, 35, 60, 40, 70, 55] },
                { name: "Home", data: [20, 35, 30, 45, 50, 40, 60] },
              ].map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-[6px] border border-gray-50 hover:border-brand-blue/30 hover:bg-gray-50/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-11 h-8 shrink-0">
                      <MiniChart type="bar" data={cat.data} color="#2196F3" height={32} />
                    </div>
                    <span className="text-[13px] font-black text-[#1D3557]">{cat.name}</span>
                  </div>
                  <Icon name="chevron_right" size="xs" className="text-gray-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                </div>
              ))}
              <button className="text-[11px] font-black text-brand-blue/60 uppercase mt-2 self-center hover:text-brand-blue transition-colors">See more</button>
            </div>

            <div className="flex flex-col gap-6 pt-6 border-t border-gray-100 mt-2">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Product</p>
              {[
                { name: "Smart Fitness Tracker", price: "₦39.99", data: [30, 45, 35, 60, 45, 75, 80] },
                { name: "Leather Wallet", price: "₦19.99", data: [20, 30, 40, 35, 50, 45, 60] },
                { name: "Electric Hair Trimmer", price: "₦34.99", data: [40, 55, 45, 80, 60, 90, 85] },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-11 h-8 shrink-0">
                      <MiniChart type="sparkline" data={p.data} color="#2196F3" height={32} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-black text-[#1D3557] leading-tight truncate max-w-[120px]">{p.name}</span>
                      <span className="text-[11px] font-black text-brand-blue mt-1">{p.price}</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-[6px] bg-[#E3F2FD] text-brand-blue text-[10px] font-black uppercase hover:bg-brand-blue hover:text-white transition-all shadow-sm">
                    <Icon name="add" size="xs" /> Add
                  </button>
                </div>
              ))}
              <button className="text-[11px] font-black text-brand-blue/60 uppercase mt-1 self-center hover:text-brand-blue transition-colors">See more</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
