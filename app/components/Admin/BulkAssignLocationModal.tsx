"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Button } from "../Button";
import { useGetOfficesQuery } from "@/lib/redux/services/officeApi";
import { useUpdateProductMutation } from "@/lib/redux/services/productApi";
import { toast } from "sonner";

interface BulkAssignLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  items: any[];
  onSuccess: () => void;
}

export function BulkAssignLocationModal({ isOpen, onClose, selectedIds, items, onSuccess }: BulkAssignLocationModalProps) {
  const { data: officesResponse, isLoading: isLoadingOffices } = useGetOfficesQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [selectedOffices, setSelectedOffices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const offices = officesResponse?.data || [];

  const handleToggleOffice = (id: string) => {
    setSelectedOffices(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    if (selectedOffices.length === 0) {
      toast.error("Please select at least one office");
      return;
    }

    setIsSubmitting(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const productId of selectedIds) {
        try {
          const product = items.find(item => item._id === productId);
          if (!product) continue;

          const currentLocations = product.locations?.map((l: any) => typeof l === 'string' ? l : l._id) || [];
          const mergedLocations = Array.from(new Set([...currentLocations, ...selectedOffices]));

          await updateProduct({
            productId,
            data: { locations: mergedLocations as any }
          }).unwrap();
          successCount++;
        } catch (err) {
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully assigned ${successCount} products to locations.`);
        onSuccess();
        onClose();
      }
      if (failCount > 0) {
        toast.error(`Failed to update ${failCount} products.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Assign to Offices" size="md">
      <ModalBody className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold text-gray-900">Select Offices</h4>
          <p className="text-xs text-gray-400">The {selectedIds.length} selected products will be made available in the offices you select below.</p>
        </div>

        <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {isLoadingOffices ? (
            <div className="py-10 text-center text-xs text-gray-400 animate-pulse">Loading offices...</div>
          ) : offices.length === 0 ? (
            <div className="py-10 text-center text-xs text-gray-400">No offices found.</div>
          ) : (
            offices.map((office) => (
              <label key={office._id} className={`flex items-center gap-4 p-4 rounded-[6px] border cursor-pointer transition-all ${selectedOffices.includes(office._id) ? 'border-brand-gold bg-brand-gold/5 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-brand-gold focus:ring-brand-gold cursor-pointer"
                  checked={selectedOffices.includes(office._id)}
                  onChange={() => handleToggleOffice(office._id)}
                />
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${selectedOffices.includes(office._id) ? 'text-brand-gold' : 'text-gray-900'}`}>{office.name}</span>
                  <span className="text-[11px] text-gray-400">{office.address}</span>
                </div>
              </label>
            ))
          )}
        </div>
      </ModalBody>

      <ModalFooter className="flex justify-end gap-3 border-t border-gray-50 pt-6">
        <Button shape="rounded-sm" variant="outline" onClick={onClose}>Cancel</Button>
        <Button shape="rounded-sm" variant="primary" onClick={handleConfirm} isLoading={isSubmitting}>Confirm Assignment</Button>
      </ModalFooter>
    </Modal>
  );
}
