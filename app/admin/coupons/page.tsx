"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { ConfirmationModal } from "../../components/Admin/ConfirmationModal";
import { EditCouponDrawer } from "../../components/Admin/EditCouponDrawer";
import { AddCouponModal } from "../../components/Admin/AddCouponModal";
import { CouponsMoreActionsDrawer } from "../../components/Admin/CouponsMoreActionsDrawer";

const couponsData = [
  { id: 1, code: "SUMMER SALE", discount: "15%", type: "Percentage", startDate: "01-06-2025", endDate: "30-08-2025", status: "Active" },
  { id: 2, code: "WELCOME10", discount: "$10.00", type: "Fixed Rate", startDate: "01-01-2025", endDate: "31-12-2025", status: "Active" },
  { id: 3, code: "BLACKFRIDAY", discount: "50%", type: "Percentage", startDate: "24-11-2025", endDate: "27-11-2025", status: "Scheduled" },
  { id: 4, code: "EXPIRED20", discount: "20%", type: "Percentage", startDate: "01-01-2024", endDate: "01-02-2024", status: "Expired" },
  { id: 5, code: "FREESHIP", discount: "Free Shipping", type: "Shipping", startDate: "01-03-2025", endDate: "31-03-2025", status: "Active" },
  { id: 6, code: "FLASH25", discount: "25%", type: "Percentage", startDate: "15-04-2025", endDate: "16-04-2025", status: "Active" },
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
  const [currentPage, setCurrentPage] = useState(1);
  const [couponToDelete, setCouponToDelete] = useState<any>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
          <Button
            variant="primary"
            shape="rounded-sm"
            iconLeft={<Icon name="ticket" folder="dashboardIcon" size="sm" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Coupon
          </Button>
          <Button
            variant="outline"
            shape="rounded-sm"
            iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            onClick={() => setIsMoreActionsOpen(true)}
          >
            More Action
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filter Controls Row */}
        <div className="p-6 flex flex-col xl:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All coupons", "Active", "Inactive", "Expired"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="flex-1 xl:w-72 bg-gray-50/80 rounded-[6px] px-4 py-2.5 flex items-center border border-transparent focus-within:bg-white focus-within:border-gray-100 transition-all">
              <input
                type="text"
                placeholder="Search coupon code"
                className="bg-transparent border-none focus:outline-none text-sm text-gray-900 w-full placeholder:text-gray-400 font-medium"
              />
              <Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400 ml-2" />
            </div>

            <div className="flex gap-2">
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="sort" folder="dashboardIcon" size="sm" />
              </button>
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" />
              </button>
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>No.</th>
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
                <tr key={coupon.id} className="group">
                  <td className="text-sm font-medium text-gray-900">{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[4px] bg-brand-blue-light flex items-center justify-center">
                        <Icon name="ticket" folder="dashboardIcon" size="sm" className="text-[#2196F3]" />
                      </div>
                      <span className="text-sm font-bold text-[#1D3557] group-hover:text-blue-600 transition-colors">
                        {coupon.code}
                      </span>
                    </div>
                  </td>
                  <td className="text-sm font-bold text-gray-700">{coupon.discount}</td>
                  <td className="text-xs font-semibold text-gray-500">{coupon.type}</td>
                  <td className="text-xs font-bold text-gray-500">{coupon.startDate}</td>
                  <td className="text-xs font-bold text-gray-500">{coupon.endDate}</td>
                  <td>
                    <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusConfig[coupon.status as keyof typeof statusConfig]}`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end items-center gap-4 text-gray-400">
                      <button 
                        className="hover:text-[#2196F3] transition-colors"
                        onClick={() => {
                          setCouponToEdit(coupon);
                          setIsEditDrawerOpen(true);
                        }}
                      >
                        <Icon name="settings" folder="dashboardIcon" size="sm" />
                      </button>
                      <button 
                        className="hover:text-rose-500 transition-colors"
                        onClick={() => setCouponToDelete(coupon)}
                      >
                        <Icon name="Delete" folder="dashboardIcon" size="sm" />
                      </button>
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
