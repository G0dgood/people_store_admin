"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { NotificationDetailDrawer } from "../../components/Admin/NotificationDetailDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";

const notificationsData = [
  {
    id: 1,
    title: "New Order Received",
    description: "Order #9034 from Robert Fox is pending processing. Total value: ₦45,000.",
    time: "2 minutes ago",
    type: "Orders",
    isRead: false,
    actor: "Robert Fox",
  },
  {
    id: 2,
    title: "Low Stock Alert",
    description: "iPhone 13 Pro is below the restock threshold (5 units left). Please review inventory levels.",
    time: "1 hour ago",
    type: "Stock",
    isRead: false,
    actor: "System",
  },
  {
    id: 3,
    title: "Audit: User Registration",
    description: "New administrative account created for Eleanor Pena with 'Support' role.",
    time: "4 hours ago",
    type: "Security",
    isRead: true,
    actor: "Wade Warren",
  },
  {
    id: 4,
    title: "High Sensitivity Action",
    description: "Super Admin permissions were Modified for 'Roles Management'.",
    time: "5 hours ago",
    type: "Security",
    isRead: true,
    actor: "Dealport (System)",
  },
  {
    id: 5,
    title: "Review Moderate Required",
    description: "A product review from 'Wade Warren' has been flagged for spam by the automated filter.",
    time: "Yesterday",
    type: "Orders",
    isRead: true,
    actor: "Automated Bot",
  },
  {
    id: 6,
    title: "Payment Confirmation",
    description: "Transaction #TXN-7829 was successfully processed for Order #8821.",
    time: "Oct 12, 2023",
    type: "Orders",
    isRead: true,
    actor: "Paystack",
  },
];

const typeStyles = {
  Orders: {
    icon: "Cart",
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  Stock: {
    icon: "inventory_2",
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  Security: {
    icon: "security",
    color: "text-rose-500",
    bg: "bg-rose-50"
  },
};

export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [isMarkAllModalOpen, setIsMarkAllModalOpen] = useState(false);
  const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleAll = () => {
    if (selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  const toggleItem = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredNotifications = notificationsData.filter(item => {
    if (activeTab === "All") return true;
    return item.type === activeTab;
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Actions */}
      <div className="flex justify-end items-center gap-4">
        <Button
          variant="outline"
          shape="rounded-sm"
          className="text-gray-400"
          onClick={() => setIsMarkAllModalOpen(true)}
        >
          Mark All as Read
        </Button>
        <Button
          variant="outline"
          shape="rounded-sm"
          className="text-rose-500 border-rose-100 bg-rose-50/30 hover:bg-rose-100 transition-all font-bold"
          onClick={() => setIsClearHistoryModalOpen(true)}
        >
          Clear History
        </Button>
      </div>

      <div className="bg-white overflow-hidden flex flex-col border border-[#1C1C1C1A] rounded-[6px]">
        {/* Filter Bar */}
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-6">
            <Checkbox
              checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
              onChange={toggleAll}
            />
            <TabFilter
              tabs={["All", "Orders", "Stock", "Security"]}
              activeTab={activeTab}
              onChange={(tab) => {
                setActiveTab(tab);
                setSelectedIds([]); // Clear selection when changing tabs
              }}
            />
          </div>
          <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
        </div>

        {/* Notifications List */}
        <div className="flex flex-col">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`
                p-4 sm:p-6 lg:p-8 flex items-start gap-3 sm:gap-6 border-b border-gray-50 hover:bg-gray-50 transition-all cursor-pointer relative group
                ${!item.isRead ? "bg-blue-50/10" : ""}
              `}
            >
              {!item.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue shadow-lg shadow-blue-100"></div>
              )}

              <div className="flex items-center self-center">
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                />
              </div>

              <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-[10px] sm:rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${typeStyles[item.type as keyof typeof typeStyles].bg} ${typeStyles[item.type as keyof typeof typeStyles].color}`}>
                <Icon
                  name={typeStyles[item.type as keyof typeof typeStyles].icon}
                  folder={item.type === 'Orders' ? 'dashboardIcon' : 'icon'}
                  size="sm"
                  className="scale-90 sm:scale-100"
                />
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <h3 className={`text-sm sm:text-[15px] tracking-tight ${!item.isRead ? "font-black text-[#1D3557]" : "font-bold text-gray-700"}`}>
                      {item.title}
                    </h3>
                    <span className="w-fit px-2 py-0.5 rounded-[4px] bg-gray-100 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-normal">
                      {item.type}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 whitespace-nowrap uppercase tracking-tighter">
                    {item.time}
                  </span>
                </div>

                <p className={`text-[13px] leading-relaxed max-w-[800px] ${!item.isRead ? "text-gray-900 font-bold" : "text-gray-500 font-medium"}`}>
                  {item.description}
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Actor:</span>
                    <span className="text-[11px] font-black text-brand-blue">{item.actor}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                  <button
                    className="text-[11px] font-bold text-gray-400 hover:text-brand-blue transition-colors underline underline-offset-4"
                    onClick={() => {
                      setSelectedNotification(item);
                      setIsDetailDrawerOpen(true);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 opacity-100 group-hover:opacity-100 sm:opacity-0 transition-all translate-x-0 sm:translate-x-2 sm:group-hover:translate-x-0 absolute sm:static right-2 top-2 sm:right-auto sm:top-auto bg-white/80 sm:bg-transparent p-1 sm:p-0 rounded-lg backdrop-blur-sm sm:backdrop-blur-none border border-gray-100 sm:border-0 shadow-sm sm:shadow-none">
                <button className="p-1 sm:p-2 hover:bg-blue-50 hover:text-brand-blue rounded-lg transition-all text-gray-300">
                  <Icon name="verified" folder="icon" size="sm" className="scale-75 sm:scale-100" />
                </button>
                <button className="p-1 sm:p-2 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-all text-gray-300">
                  <Icon name="Delete" folder="dashboardIcon" size="sm" className="scale-75 sm:scale-100" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border-t border-gray-50">
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
        selectedIds={selectedIds}
        items={notificationsData}
        onClearSelection={() => setSelectedIds([])}
        title="Notifications Selected"
        actions={[
          {
            id: "read",
            title: "Mark as Read",
            icon: "verified",
            folder: "icon",
            onClick: () => console.log("Marking notifications as read..."),
          },
          {
            id: "delete",
            title: "Delete All Selected",
            icon: "Delete",
            folder: "dashboardIcon",
            variant: "danger",
            onClick: () => setIsDeleteModalOpen(true),
          },
        ]}
      />

      <NotificationDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        notification={selectedNotification}
      />

      <ConfirmationModal
        isOpen={isMarkAllModalOpen}
        onClose={() => setIsMarkAllModalOpen(false)}
        onConfirm={() => {
          console.log("Marking all notifications as read...");
          setIsMarkAllModalOpen(false);
        }}
        title="Mark All as Read"
        message="Are you sure you want to mark all 250 notifications as read? This will remove all unread indicators from your dashboard."
        confirmText="Yes, mark all as read"
        type="info"
      />

      <ConfirmationModal
        isOpen={isClearHistoryModalOpen}
        onClose={() => setIsClearHistoryModalOpen(false)}
        onConfirm={() => {
          console.log("Clearing notification history...");
          setIsClearHistoryModalOpen(false);
        }}
        title="Clear Notification History"
        message="Are you sure you want to permanently delete all historical notifications? This action is destructive and cannot be undone."
        confirmText="Yes, clear history"
        type="danger"
      />
    </div >
  );
}
