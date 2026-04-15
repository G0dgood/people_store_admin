"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Switch } from "../Form/Switch";

interface EditRoleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: any;
}

const modules = [
  { id: "products", label: "Products & Inventory", description: "Manage catalog, stock levels, and categories." },
  { id: "orders", label: "Orders & Shipping", description: "Process orders, handle returns, and update tracking." },
  { id: "customers", label: "Customer Management", description: "View profiles, manage loyalty, and export data." },
  { id: "reviews", label: "Reviews & Feedback", description: "Moderate feedback and reply to customer reviews." },
  { id: "transactions", label: "Financial Data", description: "Access transaction logs, refunds, and payouts." },
  { id: "settings", label: "System Settings", description: "Modify storefront configuration and global rules." },
];

export function EditRoleDrawer({ isOpen, onClose, role }: EditRoleDrawerProps) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (role) {
      // Mock hydration: Super Admin gets all, others get random for demo
      const initial: Record<string, boolean> = {};
      modules.forEach(m => {
        initial[m.id] = role.name === "Super Admin";
      });
      setPermissions(initial);
    }
  }, [role]);

  const togglePermission = (id: string) => {
    setPermissions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving role permissions:", { roleId: role.id, permissions });
    onClose();
  };

  if (!role) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Edit Role Permissions">
      <form onSubmit={handleSubmit} className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-6">
          {/* Role Summary */}
          <div className="flex flex-col gap-1 px-4 py-3 bg-brand-blue-light rounded-xl border border-brand-blue/10">
             <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest leading-none">Selected Role</span>
             <span className="text-sm font-black text-[#1D3557]">{role.name}</span>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">Access Matrix</p>
            <div className="flex flex-col gap-3">
              {modules.map((module) => (
                <div 
                  key={module.id} 
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-100 hover:shadow-sm transition-all group"
                >
                  <div className="flex flex-col gap-0.5 max-w-[70%]">
                    <span className="text-[13px] font-black text-[#1D3557] group-hover:text-blue-600 transition-colors">{module.label}</span>
                    <span className="text-[11px] font-bold text-gray-400 leading-tight">{module.description}</span>
                  </div>
                  <Switch 
                    checked={permissions[module.id] || false} 
                    onChange={() => togglePermission(module.id)} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3">
          <Button 
            variant="primary" 
            type="submit"
            className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
          >
            Update Permissions
          </Button>
          <Button 
            variant="ghost" 
            type="button" 
            onClick={onClose}
            className="w-full h-12 text-[11px] font-bold text-gray-400 hover:text-gray-900"
          >
            Discard Changes
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
