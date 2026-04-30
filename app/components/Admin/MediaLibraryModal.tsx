"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import { useGetMediaItemsQuery } from "@/lib/redux/services/mediaApi";
import { Icon } from "../Icon";
import { Button } from "../Button";

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const { data: mediaData, isLoading } = useGetMediaItemsQuery(undefined, { skip: !isOpen });
  const [search, setSearch] = useState("");

  const mediaItems = mediaData?.data || [];
  const filteredItems = mediaItems.filter(item => 
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.url?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Media Library"
      size="xl"
    >
      <ModalBody className="flex flex-col gap-6 py-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search assets by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-brand-gold/30 transition-all"
          />
          <Icon name="search-01" folder="dashboardIcon" size="sm" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <div key={i} className="aspect-square bg-gray-50 animate-pulse rounded-xl border border-gray-100" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
               <Icon name="Image" folder="dashboardIcon" size="xl" className="text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No assets found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item._id}
                onClick={() => {
                  onSelect(item.url);
                  onClose();
                }}
                className="group relative aspect-square bg-white border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:border-brand-gold transition-all shadow-sm hover:shadow-lg"
              >
                <img 
                  src={item.url} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                      <Icon name="check" folder="icon" size="sm" className="text-brand-gold" />
                   </div>
                   <span className="text-[10px] font-black text-white uppercase tracking-widest px-2 text-center truncate w-full">{item.name}</span>
                </div>

                {/* Info Tag */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                   <span className="text-[8px] font-bold bg-white/90 backdrop-blur-sm text-gray-900 px-1.5 py-0.5 rounded shadow-sm uppercase tracking-tighter">
                     {item.type}
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};
