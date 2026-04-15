"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface UploadMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadMediaModal({ isOpen, onClose }: UploadMediaModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      console.log("Assets uploaded successfully!");
      setIsUploading(false);
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Product Assets" size="lg">
      <ModalBody className="flex flex-col gap-8 py-4">
        {/* Dropzone Area */}
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 bg-gray-50/50 hover:bg-white hover:border-brand-blue/30 hover:shadow-xl hover:shadow-blue-50/50 transition-all cursor-pointer group">
           <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-brand-blue group-hover:scale-110 transition-all shadow-sm">
              <Icon name="cloud_upload" folder="icon" size="md" />
           </div>
           <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-sm font-black text-[#1D3557]">Click or drag to upload media</span>
              <span className="text-[11px] font-bold text-gray-400">Support for JPG, PNG, and MP4 up to 50MB</span>
           </div>
        </div>

        {/* Requirements Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
            { icon: "verified", label: "Aspect Ratio", text: "Square (1:1) is highly recommended for listing grids." },
            { icon: "verified", label: "Color Space", text: "Use sRGB for consistent color across all browsers." }
           ].map((req, i) => (
             <div key={i} className="flex items-start gap-3 p-4 bg-white border border-gray-50 rounded-xl">
                <Icon name={req.icon} folder="icon" size="xs" className="text-brand-blue mt-0.5" />
                <div className="flex flex-col gap-0.5">
                   <span className="text-[11px] font-black text-[#1D3557]">{req.label}</span>
                   <span className="text-[10px] font-bold text-gray-400 leading-tight">{req.text}</span>
                </div>
             </div>
           ))}
        </div>
      </ModalBody>

      <ModalFooter className="flex justify-end gap-3 border-t border-gray-50 pt-8">
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="px-8 h-12 text-[11px] font-bold"
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleUpload}
          disabled={isUploading}
          className="px-8 h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
        >
          {isUploading ? "Uploading..." : "Start Upload"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
