"use client";

import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input, Textarea } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { Role, useUpdateRoleMutation } from "@/lib/redux/services/roleApi";
import { toast } from "sonner";

interface UpdateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export function UpdateRoleModal({ isOpen, onClose, role }: UpdateRoleModalProps) {
  const [updateRole, { isLoading }] = useUpdateRoleMutation();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        status: role.status,
      });
    }
  }, [role, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    
    try {
      await updateRole({
          roleId: role._id,
          data: formData
      }).unwrap();
      
      toast.success("Role Updated", {
        description: `Successfully updated the "${formData.name}" metadata.`
      });
      onClose();
    } catch (err: any) {
      toast.error("Update Failed", {
        description: err.data?.message || "Something went wrong while updating the role."
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Role Details" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Role Name</label>
            <Input
              shape="rounded-sm"
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
              shape="rounded-sm"
              placeholder="Describe the responsibilities and access level for this role..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Role Status</label>
              <Select
                shape="rounded-sm"
                options={statusOptions}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
              />
            </div>
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
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
