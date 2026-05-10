"use client";

import React from "react";
import { Icon } from "../Icon";
import { DropdownMenu, DropdownFooterAction } from "../Dropdown/DropdownMenu";
import { useRouter } from "next/navigation";
import { useGetNotificationsQuery, useMarkAllAsReadMutation, NotificationItem } from "@/lib/redux/services/notificationApi";
import moment from "moment";
import { EmptyState } from "./EmptyState";
import { LuBell, LuPackage, LuShieldAlert, LuShoppingBag } from "react-icons/lu";
import { NotificationSkeleton } from "../Skeleton/NotificationSkeleton";

const typeIcons = {
  Orders: LuShoppingBag,
  Stock: LuPackage,
  Security: LuShieldAlert,
  General: LuBell,
};

const typeStyles = {
  Orders: { bg: "bg-gray-50 text-brand-gold", dot: "bg-brand-gold" },
  Stock: { bg: "bg-amber-50 text-amber-500", dot: "bg-amber-500" },
  Security: { bg: "bg-rose-50 text-rose-500", dot: "bg-rose-500" },
  General: { bg: "bg-emerald-50 text-emerald-500", dot: "bg-emerald-500" },
};

export const NotificationList: React.FC<{ onAction?: () => void }> = ({ onAction }) => {
 const router = useRouter();
 const { data: response, isLoading } = useGetNotificationsQuery({ limit: 10 });
 const [markAllAsRead] = useMarkAllAsReadMutation();

 const notifications = (response?.data as any)?.data || [];

 return (
  <div className="flex flex-col">
   <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/30">
    <div className="flex flex-col gap-0.5">
     <span className="font-black text-[#121212] text-sm tracking-tight">System Notifications</span>
     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform Events</span>
    </div>
    <button
     className="text-[10px] font-black text-brand-gold uppercase hover:underline"
     onClick={() => markAllAsRead()}
    >
     Mark all as read
    </button>
   </div>

   <div className="flex flex-col max-h-[400px] sm:max-h-[480px] overflow-y-auto custom-scrollbar bg-white">
    {isLoading && <NotificationSkeleton />}

    {!isLoading && notifications?.length === 0 && (
     <EmptyState
      title="All caught up!"
      description="No new system events or marketing updates at this time."
      className="p-10"
     />
    )}

    {notifications?.map((item: NotificationItem) => {
     const style = typeStyles[item.type as keyof typeof typeStyles] || typeStyles.General;
     const IconComp = typeIcons[item.type as keyof typeof typeIcons] || typeIcons.General;
     return (
      <div
       key={item._id}
       className={`
                px-5 py-4 hover:bg-gray-50/50 flex gap-4 cursor-pointer transition-all border-b border-gray-50/50 last:border-0 relative group
                ${!item.isRead ? "bg-gray-50/10" : ""}
              `}
       onClick={() => {
        if (item.link) {
         router.push(item.link);
         if (onAction) onAction();
        }
       }}
      >
       <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200/50 ${style.bg}`}>
        <IconComp size={18} />
       </div>

       <div className="flex-1 flex flex-col min-w-0 pr-6">
        <div className="flex justify-between items-start gap-2">
         <span className={`text-[13px] tracking-tight truncate ${!item.isRead ? "font-black text-[#121212]" : "font-bold text-gray-600"}`}>
          {item.title}
         </span>
         <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap pt-0.5 uppercase tracking-tighter">
          {moment(item.createdAt).fromNow()}
         </span>
        </div>
        <p className={`text-[11px] leading-relaxed line-clamp-2 mt-1 ${!item.isRead ? "text-gray-900 font-bold" : "text-gray-400 font-medium"}`}>
         {item.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
         <span className="text-[8px] font-black text-brand-gold uppercase tracking-widest bg-brand-gold/5 px-1.5 py-0.5 rounded-full border border-brand-gold/10">
          {item.actor}
         </span>
        </div>
       </div>

       {!item.isRead && (
        <div className={`w-2 h-2 rounded-full absolute top-1/2 -translate-y-1/2 right-5 ${style.dot}`}></div>
       )}
      </div>
     );
    })}
   </div>

   <DropdownFooterAction
    label="View All Notifications"
    onClick={() => {
     if (onAction) onAction();
     router.push('/admin/notifications');
    }}
    icon="arrow_forward"
    className="h-14 py-0 border-t border-gray-200"
   />
  </div>
 );
};

export const AdminNotificationDropdown: React.FC = () => {
 return (
  <div className="absolute top-full right-[-80px] pt-4 z-50 cursor-default">
   <DropdownMenu width={360} className="border-gray-200 p-0 shadow-none">
    <NotificationList />
   </DropdownMenu>
  </div>
 );
};
