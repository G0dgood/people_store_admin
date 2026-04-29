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
 Completed: { color: "text-brand-gold", bg: "bg-brand-gold", lightBg: "bg-brand-gold/5" },
 Rejected: { color: "text-rose-500", bg: "bg-rose-500", lightBg: "bg-rose-50" },
 Pending: { color: "text-orange-400", bg: "bg-orange-400", lightBg: "bg-orange-50" },
 Approved: { color: "text-emerald-500", bg: "bg-emerald-500", lightBg: "bg-emerald-50" },
 Processing: { color: "text-brand-blue", bg: "bg-brand-blue", lightBg: "bg-brand-blue/5" },
};

export function RefundDetailDrawer({ isOpen, onClose, refund, onUpdateStatus }: RefundDetailDrawerProps) {
 if (!refund) return null;

 const currentStatus = statusStyles[refund.status as keyof typeof statusStyles] || statusStyles.Pending;

 const handleGenerateReceipt = () => {
  if (!refund) return;

  const receiptWindow = window.open('', '_blank');
  if (!receiptWindow) return;

  const html = `
       <html>
       <head>
          <title>Refund Receipt - ${refund.refundId}</title>
          <style>
             body { font-family: 'Inter', sans-serif; padding: 40px; color: #1D3557; line-height: 1.6; }
             .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 40px; }
             .logo { font-size: 24px; font-weight: 900; color: #C5A028; }
             .receipt-title { font-size: 28px; font-weight: 900; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px; }
             .amount-card { background: #f8fafc; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 40px; }
             .amount { font-size: 36px; font-weight: 900; color: #1D3557; }
             .section-title { font-size: 10px; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
             .value { font-size: 14px; font-weight: 700; }
             .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 20px; }
             @media print { .no-print { display: none; } }
          </style>
       </head>
       <body>
          <div class="header">
             <div class="logo">Bloom & Mist</div>
             <div style="text-align: right">
                <div class="section-title">Date Generated</div>
                <div class="value">${new Date().toLocaleDateString()}</div>
             </div>
          </div>

          <div class="receipt-title">Refund Receipt</div>
          <p>This document confirms the successful processing of your refund request.</p>

          <div class="amount-card">
             <div class="section-title">Total Refunded Amount</div>
             <div class="amount">₦${refund.amount?.toLocaleString()}</div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
             <div>
                <div class="section-title">Refund Details</div>
                <div style="margin-bottom: 15px;">
                   <div style="font-size: 10px; color: #9ca3af;">Refund ID</div>
                   <div class="value">${refund.refundId}</div>
                </div>
                <div style="margin-bottom: 15px;">
                   <div style="font-size: 10px; color: #9ca3af;">Order ID</div>
                   <div class="value">${refund.order?.orderId || "N/A"}</div>
                </div>
                <div style="margin-bottom: 15px;">
                   <div style="font-size: 10px; color: #9ca3af;">Reason</div>
                   <div class="value">${refund.reason}</div>
                </div>
             </div>
             <div>
                <div class="section-title">Customer Details</div>
                <div style="margin-bottom: 15px;">
                   <div style="font-size: 10px; color: #9ca3af;">Name</div>
                   <div class="value">${refund.customer?.fullName || "Guest"}</div>
                </div>
                <div style="margin-bottom: 15px;">
                   <div style="font-size: 10px; color: #9ca3af;">Email</div>
                   <div class="value">${refund.customer?.email || "N/A"}</div>
                </div>
             </div>
          </div>

          <div style="margin-top: 40px;">
             <div class="section-title">Status History</div>
             <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                ${refund.history?.map((h: any) => `
                   <tr style="border-bottom: 1px solid #f3f4f6;">
                      <td style="padding: 10px 0; font-weight: 700;">${h.status}</td>
                      <td style="padding: 10px 0; color: #64748b;">${new Date(h.timestamp).toLocaleString()}</td>
                   </tr>
                `).join('') || '<tr><td colspan="2">No history available</td></tr>'}
             </table>
          </div>

          <div class="footer">
             Thank you for shopping with Bloom & Mist. If you have any questions about this refund, please contact our support team.
          </div>

          <div class="no-print" style="margin-top: 40px; text-align: center;">
             <button onclick="window.print()" style="padding: 12px 24px; background: #C5A028; color: white; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;">Print Receipt</button>
          </div>
       </body>
       </html>
    `;

  receiptWindow.document.write(html);
  receiptWindow.document.close();
 };

 return (
  <Drawer isOpen={isOpen} onClose={onClose} title="Refund Details" width="max-w-md">
   <div className="flex flex-col gap-8">
    {/* Core Summary */}
    <div className={`p-6 rounded-2xl ${currentStatus.lightBg} border border-white/50 shadow-sm flex flex-col gap-4`}>
     <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Refund ID</span>
       <span className="text-sm font-black text-[#1D3557]">{refund.refundId}</span>
      </div>
      <div className={`px-3 py-1 rounded-full ${currentStatus.bg} text-white text-[10px] font-black uppercase tracking-wider shadow-sm`}>
       {refund.status}
      </div>
     </div>
     <div className="flex flex-col">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Refund Amount</span>
      <span className="text-3xl font-black text-[#1D3557] tracking-tight">₦{refund.amount?.toLocaleString()}</span>
     </div>
    </div>

    {/* Original Transaction */}
    <div className="flex flex-col gap-4">
     <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Original Order</h4>
     <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center p-2">
       <Icon name="Payment Card" folder="dashboardIcon" size="md" />
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
       <span className="text-[13px] font-black text-[#1D3557]">Order {refund.order?.orderId || "N/A"}</span>
       <span className="text-[11px] font-bold text-gray-400">Total: ₦{refund.order?.totalAmount?.toLocaleString() || "N/A"}</span>
      </div>
     </div>
    </div>

    {/* Customer Breakdown */}
    <div className="flex flex-col gap-4">
     <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Customer Details</h4>
     <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-50 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
       <img src={"https://ui-avatars.com/api/?name=" + (refund.customer?.fullName || "Guest")} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
       <span className="text-[13px] font-black text-[#1D3557]">{refund.customer?.fullName || "Guest"}</span>
       <span className="text-[11px] font-bold text-gray-400 text-brand-gold">{refund.customer?.email}</span>
      </div>
      <button className="p-2 text-gray-400 hover:text-brand-gold transition-colors">
       <Icon name="link-external" folder="dashboardIcon" size="sm" />
      </button>
     </div>
    </div>

    {/* Reason */}
    <div className="flex flex-col gap-4">
     <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Refund Reason</h4>
     <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{refund.reason}</span>
       <p className="text-xs font-bold text-[#1D3557] leading-relaxed">{refund.description}</p>
      </div>
      {refund.adminNote && (
       <div className="pt-3 border-t border-gray-200">
        <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest block mb-1">Admin Resolution Note</span>
        <p className="text-xs font-bold text-[#1D3557] italic">"{refund.adminNote}"</p>
       </div>
      )}
     </div>
    </div>

    {/* Images */}
    {refund.images && refund.images.length > 0 && (
     <div className="flex flex-col gap-4">
      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Supporting Images</h4>
      <div className="grid grid-cols-4 gap-2">
       {refund.images.map((img: string, i: number) => (
        <a key={i} href={img} target="_blank" rel="noreferrer" className="aspect-square rounded-lg overflow-hidden border border-gray-200">
         <img src={img} alt="" className="w-full h-full object-cover" />
        </a>
       ))}
      </div>
     </div>
    )}

    {/* Timeline */}
    <div className="flex flex-col gap-6">
     <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Refund Timeline</h4>
     <div className="flex flex-col gap-8 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
      {refund.history && refund.history.length > 0 ? (
       [...refund.history].reverse().map((item: any, index: number) => {
        const statusCfg = statusStyles[item.status as keyof typeof statusStyles] || statusStyles.Pending;
        const isFirst = index === 0;

        return (
         <div key={index} className={`relative flex flex-col gap-1.5 ${!isFirst ? 'opacity-60' : ''}`}>
          <div className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-white ring-4 ${isFirst ? `${statusCfg.bg} ring-${statusCfg.bg.split('-')[1]}-500/10` : 'bg-gray-300 ring-gray-100'}`}
           style={{ backgroundColor: isFirst ? undefined : '#e5e7eb' }}
          >
           {isFirst && <div className={`w-full h-full rounded-full ${statusCfg.bg}`}></div>}
          </div>

          <div className="flex justify-between items-center">
           <span className="text-[12px] font-black text-[#1D3557]">
            {item.status === "Pending" && index === refund.history.length - 1 ? "Request Submitted" : `Refund ${item.status}`}
           </span>
           <span className="text-[10px] font-bold text-gray-400">
            {new Date(item.timestamp).toLocaleString()}
           </span>
          </div>

          {item.message && (
           <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
            {item.message}
           </p>
          )}

          {item.adminNote && (
           <div className="mt-1 p-2 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">Admin Note</span>
            <p className="text-[10px] font-bold text-[#1D3557] italic">"{item.adminNote}"</p>
           </div>
          )}
         </div>
        );
       })
      ) : (
       <>
        {refund.status !== "Pending" && (
         <div className="relative flex flex-col gap-1">
          <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-brand-gold border-2 border-white ring-4 ring-brand-gold/10"></div>
          <span className="text-[12px] font-black text-[#1D3557]">Refund {refund.status}</span>
          <span className="text-[10px] font-bold text-gray-400">
           {refund.processedAt ? new Date(refund.processedAt).toLocaleString() : "Updated just now"}
          </span>
         </div>
        )}
        <div className="relative flex flex-col gap-1 opacity-60">
         <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-gray-200 border-2 border-white"></div>
         <span className="text-[12px] font-black text-[#1D3557]">Request Submitted</span>
         <span className="text-[10px] font-bold text-gray-400">{new Date(refund.createdAt).toLocaleString()}</span>
        </div>
       </>
      )}
     </div>
    </div>

    {/* Bottom Actions */}
    <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3 pb-8">
     {refund.status !== "Completed" && (
      <Button
       shape="rounded-sm"
       variant="primary"
       className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-gold/10 transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
       onClick={onUpdateStatus}
      >
       Update Refund Status
      </Button>
     )}
     <Button
      shape="rounded-sm"
      variant="outline"
      className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest border-gray-200 text-gray-400 hover:text-brand-gold transition-all duration-300"
      onClick={handleGenerateReceipt}
     >
      Generate Refund Receipt
     </Button>
    </div>
   </div>
  </Drawer>
 );
}
