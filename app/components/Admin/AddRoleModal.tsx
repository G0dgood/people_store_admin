"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input, Textarea } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const departmentOptions = [
  { value: "Management", label: "Management" },
  { value: "Content", label: "Content" },
  { value: "Logistics", label: "Logistics" },
  { value: "Support", label: "Support" },
];

export function AddRoleModal({ isOpen, onClose }: AddRoleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "Management",
    status: "Active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating new administrative role:", formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Administrative Role" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Role Name</label>
            <Input
              placeholder="e.g. Content Manager"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 border-gray-200 font-bold"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Description</label>
            <Textarea
              placeholder="Describe the responsibilities and access level for this role..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Department</label>
              <Select
                options={departmentOptions}
                value={formData.department}
                onChange={(val) => setFormData({ ...formData, department: val })}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Initial Status</label>
              <Select
                options={statusOptions}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3 border-t border-gray-50 pt-6">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onClose} 
            className="px-8 h-10 sm:h-12 text-[11px] font-bold"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            className="px-8 h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
          >
            Create Role
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
