"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import { UsersMoreActionsDrawer } from "../../components/Admin/UsersMoreActionsDrawer";
import { StaffDetailDrawer } from "../../components/Admin/StaffDetailDrawer";
import { AddUserModal } from "../../components/Admin/AddUserModal";
import { EditUserModal } from "../../components/Admin/EditUserModal";
import { HiArrowPath } from "react-icons/hi2";
import { FiEdit3 } from "react-icons/fi";
import { useGetUsersQuery, useDeleteStaffMutation } from "@/lib/redux/services/authApi";
import { SVGLoaderFetch, NoRecordFound } from "@/app/components/Options";
import { toast } from "sonner";

const roleColors: Record<string, string> = {
  "Super Admin": "text-[#1D3557] bg-gray-100",
  "SUPER_ADMIN": "text-[#1D3557] bg-gray-100",
  "Editor": "text-brand-gold bg-brand-gold/10",
  "Order Manager": "text-emerald-500 bg-emerald-50",
  "Support": "text-amber-500 bg-amber-50",
};

const statusStyles: Record<string, string> = {
  Active: "text-emerald-500 bg-emerald-50",
  Inactive: "text-gray-400 bg-gray-50",
};

export default function UsersManagement() {
  const [activeTab, setActiveTab] = useState("All staff");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isStaffDetailOpen, setIsStaffDetailOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any>(null);

  // RTK Query hooks with pagination params
  const { data, isLoading, refetch, isFetching } = useGetUsersQuery({ 
    page: currentPage, 
    limit: rowsPerPage 
  });

  // Extract users and pagination metadata
  const users = data?.users || [];
  const pagination = data?.pagination || { totalPages: 1, totalUsers: 0 };

  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const toggleAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((s: any) => s._id));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Note: Client-side filtering still happens on the current page's results
  const filteredStaff = users.filter((user: any) => {
    if (activeTab === "All staff") return true;
    return user.role === activeTab;
  });

  const getRoleStyle = (role: string) => {
    return roleColors[role] || "text-gray-500 bg-gray-50";
  };

  const handleDeleteUser = async () => {
    if (!userToDelete?._id) return;
    
    try {
      await deleteStaff(userToDelete._id).unwrap();
      toast.success("Administrative Access Revoked", {
        description: `Successfully removed ${userToDelete.fullName} from the system.`
      });
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err: any) {
      toast.error("Action Failed", {
        description: err.data?.message || "Something went wrong while removing the staff member."
      });
    }
  };

  const handleRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when limit changes
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      <div className="flex justify-end gap-3 w-full sm:w-auto">
        <Button shape="rounded-sm" variant="outline"
          className="border-gray-200 text-gray-500 group"
          iconLeft={<HiArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
        >
          {isFetching ? "Refreshing..." : "Refresh List"}
        </Button>
        <Button shape="rounded-sm" variant="primary"
          iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
          onClick={() => setIsAddUserModalOpen(true)}
        >
          Add User
        </Button>
      </div>
      <div className="bg-white rounded-[6px] border border-[#1C1C1C1A] overflow-hidden flex flex-col min-h-[600px]">
        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All staff", "SUPER_ADMIN", "Editor", "Support"]}
            activeTab={activeTab}
            onChange={setActiveTab} id={"staff-filter"} />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input shape="rounded-sm"
              type="text"
              placeholder="Search by name, email or role..."
              containerClassName="flex-1 xl:w-80"
              className="bg-gray-50/50 border-gray-200 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />
            <RowsPerPage value={rowsPerPage} onChange={handleRowsPerPageChange} />

            <div className="flex gap-2">
              <Button variant="outline" shape="rounded-sm" className="!p-2.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold border-gray-200 transition-all">
                <Icon name="filter" folder="dashboardIcon" size="sm" />
              </Button>
              <Button shape="rounded-sm" variant="outline"
                className="!p-2.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold border-gray-200 transition-all"
                onClick={() => setIsMoreActionsOpen(true)}
              >
                <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-table-container flex-1">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-10 pl-6">
                   <Checkbox
                    checked={selectedIds.length === users.length && users.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>Full Name</th>
                <th>User Role</th>
                <th>Department</th>
                <th>Created Date</th>
                <th>Status</th>
                <th className="text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <SVGLoaderFetch colSpan={7} text={"Synchronizing administrative directory..."} />
              ) : filteredStaff.length === 0 ? (
                <NoRecordFound colSpan={7} />
              ) : (
                filteredStaff.map((user: any) => (
                  <tr key={user._id} className="group">
                    <td className="w-10 pl-6">
                      <Checkbox
                        checked={selectedIds.includes(user._id)}
                        onChange={() => toggleItem(user._id)}
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-4 py-2">
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                          <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=1D3557&color=fff`} alt={user.fullName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-[#1D3557] group-hover:text-brand-gold transition-colors truncate">{user.fullName}</span>
                          <span className="text-[10px] font-medium text-gray-400 truncate tracking-tight">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-black uppercase tracking-widest ${getRoleStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-bold text-gray-500 tracking-tight">{user.department || "N/A"}</span>
                    </td>
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black text-[#1D3557]">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter opacity-70">Joined System</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Inactive' ? 'bg-gray-300' : 'bg-emerald-500 animate-pulse'}`} />
                        <span className={`px-2.5 py-1 rounded-[6px] text-[10px] font-black ${user.status === 'Inactive' ? statusStyles.Inactive : statusStyles.Active}`}>
                          {user.status || 'Active'}
                        </span>
                      </div>
                    </td>
                    <td className="text-right pr-6">
                      <div className="flex justify-end gap-3 transition-all duration-300">
                        <Button shape="rounded-sm" variant="outline"
                          className="!p-1.5 text-gray-400 hover:text-white hover:bg-[#1D3557] hover:border-[#1D3557] border-gray-200 transition-all font-bold"
                          onClick={() => {
                            setSelectedStaff(user);
                            setIsStaffDetailOpen(true);
                          }}
                        >
                          <Icon name="settings" folder="dashboardIcon" size="sm" />
                        </Button>
                        <Button shape="rounded-sm" variant="outline"
                          className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold border-gray-200 transition-all"
                          onClick={() => {
                            setUserToEdit(user);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <FiEdit3 size={14} />
                        </Button>
                        <Button shape="rounded-sm" variant="outline"
                          className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 border-gray-200 transition-all"
                          onClick={() => {
                            setUserToDelete(user);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Icon name="Delete" folder="dashboardIcon" size="sm" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-gray-50/30 border-t border-gray-50 mt-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Revoke Administrative Access"
        message={`Are you sure you want to remove ${userToDelete?.fullName} from the administrative system? This action will immediately terminate their active session and revoke all permissions.`}
        confirmText={isDeleting ? "Revoking..." : "Yes, Revoke Access"}
        type="danger"
      />

      <UsersMoreActionsDrawer
        isOpen={isMoreActionsOpen}
        onClose={() => setIsMoreActionsOpen(false)}
      />

      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
        selectedIds={selectedIds}
        items={users}
        onClearSelection={() => setSelectedIds([])}
        title="Staff Selected"
        actions={[
          {
            id: "export",
            title: "Export Selection",
            icon: "cloud_download",
            folder: "icon",
            onClick: () => {
              console.log("Exporting selected staff data...");
              setSelectedIds([]);
            },
          },
          {
            id: "deactivate",
            title: "Deactivate Selected",
            icon: "block",
            folder: "icon",
            onClick: () => {
              console.log("Deactivating selected staff...");
              setSelectedIds([]);
            },
          },
          {
            id: "delete",
            title: "Revoke Access (Bulk)",
            icon: "Delete",
            folder: "dashboardIcon",
            variant: "danger",
            onClick: () => setIsDeleteModalOpen(true),
          },
        ]}
      />

      <StaffDetailDrawer
        isOpen={isStaffDetailOpen}
        onClose={() => setIsStaffDetailOpen(false)}
        staff={selectedStaff}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        staff={userToEdit}
      />
    </div>
  );
}
