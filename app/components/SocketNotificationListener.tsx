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

    on("newCustomer", handleNewCustomer);

    return () => {
      off("newCustomer", handleNewCustomer);
    };
  }, [isConnected, on, off]);

  return null; // This component doesn't render anything
};
