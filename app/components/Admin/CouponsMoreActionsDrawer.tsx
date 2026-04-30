"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";

interface CouponsMoreActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteExpired: () => void;
}

export function CouponsMoreActionsDrawer({ isOpen, onClose, onDeleteExpired }: CouponsMoreActionsDrawerProps) {
  const actions = [
    {
      id: "export",
      title: "Export Coupons",
      description: "Download all coupon data as a CSV or Excel file.",
      icon: "cloud_download",
      folder: "icon",
      onClick: () => console.log("Exporting coupons..."),
    },
    {
      id: "delete-expired",
      title: "Delete Expired Coupons",
      description: "Permanently remove all coupons that have reached their end date.",
      icon: "Delete",
      folder: "dashboardIcon",
      variant: "danger",
      onClick: () => {
        onClose();
        onDeleteExpired();
      },
    },
    {
      id: "bulk-deactivate",
      title: "Bulk Deactivate",
      description: "Set all currently active coupons to 'Inactive' status.",
      icon: "menu-close",
      folder: "dashboardIcon",
      onClick: () => console.log("Bulk deactivating coupons..."),
    },
    {
      id: "generate-qr",
      title: "Generate QR Codes",
      description: "Create printable QR codes for all active marketing coupons.",
      icon: "Frame",
      folder: "dashboardIcon",
      onClick: () => console.log("Generating QR codes..."),
    },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="More Actions">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">
          Bulk Management
        </p>
        <div className="flex flex-col gap-1">
          {actions.map((action: any) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-gray-50 group text-left
                ${action.variant === "danger" ? "hover:bg-rose-50" : ""}
              `}
            >
              <div className={`mt-1 w-10 h-10 rounded-lg flex items-center justify-center transition-all
                ${action.variant === "danger" 
                  ? "bg-rose-50 text-rose-500 group-hover:bg-rose-100" 
                  : "bg-brand-gold-light text-brand-gold group-hover:bg-brand-gold group-hover:text-white"}
              `}>
                <Icon name={action.icon} folder={action.folder} size="sm" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <span className={`text-[13px] font-black transition-colors
                  ${action.variant === "danger" ? "text-rose-600" : "text-[#1D3557]"}
                `}>
                  {action.title}
                </span>
                <span className="text-[11px] font-bold text-gray-400 leading-relaxed">
                  {action.description}
                </span>
              </div>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <Icon name="arrow_forward" folder="icon" size="xs" className="text-gray-300" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md text-emerald-500 shadow-sm">
               <Icon name="star" folder="dashboardIcon" size="sm" />
            </div>
            <div className="flex flex-col">
               <span className="text-[11px] font-black text-[#1D3557]">Pro Tip</span>
               <span className="text-[9px] font-bold text-gray-400">You can also schedule coupons for future dates.</span>
            </div>
         </div>
      </div>
    </Drawer>
  );
}
