"use client";

import React from "react";
import { motion } from "framer-motion";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { BackgroundAsset } from "@/lib/redux/services/advertApi";
import { MockBrowserOverlay } from "./MockBrowserOverlay";

interface CinematicFocalPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  refiningAssetIndex: number | null;
  backgroundImages: BackgroundAsset[];
  onUpdateFocalPoint: (index: number, x: number, y: number) => void;
}

export default function CinematicFocalPointModal({
  isOpen,
  onClose,
  refiningAssetIndex,
  backgroundImages,
  onUpdateFocalPoint,
}: CinematicFocalPointModalProps) {
  if (refiningAssetIndex === null) return null;

  const activeAsset = backgroundImages[refiningAssetIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Refine Cinematic Focus"
      size="lg"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-black text-[#1D3557] uppercase tracking-widest">Master Your Framing</h4>
          <p className="text-xs text-gray-400 font-medium">Drag the visual within the viewfinder below to define its center of attention.</p>
        </div>

        <div className="relative aspect-[16/9] bg-gray-900 rounded-[12px] overflow-hidden shadow-2xl group cursor-move">
          <MockBrowserOverlay />

          <motion.div
            className="absolute inset-0 z-10 select-none"
            onPan={(_, info) => {
              const viewport = document.getElementById("focal-viewport");
              const bounds = viewport?.getBoundingClientRect();
              if (!bounds) return;

              // Speed up dragging response
              const sensitivity = 0.5;
              const deltaX = (info.delta.x / bounds.width) * 100 * sensitivity;
              const deltaY = (info.delta.y / bounds.height) * 100 * sensitivity;

              const currentX = activeAsset.positionX;
              const currentY = activeAsset.positionY;

              onUpdateFocalPoint(
                refiningAssetIndex,
                Math.max(0, Math.min(100, currentX - deltaX)),
                Math.max(0, Math.min(100, currentY - deltaY))
              );
            }}
            id="focal-viewport"
          >
            <img
              src={activeAsset.url}
              alt="Preview"
              className="w-full h-full object-cover pointer-events-none scale-150"
              style={{
                objectPosition: `${activeAsset.positionX}% ${activeAsset.positionY}%`,
              }}
            />

            {/* Visual focus guides */}
            <div className="absolute inset-0 pointer-events-none border border-white/20">
              <div className="absolute inset-x-0 top-1/3 border-t border-white/10" />
              <div className="absolute inset-x-0 top-2/3 border-t border-white/10" />
              <div className="absolute inset-y-0 left-1/3 border-l border-white/10" />
              <div className="absolute inset-y-0 left-2/3 border-l border-white/10" />
            </div>

            {/* Focus Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full border-2 border-brand-gold shadow-[0_0_20px_rgba(184,146,80,0.5)] flex items-center justify-center">
                <div className="w-1 h-1 bg-brand-gold rounded-full" />
              </div>
            </div>
          </motion.div>

          <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-[4px] text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
              X: {Math.round(activeAsset.positionX)}% | Y: {Math.round(activeAsset.positionY)}%
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-50">
          <Button
            shape="rounded-sm"
            variant="outline"
            onClick={() => onUpdateFocalPoint(refiningAssetIndex, 50, 50)}
          >
            Center Image
          </Button>
          <Button
            shape="rounded-sm"
            variant="primary"
            onClick={onClose}
            className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
          >
            Save Focal Point
          </Button>
        </div>
      </div>
    </Modal>
  );
}
