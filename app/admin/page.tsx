"use client";

import React from "react";
import { StatCard } from "../components/Admin/StatCard";
import { Icon } from "../components/Icon";
import { Button } from "../components/Button";
import { TransactionTable } from "../components/Admin/TransactionTable";
import { BestSellingProductTable } from "../components/Admin/BestSellingProductTable";

export default function AdminDashboard() {
 return (
  <div className="flex flex-col gap-6 pb-12">
   {/* Stats Grid */}
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatCard
     title="Total Sales"
     value="$350K"
     trendLabel="Sales"
     trendValue="10.4%"
     trendIsUp={true}
     previousValue="($235)"
    />
    <StatCard
     title="Total Orders"
     value="10.7K"
     trendLabel="order"
     trendValue="14.4%"
     trendIsUp={true}
     previousValue="(7.6k)"
    />
    <StatCard
     title="Pending & Canceled"
     value="509"
     trendLabel="user"
     trendValue="204"
     trendIsUp={true}
     previousLabel="Canceled"
     previousValue="94 (-14.4%)"
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
         <button className="px-5 py-2 rounded-[6px] bg-white text-[11px] font-black shadow-sm text-[#4CAF50]">This week</button>
         <button className="px-5 py-2 rounded-[6px] text-[11px] font-black text-gray-400">Last week</button>
        </div>
        <button className="text-gray-400 p-1 hover:bg-gray-50 rounded-[6px] transition-colors">
         <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
        </button>
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

      <div className="h-64 w-full relative group mt-4">
       {/* Wave Chart mimicking the screenshot */}
       <svg viewBox="0 0 1000 250" className="w-full h-full overflow-visible">
        <path
         d="M0,180 C100,185 150,170 200,160 S300,180 340,170 450,120 500,110 600,120 700,115 S850,140 950,110 L1000,110 L1000,250 L0,250 Z"
         fill="rgba(76, 175, 80, 0.05)"
        />
        <path
         d="M0,180 C100,185 150,170 200,160 S300,180 340,170 450,120 500,110 600,120 700,115 S850,140 950,110 L1000,110"
         fill="none"
         stroke="#4CAF50"
         strokeWidth="3"
        />
        {/* Tooltip on Wednesday (approximately index 3 - 340px) */}
        <g transform="translate(340, 115)">
         <rect x="-40" y="-45" width="80" height="42" rx="12" fill="#BAEDB6" />
         <text x="0" y="-28" textAnchor="middle" fill="#1D3557" className="text-[10px] font-black">Thursday</text>
         <text x="0" y="-14" textAnchor="middle" fill="#1D3557" className="text-[10px] font-black">14k</text>
         <circle cx="0" cy="55" r="5" fill="#4CAF50" stroke="white" strokeWidth="2" />
         <line x1="0" y1="5" x2="0" y2="48" stroke="#4CAF50" strokeDasharray="4 4" />
        </g>
       </svg>
       <div className="absolute left-0 bottom-0 top-0 flex flex-col justify-between text-[11px] font-bold text-gray-500 py-1 h-full pointer-events-none">
        <span>50k</span><span>40k</span><span>30k</span><span>20k</span><span>10k</span><span>0k</span>
       </div>
       <div className="absolute left-8 right-0 bottom-[-24px] flex justify-between text-[11px] font-black text-gray-500 px-2">
        <span>Sun</span><span>Mon</span><span>Tue</span><span className="text-[#1D3557]">Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
       </div>
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
       <button className="text-gray-400 p-1 hover:bg-gray-50 rounded-[6px] transition-colors">
        <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
       </button>
      </div>

      <div className="flex items-end gap-1.5 h-16 pt-2">
       {[40, 60, 45, 80, 50, 95, 60, 40, 30, 70, 50, 65, 40, 30, 85, 55, 75, 50, 90, 60, 95, 45, 70].map((h, i) => (
        <div key={i} className="flex-1 bg-[#4CAF50] hover:bg-brand-blue transition-all rounded-[2px]" style={{ height: `${h}%` }}></div>
       ))}
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
          <div className={`flex items-center text-[10px] font-black ${c.isUp ? 'text-[#4CAF50]' : 'text-red-500'}`}>
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

      <Button className="w-full text-[11px] font-black uppercase tracking-widest border border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white h-12 rounded-[6px] transition-all mt-4">
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
        { name: "Apple iPhone 13", itemCode: "FXZ-4567", price: "₦999.00", image: "/dashboardImage/Frame 4259.png" },
        { name: "Nike Air Jordan", itemCode: "FXZ-4567", price: "₦72.40", image: "/dashboardImage/Frame 4259 copy.png" },
        { name: "T-shirt", itemCode: "FXZ-4567", price: "₦35.40", image: "/dashboardImage/Frame 4259 copy 2.png" },
        { name: "Assorted Cross Bag", itemCode: "FXZ-4567", price: "₦80.00", image: "/dashboardImage/Frame 4259 copy 3.png" },
       ].map((p, i) => (
        <div key={i} className="flex items-center justify-between group cursor-pointer">
         <div className="flex items-center gap-4">
          <img src={p.image} className="w-12 h-12 rounded-[6px] object-contain bg-gray-50 border border-gray-100 p-1" />
          <div className="flex flex-col">
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
        { name: "Electronic", image: "/dashboardImage/Frame 4259 copy 4.png" },
        { name: "Fashion", image: "/dashboardImage/Frame 51.png" },
        { name: "Home", image: "/dashboardImage/Frame 48.png" },
       ].map((cat, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-[6px] border border-gray-50 hover:border-brand-blue/30 hover:bg-gray-50/30 transition-all cursor-pointer group">
         <div className="flex items-center gap-4">
          <img src={cat.image} className="w-11 h-11 rounded-[6px] object-contain bg-gray-50 p-1" />
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
        { name: "Smart Fitness Tracker", price: "₦39.99", image: "/dashboardImage/Frame 4259 copy 5.png" },
        { name: "Leather Wallet", price: "₦19.99", image: "/dashboardImage/Frame 51 copy.png" },
        { name: "Electric Hair Trimmer", price: "₦34.99", image: "/dashboardImage/Frame 51.png" },
       ].map((p, i) => (
        <div key={i} className="flex items-center justify-between">
         <div className="flex items-center gap-4">
          <img src={p.image} className="w-11 h-11 rounded-[6px] object-contain bg-gray-50 border border-gray-100 p-1 shadow-sm" />
          <div className="flex flex-col">
           <span className="text-[11px] font-black text-[#1D3557] leading-tight">{p.name}</span>
           <span className="text-[11px] font-black text-[#4CAF50] mt-1">{p.price}</span>
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
