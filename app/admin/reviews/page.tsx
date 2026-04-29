"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { HiMiniArrowUturnLeft } from "react-icons/hi2";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { ReviewReplyDrawer } from "../../components/Admin/ReviewReplyDrawer";
import { ReviewsMoreActionsDrawer } from "../../components/Admin/ReviewsMoreActionsDrawer";
import Checkbox from "@/app/components/Checkbox";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Modal from "../../components/Modal/Modal";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";

import {
  useGetReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
  useBulkReviewActionMutation
} from "@/lib/redux/services/reviewApi";
import { SVGLoaderFetch, NoRecordFound } from "../../components/Options";
import { toast } from "sonner";

const statusStyles = {
  Published: "text-blue-500 bg-brand-blue-light",
  Pending: "text-amber-500 bg-amber-50/50",
  Spam: "text-rose-500 bg-rose-50/50",
};

export default function ReviewListing() {
  const [activeTab, setActiveTab] = useState("All reviews");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: response, isLoading } = useGetReviewsQuery({
    page: currentPage,
    limit: rowsPerPage,
    status: activeTab,
    search: searchQuery
  });

  const [updateReviewStatus] = useUpdateReviewStatusMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [bulkAction] = useBulkReviewActionMutation();

  const reviewsData = response?.data?.reviews || [];
  const pagination = response?.data?.pagination;

  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isReplyDrawerOpen, setIsReplyDrawerOpen] = useState(false);
  const [reviewToReply, setReviewToReply] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<any>(null);
  const [isClearSpamConfirmOpen, setIsClearSpamConfirmOpen] = useState(false);
  const [isBulkApproveConfirmOpen, setIsBulkApproveConfirmOpen] = useState(false);
  const [isExportSuccessOpen, setIsExportSuccessOpen] = useState(false);

  const toggleAll = () => {
    if (selectedIds.length === reviewsData.length && reviewsData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reviewsData.map(r => r._id));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteReview(reviewToDelete._id).unwrap();
      toast.success("Review deleted");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const handleBulkAction = async (action: string, status?: string) => {
    try {
      await bulkAction({ ids: selectedIds, action, status }).unwrap();
      toast.success(`Bulk ${action} successful`);
      setSelectedIds([]);
      setIsBulkApproveConfirmOpen(false);
    } catch (error) {
      toast.error(`Bulk ${action} failed`);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
          <Button shape="rounded-sm" variant="primary"
            iconLeft={<Icon name="ticket" folder="dashboardIcon" size="sm" />}
            className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
            onClick={() => setIsExportSuccessOpen(true)}
          >
            Export Reviews
          </Button>
          <Button shape="rounded-sm" variant="outline"
            iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            onClick={() => setIsMoreActionsOpen(true)}
          >
            More Action
          </Button>
        </div>
      </div>

      <div className="bg-white overflow-hidden flex flex-col border border-[#1C1C1C1A] rounded-[6px]">
        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All reviews", "Published", "Pending", "Spam"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input shape="rounded-sm"
              type="text"
              placeholder="Search reviewer, comment..."
              containerClassName="flex-1 xl:w-96"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

            <div className="flex gap-2">
              <Button shape="rounded-sm" variant="outline"
                className="!p-2.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold border-gray-200 transition-all">
                <Icon name="sort" folder="dashboardIcon" size="sm" />
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-10">
                  <Checkbox
                    checked={selectedIds.length === reviewsData.length && reviewsData.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>Customer</th>
                <th>Review</th>
                <th>Product</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <SVGLoaderFetch colSpan={7} text="Fetching reviews..." />
              ) : reviewsData.length === 0 ? (
                <NoRecordFound colSpan={7} text="No reviews found." />
              ) : reviewsData.map((review: any) => (
                <tr key={review._id} className="group">
                  <td>
                    <Checkbox
                      checked={selectedIds.includes(review._id)}
                      onChange={() => toggleItem(review._id)}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                        <img src={review.customer?.avatar || "/dashboardImage/Fashion.png"} alt={review.customer?.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1D3557] leading-tight">{review.customer?.fullName}</span>
                        <span className="text-[10px] font-medium text-gray-400 mt-0.5">{review.customer?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-[300px]">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon
                            key={star}
                            name="star"
                            folder="dashboardIcon"
                            size="xs"
                            className={star <= review.rating ? "text-amber-400" : "text-gray-200"}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-medium text-[#1D3557] leading-relaxed line-clamp-2 italic tracking-tight opacity-80">
                        "{review.comment}"
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[6px] border border-gray-200 overflow-hidden bg-white p-1 shadow-sm">
                        <img src={review.product?.mainImage} alt={review.product?.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-xs font-bold text-gray-500 max-w-[120px] truncate">{review.product?.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-bold text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td>
                    <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusStyles[review.status as keyof typeof statusStyles]}`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="text-right text-gray-300">
                    <div className="flex justify-end gap-4">
                      <Button shape="rounded-sm" variant="outline"
                        className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
                        onClick={() => {
                          setReviewToReply(review);
                          setIsReplyDrawerOpen(true);
                        }}
                      >
                        <HiMiniArrowUturnLeft className="w-4 h-4" />
                      </Button>
                      <Button shape="rounded-sm" variant="outline"
                        className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
                        onClick={() => {
                          setReviewToDelete(review);
                          setIsDeleteModalOpen(true);
                        }}
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

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setCurrentPage}
        />
      </div>

      <ReviewsMoreActionsDrawer
        isOpen={isMoreActionsOpen && selectedIds.length === 0}
        onClose={() => setIsMoreActionsOpen(false)}
        onBulkApprove={() => handleBulkAction("updateStatus", "Published")}
        onExport={() => setIsExportSuccessOpen(true)}
      />

      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
        selectedIds={selectedIds}
        items={reviewsData}
        onClearSelection={() => setSelectedIds([])}
        title="Reviews Selected"
        actions={[
          {
            id: "approve",
            title: "Approve Selected",
            icon: "verified",
            folder: "icon",
            onClick: () => handleBulkAction("updateStatus", "Published"),
          },
          {
            id: "delete",
            title: "Delete All Selected",
            icon: "Delete",
            folder: "dashboardIcon",
            variant: "danger",
            onClick: () => handleBulkAction("delete"),
          },
        ]}
      />

      <ReviewReplyDrawer
        isOpen={isReplyDrawerOpen}
        onClose={() => setIsReplyDrawerOpen(false)}
        review={reviewToReply}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteReview}
        title="Delete Review"
        message={`Are you sure you want to delete the review from "${reviewToDelete?.customer?.fullName}"? This action cannot be undone.`}
        confirmText="Yes, delete review"
        type="danger"
      />

      <ConfirmationModal
        isOpen={isClearSpamConfirmOpen}
        onClose={() => setIsClearSpamConfirmOpen(false)}
        onConfirm={() => handleBulkAction("delete")}
        title="Clear Spam Queue"
        message="Are you sure you want to permanently delete all reviews flagged as Spam? This action will free up database space but is irreversible."
        confirmText="Yes, clear queue"
        type="danger"
      />

      <ConfirmationModal
        isOpen={isBulkApproveConfirmOpen}
        onClose={() => setIsBulkApproveConfirmOpen(false)}
        onConfirm={() => handleBulkAction("updateStatus", "Published")}
        title="Bulk Approve"
        message="Are you sure you want to publish all currently pending reviews? This will make them visible on the storefront immediately."
        confirmText="Yes, approve all"
        type="success"
      />

      <Modal
        isOpen={isExportSuccessOpen}
        onClose={() => setIsExportSuccessOpen(false)}
        title=""
        size="md"
      >
        <ModalBody className="flex flex-col items-center text-center py-10 gap-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 shadow-inner">
            <Icon name="task_alt" folder="icon" size="lg" className="w-10 h-10" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black text-[#1D3557]">Export Started!</h2>
            <p className="text-sm font-medium text-gray-400 max-w-[280px] mx-auto leading-relaxed">
              Your feedback report is being generated and will be downloaded automatically in a few moments.
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col gap-3 pb-8">
          <Button shape="rounded-sm"
            variant="primary"
            className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
            onClick={() => setIsExportSuccessOpen(false)}
          >
            Great, thank you
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
