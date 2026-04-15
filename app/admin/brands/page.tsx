"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { AddBrandModal } from "../../components/Admin/AddBrandModal";
import { EditBrandDrawer } from "../../components/Admin/EditBrandDrawer";
import { ConfirmationModal } from "../../components/Admin/ConfirmationModal";
import { BrandsMoreActionsDrawer } from "../../components/Admin/BrandsMoreActionsDrawer";

const brandsData = [
 { id: 1, name: "Apple", logo: "/dashboardImage/Electronics.png", category: "Electronics", rating: 4.8, status: "Active" },
 { id: 2, name: "Nike", logo: "/dashboardImage/Fashion.png", category: "Fashion", rating: 4.5, status: "Active" },
 { id: 3, name: "Samsung", logo: "/dashboardImage/Frame 4259 copy.png", category: "Electronics", rating: 4.6, status: "Active" },
 { id: 4, name: "Adidas", logo: "/dashboardImage/T-Shirt.png", category: "Fashion", rating: 4.4, status: "Inactive" },
 { id: 5, name: "Sony", logo: "/dashboardImage/Accessories.png", category: "Electronics", rating: 4.7, status: "Active" },
 { id: 6, name: "Logitech", logo: "/dashboardImage/Webcam.png", category: "Accessories", rating: 4.3, status: "Active" },
 { id: 7, name: "Beats", logo: "/dashboardImage/Headphones.png", category: "Electronics", rating: 4.5, status: "Active" },
 { id: 8, name: "Dyson", logo: "/dashboardImage/Home & Kitchen.png", category: "Home Appliance", rating: 4.9, status: "Inactive" },
];

const statusConfig = {
 Active: "text-blue-500 bg-brand-blue-light",
 Inactive: "text-rose-500 bg-rose-50/50",
};

export default function BrandsListing() {
 const [activeTab, setActiveTab] = useState("All brands");
 const [currentPage, setCurrentPage] = useState(1);
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
 const [brandToEdit, setBrandToEdit] = useState<any>(null);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [brandToDelete, setBrandToDelete] = useState<any>(null);
 const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
 const [isBulkDeactivateConfirmOpen, setIsBulkDeactivateConfirmOpen] = useState(false);

 return (
  <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
   {/* Header Area */}
   <div className="flex justify-end items-center">
    <div className="flex gap-3">
     <Button
      variant="primary"
      shape="rounded-sm"
      iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
      onClick={() => setIsAddModalOpen(true)}
     >
      Add Brand
     </Button>
     <Button
      variant="outline"
      shape="rounded-sm"
      iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
      onClick={() => setIsMoreActionsOpen(true)}
     >
      More Action
     </Button>
    </div>
   </div>

   <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
    {/* Filter Controls Row */}
    <div className="p-6 flex flex-col xl:flex-row gap-6 items-center justify-between border-b border-gray-50">
     <TabFilter
      tabs={["All brands", "Active", "Inactive"]}
      activeTab={activeTab}
      onChange={setActiveTab}
     />

    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
      <Input
       type="text"
       placeholder="Search brand name"
       containerClassName="flex-1 xl:w-96"
       className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
       suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
      />

      <div className="flex gap-2">
       <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
        <Icon name="sort" folder="dashboardIcon" size="sm" />
       </button>
       <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
        <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" />
       </button>
       <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
        <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
       </button>
      </div>
     </div>
    </div>

    {/* Table Area */}
    <div className="admin-table-container">
     <table>
      <thead>
       <tr>
        <th>No.</th>
        <th>Brand</th>
        <th>Category</th>
        <th>Rating</th>
        <th>Status</th>
        <th className="text-right">Action</th>
       </tr>
      </thead>
      <tbody>
       {brandsData.map((brand, index) => (
        <tr key={brand.id} className="group">
         <td className="text-sm font-medium text-gray-900">{index + 1}</td>
         <td>
          <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-[6px] border border-gray-100 overflow-hidden bg-white p-1 ring-1 ring-gray-100 flex items-center justify-center">
            <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
           </div>
           <span className="text-sm font-bold text-[#1D3557] group-hover:text-blue-600 transition-colors">
            {brand.name}
           </span>
          </div>
         </td>
         <td className="text-sm font-bold text-gray-500">{brand.category}</td>
         <td>
          <div className="flex items-center gap-1.5">
           <Icon name="star" folder="dashboardIcon" size="xs" className="text-amber-400" />
           <span className="text-xs font-bold text-[#1D3557]">{brand.rating}</span>
          </div>
         </td>
         <td>
          <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusConfig[brand.status as keyof typeof statusConfig]}`}>
           {brand.status}
          </span>
         </td>
          <td className="text-right">
           <div className="flex justify-end items-center gap-4 text-gray-400">
            <button 
              className="hover:text-[#2196F3] transition-colors"
              onClick={() => {
                setBrandToEdit(brand);
                setIsEditDrawerOpen(true);
              }}
            >
             <Icon name="settings" folder="dashboardIcon" size="sm" />
            </button>
            <button 
              className="hover:text-rose-500 transition-colors"
              onClick={() => {
                setBrandToDelete(brand);
                setIsDeleteModalOpen(true);
              }}
            >
             <Icon name="Delete" folder="dashboardIcon" size="sm" />
            </button>
           </div>
          </td>
        </tr>
       ))}
      </tbody>
     </table>
    </div>

    {/* Pagination Area */}
    <Pagination 
      currentPage={currentPage}
      totalPages={24}
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
    onConfirm={() => {
      console.log("Deleting brand:", brandToDelete?.name);
      setIsDeleteModalOpen(false);
    }}
    title="Delete Brand"
    message={`Are you sure you want to delete the brand "${brandToDelete?.name}"? This action will remove it from the storefront and cannot be undone.`}
    confirmText="Yes, delete brand"
    type="danger"
   />

   <BrandsMoreActionsDrawer
    isOpen={isMoreActionsOpen}
    onClose={() => setIsMoreActionsOpen(false)}
    onDeactivateInactive={() => setIsBulkDeactivateConfirmOpen(true)}
   />

   <ConfirmationModal
    isOpen={isBulkDeactivateConfirmOpen}
    onClose={() => setIsBulkDeactivateConfirmOpen(false)}
    onConfirm={() => {
      console.log("Bulk deactivating inactive brands...");
      setIsBulkDeactivateConfirmOpen(false);
    }}
    title="Bulk Deactivate Brands"
    message="Are you sure you want to deactivate all brands currently marked as 'Inactive'? They will no longer be visible on the storefront."
    confirmText="Yes, deactivate all"
    type="danger"
   />
  </div>
 );
}
