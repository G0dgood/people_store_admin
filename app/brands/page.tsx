"use client";

import React, { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { AddBrandModal } from "@/app/components/Admin/AddBrandModal";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { EditBrandDrawer } from "@/app/components/Admin/EditBrandDrawer";
import { BulkActionsDrawer } from "@/app/components/Admin/BulkActionsDrawer";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { BrandsMoreActionsDrawer } from "@/app/components/Admin/BrandsMoreActionsDrawer";
import { Tooltip } from "@/app/components/Tooltip";
import { QuickAddProductModal } from "@/app/components/Admin/QuickAddProductModal";
import { BrandProductsModal } from "@/app/components/Admin/BrandProductsModal";
import { HiOutlineArrowPath, HiOutlineEye, HiBars3, HiChevronUp, HiChevronDown } from "react-icons/hi2";

import { useGetBrandsQuery, useDeleteBrandMutation, useReorderBrandsMutation } from "@/lib/redux/services/brandApi";
import { toast } from "sonner";
import { SVGLoaderFetch, NoRecordFound } from "@/app/components/Options";

const statusConfig = {
 Active: "text-emerald-500 bg-emerald-50/50",
 Inactive: "text-rose-500 bg-rose-50/50",
};

export default function BrandsListing() {
 const [currentPage, setCurrentPage] = useState(1);
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [searchQuery, setSearchQuery] = useState("");
 const [activeTab, setActiveTab] = useState("All brands");
 const [selectedIds, setSelectedIds] = useState<string[]>([]);
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
 const [brandToEdit, setBrandToEdit] = useState<any>(null);
 const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
 const [selectedBrandForQuickAdd, setSelectedBrandForQuickAdd] = useState<any>(null);
 const [isViewModalOpen, setIsViewModalOpen] = useState(false);
 const [selectedBrandForView, setSelectedBrandForView] = useState<any>(null);
 const [localBrands, setLocalBrands] = useState<any[]>([]);
 const [isOrderDirty, setIsOrderDirty] = useState(false);
 const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
 const [isSaveOrderModalOpen, setIsSaveOrderModalOpen] = useState(false);

 const { data: response, isLoading, refetch, isFetching } = useGetBrandsQuery({
  page: currentPage,
  limit: rowsPerPage,
  search: searchQuery,
  status: activeTab
 });

 const [reorderBrands, { isLoading: isSavingOrder }] = useReorderBrandsMutation();

 const handleTabChange = (tab: string) => {
  setActiveTab(tab);
  setCurrentPage(1);
 };
 const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();
 const brandsData = response?.data?.brands || [];
 const totalPages = response?.data?.pagination?.pages || 1;

 React.useEffect(() => {
  if (brandsData) {
   setLocalBrands(brandsData);
   setIsOrderDirty(false);
  }
 }, [response]);

 const toggleAll = () => {
  if (selectedIds.length === brandsData?.length && brandsData?.length > 0) {
   setSelectedIds([]);
  } else {
   setSelectedIds(brandsData.map(b => String(b._id)));
  }
 };

 const toggleItem = (id: string) => {
  setSelectedIds(prev =>
   prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
  );
 };
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [brandToDelete, setBrandToDelete] = useState<any>(null);
 const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
 const [isBulkDeactivateConfirmOpen, setIsBulkDeactivateConfirmOpen] = useState(false);

 const handleDragStart = (e: React.DragEvent, index: number) => {
  setDraggedIndex(index);
  e.dataTransfer.effectAllowed = "move";
 };

 const handleDragOver = (e: React.DragEvent, index: number) => {
  e.preventDefault();
 };

 const handleDrop = (e: React.DragEvent, index: number) => {
  e.preventDefault();
  if (draggedIndex === null || draggedIndex === index) return;

  const updated = [...localBrands];
  const [draggedItem] = updated.splice(draggedIndex, 1);
  updated.splice(index, 0, draggedItem);

  setLocalBrands(updated);
  setIsOrderDirty(true);
  setDraggedIndex(null);
 };

 const handleMoveUp = (index: number) => {
  if (index === 0) return;
  const updated = [...localBrands];
  const temp = updated[index];
  updated[index] = updated[index - 1];
  updated[index - 1] = temp;
  setLocalBrands(updated);
  setIsOrderDirty(true);
 };

 const handleMoveDown = (index: number) => {
  if (index === localBrands.length - 1) return;
  const updated = [...localBrands];
  const temp = updated[index];
  updated[index] = updated[index + 1];
  updated[index + 1] = temp;
  setLocalBrands(updated);
  setIsOrderDirty(true);
 };

 const handleOrderInputChange = (index: number, val: string) => {
  const num = parseInt(val);
  if (isNaN(num)) return;
  
  const updated = [...localBrands];
  const item = { ...updated[index], order: num };
  updated[index] = item;
  
  updated.sort((a, b) => {
   const orderA = a.order ?? 0;
   const orderB = b.order ?? 0;
   if (orderA !== orderB) return orderA - orderB;
   return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  setLocalBrands(updated);
  setIsOrderDirty(true);
 };

 const handleSaveOrder = async () => {
  try {
   const orders = localBrands.map((b, index) => {
    const calculatedOrder = (currentPage - 1) * rowsPerPage + index;
    return {
     id: b._id,
     order: calculatedOrder
    };
   });

   await reorderBrands({ orders }).unwrap();
   toast.success("Brands order saved successfully");
   setIsOrderDirty(false);
   refetch();
   setIsSaveOrderModalOpen(false);
  } catch (err) {
   toast.error("Failed to save brand order");
  }
 };

 return (
  <div className="flex flex-col gap-6">
   {/* Header Area */}
   <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
    <div className="flex gap-3 w-full sm:w-auto">
     {isOrderDirty && (
      <Button shape="rounded-sm" variant="primary"
       className="transition-all duration-300 bg-brand-gold hover:bg-brand-gold-dark border-brand-gold hover:border-brand-gold-dark text-white shadow-md font-bold px-4 py-2 flex-1 sm:flex-initial animate-pulse hover:animate-none"
       onClick={() => setIsSaveOrderModalOpen(true)}
       disabled={isSavingOrder}
      >
       {isSavingOrder ? "Saving..." : "Save Order"}
      </Button>
     )}
     <Tooltip text="Refresh List">
      <Button shape="rounded-sm" variant="outline"
       className="border-gray-200 text-gray-500 group"
       iconLeft={<HiOutlineArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
       onClick={() => refetch()}
       disabled={isLoading || isFetching}
      >
       {isFetching ? "Refreshing..." : "Refresh"}
      </Button>
     </Tooltip>
     <Button shape="rounded-sm" variant="primary"
      className="flex-1 sm:flex-initial transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
      iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
      onClick={() => setIsAddModalOpen(true)}
     >
      Add Brand
     </Button>
     <Button shape="rounded-sm" variant="outline"
      className="flex-1 sm:flex-initial"
      iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
      onClick={() => setIsMoreActionsOpen(true)}
     >
      More Action
     </Button>
    </div>
   </div>

   <div className="bg-white overflow-hidden flex flex-col border border-[#1C1C1C1A] rounded-[6px]">
    {/* Filter Controls Row */}
    <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
     <TabFilter
      tabs={["All brands", "Active", "Inactive"]}
      activeTab={activeTab}
      onChange={handleTabChange} id={""} />

     <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
      <Input shape="rounded-sm"
       type="text"
       placeholder="Search brand name"
       containerClassName="w-full lg:w-80 xl:w-96"
       className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
       value={searchQuery}
       onChange={(e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
       }}
       suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
      />
      <div className="flex items-center gap-3 w-full sm:w-auto">
       <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

       <div className="flex gap-2 ml-auto sm:ml-0">
        <Button shape="rounded-sm" variant="outline"
         className="!p-2.5 text-gray-400">
         <Icon name="sort" folder="dashboardIcon" size="sm" />
        </Button>
        <Button shape="rounded-sm" variant="outline"
         className="!p-2.5 text-gray-400">
         <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" />
        </Button>
       </div>
      </div>
     </div>
    </div>

    {/* Table Area */}
    <div className="admin-table-container">
     <table>
      <thead>
       <tr>
        <th className="w-10">
         <Checkbox
          checked={selectedIds.length === brandsData.length && brandsData.length > 0}
          onChange={toggleAll}
         />
        </th>
        <th className="w-24 text-center">Order</th>
        <th>Brand</th>
        <th>Category</th>
        <th>Inventory No</th>
        <th>Rating</th>
        <th>Status</th>
        <th className="text-right">Action</th>
       </tr>
      </thead>
      <tbody>
       {isLoading ? (
        <SVGLoaderFetch asTable={true} text="Loading brands..." colSpan={8} />
       ) : localBrands.length === 0 ? (
        <NoRecordFound asTable={true} text="No brands found." colSpan={8} />
       ) : (
        localBrands.map((brand, idx) => (
         <tr
          key={brand._id}
          className={`group transition-all duration-200 border-b border-gray-100 ${
           draggedIndex === idx ? "opacity-40 bg-gray-50 scale-[0.98]" : "hover:bg-gray-50/50"
          }`}
          draggable={!searchQuery && activeTab === "All brands"}
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={(e) => handleDrop(e, idx)}
          onDragEnd={() => setDraggedIndex(null)}
         >
          <td>
           <Checkbox
            checked={selectedIds.includes(brand._id)}
            onChange={() => toggleItem(brand._id)}
           />
          </td>
          <td className="text-center py-4 w-24" onClick={(e) => e.stopPropagation()}>
           <div className="flex items-center justify-center gap-2">
            <span
             className={`p-1.5 rounded transition-colors cursor-grab active:cursor-grabbing text-gray-400 hover:text-brand-gold ${
               (!searchQuery && activeTab === "All brands") ? "" : "opacity-30 cursor-not-allowed hover:text-gray-400"
             }`}
             title={
               (!searchQuery && activeTab === "All brands")
                 ? "Drag to reorder brand"
                 : "Clear search and select 'All brands' tab to reorder"
             }
            >
             <HiBars3 className="w-4 h-4" />
            </span>
            <div className="flex flex-col items-center justify-center gap-0.5">
             <button
              type="button"
              onClick={() => handleMoveUp(idx)}
              disabled={idx === 0}
              className={`p-0.5 rounded text-gray-400 hover:text-brand-gold transition-colors ${
                idx === 0 ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
              }`}
             >
              <HiChevronUp className="w-3.5 h-3.5" />
             </button>
             <input
              type="number"
              value={brand.order !== undefined && brand.order !== null ? brand.order : (currentPage - 1) * rowsPerPage + idx}
              onChange={(e) => handleOrderInputChange(idx, e.target.value)}
              className="w-12 h-7 text-center text-xs font-bold text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 rounded focus:border-brand-gold outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
             />
             <button
              type="button"
              onClick={() => handleMoveDown(idx)}
              disabled={idx === localBrands.length - 1}
              className={`p-0.5 rounded text-gray-400 hover:text-brand-gold transition-colors ${
                idx === localBrands.length - 1 ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
              }`}
             >
              <HiChevronDown className="w-3.5 h-3.5" />
             </button>
            </div>
           </div>
          </td>
          <td>
           <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] border border-gray-200 overflow-hidden bg-white p-1 ring-1 ring-gray-100 flex items-center justify-center">
             {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
             ) : (
              <Icon name="Image" folder="dashboardIcon" size="sm" className="text-gray-300" />
             )}
            </div>
            <span className="text-sm font-bold text-[#121212] group-hover:text-brand-gold transition-colors">
             {brand.name}
            </span>
           </div>
          </td>
          <td className="text-sm font-bold text-gray-500">{brand.category}</td>
          <td>
           <span className="text-xs font-black text-brand-gold bg-brand-gold/5 px-2.5 py-1 rounded-[4px] uppercase tracking-wider">
            {brand.inventoryCount || 0} items
           </span>
          </td>
          <td>
           <div className="flex items-center gap-1.5">
            <Icon name="star" folder="dashboardIcon" size="xs" className="text-amber-400" />
            {brand.reviewCount ? (
              <span className="text-xs font-bold text-[#121212]">
               {Number(brand.rating).toFixed(1)}
               <span className="text-gray-400 font-medium"> ({brand.reviewCount})</span>
              </span>
            ) : (
              <span className="text-xs font-medium text-gray-400">No ratings</span>
            )}
           </div>
          </td>
          <td>
           <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusConfig[brand.status as keyof typeof statusConfig]}`}>
            {brand.status}
           </span>
          </td>
          <td className="text-right">
           <div className="flex justify-end items-center gap-2">
            <Tooltip text="View Products" position="top">
             <Button shape="rounded-sm" variant="outline"
              className="!p-1.5 text-gray-400 hover:text-white hover:bg-[#121212] hover:border-[#121212] transition-all"
              onClick={() => {
               setSelectedBrandForView(brand);
               setIsViewModalOpen(true);
              }}
             >
              <HiOutlineEye className="w-4 h-4" />
             </Button>
            </Tooltip>
            <Tooltip text="Add Product to Brand" position="top">
             <Button shape="rounded-sm" variant="outline"
              className="!p-1.5 text-gray-400 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all"
              onClick={() => {
               setSelectedBrandForQuickAdd(brand);
               setIsQuickAddModalOpen(true);
              }}
             >
              <Icon name="circle-plus" folder="dashboardIcon" size="sm" />
             </Button>
            </Tooltip>
            <Tooltip text="Edit Brand" position="top">
             <Button shape="rounded-sm" variant="outline"
              className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
              onClick={() => {
               setBrandToEdit(brand);
               setIsEditDrawerOpen(true);
              }}
             >
              <Icon name="settings" folder="dashboardIcon" size="sm" />
             </Button>
            </Tooltip>
            <Tooltip text="Delete Brand" position="top">
             <Button shape="rounded-sm" variant="outline"
              className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
              onClick={() => {
               setBrandToDelete(brand);
               setIsDeleteModalOpen(true);
              }}
             >
              <Icon name="Delete" folder="dashboardIcon" size="sm" />
             </Button>
            </Tooltip>
           </div>

          </td>
         </tr>
        ))
       )}
      </tbody>
     </table>
    </div>

    {/* Pagination Area */}
    <Pagination
     currentPage={currentPage}
     totalPages={totalPages}
     onPageChange={setCurrentPage}
    />
   </div>

   <AddBrandModal
    isOpen={isAddModalOpen}
    onClose={() => setIsAddModalOpen(false)}
   />

   <EditBrandDrawer
    isOpen={isEditDrawerOpen}
    onClose={() => setIsEditDrawerOpen(false)}
    brand={brandToEdit}
   />

   <ConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={async () => {
     if (brandToDelete) {
      try {
       await deleteBrand(brandToDelete._id).unwrap();
       toast.success("Brand Deleted", {
        description: `${brandToDelete.name} has been removed from the library.`
       });
       setIsDeleteModalOpen(false);
      } catch (err: any) {
       toast.error("Deletion Failed", {
        description: err?.data?.message || "Failed to delete brand."
       });
      }
     }
    }}
    title="Delete Brand"
    message={`Are you sure you want to delete the brand "${brandToDelete?.name}"? This action will remove it from the storefront and cannot be undone.`}
    confirmText="Yes, delete brand"
    type="danger"
   />

   <ConfirmationModal
    isOpen={isSaveOrderModalOpen}
    onClose={() => {
     if (!isSavingOrder) setIsSaveOrderModalOpen(false);
    }}
    onConfirm={handleSaveOrder}
    title="Save Brands Order"
    message="Are you sure you want to save the new order of brands? This will update the boutique storefront sorting immediately."
    confirmText="Yes, save order"
    cancelText="Cancel"
    type="warning"
    isLoading={isSavingOrder}
   />

   <BrandsMoreActionsDrawer
    isOpen={isMoreActionsOpen}
    onClose={() => setIsMoreActionsOpen(false)}
    onDeactivateInactive={() => setIsBulkDeactivateConfirmOpen(true)}
   />

   <BulkActionsDrawer
    isOpen={selectedIds.length > 0}
    onClose={() => setSelectedIds([])}
    selectedIds={selectedIds}
    items={brandsData}
    onClearSelection={() => setSelectedIds([])}
    title="Brands Selected"
    actions={[
     {
      id: "export",
      title: "Export Selected",
      icon: "cloud_download",
      folder: "icon",
      onClick: () => console.log("Exporting selected brands..."),
     },
     {
      id: "delete",
      title: "Delete All Selected",
      icon: "Delete",
      folder: "dashboardIcon",
      variant: "danger",
      onClick: () => setIsDeleteModalOpen(true),
     },
    ]}
   />

   <ConfirmationModal
    isOpen={isBulkDeactivateConfirmOpen}
    onClose={() => setIsBulkDeactivateConfirmOpen(false)}
    onConfirm={() => {
     setIsBulkDeactivateConfirmOpen(false);
    }}
    title="Bulk Deactivate Brands"
    message="Are you sure you want to deactivate all brands currently marked as 'Inactive'? They will no longer be visible on the storefront."
    confirmText="Yes, deactivate all"
    type="danger"
   />

   <QuickAddProductModal
    isOpen={isQuickAddModalOpen}
    onClose={() => {
     setIsQuickAddModalOpen(false);
     setSelectedBrandForQuickAdd(null);
    }}
    brand={selectedBrandForQuickAdd}
   />

   <BrandProductsModal
    isOpen={isViewModalOpen}
    onClose={() => {
     setIsViewModalOpen(false);
     setSelectedBrandForView(null);
    }}
    brand={selectedBrandForView}
   />
  </div>
 );
}
