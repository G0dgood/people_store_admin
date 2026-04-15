"use client";

import React, { useState, useRef } from "react";
import { Icon } from "../../components/Icon";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { Button } from "@/app/components/Button";
import { Input } from "../../components/Form/Inputs";
import { AddCategoryModal } from "../../components/Admin/AddCategoryModal";
import { CategoriesMoreActionsDrawer } from "../../components/Admin/CategoriesMoreActionsDrawer";
import { ConfirmationModal } from "../../components/Admin/ConfirmationModal";
import { EditCategoryDrawer } from "../../components/Admin/EditCategoryDrawer";

const categories = [
  { name: "Electronics", image: "/dashboardImage/Electronics.png" },
  { name: "Fashion", image: "/dashboardImage/Fashion.png" },
  { name: "Accessories", image: "/dashboardImage/Accessories.png" },
  { name: "Home & Kitchen", image: "/dashboardImage/Home & Kitchen.png" },
  { name: "Sports & Outdoors", image: "/dashboardImage/Sports & Outdoors.png" },
  { name: "Toys & Games", image: "/dashboardImage/Toys & Games.png" },
  { name: "Health & Fitness", image: "/dashboardImage/Health & Fitness.png" },
  { name: "Books", image: "/dashboardImage/Books.png" },
];

const products = [
  { id: 1, name: "Wireless Bluetooth Headphones", image: "/dashboardImage/Headphones.png", date: "01-01-2025", order: 25 },
  { id: 2, name: "Men's T-Shirt", image: "/dashboardImage/T-Shirt.png", date: "01-01-2025", order: 20 },
  { id: 3, name: "Men's Leather Wallet", image: "/dashboardImage/Wallet.png", date: "01-01-2025", order: 35 },
  { id: 4, name: "Memory Foam Pillow", image: "/dashboardImage/Pillow.png", date: "01-01-2025", order: 40 },
  { id: 5, name: "Coffee Maker", image: "/dashboardImage/Coffee Maker.png", date: "01-01-2025", order: 45 },
  { id: 6, name: "Casual Baseball Cap", image: "/dashboardImage/Cap.png", date: "01-01-2025", order: 55 },
  { id: 7, name: "Full HD Webcam", image: "/dashboardImage/Webcam.png", date: "01-01-2025", order: 20 },
  { id: 8, name: "Smart LED Color Bulb", image: "/dashboardImage/Bulb.png", date: "01-01-2025", order: 16 },
  { id: 9, name: "Men's T-Shirt", image: "/dashboardImage/T-Shirt.png", date: "01-01-2025", order: 10 },
  { id: 10, name: "Men's Leather Wallet", image: "/dashboardImage/Wallet.png", date: "01-01-2025", order: 35 },
];

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState("All Product (145)");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Section */}
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
          <Button
            variant="primary"
            shape="rounded-sm"
            iconLeft={<Icon name="add" folder="icon" size="xs" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Category
          </Button>
          <Button
            variant="outline"
            shape="rounded-sm"
            iconRight={<Icon name="more_vert" folder="icon" size="xs" />}
            onClick={() => setIsMoreActionsOpen(true)}
          >
            More Action
          </Button>
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="relative group">
        <button 
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-lg text-gray-400 hover:text-gray-900 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:border-brand-blue/30"
          onClick={() => scroll("left")}
        >
          <Icon name="chevron_left" folder="icon" size="sm" />
        </button>

        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth px-1"
        >
          {categories.map((cat, i) => (
            <div key={i} className="flex-shrink-0 w-[220px] bg-white border border-gray-100 p-3 rounded-[6px] flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer hover:border-brand-blue/30 group/item">
              <div className="w-12 h-12 rounded-[6px] overflow-hidden bg-gray-50 flex items-center justify-center p-1 group-hover/item:bg-brand-blue-light transition-colors">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-sm font-bold text-[#1D3557] group-hover/item:text-brand-blue transition-colors">{cat.name}</span>
            </div>
          ))}
        </div>

        <button 
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-lg text-gray-400 hover:text-gray-900 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:border-brand-blue/30"
          onClick={() => scroll("right")}
        >
          <Icon name="chevron_right" folder="icon" size="sm" />
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm flex flex-col pt-4">
        {/* Fill Tabs & Controls */}
        <div className="px-6 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <TabFilter
            tabs={["All Product (145)", "Featured Products", "On Sale", "Out of Stock"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Search your product"
              containerClassName="flex-1 md:w-96"
              className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />
            <button className="p-2 border border-gray-100 rounded-[6px] text-gray-400 hover:bg-gray-50">
              <Icon name="sort" folder="dashboardIcon" size="sm" />
            </button>
            <button className="p-2 border border-gray-100 rounded-[6px] text-gray-400 hover:bg-gray-50">
              <Icon name="circle-plus" folder="dashboardIcon" size="sm" />
            </button>
            <button className="p-2 border border-gray-100 rounded-[6px] text-gray-400 hover:bg-gray-50">
              <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="pl-6 w-12">
                  <input type="checkbox" className="rounded-[4px] border-gray-300 text-[#2196F3] focus:ring-[#2196F3]" />
                </th>
                <th className="px-4">No.</th>
                <th>Product</th>
                <th>Created Date</th>
                <th className="text-center">Order</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={idx} className="group">
                  <td className="pl-6">
                    <input type="checkbox" className="rounded-[4px] border-gray-300 text-[#2196F3] focus:ring-[#2196F3]" />
                  </td>
                  <td className="px-4">
                    <span className="text-sm font-bold text-gray-900">1</span>
                  </td>
                  <td className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[6px] overflow-hidden bg-gray-50 border border-gray-100 p-1">
                      <img src={p.image} alt="" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 leading-tight block truncate max-w-[200px]">{p.name}</span>
                  </td>
                  <td className="text-sm font-bold text-gray-900">{p.date}</td>
                  <td className="text-sm font-bold text-gray-900 text-center">{p.order}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        className="p-1.5 border border-gray-50 rounded-[6px] text-gray-400 hover:text-brand-blue hover:bg-brand-blue-light transition-all"
                        onClick={() => {
                          setCategoryToEdit(p); // Assuming products array used for demo, should be cat
                          setIsEditDrawerOpen(true);
                        }}
                      >
                        <Icon name="settings" folder="dashboardIcon" size="sm" />
                      </button>
                      <button 
                        className="p-1.5 border border-gray-50 rounded-[6px] text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        onClick={() => {
                          setCategoryToDelete(p);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Icon name="delete_outline" folder="icon" size="sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalPages={24}
          onPageChange={setCurrentPage}
        />
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <CategoriesMoreActionsDrawer
        isOpen={isMoreActionsOpen}
        onClose={() => setIsMoreActionsOpen(false)}
        onCleanEmpty={() => setIsBulkDeleteConfirmOpen(true)}
      />

      <ConfirmationModal
        isOpen={isBulkDeleteConfirmOpen}
        onClose={() => setIsBulkDeleteConfirmOpen(false)}
        onConfirm={() => {
          console.log("Cleaning empty categories...");
          setIsBulkDeleteConfirmOpen(false);
        }}
        title="Clean Empty Categories"
        message="Are you sure you want to remove all categories with 0 products? This will clean up your storefront hierarchy and cannot be undone."
        confirmText="Yes, clean categories"
        type="danger"
      />

      <EditCategoryDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        category={categoryToEdit}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          console.log("Deleting category:", categoryToDelete?.name);
          setIsDeleteModalOpen(false);
        }}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This will remove it from all associated products.`}
        confirmText="Yes, delete category"
        type="danger"
      />
    </div>
  );
}
