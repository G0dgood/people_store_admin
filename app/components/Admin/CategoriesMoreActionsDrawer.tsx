"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";

import { SelectionSummary } from "./SelectionSummary";

interface CategoriesMoreActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCleanEmpty: () => void;
  selectedIds: any[];
  items: any[];
  onClearSelection: () => void;
  idProp?: string;
}

export function CategoriesMoreActionsDrawer({
  isOpen,
  onClose,
  onCleanEmpty,
  selectedIds,
  items,
  onClearSelection,
  idProp = "id"
}: CategoriesMoreActionsDrawerProps) {
  const actions = [
    {
      id: "export",
      title: "Export Categories",
      description: "Download the complete category hierarchy as a CSV or Excel file.",
      icon: "cloud_download",
      folder: "icon",
      onClick: () => console.log("Exporting categories..."),
    },
    {
      id: "clean-empty",
      title: "Clean Empty Categories",
      description: "Automatically remove categories that have zero products assigned.",
      icon: "delete_outline",
      folder: "icon",
      variant: "danger",
      onClick: () => {
        onClose();
        onCleanEmpty();
      },
    },
    {
      id: "bulk-reorder",
      title: "Bulk Reorder",
      description: "Enable a drag-and-drop interface to change the display sequence.",
      icon: "sort",
      folder: "icon",
      onClick: () => console.log("Opening bulk reorder interface..."),
    },
    {
      id: "tax-rules",
      title: "Assign Tax Rule",
      description: "Apply a global tax or shipping rule to all selected categories.",
      icon: "verified_user",
      folder: "icon",
      onClick: () => console.log("Assigning tax rules..."),
    },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Categories: More Actions">
      <div className="flex flex-col h-full gap-8">
        <SelectionSummary
          selectedIds={selectedIds}
          items={items}
          onClear={onClearSelection}
          idProp={idProp}
          title="Categories Selected"
          labelProp="name"
        />

        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-2">
            System Operations
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
            <Icon name="star" folder="icon" size="lg" className="text-white w-20 h-20" />
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center text-blue-400">
              <Icon name="verified" folder="icon" size="sm" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-black text-white">Advanced Catalog Control</span>
              <span className="text-[11px] font-medium text-blue-200/60 leading-relaxed">
                Use these tools to clean up and reorganize your storefront's hierarchy for better SEO.
              </span>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
