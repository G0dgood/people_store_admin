"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { SearchInput } from "../../components/Form/SpecialInputs";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { Input } from "@/app/components/Form";
import { ProductsMoreActionsDrawer } from "../../components/Admin/ProductsMoreActionsDrawer";
import { EditProductDrawer } from "../../components/Admin/EditProductDrawer";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import { ConfirmationModal } from "../../components/Admin/ConfirmationModal";

const productsData = [
 {
  id: 1,
  name: "Premium Wireless Headphones",
  sku: "AU-10293",
  category: "Electronics",
  price: "₦35,000",
  stock: 124,
  status: "Published",
  image: "/dashboardImage/Headphones.png"
 },
 {
  id: 2,
  name: "Smart Fitness Watch", sku: "SW-45812", category: "Electronics", price: "₦18,500", stock: 56, status: "Published", image: "/dashboardImage/Electronics.png"
 },
 { id: 3, name: "Organic Cotton T-Shirt", sku: "TS-99201", category: "Fashion", price: "₦4,500", stock: 0, status: "Out of Stock", image: "/dashboardImage/T-Shirt.png" },
 { id: 4, name: "Leather Travel Bag", sku: "BG-33104", category: "Fashion", price: "₦25,000", stock: 12, status: "Published", image: "/dashboardImage/Fashion.png" },
 { id: 5, name: "Minimalist Wall Clock", sku: "HC-77210", category: "Home", price: "₦8,900", stock: 89, status: "Draft", image: "/dashboardImage/Home & Kitchen.png" },
 { id: 6, name: "Modern Desk Lamp", sku: "LT-88401", category: "Home", price: "₦12,000", stock: 8, status: "Low Stock", image: "/dashboardImage/Bulb.png" },
 { id: 7, name: "Ergonomic Gaming Mouse", sku: "MS-55203", category: "Electronics", price: "₦22,000", stock: 45, status: "Published", image: "/dashboardImage/Accessories.png" },
 { id: 8, name: "Wireless Charging Pad", sku: "CP-11029", category: "Electronics", price: "₦7,500", stock: 2, status: "Low Stock", image: "/dashboardImage/Electronics.png" },
];

const statusStyles = {
 Published: "text-blue-500 bg-brand-blue-light",
 Draft: "text-gray-400 bg-gray-50",
 "Out of Stock": "text-rose-500 bg-rose-50/50",
 "Low Stock": "text-amber-500 bg-amber-50/50",
};

