"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface UploadAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadAvatarModal({ isOpen, onClose }: UploadAvatarModalProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      console.log("Avatar updated successfully!");
      setIsUploading(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Profile Photo" size="md">
      <ModalBody className="flex flex-col items-center gap-8 py-10">
        {/* Circular Dropzone */}
        <div className="relative group cursor-pointer">
            <div className="w-40 h-40 rounded-full border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 bg-gray-50/50 hover:bg-white hover:border-brand-blue/30 hover:shadow-2xl hover:shadow-blue-50 transition-all overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-brand-blue group-hover:scale-110 transition-all shadow-sm">
                    <Icon name="photo_camera" folder="icon" size="sm" />
                </div>
                <div className="flex flex-col items-center gap-0.5 text-center px-4">
                    <span className="text-[11px] font-black text-[#1D3557]">Pick a photo</span>
                    <span className="text-[10px] font-medium text-gray-400">PNG, JPG up to 5MB</span>
                </div>
            </div>

            {/* Mock Crop Indicators */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-brand-blue rounded-tl-lg"></div>
               <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-brand-blue rounded-tr-lg"></div>
               <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-brand-blue rounded-bl-lg"></div>
               <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-brand-blue rounded-br-lg"></div>
            </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <Icon name="verified" folder="icon" size="xs" className="text-brand-blue" />
                <p className="text-[10px] font-medium text-blue-700 leading-relaxed">
                    A clear, professional photo helps team members identify you easily. Recommended size: 512x512px.
                </p>
            </div>
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
          {isUploading ? "Uploading..." : "Save Photo"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
