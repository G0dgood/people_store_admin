"use client";

import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Button } from "../Button";
import { Input } from "../Form/Inputs";
import { useGetOfficesQuery } from "@/lib/redux/services/officeApi";
import { useUpdateProductMutation, Product } from "@/lib/redux/services/productApi";
import { toast } from "sonner";
import { HiOutlineBuildingOffice2, HiOutlineCube, HiArrowsRightLeft } from "react-icons/hi2";

interface ProductInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ProductInventoryModal({ isOpen, onClose, product }: ProductInventoryModalProps) {
  const { data: officesResponse } = useGetOfficesQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  
  // Track stock per branch
  const [branchStock, setBranchStock] = useState<Record<string, number>>({});
  const [unassignedStock, setUnassignedStock] = useState<number>(0);

  const offices = officesResponse?.data || [];

  useEffect(() => {
    if (product) {
      // Initialize from existing data if available
      const initialBranchStock = product.branchStock || {};
      setBranchStock(initialBranchStock);
      
      // Calculate initial unassigned stock
      const totalBranchStock = Object.values(initialBranchStock).reduce((a: any, b: any) => a + Number(b), 0) as number;
      setUnassignedStock(Math.max(0, product.stock - totalBranchStock));
    }
  }, [product]);

  const handleUpdateBranchStock = (officeId: string, value: number) => {
    const currentOfficeStock = branchStock[officeId] || 0;
    const diff = value - currentOfficeStock;
    
    // If adding stock, check if we have enough unassigned
    if (diff > 0 && diff > unassignedStock) {
      toast.error("Not enough unassigned stock available in Main Warehouse");
      return;
    }

    setBranchStock(prev => ({ ...prev, [officeId]: Math.max(0, value) }));
    setUnassignedStock(prev => Math.max(0, prev - diff));
  };

  const handleTransferOne = (fromId: string, toId: string) => {
    let fromVal = fromId === 'main' ? unassignedStock : (branchStock[fromId] || 0);
    if (fromVal <= 0) return;

    if (fromId === 'main') {
      setUnassignedStock(prev => prev - 1);
    } else {
      setBranchStock(prev => ({ ...prev, [fromId]: prev[fromId] - 1 }));
    }

    if (toId === 'main') {
      setUnassignedStock(prev => prev + 1);
    } else {
      setBranchStock(prev => ({ ...prev, [toId]: (prev[toId] || 0) + 1 }));
    }
  };

  const handleSave = async () => {
    if (!product) return;
    try {
      // Calculate total stock to ensure consistency
      const totalAllocated = Object.values(branchStock).reduce((a, b) => a + Number(b), 0);
      const finalTotalStock = unassignedStock + totalAllocated;

      await updateProduct({
        productId: product._id,
        data: {
          locations: Object.keys(branchStock).filter(id => branchStock[id] > 0),
          branchStock: branchStock as any,
          stock: finalTotalStock,
          stockStatus: finalTotalStock > 0 ? "In Stock" : "Out of Stock"
        }
      }).unwrap();
      toast.success("Inventory distribution updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update inventory");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Inventory Management - ${product?.name}`} size="lg">
      <ModalBody className="flex flex-col gap-6">
        {/* Inventory Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <HiOutlineCube className="text-emerald-500" />
              Main Warehouse Stock
            </span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-[#121212]">{unassignedStock}</span>
              <span className="text-[10px] font-bold text-gray-400">Available to Distribute</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-brand-gold/5 rounded-xl border border-brand-gold/10">
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest flex items-center gap-2">
              <HiOutlineBuildingOffice2 />
              Total Distributed
            </span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-brand-gold">
                {Object.values(branchStock).reduce((a, b) => a + Number(b), 0)}
              </span>
              <span className="text-[10px] font-bold text-gray-400">Across {Object.keys(branchStock).filter(id => branchStock[id] > 0).length} Offices</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-[#121212] uppercase tracking-widest">Office Distributions</h4>
            <span className="text-[10px] text-gray-400 italic">Global Total: {unassignedStock + Object.values(branchStock).reduce((a, b) => a + Number(b), 0)} Units</span>
          </div>
          
          <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {offices.length === 0 ? (
              <div className="py-10 text-center text-xs text-gray-400 italic border border-dashed border-gray-200 rounded-xl">
                No office locations found. Create offices to distribute stock.
              </div>
            ) : offices.map((office) => (
              <div key={office._id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-brand-gold/20 transition-all group">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-bold text-gray-900 truncate">{office.name}</span>
                  <span className="text-[10px] text-gray-400 truncate">{office.address}</span>
                </div>
                
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Office Stock</span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleTransferOne(office._id, 'main')}
                        className="w-7 h-7 rounded bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-colors disabled:opacity-30"
                        disabled={(branchStock[office._id] || 0) <= 0}
                      >
                        <span className="text-xs font-bold">-</span>
                      </button>
                      <Input
                        type="number"
                        value={branchStock[office._id] || 0}
                        onChange={(e) => handleUpdateBranchStock(office._id, Number(e.target.value))}
                        className="w-16 text-center font-black h-8 !text-xs !p-1"
                        shape="rounded-sm"
                      />
                      <button 
                        onClick={() => handleTransferOne('main', office._id)}
                        className="w-7 h-7 rounded bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-500 transition-colors disabled:opacity-30"
                        disabled={unassignedStock <= 0}
                      >
                        <span className="text-xs font-bold">+</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="h-10 w-[1px] bg-gray-100 mx-1" />
                  
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Actions</span>
                    <div className="flex gap-1">
                      <Button 
                        shape="rounded-sm" 
                        variant="outline" 
                        className="!p-1.5 h-8 w-8"
                        onClick={() => handleTransferOne('main', office._id)}
                        disabled={unassignedStock <= 0}
                        title="Pull from Main Warehouse"
                      >
                        <HiArrowsRightLeft className="text-xs rotate-90 text-brand-gold" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-gold shrink-0 border border-amber-200">
            <HiArrowsRightLeft className="text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-black text-amber-900 uppercase tracking-widest">Inventory Pro-Tip</span>
            <p className="text-[10px] text-amber-700 leading-relaxed">
              Use the <span className="font-bold">+ / -</span> buttons to quickly move single units between the Main Warehouse and specific offices. Manually edit the quantity for bulk adjustments.
            </p>
          </div>
        </div>
      </ModalBody>
      
      <ModalFooter className="flex justify-end gap-3 pt-6 border-t border-gray-50">
        <Button shape="rounded-sm" variant="outline" className="px-8" onClick={onClose}>Cancel</Button>
        <Button shape="rounded-sm" variant="primary" className="px-10" onClick={handleSave} isLoading={isUpdating}>
          Apply Inventory Update
        </Button>
      </ModalFooter>
    </Modal>
  );
}
