"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { useRouter } from "next/navigation";

interface NotificationDetailDrawerProps {
   isOpen: boolean;
   onClose: () => void;
   notification: any;
}

const typeStyles = {
   Orders: { icon: "Cart", color: "text-brand-gold", bg: "bg-brand-gold/10", action: "/orders", label: "Manage Order" },
   Stock: { icon: "inventory_2", color: "text-amber-500", bg: "bg-amber-50", action: "/products", label: "Inventory Management" },
   Security: { icon: "security", color: "text-rose-500", bg: "bg-rose-50", action: "/roles", label: "View Audit Log" },
};

export function NotificationDetailDrawer({ isOpen, onClose, notification }: NotificationDetailDrawerProps) {
   const router = useRouter();

   if (!notification) return null;

   const style = typeStyles[notification.type as keyof typeof typeStyles] || typeStyles.Security;

   return (
      <Drawer isOpen={isOpen} onClose={onClose} title="Event Audit Details" width="max-w-md">
         <div className="flex flex-col h-full gap-8">
            <div className="flex flex-col gap-8">
               {/* Notification Header Card */}
               <div className={`p-8 rounded-2xl ${style.bg} border-2 border-white   flex flex-col items-center text-center gap-4`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-white ${style.color}`}>
                     <Icon
                        name={style.icon}
                        folder={notification.type === 'Orders' ? 'dashboardIcon' : 'icon'}
                        size="md"
                     />
                  </div>
                  <div className="flex flex-col gap-1">
                     <h2 className="text-xl font-black text-[#121212] tracking-tight">{notification.title}</h2>
                     <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${style.color}`}>
                        {notification.type} Event
                     </span>
                  </div>
               </div>

               {/* Event Breakdown */}
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                     <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Detailed Log Message</h4>
                     <div className="bg-gray-50/50 rounded-xl border border-gray-200 p-5">
                        <p className="text-sm font-bold text-[#121212] leading-relaxed">
                           {notification.description}
                        </p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-2">
                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Audited Actor</h4>
                        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center">
                              <Icon name="user-profile-circle" folder="dashboardIcon" size="xs" className="text-brand-gold" />
                           </div>
                           <span className="text-[11px] font-black text-[#121212] truncate">{notification.actor}</span>
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Timestamp</h4>
                        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2 text-gray-400">
                           <Icon name="info-circle" folder="dashboardIcon" size="xs" />
                           <span className="text-[11px] font-black">{notification.time}</span>
                        </div>
                     </div>
                  </div>

                  {/* Resolution Status */}
                  <div className="flex flex-col gap-2">
                     <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Management Status</h4>
                     <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${notification.isRead ? 'bg-gray-300' : 'bg-brand-gold animate-pulse'}`}></div>
                           <span className="text-xs font-bold text-gray-600">{notification.isRead ? 'Archived / Read' : 'Unresolved Event'}</span>
                        </div>
                        {!notification.isRead && (
                           <button className="text-[10px] font-black text-brand-gold uppercase hover:underline underline-offset-4 tracking-[0.1em]">Mark Resolved</button>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* Action Suite */}
            <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3">
               <Button
                  shape="rounded-sm"
                  variant="primary"
                  className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-gold/10 transition-all duration-300 hover:bg-brand-gold hover:text-white"
                  onClick={() => {
                     router.push(style.action);
                     onClose();
                  }}
               >
                  {style.label}
               </Button>
               <Button
                  shape="rounded-sm"
                  variant="ghost"
                  className="w-full h-12 text-[11px] font-bold text-gray-400 hover:text-rose-500 transition-colors"
                  onClick={onClose}
               >
                  Dismiss Details
               </Button>
            </div>
         </div>
      </Drawer>
   );
}
