"use client";

import React, { useState, useMemo } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Button } from "../Button";
import { Input } from "../Form/Inputs";
import { useGetProductsQuery, useUpdateProductMutation } from "@/lib/redux/services/productApi";
import { toast } from "sonner";
import { HiSearch, HiCheckCircle } from "react-icons/hi";

interface ManageOfficeProductsModalProps {
 isOpen: boolean;
 onClose: () => void;
 office: any;
}

export function ManageOfficeProductsModal({ isOpen, onClose, office }: ManageOfficeProductsModalProps) {
 const [searchQuery, setSearchQuery] = useState("");
 // Fetch products with a high limit for selection
 const { data: productsResponse, isLoading: isLoadingProducts } = useGetProductsQuery({ limit: 1000 });
 const [updateProduct] = useUpdateProductMutation();

 if (!office) return null;

 const products = productsResponse?.data?.products || [];

 const filteredProducts = useMemo(() => {
  return products.filter(p =>
   p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
   p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );
 }, [products, searchQuery]);

 const handleToggleProduct = async (product: any) => {
  const productId = product._id;
  const currentLocations = product.locations?.map((l: any) => typeof l === 'string' ? l : l._id) || [];
  const isAssigned = currentLocations.includes(office._id);

  const newLocations = isAssigned
   ? currentLocations.filter((id: string) => id !== office._id)
   : [...currentLocations, office._id];

  try {
   await updateProduct({
    productId,
    data: { locations: newLocations }
   }).unwrap();
  } catch (err) {
   toast.error(`Failed to update ${product.name}`);
  }
 };

 return (
  <Modal isOpen={isOpen} onClose={onClose} title={`Manage Products - ${office?.name}`} size="lg">
   <ModalBody className="flex flex-col gap-6">
    <div className="flex flex-col gap-2">
     <p className="text-xs text-gray-400">Search and select the products that should be available at this office location.</p>
     <div className="relative">
      <Input
       placeholder="Search products by name or SKU..."
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
       shape="rounded-sm"
       className="bg-gray-50/50 pl-10"
      />
      <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
     </div>
    </div>

    <div className="flex flex-col gap-2 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
     {isLoadingProducts ? (
      <div className="py-20 text-center text-xs text-gray-400 animate-pulse">Loading products...</div>
     ) : filteredProducts.length === 0 ? (
      <div className="py-20 text-center text-xs text-gray-400">No products found matching your search.</div>
     ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
       {filteredProducts.map((product) => {
        const isAssigned = (product.locations?.map((l: any) => typeof l === 'string' ? l : l._id) || []).includes(office._id);
        return (
         <div
          key={product._id}
          className={`flex items-center gap-3 p-3 rounded-[6px] border transition-all cursor-pointer group ${isAssigned ? 'border-brand-gold bg-brand-gold/5 ring-1 ring-brand-gold/10' : 'border-gray-100 hover:border-gray-200 bg-white hover:shadow-sm'}`}
          onClick={() => handleToggleProduct(product)}
         >
          <div className="w-10 h-10 rounded-[4px] border border-gray-100 bg-white p-1 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
           <img src={product.productImage} alt={product.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
           <span className="text-xs font-bold text-gray-900 truncate">{product.name}</span>
           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{product.sku}</span>
          </div>
          {isAssigned ? (
           <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center text-white shadow-sm shadow-brand-gold/20">
            <HiCheckCircle className="w-5 h-5" />
           </div>
          ) : (
           <div className="w-6 h-6 border border-gray-200 rounded-full group-hover:border-brand-gold transition-colors" />
          )}
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
