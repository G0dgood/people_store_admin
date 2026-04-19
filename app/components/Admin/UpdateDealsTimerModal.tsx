"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { Input } from "../Form/Inputs";
import { HiOutlineInformationCircle } from "react-icons/hi2";

interface UpdateDealsTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  onUpdate: (values: { days: string; hours: string; minutes: string; seconds: string }) => void;
}

export function UpdateDealsTimerModal({ isOpen, onClose, initialValues, onUpdate }: UpdateDealsTimerModalProps) {
  const [formData, setFormData] = useState({
    days: initialValues?.days || "04",
    hours: initialValues?.hours || "13",
    minutes: initialValues?.minutes || "34",
    seconds: initialValues?.seconds || "56",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    // Ensure only numbers and max length of 2 (except days)
    const sanitized = value.replace(/[^0-9]/g, "");
    if (field !== "days" && sanitized.length > 2) return;
    setFormData(prev => ({ ...prev, [field]: sanitized }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Offer Countdown" size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-blue shadow-sm shrink-0">
            <HiOutlineInformationCircle size={20} />
          </div>
          <p className="text-[11px] font-bold text-brand-blue leading-relaxed">
            Set the remaining time for the active "Deals and Offers" section. This will be visible on the home page.
          </p>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Days</label>
            <Input
              placeholder="00"
              value={formData.days}
              onChange={(e) => handleInputChange("days", e.target.value)}
              className="text-center font-black text-lg h-14 !rounded-xl"
              maxLength={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Hours</label>
            <Input
              placeholder="00"
              value={formData.hours}
              onChange={(e) => handleInputChange("hours", e.target.value)}
              className="text-center font-black text-lg h-14 !rounded-xl"
              maxLength={2}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Min</label>
            <Input
              placeholder="00"
              value={formData.minutes}
              onChange={(e) => handleInputChange("minutes", e.target.value)}
              className="text-center font-black text-lg h-14 !rounded-xl"
              maxLength={2}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Sec</label>
            <Input
              placeholder="00"
              value={formData.seconds}
              onChange={(e) => handleInputChange("seconds", e.target.value)}
              className="text-center font-black text-lg h-14 !rounded-xl"
              maxLength={2}
            />
          </div>
        </div>

        {/* Summary Preview */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Preview Display:</span>
          <div className="flex gap-2">
            <div className="flex flex-col items-center justify-center w-10 h-10 bg-white rounded-lg border border-gray-200">
              <span className="text-xs font-black text-[#1D3557]">{formData.days || "00"}</span>
              <span className="text-[8px] text-gray-400 font-bold uppercase">Days</span>
            </div>
            <div className="flex flex-col items-center justify-center w-10 h-10 bg-white rounded-lg border border-gray-200">
              <span className="text-xs font-black text-[#1D3557]">{formData.hours || "00"}</span>
              <span className="text-[8px] text-gray-400 font-bold uppercase">Hrs</span>
            </div>
            <div className="flex flex-col items-center justify-center w-10 h-10 bg-white rounded-lg border border-gray-200">
              <span className="text-xs font-black text-[#1D3557]">{formData.minutes || "00"}</span>
              <span className="text-[8px] text-gray-400 font-bold uppercase">Min</span>
            </div>
            <div className="flex flex-col items-center justify-center w-10 h-10 bg-white rounded-lg border border-gray-200">
              <span className="text-xs font-black text-[#1D3557]">{formData.seconds || "00"}</span>
              <span className="text-[8px] text-gray-400 font-bold uppercase">Sec</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 text-[11px] font-black uppercase tracking-widest border-gray-200 text-gray-400 hover:text-[#1D3557]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-[2] h-11 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
          >
            Establish Timer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
