"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { FiImage } from "react-icons/fi";
import { MediaSelectionModal } from "./MediaSelectionModal";
import { UploadCouponAssetModal } from "./UploadCouponAssetModal";
import { useUpdateCouponMutation } from "@/lib/redux/services/couponApi";
import { toast } from "sonner";

interface EditCouponDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: any;
}

const typeOptions = [
  { value: "Percentage", label: "Percentage (%)" },
  { value: "Fixed Rate", label: "Fixed Rate ($)" },
  { value: "Shipping", label: "Free Shipping" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Scheduled", label: "Scheduled" },
  { value: "Expired", label: "Expired" },
];

export function EditCouponDrawer({ isOpen, onClose, coupon }: EditCouponDrawerProps) {
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    discount: "",
    type: "Percentage",
    startDate: "",
    endDate: "",
    status: "Active",
    image: "",
    usageLimit: "",
    minAmount: "",
    bgColor: "#C5A028", // Default to Gold
    imagePosition: "center",
    thumbnailUrl: "",
    mediaType: "image" as "image" | "video",
  });

  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (coupon) {
      setIsPlaying(false); // Reset playback when coupon changes
      setFormData({
        code: coupon.code || "",
        title: coupon.title || "",
        description: coupon.description || "",
        discount: coupon.discount || "",
        type: coupon.type || "Percentage",
        startDate: coupon.startDate || "",
        endDate: coupon.endDate || "",
        status: coupon.status || "Active",
        image: coupon.image || "",
        usageLimit: coupon.usageLimit || "",
        minAmount: coupon.minAmount || "",
        bgColor: coupon.bgColor || "#C5A028",
        imagePosition: coupon.imagePosition || "center",
        thumbnailUrl: coupon.thumbnailUrl || "",
        mediaType: coupon.mediaType || "image",
      });
    }
  }, [coupon]);

  const parsePosition = (pos: string) => {
    if (!pos || pos === "center") return { x: 50, y: 50 };
    if (pos === "top") return { x: 50, y: 0 };
    if (pos === "bottom") return { x: 50, y: 100 };
    if (pos === "left") return { x: 0, y: 50 };
    if (pos === "right") return { x: 100, y: 50 };

    const parts = pos.split(" ");
    if (parts.length === 2) {
      return {
        x: parseInt(parts[0].replace("%", "")),
        y: parseInt(parts[1].replace("%", ""))
      };
    }
    return { x: 50, y: 50 };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!formData.image) return;
    setIsDragging(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
    setStartPos(parsePosition(formData.imagePosition));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPoint.x;
    const deltaY = e.clientY - startPoint.y;

    const sensitivity = 0.5;
    let newX = startPos.x - (deltaX * sensitivity);
    let newY = startPos.y - (deltaY * sensitivity);

    newX = Math.max(0, Math.min(100, Math.round(newX)));
    newY = Math.max(0, Math.min(100, Math.round(newY)));

    setFormData({ ...formData, imagePosition: `${newX}% ${newY}%` });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupon?._id) return;

    try {
      await updateCoupon({
        id: coupon._id,
        data: {
          ...formData,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit.toString()) : 0,
        }
      }).unwrap();

      toast.success("Coupon Updated", {
        description: `Changes to ${formData.code} saved successfully.`
      });
      onClose();
    } catch (err: any) {
      toast.error("Update Failed", {
        description: err?.data?.message || "Failed to save coupon changes."
      });
    }
  };

  const currentCoords = parsePosition(formData.imagePosition);

  if (!coupon) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Edit Coupon Code">
      <form
        onSubmit={handleSubmit}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex flex-col h-full gap-8 select-none"
      >
        <div className="flex flex-col gap-6">
          {/* Image Selection */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Coupon Banner / Image</label>
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(true)}
                  className="text-[9px] font-black text-brand-gold uppercase tracking-widest hover:underline"
                >
                  Change Image
                </button>
              )}
            </div>

            {formData.image ? (
              <div className="flex flex-col gap-4">
                <div
                  className={`relative w-full h-48 rounded-xl overflow-hidden border border-gray-100   group bg-gray-100 ${formData.mediaType !== "video" ? `cursor-${isDragging ? 'grabbing' : 'grab'}` : 'cursor-pointer'}`}
                  onMouseDown={formData.mediaType !== "video" ? handleMouseDown : undefined}
                  onClick={() => formData.mediaType === "video" && setIsPlaying(!isPlaying)}
                >
                  {formData.mediaType === "video" ? (
                    isPlaying ? (
                      <video
                        src={formData.image}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={formData.thumbnailUrl || formData.image}
                        alt="Coupon Cover"
                        className="w-full h-full object-cover pointer-events-none opacity-80"
                      />
                    )
                  ) : (
                    <img
                      src={formData.image}
                      alt="Coupon Preview"
                      className="w-full h-full object-cover pointer-events-none transition-all duration-75"
                      style={{ objectPosition: formData.imagePosition }}
                    />
                  )}
                  {formData.mediaType === "video" && !isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
                        <Icon name="play" folder="dashboardIcon" size="sm" className="text-white ml-1" />
                      </div>
                    </div>
                  )}
                  {!isDragging && formData.mediaType !== "video" && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                      <div className="bg-white/90 backdrop-blur-sm text-black h-10 px-6 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                        <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" className="rotate-45" />
                        Grab to Adjust Position
                      </div>
                    </div>
                  )}
                  {formData.mediaType !== "video" && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[8px] font-black uppercase tracking-tighter text-gray-500   pointer-events-none">
                      X: {currentCoords.x}% | Y: {currentCoords.y}%
                    </div>
                  )}
                </div>

                {/* Position Controls - Only for images */}
                {formData.mediaType !== "video" && (
                  <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    {/* Vertical Control */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Vertical Offset</span>
                        <span className="text-[10px] font-black text-brand-gold bg-white px-2 py-0.5 rounded   border border-gray-100">
                          {currentCoords.y}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentCoords.y}
                        onChange={(e) => setFormData({ ...formData, imagePosition: `${currentCoords.x}% ${e.target.value}%` })}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                      />
                    </div>

                    {/* Horizontal Control */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Horizontal Offset</span>
                        <span className="text-[10px] font-black text-brand-gold bg-white px-2 py-0.5 rounded   border border-gray-100">
                          {currentCoords.x}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentCoords.x}
                        onChange={(e) => setFormData({ ...formData, imagePosition: `${e.target.value}% ${currentCoords.y}%` })}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(true)}
                className="w-full h-40 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 hover:border-brand-gold hover:bg-gray-50 transition-all group bg-gray-50/50"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center   group-hover:scale-110 transition-transform">
                  <FiImage className="text-gray-400 text-2xl group-hover:text-brand-gold transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Select Promotion Banner</span>
                  <span className="text-[8px] font-bold text-gray-400">Recommended size: 1200x400px</span>
                </div>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Coupon Code</label>
              <Input
                shape="rounded-sm"
                placeholder="e.g. SUMMER25"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="h-12 border-gray-200 focus:border-brand-gold/50 transition-all font-bold"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Public Title</label>
              <Input
                shape="rounded-sm"
                placeholder="e.g. Summer Special"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Short Description</label>
            <Input
              shape="rounded-sm"
              placeholder="e.g. Limited time offer on all summer collection."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-12 border-gray-200 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Discount</label>
              <Input
                shape="rounded-sm"
                placeholder="20% or 10.00"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Type</label>
              <Select
                shape="rounded-sm"
                options={typeOptions}
                value={formData.type}
                onChange={(val) => setFormData({ ...formData, type: val })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Start Date</label>
              <Input
                shape="rounded-sm"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">End Date</label>
              <Input
                shape="rounded-sm"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Usage Limit</label>
              <Input
                shape="rounded-sm"
                type="number"
                placeholder="0 for unlimited"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="h-12 border-gray-200 font-bold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Min. Amount</label>
              <Input
                shape="rounded-sm"
                placeholder="Min. spend"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                className="h-12 border-gray-200 font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Background Color Scheme</label>
            <div className="flex flex-wrap gap-3">
              {[
                { name: "Gold", color: "#C5A028" },
                { name: "Onyx", color: "#000000" },
                { name: "Deep Blue", color: "#1D3557" },
                { name: "Rose", color: "#E63946" },
                { name: "Teal", color: "#2A9D8F" },
                { name: "Sand", color: "#F4A261" },
              ].map((item) => (
                <button
                  key={item.color}
                  type="button"
                  onClick={() => setFormData({ ...formData, bgColor: item.color })}
                  className={`group relative flex flex-col items-center gap-1.5 p-1 transition-all ${formData.bgColor === item.color ? "opacity-100" : "opacity-60 hover:opacity-100"
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 transition-all ${formData.bgColor === item.color ? "border-brand-gold scale-110 shadow-lg" : "border-transparent"
                      }`}
                    style={{ backgroundColor: item.color }}
                  >
                    {formData.bgColor === item.color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white  " />
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-gray-900 transition-colors">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</label>
            <Select
              shape="rounded-sm"
              options={statusOptions}
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
            />
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3">
          <Button
            shape="rounded-sm"
            variant="primary"
            type="submit"
            className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
            isLoading={isUpdating}
          >
            Update Coupon
          </Button>
          <Button
            shape="rounded-sm"
            variant="outline"
            type="button"
            onClick={onClose}
            className="w-full h-10 sm:h-12 text-[11px] font-bold text-gray-400 hover:text-gray-900"
          >
            Cancel
          </Button>
        </div>
      </form>

      <MediaSelectionModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url, thumbnailUrl, type) => {
          setFormData({
            ...formData,
            image: url,
            thumbnailUrl: thumbnailUrl || "",
            mediaType: type || "image"
          });
          setIsMediaModalOpen(false);
        }}
        title="Select Coupon Image"
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      <UploadCouponAssetModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </Drawer>
  );
}
