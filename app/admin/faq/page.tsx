"use client";

import React, { useState } from "react";
import { Button } from "../../components/Button";
import { CreateFAQModal } from "../../components/Admin/CreateFAQModal";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Input } from "../../components/Form/Inputs";
import { Pagination } from "../../components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { Icon } from "../../components/Icon";
import {
  HiOutlinePlusCircle,
  HiMagnifyingGlass,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import Checkbox from "@/app/components/Checkbox";
import {
  useGetFaqsQuery,
  useDeleteFaqMutation,
} from "@/lib/redux/services/faqApi";
import { toast } from "sonner";
import { NoRecordFound, SVGLoaderFetch } from "@/app/components/Options";
import moment from "moment";
import { StatusBadge } from "@/app/components/StatusBadge";
import { Tooltip } from "@/app/components/Tooltip";
import { HiArrowPath } from "react-icons/hi2";

export default function FAQManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: faqsData, isLoading, refetch, isFetching } = useGetFaqsQuery({
    page: currentPage,
    limit: rowsPerPage,
    search: searchQuery,
    category: activeTab
  });
  const [deleteFaq] = useDeleteFaqMutation();

  const faqs = faqsData?.data?.faqs || [];
  const pagination = faqsData?.data?.pagination;


  const categories = ["All Categories", "Orders & Tracking", "Shipping & Delivery", "Payments & Refunds", "Returns & Exchanges"];

  const filteredFAQs = faqs;

  const handleDelete = async () => {
    if (selectedFAQ) {
      try {
        await deleteFaq(selectedFAQ._id).unwrap();
        toast.success("FAQ deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedFAQ(null);
        setSelectedIds(prev => prev.filter(id => id !== selectedFAQ._id));
      } catch (error) {
        toast.error("Failed to delete FAQ");
      }
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredFAQs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFAQs.map(f => f._id));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Actions */}
      <div className="flex justify-end items-center gap-3">
        <Tooltip text="Refresh FAQ List">
          <Button shape="rounded-sm" variant="outline"
            className="border-gray-200 text-gray-500 group"
            iconLeft={<HiArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </Tooltip>
        <Button shape="rounded-sm" variant="primary"
          iconLeft={<HiOutlinePlusCircle size={18} />}
          onClick={() => {
            setSelectedFAQ(null);
            setIsModalOpen(true);
          }}
        >
          Create New FAQ
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-white overflow-hidden mb-8 border border-[#1C1C1C1A] rounded-[6px]">
        <div className="px-8 py-6 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 ">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <TabFilter
              tabs={categories}
              activeTab={activeTab}
              onChange={setActiveTab} id={""} />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input shape="rounded-sm"
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              containerClassName="w-full lg:w-80 xl:w-96"
              className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={
                <HiMagnifyingGlass size={18} className="text-gray-400" />
              }
            />
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
            </div>
          </div>
        </div>

        <div className="admin-table-container ">
          <table>
            <thead>
              <tr>
                <th className="w-10">
                  <Checkbox
                    checked={selectedIds.length === filteredFAQs.length && filteredFAQs.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>FAQ Question</th>
                <th>Category</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <SVGLoaderFetch colSpan={7} text={"Fetching FAQs..."} />
              ) : filteredFAQs.length === 0 ? (
                <NoRecordFound colSpan={7} />
              ) : filteredFAQs.map((faq) => (
                <tr key={faq._id} >
                  <td className="w-10 pl-8">
                    <Checkbox
                      checked={selectedIds.includes(faq._id)}
                      onChange={() => toggleItem(faq._id)}
                    />
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold/10 transition-colors">
                        <HiOutlineQuestionMarkCircle size={20} />
                      </div>
                      <span className="text-xs font-bold text-[#121212] line-clamp-1 max-w-[300px]">{faq.question}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-bold text-gray-500">{faq.category}</span>
                  </td>
                  <td>
                    <StatusBadge module="faq" value={faq.status} />
                  </td>
                  <td>
                    <span className="text-[11px] font-bold text-gray-400">
                      {faq.lastUpdated ? moment(faq.lastUpdated).format('MMM DD, YYYY') : "-"}
                    </span>
                  </td>
                  <td className="pr-8 py-5 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Tooltip text="Edit FAQ Entry">
                        <Button shape="rounded-sm" variant="outline"
                          className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
                          onClick={() => {
                            setSelectedFAQ(faq);
                            setIsModalOpen(true);
                          }}
                        >
                          <HiOutlinePencil size={14} />
                        </Button>
                      </Tooltip>
                      <Tooltip text="Delete FAQ Entry">
                        <Button shape="rounded-sm" variant="outline"
                          className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
                          onClick={() => {
                            setSelectedFAQ(faq);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <HiOutlineTrash size={14} />
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div  >
          <Pagination
            currentPage={currentPage}
            totalPages={pagination?.pages || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <CreateFAQModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFAQ(null);
        }}
        initialData={selectedFAQ}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFAQ(null);
        }}
        onConfirm={handleDelete}
        title="Delete FAQ Entry"
        message={`Are you sure you want to remove the FAQ: "${selectedFAQ?.question}"? This will hide the answer from the storefront immediately.`}
        confirmText="Yes, delete FAQ"
        type="danger"
      />
    </div>
  );
}
