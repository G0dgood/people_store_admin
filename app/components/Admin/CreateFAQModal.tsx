"use client";

import React, { useState, useEffect, useMemo } from "react";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { Input, Textarea } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

interface CreateFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faq: any) => void;
  initialData?: any;
}

const CATEGORIES = [
  "Orders & Tracking",
  "Shipping & Delivery",
  "Payments & Refunds",
  "Returns & Exchanges",
];

export function CreateFAQModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CreateFAQModalProps) {
  const [formData, setFormData] = useState({
    category: CATEGORIES[0],
    question: "",
    answer: "",
  });

  const categoryOptions = useMemo(
    () => CATEGORIES.map((cat) => ({ value: cat, label: cat })),
    []
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category,
        question: initialData.question,
        answer: initialData.answer,
      });
    } else {
      setFormData({
        category: CATEGORIES[0],
        question: "",
        answer: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: initialData?.id || Date.now(),
      status: "Active",
      lastUpdated: new Date().toLocaleDateString(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit FAQ Entry" : "Create New FAQ"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            FAQ Category
          </label>
          <div className="relative">
            <Select
              shape="rounded-sm"
              options={categoryOptions}
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val })}
              placeholder="Select Category"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Question</label>
          <Input
            shape="rounded-sm"
            placeholder="e.g. How do I track my order?"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Answer Content</label>
          <Textarea
            shape="rounded-sm"
            placeholder="Provide a detailed answer for your customers..."
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            required
            rows={6}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            shape="rounded-sm"
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            shape="rounded-sm"
            type="submit"
            variant="primary"
            className="transition-all duration-300 hover:bg-brand-gold hover:text-white"
          >
            {initialData ? "Update FAQ" : "Publish FAQ"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
