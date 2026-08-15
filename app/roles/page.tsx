"use client";

import React, { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { AddRoleModal } from "@/app/components/Admin/AddRoleModal";
import { UpdateRoleModal } from "@/app/components/Admin/UpdateRoleModal";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { EditRoleDrawer } from "@/app/components/Admin/EditRoleDrawer";
import { RolesMoreActionsDrawer } from "@/app/components/Admin/RolesMoreActionsDrawer";
import { BulkActionsDrawer } from "@/app/components/Admin/BulkActionsDrawer";
import { motion, AnimatePresence } from "framer-motion";
import { Select } from "@/app/components/Form";
import Dropdown from "@/app/components/Form/Dropdown";
import { HiUsers, HiPencil, HiArrowPath } from "react-icons/hi2";
import { NoRecordFound, SVGLoaderFetch } from "@/app/components/Options";
import { useGetRolesQuery, useDeleteRoleMutation, Role } from "@/lib/redux/services/roleApi";
import { toast } from "sonner";
import { usePrivilege } from "@/lib/contexts/PrivilegeContext";
import { Tooltip } from "@/app/components/Tooltip";

export default function RolesManagement() {
 const [activeTab, setActiveTab] = useState("All roles");
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [selectedIds, setSelectedIds] = useState<string[]>([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
 const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
 const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
 const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
 const [isSyncConfirmOpen, setIsSyncConfirmOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");

 // RTK Query hooks
 const { data: rolesData, isLoading, refetch, isFetching } = useGetRolesQuery({
  page: currentPage,
  limit: rowsPerPage,
  search: searchQuery,
 });
 
 const roles = rolesData?.roles || [];
 const pagination = rolesData?.pagination;
 const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();
 const { canAccess } = usePrivilege();

 const toggleAll = () => {
  if (selectedIds.length === roles.length) {
   setSelectedIds([]);
  } else {
   setSelectedIds(roles.map((r: Role) => r._id));
  }
 };

 const toggleItem = (id: string) => {
  setSelectedIds(prev =>
   prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
  );
 };

 const filteredRoles = roles; // Removed department filtering logic

 const handleDeleteRole = async () => {
  if (!roleToDelete) return;
  try {
   await deleteRole(roleToDelete._id).unwrap();
   toast.success("Role Deleted", {
    description: `The "${roleToDelete.name}" rule set has been successfully removed.`
   });
   setRoleToDelete(null);
  } catch (err: any) {
   toast.error("Delete Failed", {
    description: err.data?.message || "Something went wrong while removing the role."
   });
  }
 };

 return (
  <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
   {/* Action Bar */}
   <div className="flex justify-end items-center gap-3">
    <Button shape="rounded-sm" variant="outline"
     className="border-gray-200 text-gray-500 group"
     iconLeft={<HiArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
     onClick={() => refetch()}
     disabled={isLoading || isFetching}
    >
     {isFetching ? "Refreshing..." : "Refresh List"}
    </Button>
    {canAccess("roles", "create") && (
     <Button shape="rounded-sm" variant="primary"
      className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
      iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
      onClick={() => setIsAddModalOpen(true)}
     >
      Add Role
     </Button>
    )}
    <Button shape="rounded-sm" variant="outline"
     onClick={() => setIsMoreActionsOpen(true)}
    >
     More Action
    </Button>
   </div>

   <div className="bg-white rounded-[6px] border border-[#1C1C1C1A] overflow-hidden flex flex-col min-h-[600px]">
    {/* Filter Controls Bar */}
    <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
     <div className="flex items-center gap-3 w-full lg:w-auto">
      <h2 className="text-sm font-black text-[#121212] uppercase tracking-widest">Administrative Roles</h2>
     </div>

     <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
      <div className="flex-1 xl:w-80 relative group">
       <Input shape="rounded-sm"
        type="text"
        placeholder="Filter roles by keyword..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
       />
       <Icon name="search-01" folder="dashboardIcon" size="xs" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-gold transition-colors" />
      </div>

      <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

      <div className="flex gap-2">
       <Button shape="rounded-sm" variant="outline"
        className="!p-2.5 text-gray-400 border-gray-200">
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
          checked={selectedIds.length === roles.length && roles.length > 0}
          onChange={toggleAll}
         />
        </th>
        <th>Administrative Role</th>
        <th>Module Coverage</th>
        <th>Assigned Members</th>
        <th>Governance Status</th>
        <th className="text-right">Action</th>
       </tr>
      </thead>
      <tbody>
       {isLoading ? (
        <SVGLoaderFetch colSpan={6} text={"Loading administrative roles..."} />
       ) : filteredRoles.length === 0 ? (
        <NoRecordFound colSpan={6} />
       ) : (
        filteredRoles.map((role: Role) => (
         <tr
          key={role._id}
          className="group border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
         >
          <td>
           <div className="flex items-center justify-center">
            <Checkbox
             checked={selectedIds.includes(role._id)}
             onChange={() => toggleItem(role._id)}
            />
           </div>
          </td>
          <td className="py-6">
           <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-black text-[#121212] group-hover:text-brand-gold transition-colors">
             {role.name}
            </span>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Policy Ruleset</span>
           </div>
          </td>
          <td className="max-w-[320px] py-6">
           <p className="text-[12px] md:text-[14px] font-medium text-gray-400 leading-relaxed pr-4 line-clamp-2">
            {role.description}
           </p>
          </td>
          <td className="py-6">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200 group-hover:bg-brand-gold/10 group-hover:border-brand-gold/20 transition-all cursor-default">
            <HiUsers className="text-gray-400 group-hover:text-brand-gold w-3.5 h-3.5" />
            <span className="text-[11px] font-black text-[#121212]">{role.users || 0} Active</span>
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
           <div className="flex justify-end gap-2.5">
            {canAccess("roles", "edit") && (
             <Tooltip text="Edit Basic Rule Info">
              <Button shape="rounded-sm" variant="outline"
               className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold border-gray-200 transition-all"
               onClick={() => {
                setRoleToEdit(role);
                setIsUpdateModalOpen(true);
               }}
              >
               <HiPencil className="w-3.5 h-3.5" />
              </Button>
             </Tooltip>
            )}
            {canAccess("roles", "edit") && (
             <Tooltip text="Manage Permissions Matrix">
              <Button shape="rounded-sm" variant="outline"
               className="!p-1.5 text-gray-400 hover:text-white hover:bg-[#121212] hover:border-[#121212] border-gray-200 transition-all font-bold"
               onClick={() => {
                setRoleToEdit(role);
                setIsEditDrawerOpen(true);
               }}
              >
               <Icon name="settings" folder="dashboardIcon" size="sm" />
              </Button>
             </Tooltip>
            )}
            {canAccess("roles", "delete") && (
             <Tooltip text="Permanently Revoke Role">
              <Button shape="rounded-sm" variant="outline"
               className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 border-gray-200 transition-all"
               onClick={() => setRoleToDelete(role)}
              >
               <Icon name="Delete" folder="dashboardIcon" size="sm" />
              </Button>
             </Tooltip>
            )}
           </div>
          </td>
         </tr>
        ))
       )}
      </tbody>
     </table>
    </div>

    {/* Pagination Footer */}
    <div className="mt-auto border-t border-gray-50 bg-white">
     <Pagination
      currentPage={currentPage}
      totalPages={pagination?.pages || 1}
      onPageChange={setCurrentPage}
     />
    </div>
   </div>

   {/* Confirmation Modals & Drawers */}
   <ConfirmationModal
    isOpen={!!roleToDelete}
    onClose={() => setRoleToDelete(null)}
    onConfirm={handleDeleteRole}
    title="Revoke Administrative Access"
    message={`Are you sure you want to completely remove the "${roleToDelete?.name}" rule set? This action will impact any assigned users and transition them to a restricted access state.`}
    confirmText={isDeleting ? "Revoking..." : "Yes, Revoke Access"}
    type="danger"
   />

   <AddRoleModal
    isOpen={isAddModalOpen}
    onClose={() => setIsAddModalOpen(false)}
   />

   <UpdateRoleModal
    isOpen={isUpdateModalOpen}
    onClose={() => setIsUpdateModalOpen(false)}
    role={roleToEdit}
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
     setIsSyncConfirmOpen(false);
     toast.success("Governance Synchronized", {
      description: "Role policies have been forced across all server instances."
     });
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
    items={roles}
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
