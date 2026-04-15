"use client";

import React from "react";
import { Icon } from "../Icon";
import { DropdownMenu, DropdownFooterAction } from "../Dropdown/DropdownMenu";

export const AdminProfileDropdown: React.FC = () => {
  return (
    <div className="absolute top-full right-0 pt-4 z-50 cursor-default">
      <DropdownMenu width={280} className="shadow-2xl border-gray-100 p-0 overflow-hidden">
        {/* User Summary */}
        <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-50 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0">
             <img src="/dashboardImage/Picture.png" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
             <span className="text-sm font-black text-[#1D3557] truncate leading-tight">Dealport Admin</span>
             <span className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-widest mt-0.5">Super Administrator</span>
          </div>
        </div>

        {/* Action List */}
        <div className="p-2 flex flex-col">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-blue-light hover:text-brand-blue transition-all group text-[#1D3557]">
             <Icon name="user-profile-circle" folder="dashboardIcon" size="sm" className="text-gray-400 group-hover:text-brand-blue" />
             <span className="text-[13px] font-bold">View Profile</span>
          </button>
          
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-blue-light hover:text-brand-blue transition-all group text-[#1D3557]">
             <Icon name="settings" folder="dashboardIcon" size="sm" className="text-gray-400 group-hover:text-brand-blue" />
             <span className="text-[13px] font-bold">Account Settings</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-blue-light hover:text-brand-blue transition-all group text-[#1D3557]">
             <Icon name="security" folder="icon" size="sm" className="text-gray-400 group-hover:text-brand-blue" />
             <span className="text-[13px] font-bold">Security & Audit</span>
          </button>

          <div className="h-px bg-gray-50 my-2 mx-4"></div>

          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-all group text-[#1D3557]">
             <Icon name="info-circle" folder="dashboardIcon" size="sm" className="text-gray-400 group-hover:text-brand-blue" />
             <span className="text-[13px] font-bold">Help & Support</span>
          </button>
        </div>

        {/* Footer Logout */}
        <DropdownFooterAction 
          label="Logout Session" 
          onClick={() => console.log("Logging out...")} 
          icon="ic_round-logout" 
          className="h-14 py-0 text-rose-500 hover:bg-rose-50"
        />
      </DropdownMenu>
    </div>
  );
};
