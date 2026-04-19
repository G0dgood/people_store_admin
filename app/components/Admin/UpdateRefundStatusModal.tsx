"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { Radio } from "../Form/Radio";
import { Icon } from "../Icon";
import { Textarea } from "../Form/Inputs";

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
  const [selectedStatus, setSelectedStatus] = useState("Completed");
  const [reason, setReason] = useState("");

  if (!target) return null;

  const isBulk = !!target.count;

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
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-brand-blue shadow-sm">
            <Icon name={isBulk ? "users" : "cached"} folder={isBulk ? "dashboardIcon" : "icon"} size="md" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Selection</span>
            <span className="text-sm font-black text-[#1D3557]">
              {isBulk ? `${target.count} Refund Requests` : `Refund for ${target.name}`}
            </span>
          </div>
        </div>

        {/* Status Selection */}
        <div className="flex flex-col gap-4">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Select New Status</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setSelectedStatus("Completed")}
              className={`w-full p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3
                 ${selectedStatus === "Completed" ? "border-emerald-500 bg-emerald-50/30" : "border-gray-200 bg-white hover:border-gray-200"}
               `}
            >
              <div className="w-full flex  items-center justify-between">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedStatus === "Completed" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                  <Icon name="verified" folder="icon" size="xs" />
                </div>
                <Radio
                  checked={selectedStatus === "Completed"}
                  onChange={() => setSelectedStatus("Completed")}
                  activeColor="#10b981" // emerald-500
                  className="w-auto"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#1D3557]">Approve</span>
                <p className="text-[10px] font-medium text-gray-500">Refund funds to customer</p>
              </div>
            </div>

            <div
              onClick={() => setSelectedStatus("Canceled")}
              className={`w-full p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3
                 ${selectedStatus === "Canceled" ? "border-rose-500 bg-rose-50/30" : "border-gray-200 bg-white hover:border-gray-200"}
               `}
            >
              <div className="w-full flex items-center justify-between">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedStatus === "Canceled" ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                  <Icon name="Delete" folder="dashboardIcon" size="xs" />
                </div>
                <Radio
                  checked={selectedStatus === "Canceled"}
                  onChange={() => setSelectedStatus("Canceled")}
                  activeColor="#f43f5e" // rose-500
                  className="w-auto"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#1D3557]">Reject</span>
                <p className="text-[10px] font-medium text-gray-500">Deny refund request</p>
              </div>
            </div>
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
        <div className="flex gap-3 pt-6 border-t border-gray-50">
          <Button
            variant="ghost"
            className="flex-1 h-10 text-[10px] font-black uppercase tracking-widest text-gray-400"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-2 h-10 text-[10px] font-black uppercase tracking-widest shadow-md shadow-blue-100"
            onClick={() => {
              onConfirm(selectedStatus, reason);
              onClose();
            }}
          >
            Confirm Status Update
          </Button>
        </div>
      </div>
    </Modal>
  );
};
