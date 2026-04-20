"use client";

import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: any;
}

const roleOptions = [
  { value: "Super Admin", label: "Super Admin" },
  { value: "Editor", label: "Editor" },
  { value: "Order Manager", label: "Order Manager" },
  { value: "Support", label: "Support" },
];

const departmentOptions = [
  { value: "Management", label: "Management" },
  { value: "Content", label: "Content" },
  { value: "Logistics", label: "Logistics" },
  { value: "Support", label: "Support" },
];

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

export function EditUserModal({ isOpen, onClose, staff }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "Male",
    dob: "",
    role: "Support",
    department: "Support",
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        email: staff.email || "",
        gender: staff.gender || "Male",
        dob: staff.dob || "",
        role: staff.role || "Support",
        department: staff.department || "Support",
      });
    }
  }, [staff]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating staff profile:", { id: staff?.id, ...formData });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Staff Profile" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-8 py-4">
          <div className="flex flex-col gap-1 px-1 text-center items-center">
            <div className="w-16 h-16 rounded-full border-2 border-brand-gold/20 shadow-sm overflow-hidden mb-2">
              <img src={staff?.avatar} alt={staff?.name} className="w-full h-full object-cover" />
            </div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Administrative Credentials</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-[#1D3557] uppercase tracking-widest">Full Name</label>
              <Input
                shape="rounded-sm"
                placeholder="e.g. Eleanor Pena"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 border-gray-200 font-bold bg-gray-50/10 focus:bg-white transition-all underline-offset-4"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-[#1D3557] uppercase tracking-widest">Email Address</label>
              <Input
                shape="rounded-sm"
                type="email"
                placeholder="e.g. penna@dealport.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 border-gray-200 font-bold bg-gray-50/10 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-[#1D3557] uppercase tracking-widest">Gender</label>
              <Select
                shape="rounded-sm"
                options={genderOptions}
                value={formData.gender}
                onChange={(val) => setFormData({ ...formData, gender: val })}
                className="h-12"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-[#1D3557] uppercase tracking-widest">Date of Birth</label>
              <Input
                shape="rounded-sm"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="h-12 border-gray-200 font-bold bg-gray-50/10 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-[#1D3557] uppercase tracking-widest">System Role</label>
              <Select
                shape="rounded-sm"
                options={roleOptions}
                value={formData.role}
                onChange={(val) => setFormData({ ...formData, role: val })}
                className="h-12"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-[#1D3557] uppercase tracking-widest">Department</label>
              <Select
                shape="rounded-sm"
                options={departmentOptions}
                value={formData.department}
                onChange={(val) => setFormData({ ...formData, department: val })}
                className="h-12"
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3 border-t border-gray-50 pt-8 mt-4">
          <Button
            shape="rounded-sm"
            variant="outline"
            type="button"
            onClick={onClose}
          >
            Discard Changes
          </Button>
          <Button
            shape="rounded-sm"
            variant="primary"
            className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold shadow-md shadow-brand-gold/10"
            type="submit"
          >
            Update Profile
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
