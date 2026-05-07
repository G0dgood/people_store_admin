import { HiUser } from "react-icons/hi2";
import { Icon } from "../Icon";
import { DropdownMenu, DropdownFooterAction } from "../Dropdown/DropdownMenu";
import { useState } from "react";
import Image from "next/image";
import { ConfirmationModal } from "./ConfirmationModal";
import { useLogoutMutation } from "@/lib/redux/services/authApi";
import { logOut, selectCurrentUser } from "@/lib/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePrivilege } from "@/lib/contexts/PrivilegeContext";

export const AdminProfileDropdown: React.FC = () => {
 const router = useRouter();
 const dispatch = useAppDispatch();
 const user = useAppSelector(selectCurrentUser);
 const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
 const { canAccess } = usePrivilege();

 const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      dispatch(logOut());
      
      // Clear all local storage and cookies manually
      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      toast.success("Session Terminated", {
        description: "You have been successfully logged out."
      });
      
      // Full refresh to clear all in-memory states and stop active hooks
      window.location.href = "/login";
    } catch (err) {
      dispatch(logOut());
      localStorage.clear();
      window.location.href = "/login";
    }
  };

 const displayRole = user?.role?.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Super Administrator";
 return (
  <div className="absolute top-full right-0 pt-4 z-50 cursor-default">
   <DropdownMenu width={280} className="shadow-2xl border-gray-200 p-0 overflow-hidden">
    {/* User Summary */}
    <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-50 flex items-center gap-3">
     <div className="w-12 h-12 rounded-full border-2 border-white   overflow-hidden shrink-0 bg-white flex items-center justify-center relative">
      {user?.avatar ? (
       <Image src={user.avatar} alt="Admin" fill className="object-cover" sizes="48px" />
      ) : (
       <div className="w-full h-full bg-brand-gold flex items-center justify-center text-white font-black text-sm uppercase">
        {user?.fullName?.charAt(0) || "A"}
       </div>
      )}
     </div>
     <div className="flex flex-col min-w-0">
      <span className="text-sm font-black text-[#1D3557] truncate leading-tight">
       {user?.fullName || "Bloom & Mist Admin"}
      </span>
      <span className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-widest mt-0.5">
       {displayRole}
      </span>
     </div>
    </div>

    {/* Action List */}
    <div className="p-2 flex flex-col">
     {canAccess("profile", "view") && (
      <button
       onClick={() => router.push("/admin/profile")}
       className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-gold-light hover:text-brand-gold transition-all group text-[#1D3557]"
      >
       <Icon name="user-profile-circle" folder="dashboardIcon" size="sm" className="text-gray-400 group-hover:text-brand-gold" />
       <span className="text-[13px] font-bold">View Profile</span>
      </button>
     )}

     {canAccess("profile", "view") && (
      <button
       onClick={() => router.push("/admin/profile")}
       className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-gold-light hover:text-brand-gold transition-all group text-[#1D3557]"
      >
       <Icon name="settings" folder="dashboardIcon" size="sm" className="text-gray-400 group-hover:text-brand-gold" />
       <span className="text-[13px] font-bold">Account Settings</span>
      </button>
     )}

    </div>

    {/* Footer Logout */}
    <DropdownFooterAction
     label="Logout Session"
     onClick={() => setIsLogoutModalOpen(true)}
     icon="ic_round-logout"
     className="h-14 py-0 text-rose-500 hover:bg-rose-50"
    />
   </DropdownMenu>

   <ConfirmationModal
    isOpen={isLogoutModalOpen}
    onClose={() => setIsLogoutModalOpen(false)}
    onConfirm={handleLogout}
    title="Logout Session"
    message="Are you sure you want to end your current session? You will need to sign in again to access the administrative dashboard."
    confirmText="Yes, Logout Now"
    cancelText="Stay Logged In"
    type="danger"
    isLoading={isLoggingOut}
   />
  </div>
 );
};
