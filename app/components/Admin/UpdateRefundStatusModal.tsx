"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { Radio } from "../Form/Radio";
import { Icon } from "../Icon";
import { Textarea } from "../Form/Inputs";

import { getStatusConfigs } from "@/app/utils/statusRegistry";

interface UpdateStatusModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: (status: string, reason: string) => void;
 target: any;
}

export const UpdateRefundStatusModal: React.FC<UpdateStatusModalProps> = ({
 isOpen,
 onClose,
 onConfirm,
 target,
}) => {
 const [selectedStatus, setSelectedStatus] = useState("Approved");
 const [reason, setReason] = useState("");

 if (!target) return null;

 const isBulk = !!target.count;
 const refundStatuses = getStatusConfigs("refund");

 return (
  <Modal
   isOpen={isOpen}
   onClose={onClose}
   size="md"
   title="Update Refund Status"
  >
   <div className="flex flex-col gap-8 py-4">
    {/* Target Info */}
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
     <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-brand-gold  ">
      <Icon name={isBulk ? "users" : "cached"} folder={isBulk ? "dashboardIcon" : "icon"} size="md" />
     </div>
     <div className="flex flex-col">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Selection</span>
      <span className="text-sm font-black text-[#121212]">
       {isBulk ? `${target.count} Refund Requests` : `Refund for ${target.customer?.fullName || 'Guest'}`}
      </span>
     </div>
    </div>

    {/* Status Selection */}
    <div className="flex flex-col gap-4">
     <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Select New Status</label>
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {refundStatuses.map((status) => (
       <div
        key={status.value}
        onClick={() => setSelectedStatus(status.value)}
        className={`w-full p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3
                   ${selectedStatus === status.value ? "bg-opacity-10  " : "border-gray-200 bg-white hover:border-gray-300"}
                 `}
        style={{
         borderColor: selectedStatus === status.value ? status.color : undefined,
         backgroundColor: selectedStatus === status.value ? `${status.color}15` : undefined,
        }}
       >
        <div className="w-full flex items-center justify-between">
         <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: selectedStatus === status.value ? status.color : "#f3f4f6", color: selectedStatus === status.value ? "white" : "#9ca3af" }}
         >
          <Icon name={status.icon} folder={status.iconFolder} size="xs" />
         </div>
         {/* <Radio
          checked={selectedStatus === status.value}
          onChange={() => setSelectedStatus(status.value)}
          activeColor={status.color}
          className="w-auto"
         /> */}
        </div>
        <div className="flex flex-col">
         <span className="text-xs font-black text-[#121212]">{status.label}</span>
         <p className="text-[10px] font-medium text-gray-500">{status.description}</p>
        </div>
       </div>
      ))}
     </div>
    </div>

    {/* Feedback Reason */}
    <div className="flex flex-col gap-4">
     <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Internal Feedback (Optional)</label>
     <Textarea
      value={reason}
      onChange={(e) => setReason(e.target.value)}
      placeholder="Provide a reason for this status update..."
      className="!rounded-2xl !bg-gray-50 !border-gray-200 placeholder:text-gray-400 text-sm font-medium"
      style={{ minHeight: '96px' }}
     />
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
     <Button
      shape="rounded-sm"
      variant="ghost"
      onClick={onClose}
     >
      Cancel
     </Button>
     <Button
      shape="rounded-sm"
      variant="primary"
      onClick={() => {
       onConfirm(selectedStatus, reason);
      }}
     >
      Confirm Status Update
     </Button>
    </div>
   </div>
  </Modal>
 );
};
