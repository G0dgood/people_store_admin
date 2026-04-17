"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { EditCouponDrawer } from "../../components/Admin/EditCouponDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { AddCouponModal } from "../../components/Admin/AddCouponModal";
import { CouponsMoreActionsDrawer } from "../../components/Admin/CouponsMoreActionsDrawer";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";

const couponsData = [
  { code: "SUMMER SALE", discount: "15%", type: "Percentage", startDate: "01-06-2025", endDate: "30-08-2025", status: "Active" },
  { code: "WELCOME10", discount: "$10.00", type: "Fixed Rate", startDate: "01-01-2025", endDate: "31-12-2025", status: "Active" },
  { code: "BLACKFRIDAY", discount: "50%", type: "Percentage", startDate: "24-11-2025", endDate: "27-11-2025", status: "Scheduled" },
  { code: "EXPIRED20", discount: "20%", type: "Percentage", startDate: "01-01-2024", endDate: "01-02-2024", status: "Expired" },
  { code: "FREESHIP", discount: "Free Shipping", type: "Shipping", startDate: "01-03-2025", endDate: "31-03-2025", status: "Active" },
  { code: "FLASH25", discount: "25%", type: "Percentage", startDate: "15-04-2025", endDate: "16-04-2025", status: "Active" },
  { id: 7, code: "STUDENT5", discount: "5%", type: "Percentage", startDate: "01-01-2025", endDate: "31-12-2025", status: "Active" },
  { id: 8, code: "NEWYEAR25", discount: "25%", type: "Percentage", startDate: "01-01-2025", endDate: "31-01-2025", status: "Expired" },
];

const statusConfig = {
  Active: "text-blue-500 bg-brand-blue-light",
  Expired: "text-rose-500 bg-rose-50/50",
  Scheduled: "text-brand-blue bg-brand-blue-light",
};

export default function CouponsListing() {
  const [activeTab, setActiveTab] = useState("All coupons");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [couponToDelete, setCouponToDelete] = useState<any>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleAll = () => {
    if (selectedIds.length === couponsData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(couponsData.map(c => c.code));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            shape="rounded-sm"
            className="flex-1 sm:flex-initial"
            iconLeft={<Icon name="ticket" folder="dashboardIcon" size="sm" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Coupon
          </Button>
          <Button
            variant="outline"
            shape="rounded-sm"
            className="flex-1 sm:flex-initial"
            iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            onClick={() => setIsMoreActionsOpen(true)}
          >
            More Action
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[6px] overflow-hidden flex flex-col border border-[#1C1C1C1A] rounded-[6px]">
        {/* Filter Controls Row */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All coupons", "Active", "Inactive", "Expired"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search coupon code"
              containerClassName="w-full lg:w-80 xl:w-72"
              className="bg-white border-gray-100 placeholder:text-gray-400 text-sm font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

              <div className="flex gap-2 ml-auto sm:ml-0">
                <Button
                  variant="outline"
                  shape="rounded-sm"
                  className="!p-2.5 text-gray-400"
                >
                  <Icon name="sort" folder="dashboardIcon" size="sm" />
                </Button>
                <Button
                  variant="outline"
                  shape="rounded-sm"
                  className="!p-2.5 text-gray-400"
                >
                  <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" />
                </Button>
                <Button
                  variant="outline"
                  shape="rounded-sm"
                  className="!p-2.5 text-gray-400"
                >
                  <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-10">
                  <Checkbox
                    checked={selectedIds.length === couponsData.length && couponsData.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {couponsData.map((coupon, index) => (
                <tr key={coupon.code} className="group">
                  <td>
                    <Checkbox
                      checked={selectedIds.includes(coupon.code)}
                      onChange={() => toggleItem(coupon.code)}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[4px] bg-brand-blue-light flex items-center justify-center">
                        <Icon name="local_offer" folder="icon" size="sm" className="text-brand-blue" />
                      </div>
                      <span className="text-xs font-bold text-[#1D3557] group-hover:text-blue-600 transition-colors">
                        {coupon.code}
                      </span>
                    </div>
                  </td>
                  <td>{coupon.discount}</td>
                  <td>{coupon.type}</td>
                  <td>{coupon.startDate}</td>
                  <td>{coupon.endDate}</td>
                  <td>
                    <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusConfig[coupon.status as keyof typeof statusConfig]}`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end items-center gap-4 text-gray-400">
                      <Button
                        variant="outline"
                        shape="rounded-sm"
                        className="!p-1.5 text-gray-400 hover:text-[#2196F3] transition-colors"
                        onClick={() => {
                          setCouponToEdit(coupon);
                          setIsEditDrawerOpen(true);
                        }}
                      >
                        <Icon name="settings" folder="dashboardIcon" size="sm" />
                      </Button>
                      <Button
                        variant="outline"
                        shape="rounded-sm"
                        className="!p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                        onClick={() => setCouponToDelete(coupon)}
                      >
                        <Icon name="Delete" folder="dashboardIcon" size="sm" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Area */}
        <Pagination
          currentPage={currentPage}
          totalPages={24}
          onPageChange={setCurrentPage}
        />
      </div>

      <ConfirmationModal
        isOpen={!!couponToDelete}
        onClose={() => setCouponToDelete(null)}
        onConfirm={() => {
          console.log(`Deleting coupon ${couponToDelete?.code}...`);
          setCouponToDelete(null);
        }}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon ${couponToDelete?.code}? This will permanently remove the discount from all associated products.`}
        confirmText="Yes, delete coupon"
        type="danger"
      />

      <EditCouponDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        coupon={couponToEdit}
      />

      <AddCouponModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <CouponsMoreActionsDrawer
        isOpen={isMoreActionsOpen}
        onClose={() => setIsMoreActionsOpen(false)}
        onDeleteExpired={() => setIsBulkDeleteConfirmOpen(true)}
      />

      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
        selectedIds={selectedIds}
        items={couponsData}
        onClearSelection={() => setSelectedIds([])}
        idProp="code"
        labelProp="code"
        title="Coupons Selected"
        actions={[
          {
            id: "export",
            title: "Export Selected",
            icon: "cloud_download",
            folder: "icon",
            onClick: () => console.log("Exporting selected coupons..."),
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

      <ConfirmationModal
        isOpen={isBulkDeleteConfirmOpen}
        onClose={() => setIsBulkDeleteConfirmOpen(false)}
        onConfirm={() => {
          console.log("Deleting all expired coupons...");
          setIsBulkDeleteConfirmOpen(false);
        }}
        title="Delete Expired Coupons"
        message="Are you sure you want to permanently delete all expired coupons? This action cannot be undone and will clean up your coupon database."
        confirmText="Yes, delete all expired"
        type="danger"
      />
    </div>
  );
}
