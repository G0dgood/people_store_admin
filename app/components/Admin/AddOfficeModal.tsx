"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { useCreateOfficeMutation } from "@/lib/redux/services/officeApi";
import { useApiError } from "@/app/hooks/useApiError";
import { toast } from "sonner";

const WORKING_HOURS_OPTIONS = [
  { label: "Mon - Fri: 9AM - 5PM", value: "Mon - Fri: 9AM - 5PM" },
  { label: "Mon - Fri: 8AM - 6PM", value: "Mon - Fri: 8AM - 6PM" },
  { label: "Mon - Sat: 9AM - 5PM", value: "Mon - Sat: 9AM - 5PM" },
  { label: "Mon - Sat: 8AM - 6PM", value: "Mon - Sat: 8AM - 6PM" },
  { label: "24 Hours (Daily)", value: "24 Hours (Daily)" },
];

interface AddOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddOfficeModal({ isOpen, onClose }: AddOfficeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    address: "",
    phone: "",
    email: "",
    workingHours: WORKING_HOURS_OPTIONS[0].value,
  });

  const [createOffice, { isLoading: isCreating, isError, error }] = useCreateOfficeMutation();
  useApiError(isError, error, "Failed to Create Office");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOffice(formData).unwrap();
      toast.success("Office Created Successfully", {
        description: `${formData.name} added. Use the 'Manage Products' icon in the list to assign items to this location.`
      });
      // Reset form
      setFormData({
        name: "",
        subdomain: "",
        address: "",
        phone: "",
        email: "",
        workingHours: WORKING_HOURS_OPTIONS[0].value,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Location Name</label>
              <Input
                placeholder="e.g. Lagos Head Office"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                shape="rounded-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Office Subdomain</label>
              <Input
                placeholder="lagos-hq"
                value={formData.subdomain}
                onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="h-12 border-gray-200 font-bold"
                shape="rounded-sm"
                suffixElement={<span className="text-[10px] font-black text-gray-400 pr-4"> (subdomain)</span>}
                required
              />
            </div>
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
            <Select
              options={WORKING_HOURS_OPTIONS}
              value={formData.workingHours}
              onChange={(val) => setFormData({ ...formData, workingHours: val as string })}
              shape="rounded-sm"
              placeholder="Select working hours"
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
