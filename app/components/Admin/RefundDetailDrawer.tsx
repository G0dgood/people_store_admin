"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";

interface RefundDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  refund: any;
  onUpdateStatus?: () => void;
}

const statusStyles = {
  Completed: { color: "text-emerald-500", bg: "bg-emerald-500", lightBg: "bg-emerald-50" },
  Canceled: { color: "text-rose-500", bg: "bg-rose-500", lightBg: "bg-rose-50" },
  Pending: { color: "text-brand-gold", bg: "bg-brand-gold", lightBg: "bg-brand-gold/5" },
};

export function RefundDetailDrawer({ isOpen, onClose, refund, onUpdateStatus }: RefundDetailDrawerProps) {
  if (!refund) return null;

  const currentStatus = statusStyles[refund.status as keyof typeof statusStyles] || statusStyles.Pending;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Refund Details" width="max-w-md">
      <div className="flex flex-col gap-8">
        {/* Core Summary */}
        <div className={`p-6 rounded-2xl ${currentStatus.lightBg} border border-white/50 shadow-sm flex flex-col gap-4`}>
          <div className="flex justify-between items-start">
             <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Refund ID</span>
                <span className="text-sm font-black text-[#1D3557]">{refund.refundId || "#RFD_98273645"}</span>
             </div>
             <div className={`px-3 py-1 rounded-full ${currentStatus.bg} text-white text-[10px] font-black uppercase tracking-wider shadow-sm`}>
                {refund.status}
             </div>
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Refund Amount</span>
             <span className="text-3xl font-black text-[#1D3557] tracking-tight">{refund.total}</span>
          </div>
        </div>

        {/* Original Transaction */}
        <div className="flex flex-col gap-4">
           <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Original Transaction</h4>
           <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center p-2">
                 <Icon name="Payment Card" folder="dashboardIcon" size="md" />
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                 <span className="text-[13px] font-black text-[#1D3557]">Transaction #TXN_00234</span>
                 <span className="text-[11px] font-bold text-gray-400">Total: ₦45,000 via {refund.method || "CC"}</span>
              </div>
           </div>
        </div>

        {/* Customer Breakdown */}
        <div className="flex flex-col gap-4">
           <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Customer Details</h4>
           <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                 <img src={refund.image || "https://ui-avatars.com/api/?name=" + refund.name} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                 <span className="text-[13px] font-black text-[#1D3557]">{refund.name}</span>
                 <span className="text-[11px] font-bold text-gray-400 text-brand-gold">{refund.custId}</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-brand-gold transition-colors">
                 <Icon name="link-external" folder="dashboardIcon" size="sm" />
              </button>
           </div>
        </div>

        {/* Reason */}
        <div className="flex flex-col gap-4">
           <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Refund Reason</h4>
           <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-bold text-[#1D3557] leading-relaxed">
                 {refund.reason || "Customer requested cancellation due to delayed shipping."}
              </p>
           </div>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-6">
           <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Refund Timeline</h4>
           <div className="flex flex-col gap-8 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              <div className="relative flex flex-col gap-1">
                 <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-brand-gold border-2 border-white ring-4 ring-brand-gold/10"></div>
                 <span className="text-[12px] font-black text-[#1D3557]">Refund Processed</span>
                 <span className="text-[10px] font-bold text-gray-400">Just now • 10:15 AM</span>
              </div>
              <div className="relative flex flex-col gap-1 opacity-60">
                 <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-gray-200 border-2 border-white"></div>
                 <span className="text-[12px] font-black text-[#1D3557]">Refund Authorized</span>
                 <span className="text-[10px] font-bold text-gray-400">{refund.date} • 09:30 AM</span>
              </div>
              <div className="relative flex flex-col gap-1 opacity-60">
                 <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-gray-200 border-2 border-white"></div>
                 <span className="text-[12px] font-black text-[#1D3557]">Request Submitted</span>
                 <span className="text-[10px] font-bold text-gray-400">{refund.date} • 08:45 AM</span>
              </div>
           </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3">
           <Button 
              shape="rounded-sm"
              variant="primary" 
              className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-gold/10 transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
              onClick={onUpdateStatus}
           >
              Update Refund Status
           </Button>
           <Button 
              shape="rounded-sm"
              variant="outline" 
              className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest border-gray-200 text-gray-400 hover:text-brand-gold transition-all duration-300"
           >
              Generate Refund Receipt
           </Button>
        </div>
      </div>
    </Drawer>
  );
}
