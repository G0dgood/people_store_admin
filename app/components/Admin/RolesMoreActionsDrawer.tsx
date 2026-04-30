"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";

interface RolesMoreActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncPermissions: () => void;
}

export function RolesMoreActionsDrawer({ isOpen, onClose, onSyncPermissions }: RolesMoreActionsDrawerProps) {
  const actions = [
    {
      id: "audit",
      title: "Export Audit Log",
      description: "Download a detailed record of all administrative actions and permission changes.",
      icon: "cloud_download",
      folder: "icon",
      onClick: () => console.log("Exporting audit logs..."),
    },
    {
      id: "sync",
      title: "Sync Global Rules",
      description: "Force synchronize administrative access rules across all connected server instances.",
      icon: "arrow-refresh-06",
      folder: "dashboardIcon",
      onClick: () => {
        onClose();
        onSyncPermissions();
      },
    },
    {
      id: "bulk-deactivate",
      title: "Deactivate Multiple Roles",
      description: "Suspends all roles except Super Admin. Use only in emergency security scenarios.",
      icon: "block",
      folder: "icon",
      variant: "danger",
      onClick: () => console.log("Caution: Bulk deactivation triggered..."),
    },
    {
      id: "reports",
      title: "Staff Activity Report",
      description: "Generate a summary of administrative logins and module access frequency.",
      icon: "description",
      folder: "icon",
      onClick: () => console.log("Opening activity reports..."),
    },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Roles: More Actions">
      <div className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-2">
            Governance Tools
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

        <div className="mt-auto p-5 bg-[#1D3557] rounded-2xl border border-blue-900 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
             <Icon name="verified" folder="icon" size="lg" className="text-white w-20 h-20" />
          </div>
          <div className="relative z-10 flex flex-col gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center text-blue-400">
                <Icon name="verified" folder="icon" size="sm" />
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[14px] font-black text-white">Administrative Governance</span>
                <span className="text-[11px] font-medium text-blue-200/60 leading-relaxed">
                   Enforce strict access control. Reviewing audit logs regularly ensures system integrity and compliance.
                </span>
             </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
