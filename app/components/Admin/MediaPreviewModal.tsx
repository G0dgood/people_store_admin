"use client";

import React from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import { MediaItem } from "@/lib/redux/services/mediaApi";

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem | null;
}

export function MediaPreviewModal({ isOpen, onClose, media }: MediaPreviewModalProps) {
  if (!media) return null;

  const isVideo = media.type === "video";

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={media.name} 
      size={isVideo ? "xl" : "lg"}
    >
      <ModalBody className="p-0 bg-black flex items-center justify-center min-h-[400px]">
        {isVideo ? (
          <video 
            src={media.url} 
            controls 
            autoPlay 
            className="w-full h-full max-h-[80vh] object-contain"
          />
        ) : (
          <img 
            src={media.url} 
            alt={media.name} 
            className="w-full h-full max-h-[80vh] object-contain" 
          />
        )}
      </ModalBody>
      <div className="bg-white p-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-[#121212]">{media.name}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">{media.size} • {media.type}</span>
        </div>
        <button 
          onClick={() => window.open(media.url, '_blank')}
          className="text-xs font-bold text-brand-gold hover:underline"
        >
          View Original Asset
        </button>
      </div>
    </Modal>
  );
}
