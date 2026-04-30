"use client";

import React, { useEffect } from "react";
import { useSocket } from "@/app/context/SocketContext";
import { toast } from "sonner";
import { Icon } from "./Icon";
import { useDispatch } from "react-redux";
import { roleApi } from "@/lib/redux/services/roleApi";

export const SocketNotificationListener = () => {
  const { on, off, isConnected } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isConnected) return;

    const handlePermissionsUpdated = (data: any) => {
      console.log("🚀 Permissions Updated Signal:", data);
      
      // Force refresh the role privileges globally
      if (data.roleId) {
        dispatch(roleApi.util.invalidateTags([{ type: 'Role', id: data.roleId }]));
      } else {
        dispatch(roleApi.util.invalidateTags(['Role']));
      }

      toast.info("Access Privileges Updated", {
        description: data.description || "Your access permissions have been modified. Your dashboard is updating...",
        duration: 8000,
        icon: (
          <div className="bg-brand-gold/10 p-1.5 rounded-full ring-4 ring-brand-gold/5">
            <Icon name="verified_user" folder="icon" size="xs" className="text-brand-gold" />
          </div>
        ),
      });
    };

    const handleNewCustomer = (data: any) => {
      console.log("🚀 New Customer Registered:", data);
      
      toast.success("New Member Joined!", {
        description: `${data.name} just created an account.`,
        duration: 5000,
        icon: <div className="bg-brand-gold/10 p-1 rounded-full"><Icon name="group" size="xs" className="text-brand-gold" /></div>,
        action: {
          label: "View Profile",
          onClick: () => console.log("Navigate to customer profile", data.id)
        }
      });
    };

    const handleRefundUpdate = (data: any) => {
      console.log("🚀 Refund Update Received:", data);
      
      const isNew = data.status === "Pending";
      
      toast(isNew ? "New Refund Request" : "Refund Status Updated", {
        description: isNew 
          ? `A new refund request for Order ${data.order?.orderId || "..."} has been submitted.`
          : `Refund request for ${data.order?.orderId || "..."} is now ${data.status}.`,
        duration: 6000,
        icon: (
          <div className={`p-1 rounded-full ${isNew ? "bg-amber-100" : "bg-blue-100"}`}>
            <Icon 
              name={isNew ? "cached" : "verified"} 
              folder="icon" 
              size="xs" 
              className={isNew ? "text-amber-600" : "text-blue-600"} 
            />
          </div>
        ),
      });
    };

    on("permissions_updated", handlePermissionsUpdated);
    on("newCustomer", handleNewCustomer);
    on("refund:update", handleRefundUpdate);

    return () => {
      off("permissions_updated", handlePermissionsUpdated);
      off("newCustomer", handleNewCustomer);
      off("refund:update", handleRefundUpdate);
    };
  }, [isConnected, on, off, dispatch]);

  return null; // This component doesn't render anything
};
