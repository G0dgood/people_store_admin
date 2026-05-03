"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";

interface ReviewsMoreActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onClearSpam?: () => void;
  onBulkApprove?: () => void;
  onExport?: () => void;
}

export function ReviewsMoreActionsDrawer({ 
  isOpen, 
  onClose, 
  onClearSpam, 
  onBulkApprove, 
  onExport 
}: ReviewsMoreActionsDrawerProps) {
  const actions = [
    {
      id: "export",
      title: "Export Feedback",
      description: "Download a comprehensive report of all customer reviews and ratings as a CSV file.",
      icon: "cloud_download",
      folder: "icon",
      onClick: () => {
        onClose();
        onExport?.();
      },
    },
    {
      id: "bulk-approve",
      title: "Bulk Approve Pending",
      description: "Automatically move all reviews in the 'Pending' queue to 'Published' status.",
      icon: "verified",
      folder: "icon",
      onClick: () => {
        onClose();
        onBulkApprove?.();
      },
    },
    {
      id: "clear-spam",
      title: "Clear Spam Queue",
      description: "Permanently delete all reviews currently flagged as Spam from the database.",
      icon: "delete_outline",
      folder: "icon",
      variant: "danger",
      onClick: () => {
        onClose();
        onClearSpam?.();
      },
    },
    {
      id: "sentiment",
      title: "Analyze Sentiment",
      description: "Run an AI-powered sentiment analysis across the latest 100 reviews.",
      icon: "description",
      folder: "icon",
      onClick: () => {},
    },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Reviews: More Actions">
      <div className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-2">
            Moderation Tools
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
                <span className="text-[14px] font-black text-white">Trust & Moderation</span>
                <span className="text-[11px] font-medium text-blue-200/60 leading-relaxed">
                   Maintain a high-quality feedback loop. Keeping your reviews clean improves customer trust and SEO.
                </span>
             </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
