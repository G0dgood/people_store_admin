"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import Checkbox from "@/app/components/Checkbox";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Dropdown from "../../components/Form/Dropdown";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi2";

const modules = [
 { id: "products", label: "Product Catalog", category: "Inventory" },
 { id: "orders", label: "Order Management", category: "Commerce" },
 { id: "customers", label: "Customer Data", category: "Users" },
 { id: "transactions", label: "Payments & Refunds", category: "Finance" },
 { id: "marketing", label: "Coupons & Deals", category: "Marketing" },
 { id: "support", label: "Support Tickets", category: "System" },
 { id: "settings", label: "Global Config", category: "System" },
];

const roles = [
 { id: "sa", name: "Super Admin", color: "bg-blue-500", users: 3 },
 { id: "ed", name: "Editor", color: "bg-emerald-500", users: 8 },
 { id: "om", name: "Order Mgr", color: "bg-amber-500", users: 5 },
 { id: "st", name: "Support", color: "bg-rose-500", users: 12 },
];

const privileges = [
 { id: "view", label: "View" },
 { id: "create", label: "Create" },
 { id: "edit", label: "Edit" },
 { id: "delete", label: "Delete" },
];

export default function PermissionsAccordion() {
 // matrixState[roleId][moduleId][privilegeId] = boolean
 const [matrixState, setMatrixState] = useState<Record<string, Record<string, Record<string, boolean>>>>(() => {
  const initial: Record<string, Record<string, Record<string, boolean>>> = {};
  roles.forEach(r => {
   initial[r.id] = {};
   modules.forEach(m => {
    initial[r.id][m.id] = {};
    privileges.forEach(p => {
     // SA gets all, others get view only by default
     initial[r.id][m.id][p.id] = r.id === "sa" || p.id === "view";
    });
   });
  });
  return initial;
 });

 const [expandedRoleId, setExpandedRoleId] = useState<string | null>("sa");
 const [activeCategory, setActiveCategory] = useState("All sectors");
 const [searchQuery, setSearchQuery] = useState("");
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

 const togglePermission = (roleId: string, moduleId: string, privId: string) => {
  setMatrixState(prev => ({
   ...prev,
   [roleId]: {
    ...prev[roleId],
    [moduleId]: {
     ...prev[roleId][moduleId],
     [privId]: !prev[roleId][moduleId][privId]
    }
   }
  }));
 };

 const toggleModuleRow = (roleId: string, moduleId: string) => {
  const allOn = privileges.every(p => matrixState[roleId][moduleId][p.id]);
  setMatrixState(prev => ({
   ...prev,
   [roleId]: {
    ...prev[roleId],
    [moduleId]: privileges.reduce((acc, p) => ({ ...acc, [p.id]: !allOn }), {} as any)
   }
  }));
 };

 const filteredModules = modules.filter(module => {
  const matchesCategory = activeCategory === "All sectors" || module.category === activeCategory;
  const matchesSearch = module.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
   module.category.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesCategory && matchesSearch;
 });

 return (
  <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
   {/* Action Bar */}
   <div className="flex justify-between items-end gap-6 mb-2">
    <div className="flex flex-col gap-1">
     <h2 className="text-xl font-black text-[#1D3557]">Administrative Permissions</h2>
     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Role Based Governance</p>
    </div>
    <div className="flex gap-3">
     <Button
      variant="primary"
      shape="rounded-sm"
      iconLeft={<Icon name="verified" folder="icon" size="sm" />}
      onClick={() => setIsSyncModalOpen(true)}
     >
      Deploy All Policies
     </Button>
    </div>
   </div>

   {/* Global Filter Bar */}
   <div className="bg-white rounded-[6px] border border-[#1C1C1C1A] p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between">
    <div className="flex items-center gap-3 w-full lg:w-auto">
     <Dropdown
      options={[
       { value: "All sectors", label: "All Administrative Sectors" },
       { value: "Inventory", label: "Inventory Sector" },
       { value: "Commerce", label: "Commerce Sector" },
       { value: "Users", label: "Users Sector" },
       { value: "Finance", label: "Finance Sector" },
       { value: "Marketing", label: "Marketing Sector" },
       { value: "System", label: "System Sector" },
      ]}
      value={activeCategory}
      onChange={setActiveCategory}
      className="w-full lg:w-[250px]"
      size="md"
      variant="minimal"
     />
     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap hidden xl:block">:Filter Sector</span>
    </div>

    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
     <div className="flex-1 xl:w-80 relative group">
      <Input
       type="text"
       placeholder="Search modules or keywords..."
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Icon name="search-01" folder="dashboardIcon" size="xs" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-blue transition-colors" />
     </div>
     <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
    </div>
   </div>

   {/* Role Accordion List */}
   <div className="flex flex-col gap-4">
    {roles.map((role) => {
     const isExpanded = expandedRoleId === role.id;

     return (
      <div key={role.id} className="bg-white rounded-[6px] border border-[#1C1C1C1A] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md">
       {/* Accordion Header */}
       <button
        onClick={() => setExpandedRoleId(isExpanded ? null : role.id)}
        className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isExpanded ? 'bg-gray-50/50 border-b border-gray-100' : 'hover:bg-gray-50/30'}`}
       >
        <div className="flex items-center gap-4">
         <div className={`w-3 h-3 rounded-full ${role.color} shadow-sm`} />
         <div className="flex flex-col gap-0.5">
          <span className="text-base font-black text-[#1D3557]">{role.name}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{role.users} Active Users Assigned</span>
         </div>
        </div>
        <div className="flex items-center gap-4">
         <div className="flex -space-x-2 mr-2">
          {[1, 2, 3].map(i => (
           <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
            <Icon name="user-profile-circle" folder="dashboardIcon" size="sm" className="text-gray-300" />
           </div>
          ))}
         </div>
         <HiChevronDown
          className={`text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          size={20}
         />
        </div>
       </button>

       {/* Accordion Content */}
       <AnimatePresence>
        {isExpanded && (
         <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
         >
          <div className="p-0 sm:p-0 overflow-x-auto admin-table-container">
           <table className="w-full">
            <thead>
             <tr className="bg-gray-50/20 border-b border-gray-100">
              <th className="py-4 pl-8 text-left">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Module</span>
              </th>
              {privileges.map(p => (
               <th key={p.id} className="py-4 text-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.label}</span>
               </th>
              ))}
              <th className="py-4 pr-8 text-right w-24">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Toggle All</span>
              </th>
             </tr>
            </thead>
            <tbody>
             {filteredModules.map((module, mIdx) => (
              <motion.tr
               key={module.id}
               initial={{ opacity: 0, x: -5 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: mIdx * 0.02 }}
               className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors"
              >
               <td className="py-4 pl-8">
                <div className="flex flex-col">
                 <span className="text-[13px] font-black text-[#1D3557]">{module.label}</span>
                 <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{module.category} Sector</span>
                </div>
               </td>
               {privileges.map(p => (
                <td key={p.id} className="py-4 text-center px-4">
                 <div className="flex justify-center items-center">
                  <div className={`p-1.5 rounded-lg transition-all ${matrixState[role.id][module.id][p.id] ? 'bg-emerald-50/40' : 'hover:bg-gray-50'}`}>
                   <Checkbox
                    checked={matrixState[role.id][module.id][p.id]}
                    onChange={() => togglePermission(role.id, module.id, p.id)}
                   />
                  </div>
                 </div>
                </td>
               ))}
               <td className="py-4 pr-8 text-right">
                <button
                 onClick={() => toggleModuleRow(role.id, module.id)}
                 className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 hover:bg-brand-blue-light hover:text-brand-blue transition-all"
                >
                 <Icon name="verified" folder="icon" size="md" />
                </button>
               </td>
              </motion.tr>
             ))}
            </tbody>
           </table>

           {filteredModules.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic opacity-60">No modules found for current filters</span>
            </div>
           )}
          </div>
         </motion.div>
        )}
       </AnimatePresence>
      </div>
     );
    })}
   </div>

   {/* Global Sync Modal */}
   <ConfirmationModal
    isOpen={isSyncModalOpen}
    onClose={() => setIsSyncModalOpen(false)}
    onConfirm={() => {
     console.log("Deploying role-based policies globally...");
     setIsSyncModalOpen(false);
    }}
    title="Deploy Governance Policies"
    message="Are you sure you want to force synchronize these role-based access rules across all server instances? This will override local permission sets for all active accounts immediately."
    confirmText="Initialize Sync"
    type="success"
   />
  </div>
 );
}
