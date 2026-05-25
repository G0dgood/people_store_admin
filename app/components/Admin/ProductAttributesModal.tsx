"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { Icon } from "../Icon";
import { Input } from "../Form/Inputs";
import { Button } from "../Button";
import { HiArrowLeft, HiXMark, HiMagnifyingGlass } from "react-icons/hi2";
import {
 useGetAttributesQuery,
 useCreateAttributeMutation,
 useUpdateAttributeMutation,
 useDeleteAttributeMutation
} from "@/lib/redux/services/attributeApi";
import { toast } from "sonner";
import { ConfirmationModal } from "./ConfirmationModal";
import Checkbox from "../Checkbox";
import { useGetCategoriesQuery, useUpdateCategoryMutation } from "@/lib/redux/services/categoryApi";

interface ProductAttributesModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export const ProductAttributesModal: React.FC<ProductAttributesModalProps> = ({
 isOpen,
 onClose,
}) => {
 const { data: attributesResponse, isLoading: isLoadingList } = useGetAttributesQuery();
 const [createAttribute, { isLoading: isCreating }] = useCreateAttributeMutation();
 const [updateAttribute, { isLoading: isUpdating }] = useUpdateAttributeMutation();
 const [deleteAttribute, { isLoading: isDeleting }] = useDeleteAttributeMutation();

 const attributes = attributesResponse?.data || [];

 const [searchQuery, setSearchQuery] = useState("");
 const [view, setView] = useState<"list" | "form">("list");
 const [editingId, setEditingId] = useState<string | null>(null);

 // Delete modal state
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [attributeToDelete, setAttributeToDelete] = useState<{ id: string; name: string } | null>(null);

 // Categories selection state
 const { data: categoriesResponse } = useGetCategoriesQuery();
 const [updateCategory, { isLoading: isUpdatingCategories }] = useUpdateCategoryMutation();
 const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

 const allCategories = categoriesResponse?.data && 'categories' in categoriesResponse.data
  ? categoriesResponse.data.categories
  : (Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : []);

 // Form State
 const [formName, setFormName] = useState("");
 const [formOptions, setFormOptions] = useState<string[]>([""]);

 const filteredAttributes = attributes.filter((attr) =>
  attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  attr.subAttributes.some((opt) => opt.toLowerCase().includes(searchQuery.toLowerCase()))
 );

 const resetForm = () => {
  setFormName("");
  setFormOptions([""]);
  setSelectedCategoryIds([]);
  setEditingId(null);
  setView("list");
 };

 const handleEditClick = (attr: any) => {
  setEditingId(attr._id);
  setFormName(attr.name);
  setFormOptions(attr.subAttributes?.length > 0 ? [...attr.subAttributes] : [""]);

  // Pre-select categories that currently have this attribute
  const associatedCategoryIds = allCategories
   .filter((cat: any) => cat.customAttributes?.some((a: any) => a.name.toLowerCase() === attr.name.toLowerCase()))
   .map((cat: any) => cat._id);
  setSelectedCategoryIds(associatedCategoryIds);

  setView("form");
 };

 const handleAddClick = () => {
  setEditingId(null);
  setFormName("");
  setFormOptions([""]);
  setSelectedCategoryIds([]);
  setView("form");
 };

 const handleDeleteClick = (id: string, name: string) => {
  setAttributeToDelete({ id, name });
  setIsDeleteModalOpen(true);
 };

 const handleConfirmDelete = async () => {
  if (!attributeToDelete) return;
  try {
   await deleteAttribute(attributeToDelete.id).unwrap();
   toast.success("Attribute deleted successfully");
   setIsDeleteModalOpen(false);
   setAttributeToDelete(null);
  } catch (err: any) {
   toast.error(err?.data?.message || "Failed to delete attribute");
  }
 };

 const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  const cleanOptions = formOptions.map((opt) => opt.trim()).filter(Boolean);
  if (!formName.trim()) {
   toast.error("Attribute name is required");
   return;
  }

  try {
   const originalName = editingId
    ? (attributes.find((a) => a._id === editingId)?.name || formName.trim())
    : formName.trim();

   if (editingId) {
    await updateAttribute({
     attributeId: editingId,
     body: { name: formName.trim(), subAttributes: cleanOptions },
    }).unwrap();
    toast.success("Attribute updated successfully");
   } else {
    await createAttribute({
     name: formName.trim(),
     subAttributes: cleanOptions,
    }).unwrap();
    toast.success("Attribute created successfully");
   }

   // Concurrently update category custom attributes association
   const categoryUpdates = allCategories.map(async (cat: any) => {
    const isSelected = selectedCategoryIds.includes(cat._id);
    const hasOriginalAttr = cat.customAttributes?.some((a: any) => a.name.toLowerCase() === originalName.toLowerCase());

    let newCustomAttributes = [...(cat.customAttributes || [])];

    if (isSelected) {
     if (hasOriginalAttr) {
      // Update the existing attribute name and options
      newCustomAttributes = newCustomAttributes.map((a: any) =>
       a.name.toLowerCase() === originalName.toLowerCase()
        ? { ...a, name: formName.trim(), subAttributes: cleanOptions }
        : a
      );
     } else {
      // Add the attribute
      const hasNewAttr = newCustomAttributes.some((a: any) => a.name.toLowerCase() === formName.trim().toLowerCase());
      if (hasNewAttr) {
       newCustomAttributes = newCustomAttributes.map((a: any) =>
        a.name.toLowerCase() === formName.trim().toLowerCase()
         ? { ...a, subAttributes: cleanOptions }
         : a
       );
      } else {
       newCustomAttributes.push({ name: formName.trim(), subAttributes: cleanOptions });
      }
     }
    } else {
     if (hasOriginalAttr) {
      // Remove the attribute
      newCustomAttributes = newCustomAttributes.filter(
       (a: any) => a.name.toLowerCase() !== originalName.toLowerCase() && a.name.toLowerCase() !== formName.trim().toLowerCase()
      );
     } else {
      return; // No change needed
     }
    }

    // Compare if customAttributes actually changed before making API call
    const hasChanged = JSON.stringify(cat.customAttributes) !== JSON.stringify(newCustomAttributes);
    if (!hasChanged) return;

    return updateCategory({
     categoryId: cat._id,
     body: { customAttributes: newCustomAttributes }
    }).unwrap();
   });

   await Promise.all(categoryUpdates.filter(Boolean));

   resetForm();
  } catch (err: any) {
   toast.error(err?.data?.message || "Failed to save attribute");
  }
 };

 return (
  <Modal
   isOpen={isOpen}
   onClose={onClose}
   size="lg"
   title="Product Attributes Management"
   header={
    <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
     <div className="flex items-center gap-3">
      {view === "form" ? (
       <button
        type="button"
        onClick={() => setView("list")}
        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
       >
        <HiArrowLeft className="w-4 h-4" />
       </button>
      ) : (
       <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center">
        <Icon name="settings" folder="dashboardIcon" size="sm" className="text-brand-gold" />
       </div>
      )}
      <div>
       <h3 className="text-sm font-black text-[#121212] uppercase tracking-wider">
        {view === "form" ? (editingId ? "Edit Attribute" : "New Attribute") : "Product Attributes"}
       </h3>
       <p className="text-[10px] text-gray-400 font-bold uppercase">
        {view === "form" ? "Specify name & sub-attributes" : "Manage custom & standard attributes"}
       </p>
      </div>
     </div>
     <button
      onClick={onClose}
      className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100"
     >
      <Icon name="close" folder="icon" size="sm" />
     </button>
    </div>
   }
   footer={
    view === "form" ? (
     <div className="flex gap-3 w-full">
      <Button
       variant="outline"
       type="button"
       onClick={() => setView("list")}
       className="flex-1 text-[11px] font-black uppercase tracking-widest h-10"
       shape="rounded-sm"
      >
       Cancel
      </Button>
      <Button
       variant="primary"
       type="button"
       onClick={handleSave}
       isLoading={isCreating || isUpdating || isUpdatingCategories}
       className="flex-1 text-[11px] font-black uppercase tracking-widest h-10"
       shape="rounded-sm"
      >
       Save Attribute
      </Button>
     </div>
    ) : (
     <button
      onClick={onClose}
      className="w-full py-2.5 bg-white border border-gray-200 text-[#121212] text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-50 transition-colors"
     >
      Close Attributes Manager
     </button>
    )
   }
  >
   {view === "list" ? (
    <div className="flex flex-col gap-6">
     {/* Search and Add */}
     <div className="flex items-center gap-3">
      <Input
       shape="rounded-sm"
       type="text"
       placeholder="Search attributes..."
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
       containerClassName="flex-1"
       className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium h-10"
       suffixElement={<HiMagnifyingGlass className="text-gray-400 w-4 h-4" />}
      />
      <Button
       type="button"
       variant="primary"
       shape="rounded-sm"
       className="h-10 text-[10px] font-black shrink-0"
       onClick={handleAddClick}
      >
       + ADD ATTRIBUTE
      </Button>
     </div>

     {/* List of Attributes */}
     <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
      {isLoadingList ? (
       <p className="text-xs text-gray-400 text-center py-8">Loading attributes...</p>
      ) : filteredAttributes.length === 0 ? (
       <div className="py-12 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-gray-200 rounded-lg">
        <Icon name="info" folder="icon" size="lg" className="text-gray-200" />
        <p className="text-xs text-gray-400 font-medium">No attributes found. Click 'Add Attribute' to create one.</p>
       </div>
      ) : (
       filteredAttributes.map((attr, idx) => (
        <div
         key={attr._id}
         className="p-4 bg-gray-50/30 border border-gray-150 rounded-lg flex flex-col gap-3 hover:border-brand-gold/30 hover:bg-white transition-all group"
        >
         <div className="flex justify-between items-start">
          <div className="flex flex-col">
           <span className="text-sm font-black text-gray-900 leading-tight">
            {attr.name.toUpperCase()}
           </span>
           <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
            {attr.subAttributes?.length || 0} OPTIONS
           </span>

           {/* Associated Categories */}
           {(() => {
            const associatedCats = allCategories.filter((cat: any) =>
             cat.customAttributes?.some((a: any) => a.name.toLowerCase() === attr.name.toLowerCase())
            );
            return (
             <div className="flex flex-wrap gap-1 mt-1.5">
              {associatedCats.map((cat: any) => (
               <span
                key={cat._id}
                className="px-1.5 py-0.5 bg-brand-gold/10 text-brand-gold text-[8px] font-bold rounded uppercase tracking-wider"
               >
                {cat.name}
               </span>
              ))}
              {associatedCats.length === 0 && (
               <span className="text-[8px] text-gray-300 font-bold italic uppercase tracking-wider">
                Unassigned
               </span>
              )}
             </div>
            );
           })()}
          </div>

          <div className="flex items-center gap-2">
           <Button
            type="button"
            variant="outline"
            shape="rounded-sm"
            className="w-8 h-8 !p-0 text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-all shrink-0 border-gray-200"
            onClick={() => handleEditClick(attr)}
            title="Edit Attribute"
           >
            <Icon name="settings" folder="dashboardIcon" size="sm" />
           </Button>
           <Button
            type="button"
            variant="outline"
            shape="rounded-sm"
            className="w-8 h-8 !p-0 text-gray-400 hover:text-rose-500 hover:border-rose-500 transition-all shrink-0 border-gray-200"
            onClick={() => handleDeleteClick(attr._id, attr.name)}
            title="Delete Attribute"
           >
            <Icon name="Delete" folder="dashboardIcon" size="sm" />
           </Button>
          </div>
         </div>

         <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
          {attr.subAttributes?.length > 0 ? (
           attr.subAttributes.map((sub, subIdx) => (
            <span key={subIdx} className="px-2 py-0.5 bg-white text-gray-600 border border-gray-200 text-[9px] font-black rounded uppercase">
             {sub}
            </span>
           ))
          ) : (
           <span className="text-[9px] text-gray-300 font-bold italic">No sub-attributes defined.</span>
          )}
         </div>
        </div>
       ))
      )}
     </div>
    </div>
   ) : (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
     {/* Attribute Name */}
     <div className="flex flex-col gap-2">
      <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Attribute Name</label>
      <Input
       placeholder="e.g. Material"
       value={formName}
       onChange={(e) => setFormName(e.target.value)}
       className="h-12 border-gray-200 font-bold"
       shape="rounded-sm"
       required
      />
     </div>

     {/* Dynamic Options List */}
     <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
       <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Sub Attributes / Options</label>
       <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-brand-gold h-7 text-[10px] font-black hover:bg-brand-gold/5"
        onClick={() => setFormOptions(prev => [...prev, ""])}
       >
        + ADD OPTION
       </Button>
      </div>

      <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2 pl-3 border-l-2 border-gray-100">
       {formOptions.map((opt, index) => (
        <div key={index} className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
         <Input
          placeholder="e.g. Gold"
          value={opt}
          onChange={(e) => {
           const newOptions = [...formOptions];
           newOptions[index] = e.target.value;
           setFormOptions(newOptions);
          }}
          className="h-11 border-gray-100 font-bold flex-1 bg-gray-50/30"
          shape="rounded-sm"
          required
         />
         <Button
          type="button"
          variant="outline"
          shape="rounded-sm"
          className="w-11 h-11 p-0 text-gray-300 hover:text-rose-500 hover:border-rose-500 transition-all border-gray-100 shrink-0"
          onClick={() => {
           const newOptions = formOptions.filter((_, i) => i !== index);
           setFormOptions(newOptions.length > 0 ? newOptions : [""]);
          }}
         >
          <HiXMark className="w-4 h-4" />
         </Button>
        </div>
       ))}
      </div>
     </div>

     {/* Assign to Categories */}
     <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
      <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
       Assign to Categories
      </label>
      {allCategories.length === 0 ? (
       <p className="text-xs text-gray-350 italic font-medium">No categories available.</p>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
        {allCategories.map((cat: any) => {
         const isChecked = selectedCategoryIds.includes(cat._id);
         return (
          <div
           key={cat._id}
           className="flex items-center p-2 rounded-lg bg-gray-50/50 border border-gray-150 hover:bg-white hover:border-brand-gold/30 transition-all"
          >
           <Checkbox
            label={cat.name.toUpperCase()}
            checked={isChecked}
            onChange={(checked) => {
             if (checked) {
              setSelectedCategoryIds((prev) => [...prev, cat._id]);
             } else {
              setSelectedCategoryIds((prev) => prev.filter((id) => id !== cat._id));
             }
            }}
           />
          </div>
         );
        })}
       </div>
      )}
     </div>
    </form>
   )}

   <ConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={() => {
     setIsDeleteModalOpen(false);
     setAttributeToDelete(null);
    }}
    onConfirm={handleConfirmDelete}
    title="Delete Attribute"
    message={`Are you sure you want to delete the attribute "${attributeToDelete?.name}"? This action cannot be undone.`}
    confirmText="Yes, delete attribute"
    type="danger"
    isLoading={isDeleting}
   />
  </Modal>
 );
};
