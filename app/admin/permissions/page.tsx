"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { ConfirmationModal } from "../../components/Admin/ConfirmationModal";
import { AddRoleModal } from "../../components/Admin/AddRoleModal";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { EditRoleDrawer } from "../../components/Admin/EditRoleDrawer";
import { RolesMoreActionsDrawer } from "../../components/Admin/RolesMoreActionsDrawer";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";

const rolesData = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full access to all system modules and settings including financial data and user management.",
    users: ["/dashboardImage/Fashion.png", "/dashboardImage/T-Shirt.png", "/dashboardImage/Cap.png"],
    status: "Active"
  },
  {
    id: 2,
    name: "Editor",
    description: "Can manage products, categories, and brands. Access to media gallery and reviews.",
    users: ["/dashboardImage/Electronics.png", "/dashboardImage/Accessories.png"],
    status: "Active"
  },
  {
    id: 3,
    name: "Order Manager",
    description: "Handles order processing, shipping updates, and transaction monitoring.",
    users: ["/dashboardImage/Cap.png", "/dashboardImage/Fashion.png"],
    status: "Active"
  },
  {
    id: 4,
    name: "Support Staff",
    description: "Access to customer reviews, support tickets, and basic user information.",
    users: ["/dashboardImage/T-Shirt.png"],
    status: "Inactive"
  },
  {
    id: 5,
    name: "Content Creator",
    description: "Permission to upload media, write product descriptions, and manage blog content.",
    users: ["/dashboardImage/Accessories.png", "/dashboardImage/Electronics.png", "/dashboardImage/Fashion.png"],
    status: "Active"
  },
];

const statusStyles = {
  Active: "text-blue-500 bg-brand-blue-light",
  Inactive: "text-gray-400 bg-gray-50",
};

export default function PermissionsListing() {
  const [activeTab, setActiveTab] = useState("All roles");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const [roleToEdit, setRoleToEdit] = useState<any>(null);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isSyncConfirmOpen, setIsSyncConfirmOpen] = useState(false);

  const filteredRoles = rolesData.filter(role => {
    if (activeTab === "All roles") return true;
    if (activeTab === "Admin") return role.name.includes("Admin");
    if (activeTab === "Staff") return role.name.includes("Manager") || role.name.includes("Editor") || role.name.includes("Staff");
    if (activeTab === "User") return !role.name.includes("Admin") && !role.name.includes("Staff") && !role.name.includes("Manager");
    return true;
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
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
            iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            onClick={() => setIsMoreActionsOpen(true)}
          >
            More Action
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All roles", "Admin", "Staff", "User"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input
              type="text"
              placeholder="Search role name..."
              containerClassName="flex-1 xl:w-96"
              className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />
            <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

            <div className="flex gap-2">
              <Button
                variant="outline"
                shape="rounded-sm"
                className="!p-2.5 text-gray-400"
              >
                <Icon name="sort" folder="dashboardIcon" size="sm" />
              </Button>
              <Button
                variant="outline"
                shape="rounded-sm"
                className="!p-2.5 text-gray-400"
              >
                <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
              </Button>
            </div>
          </div>
        </div>

        {/* Roles Table */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-10">
                  <Checkbox
                    checked={selectedIds.length === rolesData.length && rolesData.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>Role Name</th>
                <th>Description</th>
                <th>Assigned Users</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.id} className="group">
                  <td>
                    <Checkbox
                      checked={selectedIds.includes(role.id)}
                      onChange={() => toggleItem(role.id)}
                    />
                  </td>
                  <td>
                    <span className="text-sm font-bold text-[#1D3557] group-hover:text-blue-600 transition-colors">
                      {role.name}
                    </span>
                  </td>
                  <td className="max-w-[400px]">
                    <p className="text-xs font-medium text-gray-500 leading-relaxed line-clamp-2">
                      {role.description}
                    </p>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 border border-gray-100">
                        <Icon name="user-profile-circle" folder="dashboardIcon" size="sm" className="text-gray-400" />
                      </div>
                      <span className="text-sm font-bold text-[#1D3557]">{role.users.length} Users</span>
                    </div>
                  </td>
                  <td>
                    <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusStyles[role.status as keyof typeof statusStyles]}`}>
                      {role.status}
                    </span>
                  </td>
                  <td className="text-right text-gray-300">
                    <div className="flex justify-end gap-4 text-gray-400">
                      <Button
                        variant="outline"
                        shape="rounded-sm"
                        className="!p-1.5 text-gray-400 hover:text-blue-500 hover:bg-brand-blue-light transition-all"
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
                        className="!p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        onClick={() => setRoleToDelete(role)}
                      >
                        <Icon name="Delete" folder="dashboardIcon" size="sm" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={12}
          onPageChange={setCurrentPage}
        />
      </div>

      <ConfirmationModal
        isOpen={!!roleToDelete}
        onClose={() => setRoleToDelete(null)}
        onConfirm={() => {
          console.log(`Deleting role ${roleToDelete?.name}...`);
          setRoleToDelete(null);
        }}
        title="Delete Administrative Role"
        message={`Are you sure you want to delete the "${roleToDelete?.name}" role? This will affect all ${roleToDelete?.users.length} users assigned to it and cannot be undone.`}
        confirmText="Yes, delete role"
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
        isOpen={isMoreActionsOpen && selectedIds.length === 0}
        onClose={() => setIsMoreActionsOpen(false)}
        onSyncPermissions={() => setIsSyncConfirmOpen(true)}
      />

      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
        selectedIds={selectedIds}
        items={rolesData}
        onClearSelection={() => setSelectedIds([])}
        title="Roles Selected"
        actions={[
          {
            id: "export",
            title: "Export Selected",
            icon: "cloud_download",
            folder: "icon",
            onClick: () => console.log("Exporting selected roles..."),
          },
          {
            id: "delete",
            title: "Delete All Selected",
            icon: "Delete",
            folder: "dashboardIcon",
            variant: "danger",
            onClick: () => setIsDeleteModalOpen(true),
          },
        ]}
      />

      <ConfirmationModal
        isOpen={isSyncConfirmOpen}
        onClose={() => setIsSyncConfirmOpen(false)}
        onConfirm={() => {
          console.log("Synchronizing global permissions...");
          setIsSyncConfirmOpen(false);
        }}
        title="Sync Global Rules"
        message="Are you sure you want to force synchronize administrative access rules across all server instances? this will temporarily override local configurations."
        confirmText="Yes, sync now"
        type="success"
      />
    </div>
  );
}
