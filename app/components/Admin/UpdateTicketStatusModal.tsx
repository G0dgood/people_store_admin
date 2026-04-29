"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { Select } from "../Form/Select";
import { Textarea } from "../Form/Inputs";
import { Icon } from "../Icon";

interface UpdateTicketStatusModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: (status: "Open" | "Pending" | "Resolved" | "Closed", note: string) => void;
   ticket: any;
}

const statusOptions = [
   { value: "Open", label: "Open" },
   { value: "Pending", label: "Pending" },
   { value: "Resolved", label: "Resolved" },
];

export const UpdateTicketStatusModal: React.FC<UpdateTicketStatusModalProps> = ({
   isOpen,
   onClose,
   onConfirm,
   ticket,
}) => {
   const [selectedStatus, setSelectedStatus] = useState(ticket?.status || "Open");
   const [note, setNote] = useState("");

   if (!ticket) return null;

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         size="sm"
         title="Update Ticket Status"
      >
         <div className="flex flex-col gap-8 py-2">
            {/* Ticket Context */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
               <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-gold shadow-sm border border-gray-200">
                  <Icon name="ticket" folder="dashboardIcon" size="sm" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Updating Ticket</span>
                  <span className="text-sm font-black text-[#1D3557]">{ticket.ticketId}</span>
               </div>
            </div>

            {/* Status Selection */}
            <div className="flex flex-col gap-3">
               <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Select Status</label>
               <Select
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={(val) => setSelectedStatus(val as string)}
                  className="!w-full"
               />
            </div>

            {/* Resolution Note */}
            <div className="flex flex-col gap-3">
               <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Internal Note / Resolution</label>
               <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Provide context for this status change..."
                  style={{ minHeight: '100px' }}
               />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-50">
               <Button
                  shape="rounded-sm"
                  variant="ghost" className="flex-1 h-10 text-[10px] font-black uppercase tracking-widest text-gray-400" onClick={onClose}>
                  Cancel
               </Button>
               <Button
                  shape="rounded-sm"
                  variant="primary"
                  className="flex-2 h-10 text-[10px] font-black uppercase tracking-widest shadow-md shadow-brand-gold/10 transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
                  onClick={() => {
                     onConfirm(selectedStatus, note);
                     onClose();
                  }}
               >
                  Update Status
               </Button>
            </div>
         </div>
      </Modal>
   );
};
