"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Input, Textarea } from "../Form/Inputs";
import { Button } from "../Button";
import { Icon } from "../Icon";

import { useUpdateMediaMutation } from "@/lib/redux/services/mediaApi";
import { toast } from "sonner";

import { MediaSelectionModal } from "./MediaSelectionModal";

interface EditMediaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  media: any;
}

export function EditMediaDrawer({ isOpen, onClose, media }: EditMediaDrawerProps) {
  const [updateMedia, { isLoading }] = useUpdateMediaMutation();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    altText: "",
    thumbnailUrl: "",
  });

  useEffect(() => {
    if (media) {
      setFormData({
        name: media.name || "",
        altText: media.altText || "",
        thumbnailUrl: media.thumbnailUrl || "",
      });
    }
  }, [media]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMedia({
        mediaId: media._id,
        ...formData
      }).unwrap();
      toast.success("Media asset updated successfully");
      onClose();
    } catch (err) {
      toast.error("Failed to update media asset");
    }
  };

  if (!media) return null;

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} title="Asset Metadata Settings">
        <form onSubmit={handleSubmit} className="flex flex-col h-full gap-8">
          <div className="flex flex-col gap-8">
            {/* Asset Preview Header */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-gray-200   flex items-center justify-center p-6 group">
                <img src={formData.thumbnailUrl || media.url} alt="" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                {media.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Icon name="play_circle_filled" folder="icon" size="sm" className="text-[#121212]" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-[6px] text-[10px] font-black text-[#121212]   uppercase tracking-widest border border-gray-200/50">
                  {media.type}
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-[13px] font-black text-[#121212] truncate max-w-[240px]">{media.name}</h4>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">{media.size} • {media.date}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 rounded-[6px] border border-gray-200 text-gray-400 hover:text-brand-gold hover:border-brand-gold/30 transition-all"
                    onClick={() => setIsPickerOpen(true)}
                    title="Change Thumbnail"
                  >
                    <Icon name="photo" folder="icon" size="sm" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-[6px] border border-gray-200 text-gray-400 hover:text-brand-gold hover:border-brand-gold/30 transition-all"
                    onClick={() => window.open(media.url, '_blank')}
                    title="View Full Asset"
                  >
                    <Icon name="link-external" folder="dashboardIcon" size="sm" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Filename Management</label>
                <Input
                  type="text"
                  placeholder="e.g. product_hero_main"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 border-gray-200 font-bold text-[#121212]"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">SEO Alternative Text</label>
                <Textarea
                  placeholder="Describe the asset for screen readers and search engines..."
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  className="min-h-[80px] border-gray-200 text-xs font-medium text-gray-700 leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Custom Thumbnail URL</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="https://cloudinary.com/..."
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    className="h-12 border-gray-200 font-bold text-[#121212] flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-4 text-[10px] font-black uppercase tracking-widest border-gray-200"
                    onClick={() => setIsPickerOpen(true)}
                  >
                    Select
                  </Button>
                </div>
                <p className="text-[10px] font-bold text-gray-400 mt-1 pl-1">
                  For videos, this will be used as the preview image in the library.
                </p>
              </div>
            </div>

            {/* Technical Metadata (Read-only) */}
            <div className="bg-[#F8F9FA] rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Technical Details</span>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400">Resolution</span>
                  <span className="text-xs font-black text-[#121212]">1920 × 1080 (HD)</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400">MIME Type</span>
                  <span className="text-xs font-black text-[#121212] uppercase">{media.type === 'video' ? 'video/mp4' : 'image/png'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400">Storage Class</span>
                  <span className="text-xs font-black text-[#121212]">Standard Multi-Regional</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400">Optimized</span>
                  <div className="flex items-center gap-1.5 text-[#4CAF50]">
                    <Icon name="verified" folder="icon" size="xs" />
                    <span className="text-xs font-black">Passed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3">
            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
            >
              Update Asset Metadata
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              className="w-full h-12 text-[11px] font-bold text-gray-400 hover:text-gray-900"
            >
              Discard Changes
            </Button>
          </div>
        </form>
      </Drawer>

      <MediaSelectionModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(url) => setFormData({ ...formData, thumbnailUrl: url })}
        title="Select Thumbnail Image"
      />
    </>
  );
}
