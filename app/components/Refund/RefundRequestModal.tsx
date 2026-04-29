"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { Input, Textarea } from "../Form/Inputs";
import { useRequestRefundMutation } from "@/lib/redux/services/refundApi";
import { useUploadMediaMutation } from "@/lib/redux/services/mediaApi";
import { toast } from "sonner";
import { Icon } from "../Icon";
import { PiPaperclipBold } from "react-icons/pi";
import { Select } from "../Form/Select";
import { useCustomerAuth } from "@/app/context/CustomerAuthContext";

const REFUND_REASONS = [
    { value: "Defective item", label: "Defective item" },
    { value: "Wrong item sent", label: "Wrong item sent" },
    { value: "Accidental purchase", label: "Accidental purchase" },
    { value: "Item not as described", label: "Item not as described" },
    { value: "Found better price", label: "Found better price" },
    { value: "Other", label: "Other" },
];

interface RefundRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialOrder?: any;
}

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({ isOpen, onClose, initialOrder }) => {
    const { customer } = useCustomerAuth();
    const [orderId, setOrderId] = useState("");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Sync initial data
    React.useEffect(() => {
        if (initialOrder && isOpen) {
            setOrderId(initialOrder.orderId || initialOrder._id || "");
            setAmount(initialOrder.totalAmount?.toString() || "");
        }
    }, [initialOrder, isOpen]);

    const [requestRefund, { isLoading: isSubmitting }] = useRequestRefundMutation();
    const [uploadMedia] = useUploadMediaMutation();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
            
            // Log for debugging
            console.log("Uploading files:", files.length);
            
            const result = await uploadMedia(formData).unwrap();
            console.log("Upload result:", result);

            const data = result.data as any;
            if (data && Array.isArray(data)) {
                const urls = data.map((item: any) => item.url);
                setAttachments(prev => [...prev, ...urls]);
                toast.success(`${urls.length} image(s) uploaded successfully`);
            } else if (data?.url) {
                // Single file upload case
                setAttachments(prev => [...prev, data.url]);
                toast.success("Image uploaded successfully");
            }
        } catch (error: any) {
            console.error("Upload failed:", error);
            toast.error(error?.data?.message || "Image upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            // Clear the input so the same file can be uploaded again if removed
            e.target.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId || !amount || !reason) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            await requestRefund({
                orderId,
                amount: Number(amount),
                reason,
                description,
                images: attachments
            }).unwrap();
            
            toast.success("Refund request submitted successfully!");
            onClose();
            // Reset form
            setOrderId("");
            setAmount("");
            setReason("");
            setDescription("");
            setAttachments([]);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to submit request. Ensure Order ID is valid.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request a Refund" size="md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Customer</label>
                    <Input
                        shape="rounded-sm"
                        value={customer?.fullName || "Loading..."}
                        disabled
                        className="bg-gray-50/50 border-gray-100 text-gray-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Order ID (Internal ID)</label>
                    <Input
                        shape="rounded-sm"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Enter the order ID from your receipt"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Refund Amount</label>
                    <Input
                        shape="rounded-sm"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="₦0.00"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Reason for Refund</label>
                    <Select 
                        shape="rounded-sm"
                        options={REFUND_REASONS}
                        value={reason}
                        onChange={(val) => setReason(val)}
                        placeholder="Select a reason"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Detailed Description</label>
                    <Textarea
                        shape="rounded-sm"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell us more about the issue..."
                        style={{ minHeight: '100px' }}
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Supporting Images</label>
                    <div className="flex flex-wrap gap-3">
                        {attachments.map((url, i) => (
                            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100 group shadow-sm">
                                <img src={url} alt="preview" className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg">
                                        <Icon name="Delete" folder="dashboardIcon" size="xs" />
                                    </div>
                                </button>
                            </div>
                        ))}
                        
                        <label className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            isUploading 
                            ? "border-brand-blue/30 bg-blue-50/30" 
                            : "border-gray-200 text-gray-400 hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50/50"
                        }`}>
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                                    <span className="text-[8px] font-black uppercase tracking-tighter text-brand-blue">Uploading</span>
                                </div>
                            ) : (
                                <>
                                    <PiPaperclipBold size={20} />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">Add Files</span>
                                </>
                            )}
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                    <Button
                        shape="rounded-sm"
                        variant="ghost"
                        onClick={onClose}
                        type="button">Cancel</Button>
                    <Button
                        shape="rounded-sm"
                        variant="primary"
                        type="submit"
                        isLoading={isSubmitting}
                        disabled={isSubmitting || isUploading}>
                        {isSubmitting ? "Submitting..." : "Submit Refund Request"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
