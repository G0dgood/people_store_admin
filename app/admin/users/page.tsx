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
import { FiEdit3 } from "react-icons/fi";

const staffData = [
 {
  id: 1,
  name: "Wade Warren",
  email: "wade.warren@example.com",
  gender: "Male",
  dob: "1988-05-12",
  role: "Super Admin",
  lastActive: "Now",
  status: "Active",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  department: "Management"
 },
 {
  id: 2,
  name: "Esther Howard",
  email: "esther.h@example.com",
  gender: "Female",
  dob: "1994-11-20",
  role: "Editor",
  lastActive: "12 mins ago",
  status: "Active",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  department: "Content"
 },
 {
  id: 3,
  name: "Cameron Williamson",
  email: "cameron.w@example.com",
  gender: "Male",
  dob: "1991-03-25",
  role: "Order Manager",
  lastActive: "2 days ago",
  status: "Inactive",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  department: "Logistics"
 },
 {
  id: 4,
  name: "Jenny Wilson",
  email: "jenny.w@example.com",
  gender: "Female",
  dob: "1996-08-14",
  role: "Support",
  lastActive: "5 hours ago",
  status: "Active",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  department: "Support"
 },
 {
  id: 5,
  name: "Robert Fox",
  email: "robert.f@example.com",
  gender: "Male",
  dob: "1990-12-04",
  role: "Editor",
  lastActive: "1 day ago",
  status: "Active",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  department: "Content"
 },
];

const roleColors = {
 "Super Admin": "text-[#1D3557] bg-gray-100",
 "Editor": "text-brand-gold bg-brand-gold/10",
 "Order Manager": "text-emerald-500 bg-emerald-50",
 "Support": "text-amber-500 bg-amber-50",
};

const statusStyles = {
 Active: "text-emerald-500 bg-emerald-50",
 Inactive: "text-gray-400 bg-gray-50",
};

export default function UsersManagement() {
 const [activeTab, setActiveTab] = useState("All staff");
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [selectedIds, setSelectedIds] = useState<number[]>([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [userToDelete, setUserToDelete] = useState<any>(null);
 const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
 const [isStaffDetailOpen, setIsStaffDetailOpen] = useState(false);
 const [selectedStaff, setSelectedStaff] = useState<any>(null);
 const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [userToEdit, setUserToEdit] = useState<any>(null);

 const toggleAll = () => {
  if (selectedIds.length === staffData.length) {
   setSelectedIds([]);
  } else {
   setSelectedIds(staffData.map(s => s.id));
  }
 };

 const toggleItem = (id: number) => {
  setSelectedIds(prev =>
   prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
  );
 };

 const filteredStaff = staffData.filter(user => {
  if (activeTab === "All staff") return true;
  return user.role === activeTab || user.status === activeTab;
 });

 return (
  <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
   <div className="flex justify-end gap-3 w-full sm:w-auto">
    <Button shape="rounded-sm" variant="primary"
     className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold shadow-md shadow-brand-gold/10 h-10 px-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
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
      tabs={["All staff", "Super Admin", "Editor", "Support"]}
      activeTab={activeTab}
      onChange={setActiveTab} id={""} />

     <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
      <Input shape="rounded-sm" 
       type="text"
       placeholder="Search by name, email or role..."
       containerClassName="flex-1 xl:w-80"
       className="bg-gray-50/50 border-gray-200 placeholder:text-gray-400 text-xs font-medium"
       suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
      />
      <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

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
          checked={selectedIds.length === staffData.length && staffData.length > 0}
          onChange={toggleAll}
         />
        </th>
        <th>Full Name</th>
        <th>User Role</th>
        <th>Department</th>
        <th>Last Active</th>
        <th>Status</th>
        <th className="text-right pr-6">Action</th>
       </tr>
      </thead>
      <tbody>
       {filteredStaff.map((user, i) => (
        <tr key={user.id} className="group">
         <td className="w-10 pl-6">
          <Checkbox
           checked={selectedIds.includes(user.id)}
           onChange={() => toggleItem(user.id)}
          />
         </td>
         <td>
          <div className="flex items-center gap-4 py-2">
           <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
           </div>
           <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-[#1D3557] group-hover:text-brand-gold transition-colors truncate">{user.name}</span>
            <span className="text-[10px] font-medium text-gray-400 truncate tracking-tight">{user.email}</span>
           </div>
          </div>
         </td>
         <td>
          <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-black uppercase tracking-widest ${roleColors[user.role as keyof typeof roleColors]}`}>
           {user.role}
          </span>
         </td>
         <td>
          <span className="text-xs font-bold text-gray-500 tracking-tight">{user.department}</span>
         </td>
         <td>
          <div className="flex flex-col gap-0.5">
           <span className="text-xs font-black text-[#1D3557]">{user.lastActive}</span>
           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter opacity-70">Synchronized</span>
          </div>
         </td>
         <td>
          <div className="flex items-center gap-2">
           <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
           <span className={`px-2.5 py-1 rounded-[6px] text-[10px] font-black ${statusStyles[user.status as keyof typeof statusStyles]}`}>
            {user.status}
           </span>
          </div>
         </td>
         <td className="text-right">
          <div className="flex justify-end gap-3 transition-all duration-300">
           <Button shape="rounded-sm" variant="outline"
            className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold border-gray-200 transition-all"
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
       ))}
      </tbody>
     </table>
    </div>

    {/* Pagination Footer */}
    <div className="p-4 bg-gray-50/30 border-t border-gray-50 mt-auto">
     <Pagination
      currentPage={currentPage}
      totalPages={1}
      onPageChange={setCurrentPage}
     />
    </div>
   </div>

   <ConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={() => {
     console.log(`Removing user ${userToDelete?.name}...`);
     setIsDeleteModalOpen(false);
    }}
    title="Revoke Administrative Access"
    message={`Are you sure you want to remove ${userToDelete?.name} from the administrative system? This action will immediately terminate their active session and revoke all permissions.`}
    confirmText="Yes, Revoke Access"
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
    items={staffData}
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
