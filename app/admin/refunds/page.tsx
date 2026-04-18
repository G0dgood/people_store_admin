"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { RefundDetailDrawer } from "../../components/Admin/RefundDetailDrawer";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import { UpdateRefundStatusModal } from "../../components/Admin/UpdateRefundStatusModal";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";

const refundsData = [
  { refundId: "#RFD_001", custId: "#CUST001", name: "John Doe", date: "01-01-2025", total: "₦2,904", method: "CC", status: "Completed", reason: "Defective item" },
  { refundId: "#RFD_002", custId: "#CUST002", name: "Sarah Connor", date: "02-01-2025", total: "₦5,500", method: "PayPal", status: "Completed", reason: "Accidental purchase" },
  { refundId: "#RFD_003", custId: "#CUST003", name: "Mike Wazowski", date: "03-01-2025", total: "₦1,200", method: "CC", status: "Pending", reason: "Item not as described" },
  { refundId: "#RFD_004", custId: "#CUST004", name: "Arthur Morgan", date: "04-01-2025", total: "₦12,000", method: "Bank", status: "Completed", reason: "Found better price" },
  { refundId: "#RFD_005", custId: "#CUST005", name: "Dutch van der Linde", date: "05-01-2025", total: "₦8,900", method: "CC", status: "Canceled", reason: "Changed mind" },
  { refundId: "#RFD_006", custId: "#CUST006", name: "John Marston", date: "06-01-2025", total: "₦2,450", method: "PayPal", status: "Completed", reason: "Shipping delay" },
  { refundId: "#RFD_007", custId: "#CUST007", name: "Sadie Adler", date: "07-01-2025", total: "₦3,100", method: "Bank", status: "Pending", reason: "Sizing issues" },
  { refundId: "#RFD_008", custId: "#CUST001", name: "John Doe", date: "10-01-2025", total: "₦4,200", method: "CC", status: "Completed", reason: "Late delivery" },
  { refundId: "#RFD_009", custId: "#CUST008", name: "Charles Smith", date: "11-01-2025", total: "₦1,500", method: "PayPal", status: "Pending", reason: "Wrong item sent" },
  { refundId: "#RFD_010", custId: "#CUST009", name: "Hosea Matthews", date: "12-01-2025", total: "₦6,700", method: "Bank", status: "Canceled", reason: "Order canceled" },
];

const statusStyles = {
  Completed: { color: "text-blue-500", bg: "bg-blue-500" },
  Canceled: { color: "text-rose-500", bg: "bg-rose-500" },
  Pending: { color: "text-orange-400", bg: "bg-orange-400" },
};

export default function RefundsPage() {
  const [activeTab, setActiveTab] = useState("All refunds");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<any>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [actionTarget, setActionTarget] = useState<any>(null);

  const toggleAll = () => {
    if (selectedIds.length === refundsData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(refundsData.map(r => r.refundId));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Refunds"
          value="₦45,045"
          trendValue="8.4%"
          trendIsUp={true}
          periodLabel="Last 7 days"
        />
        <StatCard
          title="Completed Refunds"
          value="3,150"
          trendValue="12%"
          trendIsUp={true}
          periodLabel="Last 7 days"
        />
        <StatCard
          title="Pending Refunds"
          value="150"
          trendValue="5%"
          trendIsUp={false}
          periodLabel="Last 7 days"
        />
        <StatCard
          title="Canceled Refunds"
          value="75"
          trendValue="2%"
          trendIsUp={false}
          periodLabel="Last 7 days"
        />
      </div>

      {/* Refunds History Table Card */}
      <div className="bg-white rounded-[6px] overflow-hidden flex flex-col border border-[#1C1C1C1A]">
        {/* Controls Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All refunds", "Completed", "Pending", "Canceled"]}
            activeTab={activeTab}
            onChange={setActiveTab} id={""} />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search refunds"
              containerClassName="w-full lg:w-80 xl:w-96"
              className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

              <div className="flex gap-2 ml-auto sm:ml-0">
                <Button variant="outline" shape="rounded-sm" className="!p-2.5 text-gray-400">
                  <Icon name="sort" folder="dashboardIcon" size="sm" />
                </Button>
                <Button variant="outline" shape="rounded-sm" className="!p-2.5 text-gray-400">
                  <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" />
                </Button>
                <Button variant="outline" shape="rounded-sm" className="!p-2.5 text-gray-400">
                  <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
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
                <th className="w-10 pl-8">
                  <Checkbox
                    checked={selectedIds.length === refundsData.length && refundsData.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>Refund Id</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {refundsData.map((refund, idx) => (
                <tr key={idx} className="group">
                  <td className="w-10 pl-8">
                    <Checkbox
                      checked={selectedIds.includes(refund.refundId)}
                      onChange={() => toggleItem(refund.refundId)}
                    />
                  </td>
                  <td>
                    <span className="text-xs font-bold text-gray-900">{refund.refundId}</span>
                  </td>
                  <td>{refund.name}</td>
                  <td>{refund.date}</td>
                  <td>{refund.total}</td>
                  <td>{refund.method}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[refund.status as keyof typeof statusStyles].bg}`}></span>
                      <span className={`text-xs font-bold ${statusStyles[refund.status as keyof typeof statusStyles].color}`}>{refund.status}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        variant="outline"
                        shape="rounded-sm"
                        className="!p-1.5 text-gray-400 hover:text-blue-500 hover:bg-brand-blue-light transition-all"
                        onClick={() => {
                          setActionTarget(refund);
                          setIsStatusModalOpen(true);
                        }}
                        title="Update Status"
                      >
                        <Icon name="cached" folder="icon" size="sm" />
                      </Button>
                      <Button
                        variant="outline"
                        shape="rounded-sm"
                        className="!p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        onClick={() => {
                          setSelectedRefund(refund);
                          setIsDetailDrawerOpen(true);
                        }}
                        title="View Details"
                      >
                        <Icon name="description" folder="icon" size="sm" />
                      </Button>
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
          totalPages={24}
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
        idProp="refundId"
        labelProp="name"
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
        onConfirm={(status, reason) => {
          console.log(`Updating ${actionTarget?.count ? 'bulk' : 'single'} to ${status} with reason: ${reason}`);
          setSelectedIds([]);
        }}
        target={actionTarget}
      />
    </div>
  );
}
