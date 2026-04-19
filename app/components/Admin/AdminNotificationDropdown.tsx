"use client";

import React from "react";
import { Icon } from "../Icon";
import { DropdownMenu, DropdownFooterAction } from "../Dropdown/DropdownMenu";
import { useRouter } from "next/navigation";

interface NotificationEvent {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "order" | "stock" | "customer" | "alert";
  isRead: boolean;
}

const notifications: NotificationEvent[] = [
  {
    id: 1,
    title: "New Order Received",
    description: "Order #9034 from Robert Fox is pending processing.",
    time: "2m ago",
    type: "order",
    isRead: false,
  },
  {
    id: 2,
    title: "Low Stock Alert",
    description: "iPhone 13 Pro is below the restock threshold (5 units left).",
    time: "1h ago",
    type: "stock",
    isRead: false,
  },
  {
    id: 3,
    title: "Member Registration",
    description: "New administrative account created for Eleanor Pena.",
    time: "4h ago",
    type: "customer",
    isRead: true,
  },
  {
    id: 4,
    title: "Review Moderate",
    description: "A product review from 'Wade Warren' has been flagged for spam.",
    time: "Yesterday",
    type: "alert",
    isRead: true,
  },
];

const typeStyles = {
  order: { icon: "Cart", bg: "bg-blue-50 text-brand-blue", dot: "bg-brand-blue" },
  stock: { icon: "inventory_2", bg: "bg-amber-50 text-amber-500", dot: "bg-amber-500" },
  customer: { icon: "people_alt", bg: "bg-emerald-50 text-emerald-500", dot: "bg-emerald-500" },
  alert: { icon: "error", bg: "bg-rose-50 text-rose-500", dot: "bg-rose-500" },
};

export const NotificationList: React.FC<{ onAction?: () => void }> = ({ onAction }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/30">
        <div className="flex flex-col gap-0.5">
          <span className="font-black text-[#1D3557] text-sm tracking-tight">System Notifications</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform Events</span>
        </div>
        <button 
          className="text-[10px] font-black text-brand-blue uppercase hover:underline"
          onClick={onAction}
        >
          Mark all as read
        </button>
      </div>

      <div className="flex flex-col max-h-[400px] sm:max-h-[480px] overflow-y-auto custom-scrollbar bg-white">
        {notifications.map((item) => (
          <div 
            key={item.id} 
            className={`
              px-5 py-4 hover:bg-gray-50/50 flex gap-4 cursor-pointer transition-all border-b border-gray-50/50 last:border-0 relative group
              ${!item.isRead ? "bg-blue-50/10" : ""}
            `}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200/50 ${typeStyles[item.type].bg}`}>
              <Icon name={typeStyles[item.type].icon} folder={item.type === "order" ? "dashboardIcon" : "icon"} size="sm" />
            </div>
            
            <div className="flex-1 flex flex-col min-w-0 pr-6">
              <div className="flex justify-between items-start gap-2">
                <span className={`text-[13px] tracking-tight truncate ${!item.isRead ? "font-black text-[#1D3557]" : "font-bold text-gray-600"}`}>
                  {item.title}
                </span>
                <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap pt-0.5 uppercase tracking-tighter">{item.time}</span>
              </div>
              <p className={`text-[11px] leading-relaxed line-clamp-2 mt-1 ${!item.isRead ? "text-gray-900 font-bold" : "text-gray-400 font-medium"}`}>
                {item.description}
              </p>
            </div>

            {!item.isRead && (
              <div className={`w-2 h-2 rounded-full absolute top-1/2 -translate-y-1/2 right-5 ${typeStyles[item.type].dot}`}></div>
            )}
          </div>
        ))}
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
