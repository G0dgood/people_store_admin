"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { useUpdateOfficeMutation } from "@/lib/redux/services/officeApi";
import { toast } from "sonner";

interface EditOfficeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  office: any;
}

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export function EditOfficeDrawer({ isOpen, onClose, office }: EditOfficeDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    workingHours: "",
    status: "Active" as "Active" | "Inactive",
  });

  useEffect(() => {
    if (office) {
      setFormData({
        name: office.name || "",
        address: office.address || "",
        phone: office.phone || "",
        email: office.email || "",
        workingHours: office.workingHours || "",
        status: office.status || "Active",
      });
    }
  }, [office]);

  const [updateOffice, { isLoading: isUpdating }] = useUpdateOfficeMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!office?._id) return;

    try {
      await updateOffice({ id: office._id, body: formData }).unwrap();
      toast.success("Office Updated Successfully", {
        description: `Changes to ${formData.name} saved.`
      });
      onClose();
    } catch (err: any) {
      toast.error("Update Failed", {
        description: err?.data?.message || "Failed to update office."
      });
    }
  };

  if (!office) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Edit Office Location">
      <form onSubmit={handleSubmit} className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Location Name</label>
            <Input
              shape="rounded-sm"
              placeholder="e.g. Lagos Head Office"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 border-gray-200 font-bold"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Physical Address</label>
            <Input
              shape="rounded-sm"
              placeholder="Full address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="h-12 border-gray-200 font-bold"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Phone Number</label>
            <Input
              shape="rounded-sm"
              placeholder="+234 ..."
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-12 border-gray-200 font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Email Address</label>
            <Input
              shape="rounded-sm"
              type="email"
              placeholder="office@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-12 border-gray-200 font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Working Hours</label>
            <Input
              shape="rounded-sm"
              placeholder="e.g. Mon-Fri: 9AM - 5PM"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              className="h-12 border-gray-200 font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</label>
            <Select
              shape="rounded-sm"
              options={statusOptions}
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val as "Active" | "Inactive" })}
            />
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3">
          <Button
            shape="rounded-sm"
            variant="primary"
            type="submit"
            className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-gold/10"
            isLoading={isUpdating}
          >
            Update Location
          </Button>
          <Button
            shape="rounded-sm"
            variant="outline"
            type="button"
            onClick={onClose}
            className="w-full h-12 text-[11px] font-bold text-gray-400"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
