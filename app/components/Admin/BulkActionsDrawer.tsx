"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { SelectionSummary } from "./SelectionSummary";
import { Icon } from "../Icon";

interface BulkAction {
  id: string;
  title: string;
  icon: string;
  folder: "icon" | "dashboardIcon";
  onClick: () => void;
  variant?: "default" | "danger";
}

interface BulkActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: any[];
  items: any[];
  onClearSelection: () => void;
  idProp?: string;
  labelProp?: string;
  title?: string;
  actions?: BulkAction[];
  isLoading?: boolean;
}

export function BulkActionsDrawer({
  isOpen,
  onClose,
  selectedIds,
  items,
  onClearSelection,
  idProp = "id",
  labelProp = "name",
  title = "Bulk Actions",
  actions = [],
  isLoading = false,
}: BulkActionsDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex justify-end">
          {/* Transparent Backdrop to allow clicks on table */}
          {/* We don't render a background div here to keep it non-blocking */}

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="pointer-events-auto relative bg-white h-full shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.12)] z-50 flex flex-col max-w-sm w-full border-l border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0 bg-gray-50/50">
              <div className="flex flex-col">
                <h3 className="text-[16px] font-black text-[#121212]">{title}</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  Batch Management
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all active:scale-95"
              >
                <IoMdClose size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
              <SelectionSummary
                selectedIds={selectedIds}
                items={items}
                onClear={onClearSelection}
                idProp={idProp}
                labelProp={labelProp}
                title="Your Selection"
              />

              {actions.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">
                    Available Actions
                  </p>
                  <div className="flex flex-col gap-2">
                    {actions.map((action) => (
                      <button
                        key={action.id}
                        onClick={action.onClick}
                        disabled={isLoading}
                        className={`flex items-center gap-4 p-3.5 rounded-[4px] transition-all text-left border border-transparent
                          ${action.variant === "danger"
                            ? "hover:bg-rose-50 hover:border-rose-100 text-rose-600"
                            : "hover:bg-brand-gold hover:text-white hover:border-brand-gold text-[#121212]"}
                          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                      >
                        <div className={`w-9 h-9 rounded-[4px] flex items-center justify-center shrink-0
                          ${action.variant === "danger"
                            ? "bg-rose-50 text-rose-500   shadow-rose-100"
                            : "bg-white text-brand-gold   border border-gray-50"}
                        `}>
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Icon name={action.icon} folder={action.folder} size="xs" />
                          )}
                        </div>
                        <span className="text-[12px] font-black">{action.title}</span>
                        <div className="ml-auto opacity-40">
                          <Icon name="arrow_forward" folder="icon" size="xs" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pro Tip Card */}
              <div className="mt-auto p-4 bg-gray-900 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 rotate-12 transition-transform group-hover:rotate-45 duration-500">
                  <Icon name="verified" folder="icon" size="lg" className="text-white w-14 h-14" />
                </div>
                <div className="relative z-10 flex flex-col gap-2">
                  <span className="text-[12px] font-black text-white">Efficiency Tip</span>
                  <p className="text-[10px] font-medium text-gray-400 leading-relaxed">
                    Batch actions apply instantly to all items in your selection list. Always double-check before confirming bulk deletions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
