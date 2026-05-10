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
import { Tooltip } from "../../components/Tooltip";
import { useGetCouponsQuery, useDeleteCouponMutation } from "@/lib/redux/services/couponApi";
import { toast } from "sonner";
import { HiArrowPath } from "react-icons/hi2";
import { SVGLoaderFetch, NoRecordFound } from "@/app/components/Options";



const statusConfig = {
  Active: "text-emerald-600 bg-emerald-50",
  Expired: "text-rose-500 bg-rose-50/50",
  Scheduled: "text-blue-600 bg-gray-50",
};

export default function CouponsListing() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: response, isLoading, refetch, isFetching } = useGetCouponsQuery({
    page: currentPage,
    limit: rowsPerPage,
    search: searchQuery
  });
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
  const couponsData = response?.data || [];
  const totalPages = response?.meta?.totalPages || 1;

  const [activeTab, setActiveTab] = useState("All coupons");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [couponToDelete, setCouponToDelete] = useState<any>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleAll = () => {
    if (selectedIds.length === couponsData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(couponsData.map(c => c._id));
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
          <Tooltip text="Refresh Coupon List">
            <Button shape="rounded-sm" variant="outline"
              className="border-gray-200 text-gray-500 group h-10"
              iconLeft={<HiArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </Tooltip>
          <Button shape="rounded-sm" variant="primary"
            className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold flex-1 sm:flex-initial"
            iconLeft={<Icon name="ticket" folder="dashboardIcon" size="sm" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Coupon
          </Button>
          <Button shape="rounded-sm" variant="outline"
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
            onChange={setActiveTab} id={""} />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input shape="rounded-sm"
              type="text"
              placeholder="Search coupon code"
              containerClassName="w-full lg:w-80 xl:w-72 group"
              className="bg-white border-gray-200 placeholder:text-gray-400 text-sm font-medium focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="xs" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-gold transition-colors" />}
            />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

              <div className="flex gap-2 ml-auto sm:ml-0">
                <Button shape="rounded-sm" variant="outline"
                  className="!p-2.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold border-gray-200 transition-all">
                  <Icon name="sort" folder="dashboardIcon" size="sm" />
                </Button>
                <Button shape="rounded-sm" variant="outline"
                  className="!p-2.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold border-gray-200 transition-all">
                  <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" />
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
                <th>Image</th>
                <th>Coupon Code</th>
                <th>Title</th>
                <th>Description</th>
                <th>Discount</th>
                <th>Min. Spend</th>
                <th>Usage Limit</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <SVGLoaderFetch asTable={true} text="Loading coupons..."
                  colSpan={8} />

              ) : couponsData.length === 0 ? (
                <NoRecordFound asTable={true} text="No coupons found." colSpan={8} />

              ) : (
                couponsData.map((coupon, index) => (
                  <tr key={coupon._id} className="group">
                    <td>
                      <Checkbox
                        checked={selectedIds.includes(coupon._id)}
                        onChange={() => toggleItem(coupon._id)}
                      />
                    </td>
                    <td className="w-16">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center relative">
                        {coupon.mediaType === "video" ? (
                          <>
                            <img src={coupon.thumbnailUrl || coupon.image} alt="" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Icon name="play" folder="dashboardIcon" size="sm" className="text-white drop- " />
                            </div>
                          </>
                        ) : coupon.image ? (
                          <img src={coupon.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Icon name="ticket" folder="dashboardIcon" size="sm" className="text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-[#121212] group-hover:text-brand-gold transition-colors uppercase tracking-widest">
                          {coupon.code}
                        </span>


                      </div>
                    </td>
                    <td>
                      <span className="text-[10px] font-bold text-gray-900 leading-tight">
                        {coupon.title}
                      </span>
                    </td>
                    <td>{coupon.description}</td>
                    <td>{coupon.discount}</td>
                    <td>{coupon.minAmount}</td>
                    <td>{coupon.usageLimit === 0 ? "Unlimited" : coupon.usageLimit}</td>
                    <td>
                      <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusConfig[coupon.status as keyof typeof statusConfig]}`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end items-center gap-4">
                        <Tooltip text="Edit Coupon" position="top">
                          <Button shape="rounded-sm" variant="outline"
                            className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
                            onClick={() => {
                              setCouponToEdit(coupon);
                              setIsEditDrawerOpen(true);
                            }}
                          >
                            <Icon name="settings" folder="dashboardIcon" size="sm" />
                          </Button>
                        </Tooltip>
                        <Tooltip text="Delete Coupon" position="top">
                          <Button shape="rounded-sm" variant="outline"
                            className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
                            onClick={() => setCouponToDelete(coupon)}
                          >
                            <Icon name="Delete" folder="dashboardIcon" size="sm" />
                          </Button>
                        </Tooltip>
                      </div>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Area */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <ConfirmationModal
        isOpen={!!couponToDelete}
        onClose={() => setCouponToDelete(null)}
        onConfirm={async () => {
          if (couponToDelete) {
            try {
              await deleteCoupon(couponToDelete._id).unwrap();
              toast.success(`Coupon ${couponToDelete.code} deleted successfully`);
              setCouponToDelete(null);
            } catch (err: any) {
              toast.error(err?.data?.message || "Failed to delete coupon");
            }
          }
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
        idProp="_id"
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
