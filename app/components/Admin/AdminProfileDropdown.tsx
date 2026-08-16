import { Icon } from "../Icon";
import { DropdownMenu, DropdownFooterAction } from "../Dropdown/DropdownMenu";
import Image from "next/image";
import { selectCurrentUser } from "@/lib/redux/features/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { usePrivilege } from "@/lib/contexts/PrivilegeContext";

// The logout confirmation modal is deliberately owned by AdminHeader (not here),
// so it isn't unmounted by the header's click-outside handler the moment you
// click "Yes, Logout Now".
export const AdminProfileDropdown: React.FC<{ onRequestLogout: () => void }> = ({ onRequestLogout }) => {
 const router = useRouter();
 const user = useAppSelector(selectCurrentUser);
 const { canAccess } = usePrivilege();

 const displayRole = user?.role?.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Super Administrator";
 return (
  <div className="absolute top-full right-0 pt-4 z-50 cursor-default">
   <DropdownMenu width={280} className="shadow-2xl border-gray-200 p-0 overflow-hidden">
    {/* User Summary */}
    <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
     <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shrink-0 bg-white flex items-center justify-center relative">
      {user?.avatar ? (
       <Image src={user.avatar} alt="Admin" fill className="object-cover" sizes="48px" />
      ) : (
       <div className="w-full h-full bg-brand-gold flex items-center justify-center text-white font-black text-sm uppercase">
        {user?.fullName?.charAt(0) || "A"}
       </div>
      )}
     </div>
     <div className="flex flex-col min-w-0">
      <span className="text-sm font-black text-gray-900 truncate leading-tight">
       {user?.fullName || "Bloom & Mist Admin"}
      </span>
      <span className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-widest mt-0.5">
       {displayRole}
      </span>
     </div>
    </div>

    {/* Action List */}
    <div className="p-2 flex flex-col gap-1">
     {canAccess("profile", "view") && (
      <button
       onClick={() => router.push("/profile")}
       className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-gold/10 text-gray-700 hover:text-brand-gold transition-all group text-left cursor-pointer"
      >
       <Icon name="user-profile-circle" folder="dashboardIcon" size="sm" className="text-gray-400 group-hover:text-brand-gold transition-colors" />
       <span className="text-[13px] font-bold">View Profile</span>
      </button>
     )}

     {canAccess("profile", "view") && (
      <button
       onClick={() => router.push("/profile")}
       className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-gold/10 text-gray-700 hover:text-brand-gold transition-all group text-left cursor-pointer"
      >
       <Icon name="settings" folder="dashboardIcon" size="sm" className="text-gray-400 group-hover:text-brand-gold transition-colors" />
       <span className="text-[13px] font-bold">Account Settings</span>
      </button>
     )}
    </div>

    {/* Footer Logout */}
    <DropdownFooterAction
     label="Logout Session"
     onClick={onRequestLogout}
     icon="ic_round-logout"
     className="h-14 py-0 text-rose-500 hover:bg-rose-50/50 hover:text-rose-600 transition-all cursor-pointer"
    />
   </DropdownMenu>
  </div>
 );
};
