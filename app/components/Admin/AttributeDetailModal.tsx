"use client";

import React from "react";
import Modal from "../Modal/Modal";
import { Icon } from "../Icon";

interface AttributeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: any;
}

export const AttributeDetailModal: React.FC<AttributeDetailModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  if (!category) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="Category Attributes"
      header={
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center">
              <Icon name="poll" folder="icon" size="sm" className="text-brand-gold" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#121212] uppercase tracking-wider">Attributes</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase">{category.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-gray-900   border border-transparent hover:border-gray-100"
          >
            <Icon name="close" folder="icon" size="sm" />
          </button>
        </div>
      }
      footer={
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-white border border-gray-200 text-[#121212] text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-50 transition-colors  "
        >
          Close Details
        </button>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Sizes */}
        {category.hasSize && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-brand-gold rounded-full" />
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Available Sizes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.selectedSizes?.length > 0 ? (
                category.selectedSizes.map((size: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100">
                    {size}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-gray-400 italic">No sizes selected</span>
              )}
            </div>
          </div>
        )}

        {/* Volumes (ML) */}
        {category.hasML && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Available Volumes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.selectedMLs?.length > 0 ? (
                category.selectedMLs.map((ml: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100">
                    {ml}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-gray-400 italic">No volumes selected</span>
              )}
            </div>
          </div>
        )}

        {/* Gender */}
        {category.hasSex && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-purple-500 rounded-full" />
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Target Gender</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.selectedSexes?.length > 0 ? (
                category.selectedSexes.map((sex: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-600 text-[10px] font-black rounded-lg border border-purple-100">
                    {sex}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-gray-400 italic">No genders selected</span>
              )}
            </div>
          </div>
        )}

        {!category.hasSize && !category.hasML && !category?.hasSex && (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
            <Icon name="info" folder="icon" size="lg" className="text-gray-200" />
            <p className="text-xs text-gray-400 font-medium">This category has no attributes enabled.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
