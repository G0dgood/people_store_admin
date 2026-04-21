"use client";

import React from "react";
import moment from "moment";
import { FiShoppingCart, FiUsers, FiCreditCard } from "react-icons/fi";
import { MdOutlineInventory2 } from "react-icons/md";
import Drawer from "../Drawer/Drawer";
import { Button } from "../Button";
import { Avatar } from "../Other/Avatar";

interface StaffDetailDrawerProps {
 isOpen: boolean;
 onClose: () => void;
 staff: any;
}

export function StaffDetailDrawer({ isOpen, onClose, staff }: StaffDetailDrawerProps) {
 if (!staff) return null;

 const permissions = [
  { label: "Orders Management", status: "Full Access", icon: <FiShoppingCart size={14} /> },
  { label: "Product Inventory", status: "Edit Only", icon: <MdOutlineInventory2 size={14} /> },
  { label: "Customer Data", status: "View Only", icon: <FiUsers size={14} /> },
  { label: "Financials", status: "Restricted", icon: <FiCreditCard size={14} /> },
 ];

 const recentActivity = [
  { action: "Updated Product Price", target: "iPhone 15 Pro", time: "2 hours ago" },
  { action: "Resolved Ticket", target: "#TK-4421", time: "5 hours ago" },
  { action: "Login Verified", target: "Office IP: 192.168.1.1", time: "Today, 09:12 AM" },
 ];

 return (
  <Drawer isOpen={isOpen} onClose={onClose} title="Staff Member Profile">
   <div className="flex flex-col gap-8 pb-12">
    {/* Profile Header Card */}
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden group shadow-sm">
     <div className="absolute top-0 inset-x-0 h-20 bg-[#1D3557] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500" />

     <Avatar
      src={staff.avatar}
      name={staff.fullName}
      size="xl"
      className="border-4 border-white shadow-xl relative z-10 -mt-2 group-hover:scale-105 transition-transform duration-500"
     />

     <div className="flex flex-col gap-1 relative z-10">
      <h3 className="text-xl font-black text-[#1D3557] tracking-tight">{staff.fullName}</h3>
      <p className="text-xs font-bold text-gray-400 truncate max-w-[200px]">{staff.email}</p>
     </div>

     <div className="flex gap-2 relative z-10">
      <span className="px-3 py-1 bg-gray-100 rounded-[6px] text-[10px] font-black uppercase tracking-widest text-gray-500">
       {staff.role}
      </span>
      {(() => {
        const statuses: Record<string, string> = {
          Active: "bg-emerald-50 text-emerald-500 border-emerald-100/50",
          Inactive: "bg-rose-50 text-rose-500 border-rose-100",
          Pending: "bg-amber-50 text-amber-600 border-amber-100",
          Suspended: "bg-rose-50 text-rose-500 border-rose-100",
        };
        const statusStyle = statuses[staff.status] || statuses.Inactive;
        return (
          <span className={`px-3 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-widest border ${statusStyle}`}>
            {staff.status || "Inactive"}
          </span>
        );
      })()}
     </div>
    </div>

    {/* Organization Info */}
    <div className="grid grid-cols-2 gap-4">
     <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-200 flex flex-col gap-1">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department</span>
      <span className="text-sm font-black text-[#1D3557]">{staff.department || "General"}</span>
     </div>
     <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-200 flex flex-col gap-1">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee ID</span>
      <span className="text-sm font-black text-[#1D3557]">STF-{staff.id?.toString().substr(-4).toUpperCase() || staff._id?.toString().substr(-4).toUpperCase()}</span>
     </div>
    </div>

    {/* Personal Info */}
    <div className="grid grid-cols-2 gap-4">
     <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-200 flex flex-col gap-1">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gender</span>
      <span className="text-sm font-black text-[#1D3557]">{staff.gender || "Other"}</span>
     </div>
     <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-200 flex flex-col gap-1">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date of Birth</span>
      <span className="text-sm font-black text-[#1D3557]">
       {staff.dob ? moment(staff.dob).format('MMM DD, YYYY') : "Not Specified"}
      </span>
     </div>
    </div>

    {/* Permissions Section */}
    <div className="flex flex-col gap-4">
     <div className="flex items-center justify-between px-1">
      <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">Module Access</h4>
      <button className="text-[10px] font-black text-brand-gold uppercase tracking-widest hover:underline">Edit All</button>
     </div>
     <div className="flex flex-col gap-2">
      {permissions.map((perm, i) => (
       <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-brand-gold/20 hover:shadow-md transition-all group">
        <div className="flex items-center gap-3">
         <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-colors">
          {perm.icon}
         </div>
         <span className="text-[13px] font-bold text-[#1D3557]">{perm.label}</span>
        </div>
        {(() => {
          const statusColors: Record<string, string> = {
            "Full Access": "bg-emerald-50 text-emerald-500",
            "Edit Only": "bg-amber-50 text-amber-600",
            "View Only": "bg-blue-50 text-blue-500",
            "Restricted": "bg-rose-50 text-rose-500",
          };
          const colorClass = statusColors[perm.status] || "bg-gray-50 text-gray-400";
          return (
            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded ${colorClass}`}>
              {perm.status}
            </span>
          );
        })()}
       </div>
      ))}
     </div>
    </div>

    {/* Recent Activity Timeline */}
    <div className="flex flex-col gap-4">
     <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Recent Activity</h4>
     <div className="flex flex-col gap-5 pl-2">
      {recentActivity.map((act, i) => (
       <div key={i} className="flex gap-4 relative">
        {i !== recentActivity.length - 1 && (
         <div className="absolute left-[7px] top-4 bottom-[-20px] w-[2px] bg-gray-100" />
        )}
        <div className="w-[16px] h-[16px] rounded-full bg-white border-2 border-brand-gold shadow-sm mt-1 z-10 shrink-0" />
        <div className="flex flex-col gap-0.5" >
         <span className="text-[11px] font-black text-[#1D3557] leading-tight">
          {act.action} <span className="text-gray-400 font-bold ml-1">{act.target}</span>
         </span>
         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{act.time}</span>
        </div>
       </div>
      ))}
     </div>
    </div>

    {/* Footer Actions */}
    <div className="mt-auto flex gap-3 pt-4">
     <Button shape="rounded-sm" variant="outline" className="flex-1 font-black text-xs h-12 uppercase tracking-widest transition-all duration-300 hover:text-brand-gold hover:border-brand-gold">
      Lock Session
     </Button>
     <Button shape="rounded-sm" variant="outline" className="flex-1 font-black text-xs h-12 uppercase tracking-widest text-rose-500 border-rose-100 bg-rose-50/30 hover:bg-rose-100">
      Revoke Access
     </Button>
    </div>
   </div>
  </Drawer>
 );
}
