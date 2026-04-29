"use client";

import React, { useEffect } from "react";
import { useSocket } from "@/app/context/SocketContext";
import { toast } from "sonner";
import { Icon } from "./Icon";

export const SocketNotificationListener = () => {
  const { on, off, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

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

    on("newCustomer", handleNewCustomer);
    on("refund:update", handleRefundUpdate);

    return () => {
      off("newCustomer", handleNewCustomer);
      off("refund:update", handleRefundUpdate);
    };
  }, [isConnected, on, off]);

  return null; // This component doesn't render anything
};
