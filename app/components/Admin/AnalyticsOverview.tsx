"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../Icon";
import { AdminChart } from "./AdminChart";
import { TabFilter } from "./TabFilter";
import { DropdownMenu, DropdownItem } from "../Dropdown/DropdownMenu";
import { HiPrinter, HiPhoto, HiCog6Tooth } from "react-icons/hi2";

import { useGetOrderStatsQuery, useGetRevenueHistoryQuery } from "@/lib/redux/services/orderApi";
import { useGetCustomerStatsQuery } from "@/lib/redux/services/customerApi";
import { useGetProductStatsQuery } from "@/lib/redux/services/productApi";

export const AnalyticsOverview: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chartTab, setChartTab] = useState("This week");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: orderStatsResponse, isLoading: isLoadingOrders } = useGetOrderStatsQuery();
  const { data: customerStatsResponse, isLoading: isLoadingCustomers } = useGetCustomerStatsQuery();
  const { data: productStatsResponse, isLoading: isLoadingProducts } = useGetProductStatsQuery();
  const { data: revenueHistoryResponse } = useGetRevenueHistoryQuery();

  const orderStats = orderStatsResponse?.data;
  const customerStats = customerStatsResponse?.data;
  const productStats = productStatsResponse?.data;
  const revenueHistory = revenueHistoryResponse?.data || [];



  const stats = [
    {
      label: "Customers",
      val: isLoadingCustomers ? "..." : (customerStats?.totalCustomers || 0).toLocaleString()
    },
    {
      label: "Total Products",
      val: isLoadingProducts ? "..." : (productStats?.totalProducts || 0).toLocaleString()
    },
    {
      label: "Stock Products",
      val: isLoadingProducts ? "..." : (productStats?.stockProducts || 0).toLocaleString()
    },
    {
      label: "Out of Stock",
      val: isLoadingProducts ? "..." : (productStats?.outOfStock || 0).toLocaleString()
    },
    {
      label: "Revenue",
      val: isLoadingOrders ? "..." : "₦" + (orderStats?.totalRevenue || 0).toLocaleString()
    },
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h3 className="text-[20px] font-black text-brand-charcoal">Report for this week</h3>
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <TabFilter
            tabs={["This week", "Last week"]}
            activeTab={chartTab}
            onChange={setChartTab} id={""} />
          <div className="relative" ref={dropdownRef}>
            <button
              className={`p-1 rounded-[6px] transition-all ${isDropdownOpen ? "bg-gray-100 text-brand-charcoal shadow-sm" : "text-gray-400 hover:bg-gray-50"}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 z-50">
                <DropdownMenu width={240} className="shadow-2xl border-gray-200">
                  <DropdownItem
                    label="Print Detailed Report"
                    subtext="Generate printer-friendly PDF"
                    icon={<HiPrinter />}
                    onSelect={() => { setIsDropdownOpen(false); }}
                  />
                  <DropdownItem
                    label="Export as Image"
                    subtext="Download chart as PNG"
                    icon={<HiPhoto />}
                    onSelect={() => { setIsDropdownOpen(false); }}
                  />
                  <DropdownItem
                    label="Report Settings"
                    subtext="Adjust data visualization"
                    icon={<HiCog6Tooth />}
                    onSelect={() => { setIsDropdownOpen(false); }}
                  />
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-6 gap-x-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 lg:border-gray-200 lg:border-l lg:pl-4 first:border-l-0 first:pl-0">
            <span className="text-[22px] font-black text-brand-charcoal leading-none">{stat.val}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="h-[300px] w-full mt-4">
        <AdminChart
          type="line"
          data={{
            labels: revenueHistory.slice(-7).map((h: any) => new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' })),
            datasets: [{
              label: 'Daily Revenue',
              data: revenueHistory.slice(-7).map((h: any) => h.revenue / 1000), // Display in 'k'
              borderColor: '#222222',
              borderWidth: 3,
              fill: true,
              backgroundColor: 'rgba(34, 34, 34, 0.05)',
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: '#222222',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
            }]
          }}
          options={{
            scales: {
              y: {
                ticks: {
                  callback: (value: any) => `${value}k`
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};
