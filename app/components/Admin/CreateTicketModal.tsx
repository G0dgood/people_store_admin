"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Textarea } from "../Form/Inputs";
import { motion } from "framer-motion";

interface CreateTicketModalProps {
   isOpen: boolean;
   onClose: () => void;
   onCreate: (ticketData: any) => void;
}

const priorityOptions = [
   { value: "Low", label: "Low Priority" },
   { value: "Medium", label: "Medium Priority" },
   { value: "High", label: "High Priority" },
   { value: "Urgent", label: "Urgent Priority" },
];

const priorityMap: Record<string, { percent: number; color: string; label: string }> = {
   Low: { percent: 25, color: "bg-emerald-500", label: "Minor Issue" },
   Medium: { percent: 50, color: "bg-blue-500", label: "Standard Support" },
   High: { percent: 75, color: "bg-orange-500", label: "Critical Attention" },
   Urgent: { percent: 100, color: "bg-rose-500", label: "Immediate Action Required" },
};

export function CreateTicketModal({ isOpen, onClose, onCreate }: CreateTicketModalProps) {
   const [formData, setFormData] = useState({
      subject: "",
      customer: "",
      priority: "Low",
      description: "",
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onCreate(formData);
      onClose();
      setFormData({ subject: "", customer: "", priority: "Low", description: "" });
   };

   return (
      <Modal isOpen={isOpen} onClose={onClose} title="Create New Ticket" size="md">
         <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Instructions */}
            <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-2xl p-4 flex gap-3">
               <div className="w-14 h-8 rounded-full bg-white flex items-center justify-center text-brand-gold  ">
                  <Icon name="info" folder="icon" size="sm" />
               </div>
               <p className="text-[11px] font-bold text-brand-gold leading-relaxed">
                  Create a new support case for a customer manually. Ensure the customer name matches their account profile.
               </p>
            </div>

            {/* Input Fields */}
            <div className="flex flex-col gap-6">
               <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Case Subject</label>
                  <Input
                     shape="rounded-sm"
                     placeholder="e.g., Login issue after password reset"
                     value={formData.subject}
                     onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                     required
                  />
               </div>

               <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Customer Name</label>
                  <div className="relative">
                     <Input
                        shape="rounded-sm"
                        placeholder="Enter customer name"
                        value={formData.customer}
                        onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                        className="font-bold text-xs pl-10"
                        required
                     />
                     <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon name="user-profile-circle" folder="dashboardIcon" size="sm" />
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Initial Priority</label>
                  <Select
                     shape="rounded-sm"
                     options={priorityOptions}
                     value={formData.priority}
                     onChange={(val) => setFormData({ ...formData, priority: val as string })}
                     className="!w-full"
                  />
                  <div className="flex flex-col gap-2 mt-1">
                     <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase">Severity Level</span>
                        <span className={`text-[9px] font-black tracking-widest uppercase ${priorityMap[formData.priority]?.color.replace('bg-', 'text-')}`}>
                           {priorityMap[formData.priority]?.label}
                        </span>
                     </div>
                     <div className="h-4 w-full bg-gray-100 rounded-sm overflow-hidden p-0.5 border border-white shadow-inner relative">
                        <motion.div
                           key={formData.priority}
                           initial={{ width: 0 }}
                           animate={{
                              width: `${priorityMap[formData.priority]?.percent || 0}%`,
                              backgroundColor: formData.priority === "Low" ? "#10b981" :
                                 formData.priority === "Medium" ? "#C5A028" :
                                    formData.priority === "High" ? "#f59e0b" : "#f43f5e"
                           }}
                           transition={{ type: "spring", damping: 25, stiffness: 120 }}
                           className="h-full rounded-sm   flex items-center justify-end px-2"
                        >
                        </motion.div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Detailed Description</label>
                  <Textarea
                     shape="rounded-sm"
                     placeholder="Describe the issue in detail..."
                     value={formData.description}
                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                     style={{ minHeight: '120px' }}
                     required
                  />
               </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
               <Button
                  shape="rounded-sm"
                  variant="outline"
                  onClick={onClose}
               >
                  Cancel
               </Button>
               <Button
                  shape="rounded-sm"
                  type="submit"
                  variant="primary"
               >
                  Create Ticket
               </Button>
            </div>
         </form>
      </Modal>
   );
}
