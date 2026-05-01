"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import { Icon } from "../Icon";
import { Input } from "../Form/Inputs";
import { useGetMediaItemsQuery, MediaItem } from "@/lib/redux/services/mediaApi";
import { SVGLoaderFetch, NoRecordFound } from "@/app/components/Options";
import { UploadMediaModal } from "./UploadMediaModal";
import { Button } from "../Button";

interface MediaSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, thumbnailUrl?: string, type?: 'image' | 'video') => void;
  title?: string;
  onUploadClick?: () => void;
}

export function MediaSelectionModal({ isOpen, onClose, onSelect, title = "Select Image", onUploadClick }: MediaSelectionModalProps) {
  const { data: response, isLoading } = useGetMediaItemsQuery();
  const mediaData = response?.data || [];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMedia = mediaData.filter(item => {
    const isImage = item.type === "image" || 
                    /\.(jpeg|jpg|gif|png|webp|avif|svg)$/i.test(item.url);
    const isVideo = item.type === "video" ||
                    /\.(mp4|webm|ogg)$/i.test(item.url);
    return (isImage || isVideo) && item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <ModalBody className="flex flex-col gap-6 py-4">
        {/* Search Bar */}
        <div className="flex flex-col gap-2">
          <Input
            shape="rounded-sm"
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
            suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
          />
        </div>

        {/* Grid View */}
        <div className="min-h-[400px] max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <SVGLoaderFetch asTable={false} text="Loading media library..." />
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-6 py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <NoRecordFound asTable={false} text="No images found in your library." />
              {onUploadClick && (
                <Button
                  onClick={onUploadClick}
                  variant="primary"
                  shape="rounded-sm"
                  className="px-8 h-10 font-bold uppercase tracking-widest text-[10px]"
                  iconLeft={<Icon name="upload-01" folder="dashboardIcon" size="sm" />}
                >
                  Upload New Image
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1">
              {filteredMedia.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    onSelect(item.url, item.thumbnailUrl, item.type);
                    onClose();
                  }}
                  className="group relative aspect-square bg-gray-50 rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:border-brand-gold hover:shadow-lg transition-all"
                >
                  {item.url?.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={item.url}
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-brand-gold px-3 py-1 rounded-full">Select</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[9px] font-bold text-white truncate">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}
