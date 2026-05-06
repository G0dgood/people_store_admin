"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../Icon";
import { useUploadMediaMutation } from "@/lib/redux/services/mediaApi";
import { toast } from "sonner";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Button } from "../Button";
import { MediaLibraryModal } from "../Admin/MediaLibraryModal";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ImageUpload({
  value,
  onChange,
  label,
  placeholder = "Click or drag to upload image",
  className = "",
}: ImageUploadProps) {
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();
  const [isDragging, setIsDragging] = useState(false);
  const [isTweakModalOpen, setIsTweakModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Tweak States
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [bgColor, setBgColor] = useState("transparent");
  const [borderRadius, setBorderRadius] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid format. Only JPG, PNG, WEBP, and MP4/WEBM videos are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File exceeds the 5MB limit.");
      return;
    }

    setStagedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
      // Direct upload for videos (no tweaks supported yet)
      handleDirectUpload(file);
    } else {
      setIsTweakModalOpen(true);
    }
  };

  const handleDirectUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await uploadMedia(formData).unwrap();
      const url = response.data?.[0]?.url;
      if (url) {
        onChange(url);
        toast.success("Video uploaded successfully");
        setStagedFile(null);
        setPreviewUrl(null);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload video.");
    }
  };

  const handleUpload = async () => {
    if (!stagedFile || !previewUrl) return;

    try {
      // Create a canvas to bake the tweaks
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = previewUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Set canvas size (standardize to high resolution)
      canvas.width = 1024;
      canvas.height = 1024;

      // Draw background
      if (bgColor !== "transparent") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Clear for transparency if needed, though default is transparent
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Prepare image transformation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Calculate scaled dimensions while preserving aspect ratio
      const scale = zoom;
      const aspectRatio = img.height / img.width;
      let drawWidth = canvas.width * scale;
      let drawHeight = drawWidth * aspectRatio;

      // If height is dominant after scale, adjust to fit within canvas bounds nicely
      if (drawHeight > canvas.height * scale) {
        drawHeight = canvas.height * scale;
        drawWidth = drawHeight / aspectRatio;
      }

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      // Convert to blob
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png", 1.0)
      );

      if (!blob) throw new Error("Failed to generate image blob");

      const processedFile = new File([blob], stagedFile.name.replace(/\.[^/.]+$/, "") + ".png", { type: "image/png" });

      const formData = new FormData();
      formData.append("files", processedFile);

      const response = await uploadMedia(formData).unwrap();
      const url = response.data?.[0]?.url;
      if (url) {
        onChange(url);
        toast.success("Image uploaded successfully with refinements");
        closeTweakModal();
      }
    } catch (err: any) {
      console.error("IMAGE PROCESS ERROR:", err);
      toast.error(err?.message || "Failed to process or upload image.");
    }
  };

  const closeTweakModal = () => {
    setIsTweakModalOpen(false);
    setStagedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    // Reset tweaks
    setZoom(1);
    setRotation(0);
    setBgColor("transparent");
    setBorderRadius(0);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 group">
          {value.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={value}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover bg-gray-50 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-contain p-4 bg-gray-50 transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 px-4 flex-wrap">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-black px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all shadow-xl"
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setIsLibraryModalOpen(true)}
              className="bg-brand-gold text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-gold transition-all shadow-xl"
            >
              Library
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
          }}
          className={`
            w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group relative overflow-hidden
            ${isDragging
              ? "border-brand-gold bg-brand-gold/5"
              : "border-gray-200 hover:border-brand-gold/30 hover:bg-gray-50/50"
            }
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp,.mp4,.webm,.ogg"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">
                Uploading...
              </span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors  ">
                <Icon
                  name="cloud_upload"
                  folder="icon"
                  size="sm"
                  className="text-gray-400 group-hover:text-brand-gold"
                />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-brand-gold text-center px-4">
                {placeholder}
              </span>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLibraryModalOpen(true);
                  }}
                  className="text-[9px] font-black text-brand-gold bg-brand-gold/5 px-3 py-1.5 rounded-full uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all border border-brand-gold/10"
                >
                  Select from Library
                </button>
              </div>
            </>
          )}

          {/* Animated background on drag */}
          {isDragging && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border-4 border-brand-gold/10 animate-pulse" />
            </div>
          )}
        </div>
      )}

      {/* Tweak Modal */}
      <Modal
        isOpen={isTweakModalOpen}
        onClose={closeTweakModal}
        title="Refine Asset Appearance"
        size="lg"
      >
        <ModalBody className="flex flex-col gap-8 py-6">
          {/* Main Preview */}
          <div className="flex flex-col items-center justify-center">
            <div
              className="relative w-64 h-64 border border-gray-100 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Tweak Preview"
                  className="w-full h-full object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    borderRadius: `${borderRadius}%`
                  }}
                />
              )}
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">Live Transformation Preview</span>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-[#1D3557] uppercase tracking-wider">Zoom Scale</label>
                  <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/5 px-2 py-0.5 rounded">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range" min="0.5" max="3" step="0.1" value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-[#1D3557] uppercase tracking-wider">Rotation</label>
                  <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/5 px-2 py-0.5 rounded">{rotation}°</span>
                </div>
                <input
                  type="range" min="-180" max="180" step="1" value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-[#1D3557] uppercase tracking-wider">Background Tweak</label>
                <div className="flex gap-2.5">
                  {["transparent", "#FFFFFF", "#F9FAFB", "#1D3557", "#D4AF37"].map(color => (
                    <button
                      key={color}
                      onClick={() => setBgColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${bgColor === color ? "border-brand-gold scale-110 shadow-lg" : "border-gray-100 hover:scale-105"}`}
                      style={{
                        backgroundColor: color === "transparent" ? "white" : color,
                        backgroundImage: color === "transparent" ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)" : "none",
                        backgroundSize: color === "transparent" ? "8px 8px" : "initial",
                        backgroundPosition: color === "transparent" ? "0 0, 4px 4px" : "initial"
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-[#1D3557] uppercase tracking-wider">Corner Radius</label>
                  <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/5 px-2 py-0.5 rounded">{borderRadius}%</span>
                </div>
                <input
                  type="range" min="0" max="50" step="1" value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-3 pt-6 border-t border-gray-50">
          <Button shape="rounded-sm" variant="ghost" onClick={closeTweakModal}>Discard</Button>
          <Button
            shape="rounded-sm"
            variant="primary"
            onClick={handleUpload}
            isLoading={isUploading}
            iconLeft={<Icon name="verified" folder="icon" size="sm" />}
          >
            Confirm & Upload
          </Button>
        </ModalFooter>
      </Modal>

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onSelect={(url) => {
          onChange(url);
          toast.success("Asset selected from library");
        }}
      />
    </div>
  );
}
