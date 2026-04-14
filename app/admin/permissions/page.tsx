"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";

const rolesData = [
  { 
    id: 1, 
    name: "Super Admin", 
    description: "Full access to all system modules and settings including financial data and user management.",
    users: ["/dashboardImage/Fashion.png", "/dashboardImage/T-Shirt.png", "/dashboardImage/Cap.png"],
    status: "Active"
  },
  { 
    id: 2, 
    name: "Editor", 
    description: "Can manage products, categories, and brands. Access to media gallery and reviews.",
    users: ["/dashboardImage/Electronics.png", "/dashboardImage/Accessories.png"],
    status: "Active"
  },
  { 
    id: 3, 
    name: "Order Manager", 
    description: "Handles order processing, shipping updates, and transaction monitoring.",
    users: ["/dashboardImage/Cap.png", "/dashboardImage/Fashion.png"],
    status: "Active"
  },
  { 
    id: 4, 
    name: "Support Staff", 
    description: "Access to customer reviews, support tickets, and basic user information.",
    users: ["/dashboardImage/T-Shirt.png"],
    status: "Inactive"
  },
  { 
    id: 5, 
    name: "Content Creator", 
    description: "Permission to upload media, write product descriptions, and manage blog content.",
    users: ["/dashboardImage/Accessories.png", "/dashboardImage/Electronics.png", "/dashboardImage/Fashion.png"],
    status: "Active"
  },
];

const statusStyles = {
  Active: "text-blue-500 bg-brand-blue-light",
  Inactive: "text-gray-400 bg-gray-50",
};

export default function PermissionsListing() {
  const [activeTab, setActiveTab] = useState("All roles");

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
          <Button
            variant="primary"
            shape="rounded-sm"
            iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
          >
            Add Role
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
        {/* Filter Controls Bar */}
        <div className="p-6 flex flex-col xl:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All roles", "Admin", "Staff", "User"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input
              type="text"
              placeholder="Search role name..."
              containerClassName="flex-1 xl:w-96"
              className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <div className="flex gap-2">
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="sort" folder="dashboardIcon" size="sm" />
              </button>
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Roles Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[#1D3557]">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Role Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Assigned Users</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rolesData.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-[#1D3557] group-hover:text-blue-600 transition-colors">
                       {role.name}
                    </span>
                  </td>
                  <td className="px-6 py-5 max-w-[400px]">
                    <p className="text-xs font-medium text-gray-500 leading-relaxed line-clamp-2">
                       {role.description}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 border border-gray-100">
                          <Icon name="user-profile-circle" folder="dashboardIcon" size="sm" className="text-gray-400" />
                       </div>
                       <span className="text-sm font-bold text-[#1D3557]">{role.users.length} Users</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusStyles[role.status as keyof typeof statusStyles]}`}>
                      {role.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right pr-6 text-gray-300">
                    <div className="flex justify-end gap-4 text-gray-400">
                       <button className="hover:text-blue-500 transition-colors">
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

        {/* Pagination Footer */}
        <div className="p-6 flex items-center justify-between border-t border-gray-50">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-[6px] text-xs font-bold text-[#1D3557] hover:bg-gray-50 transition-all shadow-sm group">
            <Icon name="arrow_back" folder="icon" size="xs" className="transition-transform group-hover:-translate-x-0.5" />
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", 12].map((page, i) => (
              <button
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded-[6px] text-xs font-bold transition-all ${
                  page === 1 
                    ? "bg-blue-100 text-blue-600 shadow-sm" 
                    : "text-gray-400 hover:text-[#1D3557] hover:bg-gray-50"
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
