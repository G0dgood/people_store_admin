"use client";

import { BulkActionsDrawer } from "@/app/components/Admin/BulkActionsDrawer";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RefundDetailDrawer } from "@/app/components/Admin/RefundDetailDrawer";
import { StatCard } from "@/app/components/Admin/StatCard";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { UpdateRefundStatusModal } from "@/app/components/Admin/UpdateRefundStatusModal";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form";
import Dropdown from "@/app/components/Form/Dropdown";
import Checkbox from "@/app/components/Checkbox";
import { Icon } from "@/app/components/Icon";
import { NoRecordFound, SVGLoaderFetch } from "@/app/components/Options";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { useGetRefundsQuery, useGetRefundStatsQuery, useUpdateRefundStatusMutation } from "@/lib/redux/services/refundApi";
import { useState } from "react";
import { StatusBadge } from "@/app/components/StatusBadge";
import { toast } from "sonner";
import { Tooltip } from "@/app/components/Tooltip";
import { HiArrowPath } from "react-icons/hi2";
import { StatCardSkeleton } from "@/app/components/Skeleton/StatCardSkeleton";

export default function RefundsPage() {
  const [activeTab, setActiveTab] = useState("All refunds");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<any>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [actionTarget, setActionTarget] = useState<any>(null);

  const { data: refundsResponse, isLoading, refetch, isFetching } = useGetRefundsQuery({
    status: activeTab === "All refunds" ? undefined : activeTab,
    search: searchQuery || undefined,
    page: currentPage,
    limit: rowsPerPage
  });

  const { data: statsResponse, isLoading: isLoadingStats } = useGetRefundStatsQuery();

  const [updateStatus] = useUpdateRefundStatusMutation();

  const refundsData = refundsResponse?.data.refunds || [];
  const pagination = refundsResponse?.data.pagination;
  const stats = statsResponse?.data;

  const toggleAll = () => {
    if (selectedIds.length === refundsData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(refundsData.map(r => r._id));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleUpdateStatus = async (status: string, note: string) => {
    try {
      if (actionTarget?._id) {
        await updateStatus({ id: actionTarget._id, body: { status, adminNote: note } }).unwrap();
        toast.success("Refund status updated successfully");
      }
      setIsStatusModalOpen(false);
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update refund status");
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {isLoadingStats ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Refunds"
              value={`₦${stats?.totalAmount?.toLocaleString() || '0'}`}
              trendValue="8.4%"
              trendIsUp={true}
              periodLabel="Last 7 days"
            />
            <StatCard
              title="Completed Refunds"
              value={stats?.completedCount?.toString() || '0'}
              trendValue="12%"
              trendIsUp={true}
              periodLabel="Last 7 days"
            />
            <StatCard
              title="Pending Refunds"
              value={stats?.pendingCount?.toString() || '0'}
              trendValue="5%"
              trendIsUp={false}
              periodLabel="Last 7 days"
            />
            <StatCard
              title="Approved Refunds"
              value={stats?.approvedCount?.toString() || '0'}
              trendValue="2%"
              trendIsUp={true}
              periodLabel="Last 7 days"
            />
          </>
        )}
      </div>

      {/* Refunds History Table Card */}
      <div className="bg-white rounded-[6px] overflow-hidden flex flex-col border border-[#1C1C1C1A]">
        {/* Controls Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <div className="w-full lg:w-64">
            <Dropdown
              value={activeTab}
              onChange={setActiveTab}
              placeholder="Filter by Status"
              options={[
                { value: "All refunds", label: "All Refunds" },
                { value: "Completed", label: "Completed" },
                { value: "Pending", label: "Pending" },
                { value: "Approved", label: "Approved" },
                { value: "Processing", label: "Processing" },
                { value: "Rejected", label: "Rejected" },
              ]}
              getOptionDotColor={(opt) => {
                const colors: Record<string, string> = {
                  Completed: "#10B981",
                  Pending: "#F59E0B",
                  Approved: "#3B82F6",
                  Processing: "#6366F1",
                  Rejected: "#EF4444",
                };
                return colors[opt.value];
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Tooltip text="Refresh Refund List">
              <Button shape="rounded-sm" variant="outline"
                className="border-gray-200 text-gray-500 group"
                iconLeft={<HiArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
                onClick={() => refetch()}
                disabled={isLoading || isFetching}
              >
                {isFetching ? "Refreshing..." : "Refresh"}
              </Button>
            </Tooltip>
            <Input shape="rounded-sm"
              type="text"
              placeholder="Search refunds"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              containerClassName="w-full lg:w-80 xl:w-96"
              className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

              <div className="flex gap-2 ml-auto sm:ml-0">
                <Button variant="outline" shape="rounded-sm" className="!p-2.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold border-gray-200 transition-all">
                  <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" />
                </Button>
                <Button variant="outline" shape="rounded-sm" className="!p-2.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold border-gray-200 transition-all">
                  <Icon name="sort" folder="dashboardIcon" size="sm" />
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-container">

          <table>
            <thead>
              <tr>
                <th className="w-12 pl-6">
                  <Checkbox
                    checked={selectedIds.length === refundsData.length && refundsData.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>Refund Id</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Order</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <SVGLoaderFetch colSpan={8} text={"Fetching Refunds..."} />
              ) : refundsData.length === 0 ? (
                <NoRecordFound colSpan={8} text="No refunds found." />
              ) : refundsData.map((refund, idx) => (
                <tr key={idx} className="group">
                  <td className="w-12 pl-6">
                    <Checkbox
                      checked={selectedIds.includes(refund._id)}
                      onChange={() => toggleItem(refund._id)}
                    />
                  </td>
                  <td>
                    <span className="text-xs font-bold text-gray-900">{refund.refundId}</span>
                  </td>
                  <td>{refund.customer?.fullName || "Guest"}</td>
                  <td>{new Date(refund.createdAt).toLocaleDateString()}</td>
                  <td>₦{refund.amount.toLocaleString()}</td>
                  <td>{refund.order?.orderId || "N/A"}</td>
                  <td>
                    <StatusBadge module="refund" value={refund.status} />
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Tooltip text={refund.status === "Completed" ? "Refund Completed" : "Update Status"}>
                        <Button shape="rounded-sm" variant="outline"
                          className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
                          onClick={() => {
                            setActionTarget(refund);
                            setIsStatusModalOpen(true);
                          }}
                          disabled={refund.status === "Completed"}
                        >
                          <Icon name="cached" folder="icon" size="sm" />
                        </Button>
                      </Tooltip>
                      <Tooltip text="View Refund Details">
                        <Button shape="rounded-sm" variant="outline"
                          className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
                          onClick={() => {
                            setSelectedRefund(refund);
                            setIsDetailDrawerOpen(true);
                          }}
                        >
                          <Icon name="description" folder="icon" size="sm" />
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setCurrentPage}
        />
      </div>

      <RefundDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        refund={selectedRefund}
        onUpdateStatus={() => {
          setActionTarget(selectedRefund);
          setIsStatusModalOpen(true);
        }}
      />

      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
        selectedIds={selectedIds}
        items={refundsData}
        onClearSelection={() => setSelectedIds([])}
        idProp="_id"
        labelProp="refundId"
        title="Refunds Selected"
        actions={[
          {
            id: "export",
            title: "Export Selection",
            icon: "cloud_download",
            folder: "icon",
            onClick: () => console.log("Exporting selected refunds:", selectedIds),
          },
          {
            id: "status",
            title: "Change Status",
            icon: "cached",
            folder: "icon",
            onClick: () => {
              setActionTarget({ count: selectedIds.length });
              setIsStatusModalOpen(true);
            },
          },
        ]}
      />

      <UpdateRefundStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleUpdateStatus}
        target={actionTarget}
      />
    </div>
  );
}
