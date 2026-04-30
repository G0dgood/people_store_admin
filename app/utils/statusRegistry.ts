"use client";

export type ModuleName = "refund" | "order" | "ticket" | "transaction" | "review" | "faq";

export interface StatusConfig {
  value: string;
  label: string;
  description: string;
  color: string; // Tailwind class or hex
  bgColor: string;
  icon: string;
  iconFolder: "icon" | "dashboardIcon";
}

const MODULE_STATUSES: Record<ModuleName, StatusConfig[]> = {
  faq: [
    {
      value: "Active",
      label: "Active",
      description: "Visible on the storefront",
      color: "#10b981", // emerald-500
      bgColor: "bg-emerald-50/30",
      icon: "verified",
      iconFolder: "icon",
    },
    {
      value: "Inactive",
      label: "Inactive",
      description: "Hidden from customers",
      color: "#9ca3af", // gray-400
      bgColor: "bg-gray-50/30",
      icon: "Delete",
      iconFolder: "dashboardIcon",
    },
  ],
  refund: [
    {
      value: "Pending",
      label: "Pending",
      description: "Awaiting initial review",
      color: "#f59e0b", // amber-500
      bgColor: "bg-amber-50/30",
      icon: "cached",
      iconFolder: "icon",
    },
    {
      value: "Processing",
      label: "Processing",
      description: "Mark as being processed",
      color: "#2D4A6E", // brand-gold
      bgColor: "bg-brand-gold/10",
      icon: "cached",
      iconFolder: "icon",
    },
    {
      value: "Approved",
      label: "Approve",
      description: "Approve refund request",
      color: "#10b981", // emerald-500
      bgColor: "bg-emerald-50/30",
      icon: "verified",
      iconFolder: "icon",
    },
    {
      value: "Completed",
      label: "Completed",
      description: "Refund has been sent",
      color: "#B88E2F", // brand-gold
      bgColor: "bg-brand-gold/10",
      icon: "verified",
      iconFolder: "icon",
    },
    {
      value: "Rejected",
      label: "Reject",
      description: "Deny refund request",
      color: "#f43f5e", // rose-500
      bgColor: "bg-rose-50/30",
      icon: "Delete",
      iconFolder: "dashboardIcon",
    },
  ],
  order: [
    {
      value: "Pending",
      label: "Pending",
      description: "Order has been placed",
      color: "#f59e0b",
      bgColor: "bg-amber-50/30",
      icon: "cached",
      iconFolder: "icon",
    },
    {
      value: "Processing",
      label: "Processing",
      description: "Order is being prepared",
      color: "#2D4A6E",
      bgColor: "bg-brand-gold/10",
      icon: "cached",
      iconFolder: "icon",
    },
    {
      value: "Shipped",
      label: "Shipped",
      description: "Order is with carrier",
      color: "#3b82f6", // blue-500
      bgColor: "bg-blue-50/30",
      icon: "Shipped",
      iconFolder: "dashboardIcon",
    },
    {
      value: "Delivered",
      label: "Delivered",
      description: "Customer received order",
      color: "#10b981",
      bgColor: "bg-emerald-50/30",
      icon: "Delivered",
      iconFolder: "dashboardIcon",
    },
    {
      value: "Cancelled",
      label: "Cancelled",
      description: "Order was cancelled",
      color: "#f43f5e",
      bgColor: "bg-rose-50/30",
      icon: "Cancelled",
      iconFolder: "dashboardIcon",
    },
  ],
  ticket: [
    {
      value: "Open",
      label: "Open",
      description: "New support request",
      color: "#3b82f6",
      bgColor: "bg-blue-50/30",
      icon: "cached",
      iconFolder: "icon",
    },
    {
      value: "Pending",
      label: "Pending",
      description: "Waiting for response",
      color: "#f59e0b",
      bgColor: "bg-amber-50/30",
      icon: "cached",
      iconFolder: "icon",
    },
    {
      value: "Resolved",
      label: "Resolved",
      description: "Issue has been fixed",
      color: "#10b981",
      bgColor: "bg-emerald-50/30",
      icon: "verified",
      iconFolder: "icon",
    },
    {
      value: "Closed",
      label: "Closed",
      description: "Ticket is finalized",
      color: "#6b7280", // gray-500
      bgColor: "bg-gray-50/30",
      icon: "Delete",
      iconFolder: "dashboardIcon",
    },
  ],
  transaction: [
    {
      value: "Pending",
      label: "Pending",
      description: "Payment initiated",
      color: "#f59e0b",
      bgColor: "bg-amber-50/30",
      icon: "cached",
      iconFolder: "icon",
    },
    {
      value: "Successful",
      label: "Successful",
      description: "Payment received",
      color: "#10b981",
      bgColor: "bg-emerald-50/30",
      icon: "verified",
      iconFolder: "icon",
    },
    {
      value: "Failed",
      label: "Failed",
      description: "Payment declined",
      color: "#f43f5e",
      bgColor: "bg-rose-50/30",
      icon: "Delete",
      iconFolder: "dashboardIcon",
    },
  ],
  review: [
    {
      value: "Pending",
      label: "Pending",
      description: "Awaiting moderation",
      color: "#f59e0b",
      bgColor: "bg-amber-50/30",
      icon: "cached",
      iconFolder: "icon",
    },
    {
      value: "Approved",
      label: "Approved",
      description: "Visible to customers",
      color: "#10b981",
      bgColor: "bg-emerald-50/30",
      icon: "verified",
      iconFolder: "icon",
    },
    {
      value: "Rejected",
      label: "Rejected",
      description: "Hidden from store",
      color: "#f43f5e",
      bgColor: "bg-rose-50/30",
      icon: "Delete",
      iconFolder: "dashboardIcon",
    },
  ],
};

export const getStatusConfigs = (module: ModuleName): StatusConfig[] => {
  return MODULE_STATUSES[module] || [];
};

export const getStatusConfig = (module: ModuleName, value: string): StatusConfig | undefined => {
  return MODULE_STATUSES[module]?.find((s) => s.value === value);
};
