"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";

export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface QuickActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actions: QuickAction[];
}

export function QuickActionsDrawer({ 
  isOpen, 
  onClose, 
  title, 
  actions 
}: QuickActionsDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title} width="max-w-md">
      <div className="flex flex-col gap-2 pb-8">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1 mb-2">Available Actions</p>
        
        <div className="flex flex-col gap-1">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                action.onClick();
                onClose();
              }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all group hover:bg-gray-50 text-left border border-transparent hover:border-gray-100 ${
                action.variant === "danger" ? "hover:bg-rose-50/50 hover:border-rose-100" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                action.variant === "danger" 
                  ? "bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white" 
                  : "bg-blue-50 text-brand-blue group-hover:bg-brand-blue group-hover:text-white"
              }`}>
                <Icon name={action.icon as any} size="sm" />
              </div>
              
              <div className="flex flex-col gap-0.5">
                <span className={`text-[13px] font-black tracking-tight ${
                  action.variant === "danger" ? "text-rose-600" : "text-[#1D3557]"
                }`}>
                  {action.label}
                </span>
                {action.description && (
                  <span className="text-[11px] font-bold text-gray-400 group-hover:text-gray-500 transition-colors">
                    {action.description}
                  </span>
                )}
              </div>
              
              <Icon 
                name="chevron_right" 
                size="xs" 
                className={`ml-auto opacity-0 group-hover:opacity-40 transition-all -translate-x-2 group-hover:translate-x-0 ${
                  action.variant === "danger" ? "text-rose-400" : "text-brand-blue"
                }`} 
              />
            </button>
          ))}
        </div>
        
        {/* Help Tip */}
        <div className="mt-6 p-4 rounded-xl bg-gray-50/50 border border-dashed border-gray-200">
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                <Icon name="help_outline" size="xs" />
             </div>
             <p className="text-[11px] font-bold text-gray-500 leading-relaxed italic">
                These actions are contextual to the active view. Exports are processed in background and notified once ready.
             </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
