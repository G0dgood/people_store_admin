"use client";

import React, { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { NotificationDetailDrawer } from "@/app/components/Admin/NotificationDetailDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { BulkActionsDrawer } from "@/app/components/Admin/BulkActionsDrawer";
import { LuBell, LuPackage, LuShieldAlert, LuShoppingBag } from "react-icons/lu";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationsMutation,
  useClearHistoryMutation,
  NotificationItem
} from "@/lib/redux/services/notificationApi";
import { toast } from "sonner";
import moment from "moment";
import { NoRecordFound, SVGLoaderFetch } from "@/app/components/Options";
import { Tooltip } from "@/app/components/Tooltip";
import { HiArrowPath } from "react-icons/hi2";

const typeStyles = {
  Orders: {
    icon: "Cart",
    color: "text-brand-gold",
    bg: "bg-gray-50"
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
  General: {
    icon: "notification",
    color: "text-gray-500",
    bg: "bg-gray-50"
  }
};

export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: response, isLoading, refetch, isFetching } = useGetNotificationsQuery({
    page: currentPage,
    limit: rowsPerPage,
    type: activeTab
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotifications] = useDeleteNotificationsMutation();
  const [clearHistory] = useClearHistoryMutation();

  const notificationsData = (response?.data as any)?.data || [];
  const totalPages = (response?.data as any)?.meta?.totalPages || 1;
  const totalCount = (response?.data as any)?.meta?.total || 0;

  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [isMarkAllModalOpen, setIsMarkAllModalOpen] = useState(false);
  const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleAll = () => {
    if (selectedIds.length === notificationsData?.length && notificationsData?.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notificationsData?.map((n: { _id: any; }) => n._id));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success("All caught up!", { description: "All notifications have been marked as read." });
      setIsMarkAllModalOpen(false);
    } catch (err: any) {
      toast.error("Action Failed", { description: err?.data?.message || "Could not mark all as read." });
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory().unwrap();
      toast.success("History Cleared", { description: "All notification history has been removed." });
      setIsClearHistoryModalOpen(false);
    } catch (err: any) {
      toast.error("Action Failed", { description: err?.data?.message || "Could not clear history." });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteNotifications({ ids: selectedIds }).unwrap();
      toast.success("Deleted", { description: `${selectedIds.length} notifications removed.` });
      setSelectedIds([]);
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast.error("Action Failed", { description: err?.data?.message || "Could not delete notifications." });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Actions */}

      <div className="flex justify-end items-center gap-4">
        <Tooltip text="Refresh Notifications">
          <Button shape="rounded-sm" variant="outline"
            className="border-gray-200 text-gray-500 group"
            iconLeft={<HiArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </Tooltip>
        <Button shape="rounded-sm" variant="outline"
          className="text-gray-400"
          onClick={() => setIsMarkAllModalOpen(true)}
        >
          Mark All as Read
        </Button>
        <Button shape="rounded-sm" variant="outline"
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
              checked={selectedIds.length === notificationsData.length && notificationsData.length > 0}
              onChange={toggleAll}
            />
            <TabFilter
              tabs={["All", "Orders", "Stock", "Security", "General"]}
              activeTab={activeTab}
              onChange={(tab) => {
                setActiveTab(tab);
                setCurrentPage(1);
                setSelectedIds([]);
              }}
              id="notification-tabs"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-400">{totalCount} Notifications</span>
            <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex flex-col min-h-[400px]">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-20">
              <SVGLoaderFetch
                text="Fetching alerts..."
                asTable={false} />
            </div>
          ) : notificationsData?.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-20">
              <NoRecordFound
                text="No Notifications Yet"
                asTable={false}
              />
            </div>
          ) : (
            notificationsData?.map((item: NotificationItem) => (
              <div
                key={item._id}
                className={`p-4 sm:p-6 lg:p-8 flex items-start gap-3 sm:gap-6 border-b border-gray-50 hover:bg-gray-50 transition-all cursor-pointer relative group ${!item.isRead ? "bg-gray-50/10" : ""}`}
                onClick={async () => {
                  if (!item.isRead) {
                    await markAsRead({ ids: [item._id] });
                  }
                  setSelectedNotification(item);
                  setIsDetailDrawerOpen(true);
                }}
              >
                {!item.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold shadow-lg shadow-blue-100"></div>
                )}

                <div className="flex items-center self-center" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(item._id)}
                    onChange={() => toggleItem(item._id)}
                  />
                </div>

                <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-[10px] sm:rounded-2xl flex items-center justify-center shrink-0   ${typeStyles[item.type as keyof typeof typeStyles]?.bg || 'bg-gray-50'} ${typeStyles[item.type as keyof typeof typeStyles]?.color || 'text-gray-400'}`}>
                  <Icon
                    name={typeStyles[item.type as keyof typeof typeStyles]?.icon || 'notification'}
                    folder={item.type === 'Orders' ? 'dashboardIcon' : 'icon'}
                    size="sm"
                    className="scale-90 sm:scale-100"
                  />
                </div>

                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <h3 className={`text-sm sm:text-[15px] tracking-tight ${!item.isRead ? "font-black text-[#121212]" : "font-bold text-gray-700"}`}>
                        {item.title}
                      </h3>
                      <span className="w-fit px-2 py-0.5 rounded-[4px] bg-gray-100 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-normal">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 whitespace-nowrap uppercase tracking-tighter">
                      {moment(item.createdAt).fromNow()}
                    </span>
                  </div>

                  <p className={`text-[13px] leading-relaxed max-w-[800px] ${!item.isRead ? "text-gray-900 font-bold" : "text-gray-500 font-medium"}`}>
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Actor:</span>
                      <span className="text-[11px] font-black text-brand-gold">{item.actor}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                    <span className="text-[11px] font-bold text-gray-400 hover:text-brand-gold transition-colors underline underline-offset-4">
                      View Details
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 opacity-100 group-hover:opacity-100 sm:opacity-0 transition-all translate-x-0 sm:translate-x-2 sm:group-hover:translate-x-0 absolute sm:static right-2 top-2 sm:right-auto sm:top-auto bg-white/80 sm:bg-transparent p-1 sm:p-0 rounded-lg backdrop-blur-sm sm:backdrop-blur-none border border-gray-200 sm:border-0   sm:shadow-none" onClick={(e) => e.stopPropagation()}>
                  {!item.isRead && (
                    <Tooltip text="Mark as Read">
                      <Button shape="rounded-sm" variant="outline"
                        onClick={() => markAsRead({ ids: [item._id] })}
                        className="!p-1.5 text-gray-300 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all">
                        <Icon name="verified" folder="icon" size="sm" className="scale-75 sm:scale-100" />
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip text="Delete Notification">
                    <Button shape="rounded-sm" variant="outline"
                      onClick={() => {
                        setSelectedIds([item._id]);
                        setIsDeleteModalOpen(true);
                      }}
                      className="!p-1.5 text-gray-300 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all">
                      <Icon name="Delete" folder="dashboardIcon" size="sm" className="scale-75 sm:scale-100" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white border-t border-gray-50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
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
            onClick: async () => {
              try {
                await markAsRead({ ids: selectedIds }).unwrap();
                toast.success("Updated", { description: `${selectedIds.length} notifications marked as read.` });
                setSelectedIds([]);
              } catch (err) {
                toast.error("Error", { description: "Failed to update notifications." });
              }
            }
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
        onConfirm={handleMarkAllAsRead}
        title="Mark All as Read"
        message={`Are you sure you want to mark all notifications as read? This will remove all unread indicators from your dashboard.`}
        confirmText="Yes, mark all as read"
        type="info"
      />

      <ConfirmationModal
        isOpen={isClearHistoryModalOpen}
        onClose={() => setIsClearHistoryModalOpen(false)}
        onConfirm={handleClearHistory}
        title="Clear Notification History"
        message="Are you sure you want to permanently delete all historical notifications? This action is destructive and cannot be undone."
        confirmText="Yes, clear history"
        type="danger"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleBulkDelete}
        title="Delete Notifications"
        message={`Are you sure you want to delete ${selectedIds.length} selected notifications? This action cannot be undone.`}
        confirmText="Yes, delete"
        type="danger"
      />
    </div>
  );
}
