"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { AddRoleModal } from "../../components/Admin/AddRoleModal";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { EditRoleDrawer } from "../../components/Admin/EditRoleDrawer";
import { RolesMoreActionsDrawer } from "../../components/Admin/RolesMoreActionsDrawer";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import { motion, AnimatePresence } from "framer-motion";
import { Select } from "@/app/components/Form";
import Dropdown from "@/app/components/Form/Dropdown";

const rolesData = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full access to all system modules and settings including financial data and user management.",
    users: 3,
    department: "Management",
    status: "Active"
  },
  {
    id: 2,
    name: "Editor",
    description: "Can manage products, categories, and brands. Access to media gallery and reviews.",
    users: 8,
    department: "Content",
    status: "Active"
  },
  {
    id: 3,
    name: "Order Manager",
    description: "Handles order processing, shipping updates, and transaction monitoring.",
    users: 5,
    department: "Logistics",
    status: "Active"
  },
  {
    id: 4,
    name: "Support Staff",
    description: "Access to customer reviews, support tickets, and basic user information.",
    users: 12,
    department: "Support",
    status: "Inactive"
  },
  {
    id: 5,
    name: "Content Creator",
    description: "Permission to upload media, write product descriptions, and manage blog content.",
    users: 6,
    department: "Content",
    status: "Active"
  },
];

export default function RolesManagement() {
  const [activeTab, setActiveTab] = useState("All roles");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<any>(null);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isSyncConfirmOpen, setIsSyncConfirmOpen] = useState(false);

  const toggleAll = () => {
    if (selectedIds.length === rolesData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rolesData.map(r => r.id));
    }
  };

  const toggleItem = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredRoles = rolesData.filter(role => {
    if (activeTab === "All roles") return true;
    return role.department === activeTab;
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Action Bar */}
      <div className="flex justify-end items-center gap-3">
        <Button
          variant="primary"
          shape="rounded-sm"
          iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Role
        </Button>
        <Button
          variant="outline"
          shape="rounded-sm"
          onClick={() => setIsMoreActionsOpen(true)}
        >
          More Action
        </Button>
      </div>

      <div className="bg-white rounded-[6px] border border-[#1C1C1C1A] overflow-hidden flex flex-col min-h-[600px]">
        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Dropdown
              options={[
                { value: "All roles", label: "All Administrative Roles" },
                { value: "Management", label: "Management Unit" },
                { value: "Content", label: "Content Unit" },
                { value: "Logistics", label: "Logistics Unit" },
                { value: "Support", label: "Support Unit" },
              ]}
              value={activeTab}
              onChange={setActiveTab}
              className="w-full lg:w-[220px]"
              size="md"
              variant="minimal"
            />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap hidden xl:block">:Filter By Sector</span>

          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="flex-1 xl:w-80 relative group">
              <Input
                type="text"
                placeholder="Filter roles by keyword..."
              />
              <Icon name="search-01" folder="dashboardIcon" size="xs" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-blue transition-colors" />
            </div>

            <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

            <div className="flex gap-2">
              <Button
                variant="outline"
                shape="rounded-sm"
                className="!p-2.5 text-gray-400 border-gray-200"
              >
                <Icon name="sort" folder="dashboardIcon" size="sm" />
              </Button>
            </div>
          </div>
        </div>

        {/* Roles Table */}
        <div className="admin-table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-14">
                  <Checkbox
                    checked={selectedIds.length === rolesData.length && rolesData.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>Administrative Role</th>
                <th>Module Coverage</th>
                <th>Assigned Members</th>
                <th>Governance Status</th>
                <th className="text-right">Action Matrix</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredRoles.map((role, idx) => (
                  <motion.tr
                    key={role.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td>
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={selectedIds.includes(role.id)}
                          onChange={() => toggleItem(role.id)}
                        />
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-black text-[#1D3557] group-hover:text-brand-blue transition-colors">
                          {role.name}
                        </span>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{role.department} unit</span>
                      </div>
                    </td>
                    <td className="max-w-[320px] py-6">
                      <p className="text-[12px] md:text-[14px] font-medium text-gray-400 leading-relaxed pr-4">
                        {role.description}
                      </p>
                    </td>
                    <td className="py-6 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200 group-hover:bg-white group-hover:border-blue-100 transition-all cursor-default">
                        <Icon name="users" folder="icon" size="xs" className="text-gray-400 group-hover:text-brand-blue" />
                        <span className="text-[11px] font-black text-[#1D3557]">{role.users} Active</span>
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${role.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-gray-300'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${role.status === 'Active' ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {role.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 text-right pr-6">
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          shape="rounded-sm"
                          className="!p-1.5 text-gray-400 hover:text-brand-blue hover:bg-brand-blue-light border-gray-200 transition-all font-bold"
                          onClick={() => {
                            setRoleToEdit(role);
                            setIsEditDrawerOpen(true);
                          }}
                        >
                          <Icon name="settings" folder="dashboardIcon" size="sm" />
                        </Button>
                        <Button
                          variant="outline"
                          shape="rounded-sm"
                          className="!p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 border-gray-200 transition-all"
                          onClick={() => setRoleToDelete(role)}
                        >
                          <Icon name="Delete" folder="dashboardIcon" size="sm" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredRoles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 bg-gray-50/20">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-200 mb-4 shadow-sm">
                <Icon name="star" folder="dashboardIcon" size="lg" />
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">No roles found in this sector</span>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="mt-auto border-t border-gray-50 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={8}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Confirmation Modals & Drawers */}
      <ConfirmationModal
        isOpen={!!roleToDelete}
        onClose={() => setRoleToDelete(null)}
        onConfirm={() => {
          console.log(`Revoking role: ${roleToDelete?.name}`);
          setRoleToDelete(null);
        }}
        title="Revoke Administrative Access"
        message={`Are you sure you want to completely remove the "${roleToDelete?.name}" rule set? This action will impact all ${roleToDelete?.users} assigned users and transition them to a restricted access state.`}
        confirmText="Yes, Revoke Access"
        type="danger"
      />

      <AddRoleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditRoleDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        role={roleToEdit}
      />

      <RolesMoreActionsDrawer
        isOpen={isMoreActionsOpen}
        onClose={() => setIsMoreActionsOpen(false)}
        onSyncPermissions={() => setIsSyncConfirmOpen(true)}
      />

      <ConfirmationModal
        isOpen={isSyncConfirmOpen}
        onClose={() => setIsSyncConfirmOpen(false)}
        onConfirm={() => {
          console.log("Global sync initiated...");
          setIsSyncConfirmOpen(false);
        }}
        title="Synchronize Governance"
        message="Force synchronize administrative access rules across all server instances? This will override legacy configurations with the current master ruleset."
        confirmText="Initialize Sync"
        type="success"
      />

      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
        selectedIds={selectedIds}
        items={rolesData}
        onClearSelection={() => setSelectedIds([])}
        title="Administrative Roles"
        actions={[
          {
            id: "export",
            title: "Export Policy",
            icon: "cloud_download",
            folder: "icon",
            onClick: () => console.log("Exporting roles..."),
          },
          {
            id: "delete",
            title: "Purge Rulesets",
            icon: "Delete",
            folder: "dashboardIcon",
            variant: "danger",
            onClick: () => console.log("Bulk delete initiated..."),
          },
        ]}
      />
    </div>
  );
}
