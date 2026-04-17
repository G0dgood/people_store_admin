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

const reviewsData = [
  {
    id: 1,
    customer: { name: "Arlene McCoy", email: "arlene.mccoy@example.com", avatar: "/dashboardImage/Fashion.png" },
    rating: 5,
    comment: "The sound quality is exceptional. Best headphones I've owned!",
    product: { name: "Premium Wireless Headphones", image: "/dashboardImage/Headphones.png" },
    date: "Oct 24, 2023",
    status: "Published"
  },
  {
    id: 2,
    customer: { name: "Brooklyn Simmons", email: "brooklyn.s@example.com", avatar: "/dashboardImage/T-Shirt.png" },
    rating: 4,
    comment: "Great fitness tracker, but the strap is a bit stiff initially.",
    product: { name: "Smart Fitness Watch", image: "/dashboardImage/Electronics.png" },
    date: "Oct 22, 2023",
    status: "Pending"
  },
  {
    id: 3,
    customer: { name: "Cody Fisher", email: "cody.f@example.com", avatar: "/dashboardImage/Cap.png" },
    rating: 2,
    comment: "The color is slightly different from the photos. Disappointed.",
    product: { name: "Organic Cotton T-Shirt", image: "/dashboardImage/T-Shirt.png" },
    date: "Oct 20, 2023",
    status: "Published"
  },
  {
    id: 4,
    customer: { name: "Jane Cooper", email: "jane.c@example.com", avatar: "/dashboardImage/Electronics.png" },
    rating: 5,
    comment: "Stunning design and very accurate timekeeping. Love it!",
    product: { name: "Minimalist Wall Clock", image: "/dashboardImage/Home & Kitchen.png" },
    date: "Oct 18, 2023",
    status: "Published"
  },
  {
    id: 5,
    customer: { name: "Robert Fox", email: "robert.f@example.com", avatar: "/dashboardImage/Accessories.png" },
    rating: 1,
    comment: "Item arrived damaged. Customer support was helpful though.",
    product: { name: "Modern Desk Lamp", image: "/dashboardImage/Bulb.png" },
    date: "Oct 15, 2023",
    status: "Spam"
  },
  {
    id: 6,
    customer: { name: "Esther Howard", email: "esther.h@example.com", avatar: "/dashboardImage/Fashion.png" },
    rating: 4,
    comment: "Very comfortable bag for daily commute. Highly recommend.",
    product: { name: "Leather Travel Bag", image: "/dashboardImage/Fashion.png" },
    date: "Oct 12, 2023",
    status: "Published"
  },
];

const statusStyles = {
  Published: "text-blue-500 bg-brand-blue-light",
  Pending: "text-amber-500 bg-amber-50/50",
  Spam: "text-rose-500 bg-rose-50/50",
};

export default function ReviewListing() {
  const [activeTab, setActiveTab] = useState("All reviews");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isReplyDrawerOpen, setIsReplyDrawerOpen] = useState(false);
  const [reviewToReply, setReviewToReply] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<any>(null);
  const [isClearSpamConfirmOpen, setIsClearSpamConfirmOpen] = useState(false);
  const [isBulkApproveConfirmOpen, setIsBulkApproveConfirmOpen] = useState(false);
  const [isExportSuccessOpen, setIsExportSuccessOpen] = useState(false);

  const toggleAll = () => {
    if (selectedIds.length === filteredReviews.length && filteredReviews.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredReviews.map(r => r.id));
    }
  };

  const toggleItem = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredReviews = reviewsData.filter(review => {
    if (activeTab === "All reviews") return true;
    return review.status === activeTab;
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
          <Button
            variant="primary"
            shape="rounded-sm"
            iconLeft={<Icon name="ticket" folder="dashboardIcon" size="sm" />}
            onClick={() => setIsExportSuccessOpen(true)}
          >
            Export Reviews
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

      <div className="bg-white overflow-hidden flex flex-col border border-[#1C1C1C1A] rounded-[6px]">
        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All reviews", "Published", "Pending", "Spam"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input
              type="text"
              placeholder="Search reviewer, comment..."
              containerClassName="flex-1 xl:w-96"
              className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

            <div className="flex gap-2">
              <Button
                variant="outline"
                shape="rounded-sm"
                className="!p-2.5 text-gray-400"
              >
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
                    checked={selectedIds.length === filteredReviews.length && filteredReviews.length > 0}
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
              {filteredReviews.map((review) => (
                <tr key={review.id} className="group">
                  <td>
                    <Checkbox
                      checked={selectedIds.includes(review.id)}
                      onChange={() => toggleItem(review.id)}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                        <img src={review.customer.avatar} alt={review.customer.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1D3557] leading-tight">{review.customer.name}</span>
                        <span className="text-[10px] font-medium text-gray-400 mt-0.5">{review.customer.email}</span>
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
                      <div className="w-10 h-10 rounded-[6px] border border-gray-100 overflow-hidden bg-white p-1 shadow-sm">
                        <img src={review.product.image} alt={review.product.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-xs font-bold text-gray-500 max-w-[120px] truncate">{review.product.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-bold text-gray-400">{review.date}</span>
                  </td>
                  <td>
                    <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusStyles[review.status as keyof typeof statusStyles]}`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="text-right text-gray-300">
                    <div className="flex justify-end gap-4">
                      <Button
                        variant="outline"
                        shape="rounded-sm"
                        className="!p-1.5 text-gray-400 hover:text-blue-500 hover:bg-brand-blue-light transition-all"
                        onClick={() => {
                          setReviewToReply(review);
                          setIsReplyDrawerOpen(true);
                        }}
                      >
                        <HiMiniArrowUturnLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        shape="rounded-sm"
                        className="!p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
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
          totalPages={85}
          onPageChange={setCurrentPage}
        />
      </div>

      <ReviewsMoreActionsDrawer
        isOpen={isMoreActionsOpen && selectedIds.length === 0}
        onClose={() => setIsMoreActionsOpen(false)}
        onBulkApprove={() => setIsBulkApproveConfirmOpen(true)}
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
            onClick: () => setIsBulkApproveConfirmOpen(true),
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

      <ReviewReplyDrawer
        isOpen={isReplyDrawerOpen}
        onClose={() => setIsReplyDrawerOpen(false)}
        review={reviewToReply}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          console.log("Deleting review from:", reviewToDelete?.customer.name);
          setIsDeleteModalOpen(false);
        }}
        title="Delete Review"
        message={`Are you sure you want to delete the review from "${reviewToDelete?.customer.name}"? This action cannot be undone.`}
        confirmText="Yes, delete review"
        type="danger"
      />

      <ConfirmationModal
        isOpen={isClearSpamConfirmOpen}
        onClose={() => setIsClearSpamConfirmOpen(false)}
        onConfirm={() => {
          console.log("Clearing spam queue...");
          setIsClearSpamConfirmOpen(false);
        }}
        title="Clear Spam Queue"
        message="Are you sure you want to permanently delete all reviews flagged as Spam? This action will free up database space but is irreversible."
        confirmText="Yes, clear queue"
        type="danger"
      />

      <ConfirmationModal
        isOpen={isBulkApproveConfirmOpen}
        onClose={() => setIsBulkApproveConfirmOpen(false)}
        onConfirm={() => {
          console.log("Bulk approving pending reviews...");
          setIsBulkApproveConfirmOpen(false);
        }}
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
          <Button
            variant="primary"
            className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
            onClick={() => setIsExportSuccessOpen(false)}
          >
            Great, thank you
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
