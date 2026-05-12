"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input } from "../Form/Inputs";
import { Button } from "../Button";
import { useCreateOfficeMutation } from "@/lib/redux/services/officeApi";
import { toast } from "sonner";
import { useApiError } from "@/app/hooks/useApiError";

interface AddOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddOfficeModal({ isOpen, onClose }: AddOfficeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    workingHours: "",
  });

  const [createOffice, { isLoading: isCreating, isError, error }] = useCreateOfficeMutation();
  useApiError(isError, error, "Failed to Create Office");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOffice(formData).unwrap();
      toast.success("Office Created Successfully", {
        description: `${formData.name} has been added to locations.`
      });
      // Reset form
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        workingHours: "",
      });
      onClose();
    } catch (err: any) {
      // Error handled by hook
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Office Location" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Location Name</label>
            <Input
              placeholder="e.g. Lagos Head Office, Ikeja Branch"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 border-gray-200 font-bold"
              shape="rounded-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Physical Address</label>
            <Input
              placeholder="Full address of the location"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="h-12 border-gray-200 font-bold"
              shape="rounded-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Phone Number</label>
              <Input
                placeholder="+234 ..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                shape="rounded-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Email Address</label>
              <Input
                type="email"
                placeholder="office@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                shape="rounded-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Working Hours</label>
            <Input
              placeholder="e.g. Mon-Fri: 9AM - 5PM"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              className="h-12 border-gray-200 font-bold"
              shape="rounded-sm"
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3 border-t border-gray-50 pt-6">
          <Button
            shape="rounded-sm"
            variant="outline"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            shape="rounded-sm"
            variant="primary"
            type="submit"
            isLoading={isCreating}
          >
            Create Location
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
