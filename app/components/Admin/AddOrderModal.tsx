"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Shipped", label: "Shipped" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
];

const paymentOptions = [
  { value: "Paid", label: "Paid" },
  { value: "Unpaid", label: "Unpaid" },
];

export function AddOrderModal({ isOpen, onClose }: AddOrderModalProps) {
  const [formData, setFormData] = useState({
    customer: "",
    product: "",
    quantity: "1",
    price: "",
    status: "Pending",
    payment: "Unpaid",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log("Creating order:", formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Order" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Customer Name</label>
              <Input
                placeholder="Enter customer name"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Product Name</label>
              <Input
                placeholder="Enter product name"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Quantity</label>
              <Input
                type="number"
                min="1"
                placeholder="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price (₦)</label>
              <Input
                type="text"
                placeholder="49.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
              <Select
                options={statusOptions}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Payment Status</label>
            <Select
              options={paymentOptions}
              value={formData.payment}
              onChange={(val) => setFormData({ ...formData, payment: val })}
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3 border-t border-gray-50 pt-6">
          <Button variant="outline" type="button" onClick={onClose} shape="rounded-sm" className="px-8 flex-1 md:flex-none">
            Cancel
          </Button>
          <Button variant="primary" type="submit" shape="rounded-sm" className="px-8 flex-1 md:flex-none">
            Create Order
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
