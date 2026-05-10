"use client";

import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import { Button } from "../Button/Button";
import { Input, Textarea } from "../Form/Inputs";
import { useCreateGiftCardMutation, useUpdateGiftCardMutation, GiftCard } from "@/lib/redux/services/giftCardApi";
import { toast } from "sonner";
import { HiCreditCard, HiSparkles } from "react-icons/hi2";
import { Select } from "../Form/Select";
import { DatePicker } from "../Form/DatePicker";

interface AddGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftCard?: GiftCard | null;
}

export function AddGiftCardModal({ isOpen, onClose, giftCard }: AddGiftCardModalProps) {
  const [createGiftCard, { isLoading: isCreating }] = useCreateGiftCardMutation();
  const [updateGiftCard, { isLoading: isUpdating }] = useUpdateGiftCardMutation();
  const [showRecipient, setShowRecipient] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    initialAmount: 0,
    balance: 0,
    expiryDate: "",
    status: "Active" as GiftCard['status'],
    color: "#121212",
    recipientName: "",
    recipientEmail: "",
    message: ""
  });

  useEffect(() => {
    if (giftCard) {
      setFormData({
        name: giftCard.name,
        code: giftCard.code,
        initialAmount: giftCard.initialAmount,
        balance: giftCard.balance,
        expiryDate: giftCard.expiryDate ? new Date(giftCard.expiryDate).toISOString().split('T')[0] : "",
        status: giftCard.status,
        color: giftCard.color || "#121212",
        recipientName: giftCard.recipientName || "",
        recipientEmail: giftCard.recipientEmail || "",
        message: giftCard.message || ""
      });
      if (giftCard.recipientName || giftCard.recipientEmail) {
        setShowRecipient(true);
      }
    } else {
      const randomCode = Math.random().toString(36).substring(2, 12).toUpperCase();
      setFormData({
        name: "Standard Gift Card",
        code: randomCode,
        initialAmount: 0,
        balance: 0,
        expiryDate: "",
        status: "Active",
        color: "#121212",
        recipientName: "",
        recipientEmail: "",
        message: ""
      });
    }
  }, [giftCard, isOpen]);

  const cardColors = [
    { name: "Brand Charcoal", value: "#121212" },
    { name: "Midnight Purple", value: "#2D1B4D" },
    { name: "Deep Emerald", value: "#0A2F1F" },
    { name: "Ruby Noir", value: "#3D0C11" },
    { name: "Royal Blue", value: "#0F172A" },
    { name: "Champagne", value: "#C5A059" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (giftCard) {
        await updateGiftCard({ id: giftCard._id, data: formData }).unwrap();
        toast.success("Gift card updated successfully");
      } else {
        await createGiftCard(formData).unwrap();
        toast.success("Gift card issued successfully");
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const isProcessing = isCreating || isUpdating;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={giftCard ? "Update Card" : "Issue Gift Card"} size="md">
      <ModalBody className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div
            className="rounded-xl p-6 shadow-2xl flex flex-col gap-6 relative overflow-hidden group transition-all duration-700"
            style={{ backgroundColor: formData.color }}
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />

            <div className="flex justify-between items-start relative z-10">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black text-brand-gold uppercase tracking-[0.3em]">Card Identifier</label>
                <input
                  className="bg-transparent text-white text-xl font-black tracking-widest uppercase border-none focus:ring-0 p-0 outline-none w-full"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="CODE-XXXX"
                  required
                  disabled={!!giftCard}
                />
              </div>
              <HiCreditCard size={32} className="text-white/20" />
            </div>

            <div className="flex flex-col gap-1 relative z-10">
              <label className="text-[8px] font-black text-white/50 uppercase tracking-[0.3em]">Card Name / Holder</label>
              <input
                className="bg-transparent text-white text-sm font-bold border-none focus:ring-0 p-0 outline-none w-full"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Holder Name"
                required
              />
            </div>

            <div className="flex items-end justify-between relative z-10 pt-2">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black text-white/50 uppercase tracking-[0.3em]">Available Balance</label>
                <div className="flex items-center gap-1">
                  <span className="text-brand-gold text-lg font-black tracking-tight">₦</span>
                  <input
                    type="number"
                    className="bg-transparent text-white text-2xl font-black border-none focus:ring-0 p-0 outline-none w-32"
                    value={giftCard ? formData.balance : formData.initialAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (giftCard) {
                        setFormData({ ...formData, balance: val });
                      } else {
                        setFormData({ ...formData, initialAmount: val, balance: val });
                      }
                    }}
                    required
                  />
                </div>
              </div>
              <HiSparkles size={20} className="text-brand-gold/30 animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Card Aesthetic</label>
            <div className="flex flex-wrap gap-3">
              {cardColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${formData.color === color.value ? "border-brand-gold scale-110 shadow-lg" : "border-transparent hover:scale-105"}`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {formData.color === color.value && <div className="w-2 h-2 rounded-full bg-brand-gold" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
              <Select
                shape="rounded-sm"
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                  { value: "Used", label: "Used" },
                  { value: "Expired", label: "Expired" }
                ]}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val as any })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry Date</label>
              <Input
                shape="rounded-sm"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="bg-gray-50/50 border-gray-100"
              />
            </div>
          </div>

          <div className="flex flex-row justify-end gap-3 mt-4">

            <Button
              type="button"
              onClick={onClose}
              variant={"ghost"}
            >
              Cancel Operation
            </Button>

            <Button
              type="submit"
              isLoading={isProcessing}
              shape="rounded-sm"
            >
              {giftCard ? "Update Card Details" : "Issue Prepaid Card"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
