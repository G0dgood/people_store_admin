"use client";

import React from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Button } from "../Button";
import { Product } from "@/lib/redux/services/productApi";
import { HiOutlineCube, HiOutlineArchiveBox } from "react-icons/hi2";

interface ViewOfficeProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  office: any;
  assignedProducts: Product[];
}

export function ViewOfficeProductsModal({ isOpen, onClose, office, assignedProducts }: ViewOfficeProductsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assigned Products - ${office?.name}`} size="lg">
      <ModalBody className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-400">Below is the list of all products currently assigned to this office location and their distributed quantities.</p>
        </div>

        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {assignedProducts.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-4 text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
              <HiOutlineArchiveBox size={40} className="opacity-20" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold">No Products Assigned</span>
                <p className="text-[10px] max-w-[200px]">Head over to the Product Catalog to assign items to this location.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
              {assignedProducts.map((product) => {
                const stockInBranch = (product.branchStock as any)?.[office._id] || 0;
                return (
                  <div key={product._id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-brand-gold/20 transition-all group">
                    <div className="w-12 h-12 rounded-lg border border-gray-100 bg-gray-50 p-1 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                      <img src={product.productImage} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-xs font-bold text-gray-900 truncate">{product.name}</span>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{product.sku}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Current Stock</span>
                      <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 font-black text-[10px]">
                        {stockInBranch} Units
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter className="flex justify-end pt-6 border-t border-gray-50">
        <Button shape="rounded-sm" variant="primary" className="px-10" onClick={onClose}>Done</Button>
      </ModalFooter>
    </Modal>
  );
}
