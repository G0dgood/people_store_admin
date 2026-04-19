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

const initialFAQs = [
  { id: 1, category: "Orders & Tracking", question: "How can I track my order?", answer: "Once your order is shipped, you will receive an email with a tracking number...", lastUpdated: "2023-10-15", status: "Active" },
  { id: 2, category: "Orders & Tracking", question: "Can I modify my order after placing it?", answer: "We process orders quickly, but you can request modifications within 1 hour...", lastUpdated: "2023-10-14", status: "Active" },
  { id: 4, category: "Shipping & Delivery", question: "What are the shipping rates?", answer: "Shipping rates are calculated based on the weight of your order...", lastUpdated: "2023-10-12", status: "Active" },
  { id: 7, category: "Payments & Refunds", question: "What payment methods do you accept?", answer: "We accept all major credit/debit cards, PayPal, and local bank transfers...", lastUpdated: "2023-10-10", status: "Active" },
  { id: 10, category: "Returns & Exchanges", question: "What is your return policy?", answer: "We offer a 30-day return policy for most items...", lastUpdated: "2023-10-05", status: "Active" },
];

export default function FAQManagementPage() {
  const [faqs, setFaqs] = useState(initialFAQs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ["All Categories", "Orders & Tracking", "Shipping & Delivery", "Payments & Refunds", "Returns & Exchanges"];

  const filteredFAQs = faqs.filter(faq => {
    const matchesTab = activeTab === "All Categories" || faq.category === activeTab;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSave = (faqData: any) => {
    if (selectedFAQ) {
      setFaqs(prev => prev.map(f => f.id === selectedFAQ.id ? faqData : f));
    } else {
      setFaqs(prev => [faqData, ...prev]);
    }
    setSelectedFAQ(null);
  };

  const handleDelete = () => {
    if (selectedFAQ) {
      setFaqs(prev => prev.filter(f => f.id !== selectedFAQ.id));
      setIsDeleteModalOpen(false);
      setSelectedFAQ(null);
      setSelectedIds(prev => prev.filter(id => id !== selectedFAQ.id));
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredFAQs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFAQs.map(f => f.id));
    }
  };

  const toggleItem = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Actions */}
      <div className="flex justify-end items-center">
        <Button
          variant="primary"
          shape="rounded-sm"
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
              onChange={setActiveTab}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input
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
              {filteredFAQs.map((faq) => (
                <tr key={faq.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="w-10 pl-8">
                    <Checkbox
                      checked={selectedIds.includes(faq.id)}
                      onChange={() => toggleItem(faq.id)}
                    />
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue/10 transition-colors">
                        <HiOutlineQuestionMarkCircle size={20} />
                      </div>
                      <span className="text-xs font-bold text-[#1D3557] line-clamp-1 max-w-[300px]">{faq.question}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-bold text-gray-500">{faq.category}</span>
                  </td>
                  <td className="text-center">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-500 text-[10px] font-black rounded-full uppercase">
                      {faq.status}
                    </span>
                  </td>
                  <td>
                    <span className="text-[11px] font-bold text-gray-400">{faq.lastUpdated}</span>
                  </td>
                  <td className="pr-8 py-5 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        variant="outline"
                        shape="rounded-sm"
                        className="!p-1.5 text-gray-400 hover:text-blue-500 hover:bg-brand-blue-light transition-all"
                        onClick={() => {
                          setSelectedFAQ(faq);
                          setIsModalOpen(true);
                        }}
                      >
                        <HiOutlinePencil size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        shape="rounded-sm"
                        className="!p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        onClick={() => {
                          setSelectedFAQ(faq);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <HiOutlineTrash size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredFAQs.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center gap-4 bg-gray-50/20">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-200 shadow-inner">
                <HiMagnifyingGlass size={32} />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No FAQs found matching your criteria</p>
            </div>
          )}
        </div>
        <div className="p-4 bg-gray-50/30 border-t border-gray-50">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredFAQs.length / rowsPerPage) || 1}
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
        onSave={handleSave}
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
