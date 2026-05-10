"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";

import { useUpdateTicketMutation } from "@/lib/redux/services/ticketApi";
import { toast } from "sonner";

interface TicketDetailDrawerProps {
   isOpen: boolean;
   onClose: () => void;
   ticket: any;
   onReply: () => void;
}

const priorityStyles = {
   Urgent: "text-rose-600 bg-rose-50 border-rose-100",
   High: "text-orange-600 bg-orange-50 border-orange-100",
   Medium: "text-brand-gold bg-brand-gold/10 border-brand-gold/20",
   Low: "text-emerald-600 bg-emerald-50 border-emerald-100",
};

export function TicketDetailDrawer({ isOpen, onClose, ticket, onReply }: TicketDetailDrawerProps) {
   const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketMutation();

   if (!ticket) return null;

   const handleEscalate = async () => {
      try {
         await updateTicket({
            id: ticket._id,
            body: { priority: "Urgent" }
         }).unwrap();
         toast.success("Ticket escalated to Urgent");
      } catch (error: any) {
         toast.error(error?.data?.message || "Failed to escalate ticket");
      }
   };

   return (
      <Drawer isOpen={isOpen} onClose={onClose} title="Ticket Details" width="max-w-md">
         <div className="flex flex-col gap-8 pb-8">
            {/* Header Summary */}
            <div className="p-6 rounded-2xl bg-[#121212] text-white flex flex-col gap-4 shadow-lg shadow-brand-gold/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                  <Icon name="tabler_message" folder="dashboardIcon" size="lg" className="w-24 h-24" />
               </div>
               <div className="flex justify-between items-start relative z-10">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Reference ID</span>
                     <span className="text-sm font-black text-white">{ticket.ticketId}</span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border   ${priorityStyles[ticket.priority as keyof typeof priorityStyles]}`}>
                     {ticket.priority} Priority
                  </div>
               </div>
               <div className="flex flex-col gap-1 relative z-10">
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Subject</span>
                  <h3 className="text-lg font-black leading-tight">{ticket.subject}</h3>
               </div>
            </div>

            {/* Customer Information */}
            <div className="flex flex-col gap-4">
               <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Customer Profile</h4>
               <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4  ">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 border-2 border-white   flex items-center justify-center overflow-hidden">
                     <img src={"https://ui-avatars.com/api/?name=" + ticket.customerName} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5">
                     <span className="text-[13px] font-black text-[#121212]">{ticket.customerName}</span>
                     <span className="text-[11px] font-bold text-gray-400">#USR_023456789</span>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-brand-gold transition-colors">
                     <Icon name="link-external" folder="dashboardIcon" size="sm" />
                  </button>
               </div>
            </div>

            {/* Ticket Description / Messages */}
            <div className="flex flex-col gap-4">
               <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Ticket Conversation</h4>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                     <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-none p-4  ">
                        <p className="text-xs font-bold text-[#121212] leading-relaxed">
                           {ticket.message}
                        </p>
                     </div>
                     <span className="text-[10px] font-bold text-gray-400 pl-1">{ticket.activity}</span>
                  </div>

                  {/* Internal Note Tag */}
                  {ticket.responses?.slice().reverse().find((r: any) => r.sender === "Admin") && (
                     <div className="flex items-center gap-2 border-l-4 border-amber-400 pl-3 py-1">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Latest Admin Note</span>
                           <p className="text-[11px] font-bold text-gray-500">
                              {ticket.responses.slice().reverse().find((r: any) => r.sender === "Admin").message}
                           </p>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* Timeline Log */}
            <div className="flex flex-col gap-6">
               <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Case Timeline</h4>
               <div className="flex flex-col gap-8 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  <div className="relative flex flex-col gap-1">
                     <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-brand-gold border-2 border-white ring-4 ring-brand-gold/10"></div>
                     <span className="text-[12px] font-black text-[#121212]">Last Activity Tracked</span>
                     <span className="text-[10px] font-bold text-gray-400">{ticket.activity}</span>
                  </div>
                  <div className="relative flex flex-col gap-1 opacity-60">
                     <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-gray-200 border-2 border-white"></div>
                     <span className="text-[12px] font-black text-[#121212]">Ticket Assigned to Agent</span>
                     <span className="text-[10px] font-bold text-gray-400">1 hour ago</span>
                  </div>
                  <div className="relative flex flex-col gap-1 opacity-60">
                     <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-gray-200 border-2 border-white"></div>
                     <span className="text-[12px] font-black text-[#121212]">Ticket Created</span>
                     <span className="text-[10px] font-bold text-gray-400">3 hours ago</span>
                  </div>
               </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3">
               <Button
                  shape="rounded-sm"
                  variant="primary"
                  className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-gold/10 transition-all duration-300 hover:bg-brand-gold hover:text-white">
                  Reply to Customer
               </Button>
               <Button
                  shape="rounded-sm"
                  variant="outline"
                  className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest border-gray-200 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all duration-300">
                  Escalate Ticket
               </Button>
            </div>
         </div>
      </Drawer>
   );
}
