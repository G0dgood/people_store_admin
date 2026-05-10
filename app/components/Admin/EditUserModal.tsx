"use client";

import React, { useState, useEffect, useMemo } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { useGetRolesQuery } from "@/lib/redux/services/roleApi";
import { useUpdateStaffMutation } from "@/lib/redux/services/authApi";
import { useApiError } from "@/app/hooks/useApiError";
import { toast } from "sonner";
import { Avatar } from "../Other/Avatar";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: any;
}

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const departmentOptions = [
  { value: "Management", label: "Management" },
  { value: "Content", label: "Content" },
  { value: "Logistics", label: "Logistics" },
  { value: "Support", label: "Support" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "Human Resources" },
  { value: "Marketing", label: "Marketing" },
  { value: "IT", label: "IT & Systems" },
];

export function EditUserModal({ isOpen, onClose, staff }: EditUserModalProps) {
  const { data: rolesResponse, isLoading: isLoadingRoles } = useGetRolesQuery();
  const roles = rolesResponse?.roles || [];
  const [updateStaff, { isLoading: isUpdating, isError, error }] = useUpdateStaffMutation();

  useApiError(isError, error, "Update Failed");

  const roleOptions = useMemo(() => {
    return roles.map(role => ({
      value: role.name,
      label: role.name
    }));
  }, [roles]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "Male",
    dob: "",
    role: "",
    department: "",
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.fullName || "",
        email: staff.email || "",
        gender: staff.gender || "",
        dob: staff.dob || "",
        role: staff.role || "",
        department: staff.department || "",
      });
    }
  }, [staff, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff?._id) return;

    try {
      await updateStaff({
        userId: staff._id,
        data: {
          fullName: formData.name,
          email: formData.email,
          role: formData.role,
          gender: formData.gender,
          dob: formData.dob,
          department: formData.department
        }
      }).unwrap();

      toast.success("Profile Updated", {
        description: `Successfully updated the administrative profile for ${formData.name}.`
      });
      onClose();
    } catch (err) {
      // Error handled by useApiError hook
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Staff Profile" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-8 py-4">
          <div className="flex flex-col gap-1 px-1 text-center items-center">
            <Avatar src={staff?.avatar} name={staff?.fullName} size="lg" className="mb-2" />
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Administrative Credentials</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-[#121212] uppercase tracking-widest">Full Name</label>
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
              <label className="text-[10px] font-black text-[#121212] uppercase tracking-widest">Email Address</label>
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
              <label className="text-[10px] font-black text-[#121212] uppercase tracking-widest">Gender</label>
              <Select
                shape="rounded-sm"
                options={genderOptions}
                value={formData.gender}
                onChange={(val) => setFormData({ ...formData, gender: val })}
                className="h-12"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-[#121212] uppercase tracking-widest">Date of Birth</label>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">            <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-[#121212] uppercase tracking-widest">System Role</label>
            <Select
              shape="rounded-sm"
              options={roleOptions}
              value={formData.role}
              onChange={(val) => setFormData({ ...formData, role: val })}
              className="h-12"
            />
          </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-[#121212] uppercase tracking-widest">Department</label>
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
            disabled={isLoadingRoles || roles.length === 0 || isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Profile"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
