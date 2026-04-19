"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../Icon";
import { AdminChart } from "./AdminChart";
import { TabFilter } from "./TabFilter";
import { DropdownMenu, DropdownItem } from "../Dropdown/DropdownMenu";
import { HiPrinter, HiPhoto, HiCog6Tooth } from "react-icons/hi2";

export const AnalyticsOverview: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chartTab, setChartTab] = useState("This week");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h3 className="text-[20px] font-black text-[#1D3557]">Report for this week</h3>
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <TabFilter
            tabs={["This week", "Last week"]}
            activeTab={chartTab}
            onChange={setChartTab}
          />
          <div className="relative" ref={dropdownRef}>
            <button
              className={`p-1 rounded-[6px] transition-all ${isDropdownOpen ? "bg-brand-blue-light text-brand-blue shadow-sm" : "text-gray-400 hover:bg-gray-50"}`}
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
                    onSelect={() => { console.log("Print"); setIsDropdownOpen(false); }}
                  />
                  <DropdownItem
                    label="Export as Image"
                    subtext="Download chart as PNG"
                    icon={<HiPhoto />}
                    onSelect={() => { console.log("Export Image"); setIsDropdownOpen(false); }}
                  />
                  <DropdownItem
                    label="Report Settings"
                    subtext="Adjust data visualization"
                    icon={<HiCog6Tooth />}
                    onSelect={() => { console.log("Settings"); setIsDropdownOpen(false); }}
                  />
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-6 gap-x-4">
        {[
          { label: "Customers", val: "52k" },
          { label: "Total Products", val: "3.5k" },
          { label: "Stock Products", val: "2.5k" },
          { label: "Out of Stock", val: "0.5k" },
          { label: "Revenue", val: "250k" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 lg:border-gray-200 lg:border-l lg:pl-4 first:border-l-0 first:pl-0">
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
