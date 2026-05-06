"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";

interface TransactionDetailDrawerProps {
   isOpen: boolean;
   onClose: () => void;
   transaction: any;
}

const statusStyles = {
   Success: { color: "text-emerald-500", bg: "bg-emerald-500", lightBg: "bg-emerald-50" },
   Failed: { color: "text-rose-500", bg: "bg-rose-500", lightBg: "bg-rose-50" },
   Pending: { color: "text-orange-400", bg: "bg-orange-400", lightBg: "bg-orange-50" },
   Reversed: { color: "text-brand-gold", bg: "bg-brand-gold", lightBg: "bg-brand-gold/5" },
};

export function TransactionDetailDrawer({ isOpen, onClose, transaction }: TransactionDetailDrawerProps) {
   if (!transaction) return null;

   const currentStatus = statusStyles[transaction.status as keyof typeof statusStyles] || statusStyles.Pending;

   return (
      <Drawer isOpen={isOpen} onClose={onClose} title="Transaction Details" width="max-w-md">
         <div className="flex flex-col gap-8">
            {/* Core Summary */}
            <div className={`p-6 rounded-2xl ${currentStatus.lightBg} border border-white/50   flex flex-col gap-4`}>
               <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</span>
                     <span className="text-sm font-black text-brand-charcoal">{transaction.transactionId}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${currentStatus.bg} text-white text-[10px] font-black uppercase tracking-wider  `}>
                     {transaction.status}
                  </div>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                  <span className="text-3xl font-black text-brand-charcoal tracking-tight">₦{transaction.amount?.toLocaleString()}</span>
               </div>
            </div>

            {/* Payment Method Detailed */}
            <div className="flex flex-col gap-4">
               <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Payment Information</h4>
               <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center p-2">
                     <Icon name="Payment Card" folder="dashboardIcon" size="md" />
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5">
                     <span className="text-[13px] font-black text-brand-charcoal">{transaction.paymentMethod} Payment</span>
                     <span className="text-[11px] font-bold text-gray-400">Ref: {transaction.providerReference}</span>
                  </div>
                  <div className="text-right">
                     <span className={`text-[11px] font-black uppercase tracking-widest ${transaction.status === 'Success' ? 'text-emerald-500' : 'text-gray-400'}`}>
                        {transaction.status === 'Success' ? 'Captured' : transaction.status}
                     </span>
                  </div>
               </div>
            </div>

            {/* Customer Breakdown */}
            <div className="flex flex-col gap-4">
               <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Customer Details</h4>
               <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 border-2 border-white   flex items-center justify-center overflow-hidden">
                     <img src={"https://ui-avatars.com/api/?name=" + (transaction.customer?.fullName || "Guest")} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5">
                     <span className="text-[13px] font-black text-brand-charcoal">{transaction.customer?.fullName || "Guest"}</span>
                     <span className="text-[11px] font-bold text-gray-400">{transaction.customer?.email || "N/A"}</span>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-brand-gold transition-colors">
                     <Icon name="link-external" folder="dashboardIcon" size="sm" />
                  </button>
               </div>
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-6">
               <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Transaction Timeline</h4>
               <div className="flex flex-col gap-8 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  <div className="relative flex flex-col gap-1">
                     <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-brand-gold border-2 border-white ring-4 ring-brand-gold/10"></div>
                     <span className="text-[12px] font-black text-brand-charcoal">Transaction {transaction.status}</span>
                     <span className="text-[10px] font-bold text-gray-400">
                        {new Date(transaction.paidAt || transaction.createdAt).toLocaleString()}
                     </span>
                  </div>
                  <div className="relative flex flex-col gap-1 opacity-60">
                     <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-gray-200 border-2 border-white"></div>
                     <span className="text-[12px] font-black text-brand-charcoal">Order Placed</span>
                     <span className="text-[10px] font-bold text-gray-400">
                        {new Date(transaction.createdAt).toLocaleString()}
                     </span>
                  </div>
               </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3 pb-8">
               <Button
                  shape="rounded-sm"
                  variant="primary"
                  className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-gold/10">
                  Download Receipt
               </Button>
               <Button
                  shape="rounded-sm"
                  variant="ghost" className="w-full h-10 sm:h-12 text-[11px] font-bold text-rose-500 hover:bg-rose-50">
                  Report Transaction Issue
               </Button>
            </div>
         </div>
      </Drawer>
   );
}
