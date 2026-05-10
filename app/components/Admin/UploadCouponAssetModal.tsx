import React, { useState, useRef } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { toast } from "sonner";
import { HiXMark } from "react-icons/hi2";
import { useUploadMediaMutation } from "@/lib/redux/services/mediaApi";

interface UploadCouponAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for coupons
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function UploadCouponAssetModal({ isOpen, onClose, onUploadSuccess }: UploadCouponAssetModalProps) {
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndAddFiles = (newFiles: FileList | File[]) => {
    const validFiles: File[] = [];
    let hasError = false;

    Array.from(newFiles).forEach(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} has an invalid format. Only JPG, PNG, and WEBP are allowed for coupons.`);
        hasError = true;
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds the 10MB limit.`);
        hasError = true;
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setStagedFiles(prev => [...prev, ...validFiles]);
      if (!hasError) toast.success(`${validFiles.length} banner(s) staged for upload`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndAddFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setStagedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (stagedFiles.length === 0) {
      toast.error("Please select a coupon banner to upload.");
      return;
    }

    const formData = new FormData();
    stagedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await uploadMedia(formData).unwrap();
      toast.success("Coupon assets uploaded successfully!");
      setStagedFiles([]);
      if (onUploadSuccess) onUploadSuccess();
      onClose();
    } catch (err: any) {
      console.error("UPLOAD ERROR:", err);
      toast.error(err?.data?.message || "Failed to upload coupon assets.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Coupon Assets" size="lg">
      <ModalBody className="flex flex-col gap-8 py-4">
        {/* Dropzone Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group
            ${isDragging ? "border-brand-gold bg-brand-gold/5" : "border-gray-200 bg-gray-50/50 hover:bg-white hover:border-brand-gold/30 hover:shadow-xl hover:shadow-brand-gold/5"}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileSelect}
          />
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-brand-gold group-hover:scale-110 transition-all  ">
            <Icon name="cloud_upload" folder="icon" size="md" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-sm font-black text-[#121212]">Click or drag to upload coupon banners</span>
            <span className="text-[11px] font-bold text-gray-400">Support for JPG, PNG, and WEBP up to 10MB</span>
          </div>
        </div>

        {/* Staged Files List */}
        {stagedFiles.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#121212] uppercase tracking-wider">Staged Banners ({stagedFiles.length})</span>
              <button onClick={() => setStagedFiles([])} className="text-[10px] font-bold text-red-500 hover:underline">Clear all</button>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
              {stagedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl group/item">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <Icon name="image" folder="icon" size="xs" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-900 truncate max-w-[200px]">{file.name}</span>
                      <span className="text-[10px] font-medium text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <HiXMark className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requirements Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: "verified", label: "Optimized Ratio", text: "Landscape (16:9) is recommended for coupon banners." },
            { icon: "verified", label: "File Format", text: "Use WebP for best performance and high visual quality." }
          ].map((req, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-white border border-gray-50 rounded-xl">
              <Icon name={req.icon} folder="icon" size="xs" className="text-brand-gold mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-black text-[#121212]">{req.label}</span>
                <span className="text-[10px] font-bold text-gray-400 leading-tight">{req.text}</span>
              </div>
            </div>
          ))}
        </div>
      </ModalBody>

      <ModalFooter className="flex justify-end gap-3 border-t border-gray-50 pt-8 mt-4">
        <Button
          shape="rounded-sm"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          shape="rounded-sm"
          variant="primary"
          onClick={handleUpload}
          disabled={isUploading || stagedFiles.length === 0}
        >
          {isUploading ? "Uploading..." : "Upload Banner"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
