"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";

const couponsData = [
  { id: 1, code: "SUMMER SALE", discount: "15%", type: "Percentage", startDate: "01-06-2025", endDate: "30-08-2025", status: "Active" },
  { id: 2, code: "WELCOME10", discount: "$10.00", type: "Fixed Rate", startDate: "01-01-2025", endDate: "31-12-2025", status: "Active" },
  { id: 3, code: "BLACKFRIDAY", discount: "50%", type: "Percentage", startDate: "24-11-2025", endDate: "27-11-2025", status: "Scheduled" },
  { id: 4, code: "EXPIRED20", discount: "20%", type: "Percentage", startDate: "01-01-2024", endDate: "01-02-2024", status: "Expired" },
  { id: 5, code: "FREESHIP", discount: "Free Shipping", type: "Shipping", startDate: "01-03-2025", endDate: "31-03-2025", status: "Active" },
  { id: 6, code: "FLASH25", discount: "25%", type: "Percentage", startDate: "15-04-2025", endDate: "16-04-2025", status: "Active" },
  { id: 7, code: "STUDENT5", discount: "5%", type: "Percentage", startDate: "01-01-2025", endDate: "31-12-2025", status: "Active" },
  { id: 8, code: "NEWYEAR25", discount: "25%", type: "Percentage", startDate: "01-01-2025", endDate: "31-01-2025", status: "Expired" },
];

const statusConfig = {
  Active: "text-blue-500 bg-brand-blue-light",
  Expired: "text-rose-500 bg-rose-50/50",
  Scheduled: "text-brand-blue bg-brand-blue-light",
};

export default function CouponsListing() {
  const [activeTab, setActiveTab] = useState("All coupons");

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
          <Button
            variant="primary"
            shape="rounded-sm"
            iconLeft={<Icon name="ticket" folder="dashboardIcon" size="sm" />}
          >
            Add Coupon
          </Button>
          <Button
            variant="outline"
            shape="rounded-sm"
            iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
          >
            More Action
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filter Controls Row */}
        <div className="p-6 flex flex-col xl:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All coupons", "Active", "Inactive", "Expired"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="flex-1 xl:w-72 bg-gray-50/80 rounded-[6px] px-4 py-2.5 flex items-center border border-transparent focus-within:bg-white focus-within:border-gray-100 transition-all">
              <input
                type="text"
                placeholder="Search coupon code"
                className="bg-transparent border-none focus:outline-none text-sm text-gray-900 w-full placeholder:text-gray-400 font-medium"
              />
              <Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400 ml-2" />
            </div>

            <div className="flex gap-2">
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="sort" folder="dashboardIcon" size="sm" />
              </button>
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" />
              </button>
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">No.</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Coupon Code</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {couponsData.map((coupon, index) => (
                <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5 text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[4px] bg-brand-blue-light flex items-center justify-center">
                        <Icon name="ticket" folder="dashboardIcon" size="sm" className="text-[#56A881]" />
                      </div>
                      <span className="text-sm font-bold text-[#1D3557] group-hover:text-blue-600 transition-colors">
                        {coupon.code}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-700">{coupon.discount}</td>
                  <td className="px-6 py-5 text-xs font-semibold text-gray-500">{coupon.type}</td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-500">{coupon.startDate}</td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-500">{coupon.endDate}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusConfig[coupon.status as keyof typeof statusConfig]}`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right pr-6">
                    <div className="flex justify-end items-center gap-4 text-gray-400">
                      <button className="hover:text-[#56A881] transition-colors">
                        <Icon name="settings" folder="dashboardIcon" size="sm" />
                      </button>
                      <button className="hover:text-rose-500 transition-colors">
                        <Icon name="Delete" folder="dashboardIcon" size="sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Area */}
        <div className="p-6 flex items-center justify-between border-t border-gray-50">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-[6px] text-xs font-bold text-[#1D3557] hover:bg-gray-50 transition-all shadow-sm group">
            <Icon name="arrow_back" folder="icon" size="xs" className="transition-transform group-hover:-translate-x-0.5" />
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, "...", 24].map((page, i) => (
              <button
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded-[6px] text-xs font-bold transition-all ${
                  page === 1 
                    ? "bg-blue-100 text-blue-600 shadow-sm" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-[6px] text-xs font-bold text-[#1D3557] hover:bg-gray-50 transition-all shadow-sm group">
            Next
            <Icon name="arrow_forward" folder="icon" size="xs" className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
