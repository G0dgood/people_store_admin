"use client";

import React from "react";
import moment from "moment";
import { FiShoppingCart, FiUsers, FiCreditCard } from "react-icons/fi";
import { MdOutlineInventory2 } from "react-icons/md";
import Drawer from "../Drawer/Drawer";
import { Button } from "../Button";
import { Avatar } from "../Other/Avatar";
import { useGetRolesQuery, useGetRolePrivilegesQuery } from "@/lib/redux/services/roleApi";
import { useDeleteStaffMutation, useLockStaffSessionMutation, useResetStaffPasswordMutation, useGetUserByIdQuery } from "@/lib/redux/services/authApi";
import { ConfirmationModal } from "./ConfirmationModal";
import { toast } from "sonner";
import { HiOutlineCube, HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineShoppingBag, HiLockClosed, HiLockOpen, HiKey } from "react-icons/hi2";
import { BiLoaderAlt } from "react-icons/bi";
import { Input } from "../Form/Inputs";
import { StaffProfileSkeleton } from "./StaffProfileSkeleton";

interface StaffDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  staff: any;
}

export function StaffDetailDrawer({ isOpen, onClose, staff }: StaffDetailDrawerProps) {
  // 1. Fetch all roles to find the ID for the staff member's role name
  const { data: allRoles = [] } = useGetRolesQuery();
  const staffRole = allRoles.find(r => r.name === staff?.role);
  const roleId = staffRole?._id;

  // 2. Fetch structured privileges for this role
  const { data: rolePrivileges, isLoading: isPrivilegeLoading } = useGetRolePrivilegesQuery(roleId!, {
    skip: !roleId || !isOpen
  });

  // 3. Fetch latest staff status to ensure Lock/Unlock toggle is accurate
  const { data: liveStaffData } = useGetUserByIdQuery(staff?._id, {
    skip: !staff?._id || !isOpen
  });

  const currentStaff = liveStaffData || staff;

  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const [lockStaff, { isLoading: isLocking }] = useLockStaffSessionMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetStaffPasswordMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = React.useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = React.useState(false);
  const [tempPassword, setTempPassword] = React.useState("password123");

  const handleRevokeAccess = async () => {
    try {
      await deleteStaff(staff._id).unwrap();
      toast.success("Access Revoked", {
        description: `${staff.fullName} has been removed from the system.`
      });
      setIsDeleteModalOpen(false);
      onClose();
    } catch (err: any) {
      toast.error("Action Failed", {
        description: err.data?.message || "Could not revoke access."
      });
    }
  };

  const handleLockSession = async () => {
    try {
      const isCurrentlySuspended = currentStaff.status === "Suspended";
      await lockStaff(staff._id).unwrap();
      toast.success(isCurrentlySuspended ? "Account Unlocked" : "Session Locked", {
        description: `${staff.fullName}'s account has been ${isCurrentlySuspended ? "reactivated" : "suspended and session terminated"}.`
      });
      setIsLockModalOpen(false);
    } catch (err: any) {
      toast.error("Action Failed", {
        description: err.data?.message || "Could not modify session status."
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      const result = await resetPassword({ userId: staff._id, newPassword: tempPassword }).unwrap();
      toast.success("Password Reset Successfully", {
        description: `The password for ${staff.fullName} has been reset to: ${tempPassword}.`
      });
      setIsResetModalOpen(false);
    } catch (err: any) {
      toast.error("Reset Failed", {
        description: err.data?.message || "Could not reset password."
      });
    }
  };

  if (!staff) return null;

  const getAccessLabel = (perms: { view: boolean, create: boolean, edit: boolean, delete: boolean }) => {
    if (perms.view && perms.create && perms.edit && perms.delete) return "Full Access";
    if (perms.view && perms.edit) return "Edit Only";
    if (perms.view) return "View Only";
    return "Restricted";
  };

  const getModuleIcon = (moduleName: string) => {
    const name = moduleName.toLowerCase();
    if (name.includes("order")) return <FiShoppingCart size={14} />;
    if (name.includes("product") || name.includes("invent")) return <MdOutlineInventory2 size={14} />;
    if (name.includes("customer") || name.includes("user")) return <FiUsers size={14} />;
    if (name.includes("financial") || name.includes("transaction")) return <FiCreditCard size={14} />;
    if (name.includes("perm") || name.includes("role") || name.includes("govern")) return <HiOutlineShieldCheck size={14} />;
    return <HiOutlineCube size={14} />;
  };

  const permissions = rolePrivileges?.permissions?.map(p => ({
    label: p.moduleName,
    status: getAccessLabel(p.permissions),
    icon: getModuleIcon(p.moduleName)
  })) || [];

  const recentActivity: any[] = []; // Hidden for now as requested

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Staff Member Profile">
      {isPrivilegeLoading ? (
        <StaffProfileSkeleton />
      ) : (
        <div className="flex flex-col gap-8 pb-12">
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden group  ">
            <div className="absolute top-0 inset-x-0 h-20 bg-[#1D3557] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500" />

            <Avatar
              src={staff.avatar}
              name={staff.fullName}
              size="xl"
              className="border-4 border-white shadow-xl relative z-10 -mt-2 group-hover:scale-105 transition-transform duration-500"
            />

            <div className="flex flex-col gap-1 relative z-10">
              <h3 className="text-xl font-black text-[#1D3557] tracking-tight">{staff.fullName}</h3>
              <p className="text-xs font-bold text-gray-400 truncate max-w-[200px]">{staff.email}</p>
            </div>

            <div className="flex gap-2 relative z-10">
              <span className="px-3 py-1 bg-gray-100 rounded-[6px] text-[10px] font-black uppercase tracking-widest text-gray-500">
                {currentStaff.role}
              </span>
              {(() => {
                const statuses: Record<string, string> = {
                  Active: "bg-emerald-50 text-emerald-500 border-emerald-100/50",
                  Inactive: "bg-rose-50 text-rose-500 border-rose-100",
                  Pending: "bg-amber-50 text-amber-600 border-amber-100",
                  Suspended: "bg-rose-50 text-rose-500 border-rose-100",
                };
                const statusStyle = statuses[currentStaff.status] || statuses.Inactive;
                return (
                  <span className={`px-3 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-widest border ${statusStyle}`}>
                    {currentStaff.status || "Inactive"}
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Organization Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-200 flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department</span>
              <span className="text-sm font-black text-[#1D3557]">{staff.department || "General"}</span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-200 flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee ID</span>
              <span className="text-sm font-black text-[#1D3557]">STF-{staff.id?.toString().substr(-4).toUpperCase() || staff._id?.toString().substr(-4).toUpperCase()}</span>
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-200 flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gender</span>
              <span className="text-sm font-black text-[#1D3557]">{staff.gender || "Other"}</span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-200 flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date of Birth</span>
              <span className="text-sm font-black text-[#1D3557]">
                {staff.dob ? moment(staff.dob).format('MMM DD, YYYY') : "Not Specified"}
              </span>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">Module Access</h4>
              <button className="text-[10px] font-black text-brand-gold uppercase tracking-widest hover:underline">Edit All</button>
            </div>
            <div className="flex flex-col gap-2">
              {permissions.map((perm, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-brand-gold/20 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-colors">
                      {perm.icon}
                    </div>
                    <span className="text-[13px] font-bold text-[#1D3557]">{perm.label}</span>
                  </div>
                  {(() => {
                    const statusColors: Record<string, string> = {
                      "Full Access": "bg-emerald-50 text-emerald-500",
                      "Edit Only": "bg-amber-50 text-amber-600",
                      "View Only": "bg-blue-50 text-blue-500",
                      "Restricted": "bg-rose-50 text-rose-500",
                    };
                    const colorClass = statusColors[perm.status] || "bg-gray-50 text-gray-400";
                    return (
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded ${colorClass}`}>
                        {perm.status}
                      </span>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Timeline - Hidden until backend supports audit logging */}
          {recentActivity.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Recent Activity</h4>
              <div className="flex flex-col gap-5 pl-2">
                {recentActivity.map((act, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i !== recentActivity.length - 1 && (
                      <div className="absolute left-[7px] top-4 bottom-[-20px] w-[2px] bg-gray-100" />
                    )}
                    <div className="w-[16px] h-[16px] rounded-full bg-white border-2 border-brand-gold   mt-1 z-10 shrink-0" />
                    <div className="flex flex-col gap-0.5" >
                      <span className="text-[11px] font-black text-[#1D3557] leading-tight">
                        {act.action} <span className="text-gray-400 font-bold ml-1">{act.target}</span>
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-auto flex flex-col gap-3 pt-4 no-invert">
            <div className="flex gap-3 w-full">
              <Button
                shape="rounded-sm"
                variant="outline"
                className={`flex-1 font-black text-xs h-12 uppercase tracking-widest transition-all duration-300 
          ${currentStaff.status === "Suspended" ? "text-emerald-500 border-emerald-100 bg-emerald-50/30 hover:bg-emerald-100" : "hover:text-brand-gold hover:border-brand-gold"}`}
                disabled={isLocking}
                onClick={() => setIsLockModalOpen(true)}
                iconLeft={isLocking ? <BiLoaderAlt className="animate-spin" size={14} /> : (currentStaff.status === "Suspended" ? <HiLockOpen size={14} /> : <HiLockClosed size={14} />)}
              >
                {isLocking ? "Processing..." : (currentStaff.status === "Suspended" ? "Unlock Session" : "Lock Session")}
              </Button>
              <Button
                shape="rounded-sm"
                variant="outline"
                className="flex-1 font-black text-xs h-12 uppercase tracking-widest text-rose-500 border-rose-100 bg-rose-50/30 hover:bg-rose-100"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(true)}
                iconLeft={isDeleting && <BiLoaderAlt className="animate-spin" size={14} />}
              >
                {isDeleting ? "Revoking..." : "Revoke Access"}
              </Button>
            </div>
            <Button
              shape="rounded-sm"
              variant="outline"
              className="w-full font-black text-xs h-12 uppercase tracking-widest text-brand-gold border-brand-gold/20 bg-brand-gold/5 hover:bg-brand-gold/10 transition-all duration-300"
              disabled={isResetting}
              onClick={() => setIsResetModalOpen(true)}
              iconLeft={isResetting ? <BiLoaderAlt className="animate-spin" size={16} /> : <HiKey size={16} />}
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleRevokeAccess}
        title="Revoke Administrative Access"
        message={`Are you sure you want to permanently remove ${staff.fullName}? This will delete their account and immediately terminate all active sessions.`}
        confirmText="Yes, Revoke Permanently"
        type="danger"
      />

      <ConfirmationModal
        isOpen={isLockModalOpen}
        onClose={() => setIsLockModalOpen(false)}
        onConfirm={handleLockSession}
        title={currentStaff.status === "Suspended" ? "Unlock Staff Account" : "Lock Staff Session"}
        message={currentStaff.status === "Suspended"
          ? `Are you sure you want to reactivate ${staff.fullName}'s account? They will be able to log in again.`
          : `Are you sure you want to lock ${staff.fullName}'s session? They will be forcibly logged out and their status will be set to Suspended.`}
        confirmText={currentStaff.status === "Suspended" ? "Yes, Unlock" : "Yes, Lock Session"}
        type={currentStaff.status === "Suspended" ? "warning" : "danger"}
      />

      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetPassword}
        title="Reset Staff Password"
        message={`Are you sure you want to reset the password for ${staff.fullName}? This will generate a new temporary password and log them out of all active sessions.`}
        confirmText="Yes, Reset Password"
        type="warning"
        isLoading={isResetting}
        icon={<HiKey size={28} />}
      >
        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Temporary Password</label>
          <Input
            shape="rounded-sm"
            value={tempPassword}
            onChange={(e) => setTempPassword(e.target.value)}
            placeholder="Enter new password"
            className="bg-gray-50 border-gray-200"
          />
          <p className="text-[10px] text-gray-400 font-medium ml-1 italic mt-1">
            The staff member will be required to use this password on their next login.
          </p>
        </div>
      </ConfirmationModal>
    </Drawer>
  );
}
