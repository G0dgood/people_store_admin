"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { ConfirmationModal } from "./ConfirmationModal";
import { useState } from "react";

interface OrdersMoreActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkPrint: () => void;
}

export function OrdersMoreActionsDrawer({ isOpen, onClose, onBulkPrint }: OrdersMoreActionsDrawerProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const actions = [
    {
      title: "Export Orders",
      description: "Download current orders as CSV or PDF",
      icon: "cloud_download",
      folder: "icon",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Bulk Status Update",
      description: "Change status for multiple orders at once",
      icon: "arrow-refresh-06",
      folder: "dashboardIcon",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Print Packing Slips",
      description: "Generate and print slips for all pending orders",
      icon: "print",
      folder: "icon",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Bulk Archive",
      description: "Move completed orders to archive storage",
      icon: "archive",
      folder: "icon",
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
    {
      title: "Delete All Cancelled",
      description: "Permanently remove all cancelled orders",
      icon: "Delete",
      folder: "dashboardIcon",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="More Actions">
      <div className="flex flex-col gap-4">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 px-1">
          Available Operations
        </p>
        
        <div className="flex flex-col gap-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => {
                if (action.title === "Delete All Cancelled") {
                  setIsDeleteConfirmOpen(true);
                } else if (action.title === "Print Packing Slips") {
                  onBulkPrint();
                  onClose();
                } else {
                  console.log(`Triggering ${action.title}`);
                  onClose();
                }
              }}
              className="flex items-start gap-4 p-5 rounded-[6px] border border-gray-50 hover:border-brand-blue/30 hover:bg-brand-blue/5 transition-all group text-left"
            >
              <div className={`w-10 h-10 rounded-[6px] ${action.bg} ${action.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                <Icon name={action.icon} folder={action.folder as any} size="sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-black text-[#1D3557] group-hover:text-brand-blue transition-colors">
                  {action.title}
                </span>
                <span className="text-[11px] font-bold text-gray-500 mt-1 leading-relaxed">
                  {action.description}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <Button 
            className="w-full h-12 text-[11px] font-black uppercase tracking-widest border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all rounded-[6px]"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          console.log("Bulk deleting cancelled orders...");
          setIsDeleteConfirmOpen(false);
          onClose();
        }}
        title="Delete Cancelled Orders"
        message="Are you sure you want to permanently remove all cancelled orders? This action cannot be undone."
        confirmText="Yes, delete all"
        type="danger"
      />
    </Drawer>
  );
}
