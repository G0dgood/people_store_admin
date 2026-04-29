"use client";

import React, { useState, useMemo } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { useGetRolesQuery } from "@/lib/redux/services/roleApi";
import { useOnboardUserMutation } from "@/lib/redux/services/authApi";
import { useApiError } from "@/app/hooks/useApiError";
import { toast } from "sonner";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const departmentOptions = [
  { value: "Management", label: "Management" },
  { value: "Content", label: "Content" },
  { value: "Logistics", label: "Logistics" },
  { value: "Support", label: "Support" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "Human Resources" },
  { value: "Marketing", label: "Marketing" },
  { value: "IT", label: "IT & Systems" },
  { value: "Sales", label: "Sales" },
];

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const { data: roles = [], isLoading: isLoadingRoles } = useGetRolesQuery();
  const [onboardUser, { isLoading: isOnboarding, isError, error }] = useOnboardUserMutation();

  useApiError(isError, error, "Onboarding Failed");

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

  // Set default role when roles are loaded
  React.useEffect(() => {
    if (roles.length > 0 && !formData.role) {
      setFormData(prev => ({ ...prev, role: roles[0].name }));
    }
  }, [roles, formData.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await onboardUser({
        fullName: formData.name,
        email: formData.email,
        gender: formData.gender,
        dob: formData.dob,
        role: formData.role,
        department: formData.department
      }).unwrap();

      toast.success("Staff Member Onboarded", {
        description: `Successfully created an account for ${formData.name}. Temporary password: ${response.data.tempPassword}`
      });
      
      onClose();
      setFormData({
        name: "",
        email: "",
        gender: "Male",
        dob: "",
        role: roles.length > 0 ? roles[0].name : "",
        department: "",
      });
    } catch (err) {
      // Error handled by useApiError hook
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Administrative Onboarding" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-8 py-4">
          {/* Section Header */}
          <div className="flex flex-col gap-1 px-1">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profile Information</h4>
            <p className="text-[11px] font-medium text-gray-400">Ensure the staff member's details are accurate for their administrative credentials.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-[#1D3557] uppercase tracking-widest">Full Name</label>
              <Input
                shape="rounded-sm"
                placeholder="e.g. Eleanor Pena"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 border-gray-200 font-bold bg-gray-50/30 focus:bg-white transition-all"
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
                className="h-12 border-gray-200 font-bold bg-gray-50/30 focus:bg-white transition-all"
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
                className="h-12 border-gray-200 font-bold bg-gray-50/30 focus:bg-white transition-all"
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

          {/* Security Note */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex gap-4 items-center mt-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Icon name="verified" folder="icon" size="sm" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-black text-emerald-800">Automated Invitation</span>
              <p className="text-[10px] font-medium text-emerald-600 leading-relaxed">
                A secure invitation link will be sent to the email provided, allowing the user to set their password and verify their identity.
              </p>
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
            Discard
          </Button>
          <Button
            shape="rounded-sm"
            variant="primary"
            className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold shadow-md shadow-brand-gold/10"
            type="submit"
            disabled={isLoadingRoles || roles.length === 0 || isOnboarding}
          >
            {isOnboarding ? "Onboarding..." : "Quick Onboard"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