export default function ProductListing() {
 const [activeTab, setActiveTab] = useState("All products");
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [selectedIds, setSelectedIds] = useState<number[]>([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
 const [isAddProductOpen, setIsAddProductOpen] = useState(false);

 const toggleAll = () => {
  if (selectedIds.length === filteredProducts.length) {
   setSelectedIds([]);
  } else {
   setSelectedIds(filteredProducts.map(p => p.id));
  }
 };

 const toggleItem = (id: number) => {
  setSelectedIds(prev =>
   prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
  );
 };
 const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
 const [productToEdit, setProductToEdit] = useState<any>(null);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [productToDelete, setProductToDelete] = useState<any>(null);
 const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);

 const filteredProducts = productsData.filter(product => {
  if (activeTab === "All products") return true;
  return product.status === activeTab;
 });

 return (
  <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
   {/* Header Area */}
   <div className="flex justify-end items-center">
    <div className="flex gap-3">
     <Link href="/admin/products/new">
      <Button
       variant="primary"
       shape="rounded-sm"
       iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
      >
       Add New Product
      </Button>
     </Link>
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
    {/* Filter Controls Bar */}
    <div className="p-6 flex flex-col xl:flex-row gap-6 items-center justify-between border-b border-gray-50">
     <TabFilter
      tabs={["All products", "Published", "Draft", "Low Stock"]}
      activeTab={activeTab}
      onChange={setActiveTab}
     />

     <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
      <Input
       type="text"
       placeholder="Search product name, SKU..."
       containerClassName="flex-1 xl:w-96"
       className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
       suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
      />

      <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

      <div className="flex gap-2">
       <Button
        variant="outline"
        shape="rounded-sm"
        className="!p-2.5 text-gray-400"
       >
        <Icon name="sort" folder="dashboardIcon" size="sm" />
       </Button>
       <Button
        variant="outline"
        shape="rounded-sm"
        className="text-gray-400 flex items-center gap-2 px-4 shadow-sm"
       >
        <Icon name="filter" folder="dashboardIcon" size="sm" />
        <span className="text-xs font-bold text-[#1D3557]">Filters</span>
       </Button>
      </div>
     </div>
    </div>

    {/* Product Table */}
    <div className="admin-table-container">
     <table>
      <thead>
       <tr>
        <th className="w-10">
         <Checkbox
          checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
          onChange={toggleAll}
         />
        </th>
        <th className="text-xs">Product</th>
        <th className="text-xs">Category</th>
        <th className="text-xs">Price</th>
        <th className="text-xs">Stock</th>
        <th className="text-xs">Status</th>
        <th className="text-xs text-right">Action</th>
       </tr>
      </thead>
      <tbody>
       {filteredProducts.map((product) => (
        <tr key={product.id} className="group">
         <td>
          <Checkbox
           checked={selectedIds.includes(product.id)}
           onChange={() => toggleItem(product.id)}
          />
         </td>
         <td>
          <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-[6px] border border-gray-100 overflow-hidden bg-white p-1 shadow-sm ring-1 ring-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
           </div>
           <div className="flex flex-col">
            <span className="text-sm font-bold text-[#1D3557] leading-tight group-hover:text-blue-600 transition-colors">{product.name}</span>
            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">SKU: {product.sku}</span>
           </div>
          </div>
         </td>
         <td>
          <span className="text-sm font-bold text-gray-500">{product.category}</span>
         </td>
         <td>
          <span className="text-sm font-black text-[#2196F3]">{product.price}</span>
         </td>
         <td>
          <div className="flex flex-col gap-1">
           <span className={`text-sm font-bold ${product.stock === 0 ? "text-rose-500" : "text-gray-700"}`}>
            {product.stock} units
           </span>
          </div>
         </td>
         <td>
          <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusStyles[product.status as keyof typeof statusStyles]}`}>
           {product.status}
          </span>
         </td>
         <td className="text-right">
          <div className="flex justify-end items-center gap-4 text-gray-300">
           <button
            className="hover:text-blue-500 transition-colors"
            onClick={() => {
             setProductToEdit(product);
             setIsEditDrawerOpen(true);
            }}
           >
            <Icon name="settings" folder="dashboardIcon" size="sm" />
           </button>
           <button
            className="hover:text-rose-500 transition-colors"
            onClick={() => {
             setProductToDelete(product);
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

    <Pagination
     currentPage={currentPage}
     totalPages={24}
     onPageChange={setCurrentPage}
    />
   </div>

   <ProductsMoreActionsDrawer
    isOpen={isMoreActionsOpen && selectedIds.length === 0}
    onClose={() => setIsMoreActionsOpen(false)}
    onArchiveOutOfStock={() => setIsArchiveConfirmOpen(true)}
   />

   <BulkActionsDrawer
    isOpen={selectedIds.length > 0}
    onClose={() => setSelectedIds([])}
    selectedIds={selectedIds}
    items={filteredProducts}
    onClearSelection={() => setSelectedIds([])}
    title="Products Selected"
    actions={[
     {
      id: "export",
      title: "Export Selected",
      icon: "cloud_download",
      folder: "icon",
      onClick: () => console.log("Exporting selected products..."),
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

   <EditProductDrawer
    isOpen={isEditDrawerOpen}
    onClose={() => setIsEditDrawerOpen(false)}
    product={productToEdit}
   />

   <ConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={() => {
     console.log("Deleting product:", productToDelete?.name);
     setIsDeleteModalOpen(false);
    }}
    title="Delete Product"
    message={`Are you sure you want to delete "${productToDelete?.name}"? This action will permanently remove it from the catalog and storefront.`}
    confirmText="Yes, delete product"
    type="danger"
   />

   <ConfirmationModal
    isOpen={isArchiveConfirmOpen}
    onClose={() => setIsArchiveConfirmOpen(false)}
    onConfirm={() => {
     console.log("Archiving out-of-stock products...");
     setIsArchiveConfirmOpen(false);
    }}
    title="Archive Out of Stock"
    message="Are you sure you want to archive all products with 0 stock units? They will be moved to the Draft status and hidden from the storefront."
    confirmText="Yes, archive all"
    type="danger"
   />
  </div>
 );
}
