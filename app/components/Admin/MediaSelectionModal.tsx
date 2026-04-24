"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import { Icon } from "../Icon";
import { Input } from "../Form/Inputs";
import { useGetMediaItemsQuery, MediaItem } from "@/lib/redux/services/mediaApi";
import { SVGLoaderFetch, NoRecordFound } from "@/app/components/Options";

interface MediaSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaSelectionModal({ isOpen, onClose, onSelect }: MediaSelectionModalProps) {
  const { data: response, isLoading } = useGetMediaItemsQuery();
  const mediaData = response?.data || [];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMedia = mediaData.filter(item =>
    item.type === "image" &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Category Image" size="lg">
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
            <NoRecordFound asTable={false} text="No images found in your library." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1">
              {filteredMedia.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  className="group relative aspect-square bg-gray-50 rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:border-brand-gold hover:shadow-lg transition-all"
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
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
