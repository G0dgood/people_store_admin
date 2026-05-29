"use client";

import React, { useState, useRef } from "react";
import { Icon } from "../../components/Icon";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { Button } from "@/app/components/Button";
import { Input } from "../../components/Form/Inputs";
import { AddCategoryModal } from "../../components/Admin/AddCategoryModal";
import { CategoriesMoreActionsDrawer } from "../../components/Admin/CategoriesMoreActionsDrawer";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import Checkbox from "@/app/components/Checkbox";
import { EditCategoryDrawer } from "../../components/Admin/EditCategoryDrawer";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { Tooltip } from "../../components/Tooltip";
import { AttributeDetailModal } from "../../components/Admin/AttributeDetailModal";
import { QuickAddProductModal } from "../../components/Admin/QuickAddProductModal";
import { CategoryProductsModal } from "../../components/Admin/CategoryProductsModal";
import { ProductAttributesModal } from "../../components/Admin/ProductAttributesModal";
import { HiArrowPath, HiOutlineEye, HiBars3, HiChevronUp, HiChevronDown } from "react-icons/hi2";
import { usePrivilege } from "@/lib/contexts/PrivilegeContext";
import { NoRecordFound, SVGLoaderFetch } from "@/app/components/Options";
import moment from "moment";
import { useDeleteCategoryMutation, useGetCategoriesQuery, useReorderCategoriesMutation } from "@/lib/redux/services/categoryApi";
import { toast } from "sonner";

export default function CategoriesPage() {
 const [searchQuery, setSearchQuery] = useState("");
 const [activeTab, setActiveTab] = useState("All Categories");
 const [currentPage, setCurrentPage] = useState(1);
 const [rowsPerPage, setRowsPerPage] = useState(10);

 const { data: response, isLoading, refetch, isFetching } = useGetCategoriesQuery({
  page: currentPage,
  limit: rowsPerPage,
  search: searchQuery,
  status: activeTab === "All Categories" ? undefined : activeTab
 });
 const [deleteCategory] = useDeleteCategoryMutation();
 const [reorderCategories, { isLoading: isSavingOrder }] = useReorderCategoriesMutation();
 const { canAccess } = usePrivilege();

 const categories = response?.data && 'categories' in response.data ? response.data.categories : (Array.isArray(response?.data) ? response.data : []);
 const pagination = response?.data && 'pagination' in response.data ? response.data.pagination : undefined;

 const [localCategories, setLocalCategories] = useState<any[]>([]);
 const [isOrderDirty, setIsOrderDirty] = useState(false);
 const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

 React.useEffect(() => {
  if (categories) {
   setLocalCategories(categories);
   setIsOrderDirty(false);
  }
 }, [response]);

 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
 const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
 const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
 const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
 const [isSaveOrderModalOpen, setIsSaveOrderModalOpen] = useState(false);
 const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
 const [selectedCategoryForAttributes, setSelectedCategoryForAttributes] = useState<any>(null);
 const [selectedCategoryForGlobalAttributes, setSelectedCategoryForGlobalAttributes] = useState<string | undefined>(undefined);
 const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
 const [selectedCategoryForQuickAdd, setSelectedCategoryForQuickAdd] = useState<any>(null);
 const [isViewModalOpen, setIsViewModalOpen] = useState(false);
 const [selectedCategoryForView, setSelectedCategoryForView] = useState<any>(null);
 const [isAttributesGlobalModalOpen, setIsAttributesGlobalModalOpen] = useState(false);
 const [selectedIds, setSelectedIds] = useState<string[]>([]);
 const scrollContainerRef = useRef<HTMLDivElement>(null);

 const totalItems = pagination?.total || categories.length;
 const totalPages = pagination?.pages || Math.ceil(totalItems / rowsPerPage) || 1;

 // Sync pagination reset
 React.useEffect(() => {
  setCurrentPage(1);
 }, [searchQuery, activeTab, rowsPerPage]);

 const toggleAll = () => {
  if (selectedIds.length === categories.length) {
   setSelectedIds([]);
  } else {
   setSelectedIds(categories.map((c: any) => c._id));
  }
 };

 const toggleItem = (id: string) => {
  setSelectedIds((prev) =>
   prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  );
 };

 const handleDeleteCategory = async () => {
  if (!categoryToDelete?._id) return;
  try {
   await deleteCategory(categoryToDelete._id).unwrap();
   toast.success("Category deleted successfully");
   setIsDeleteModalOpen(false);
   setCategoryToDelete(null);
  } catch (error) {
   toast.error("Failed to delete category");
  }
 };

 const scroll = (direction: "left" | "right") => {
  if (scrollContainerRef.current) {
   const scrollAmount = 300;
   scrollContainerRef.current.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth"
   });
  }
 };

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

  const updated = [...localCategories];
  const [draggedItem] = updated.splice(draggedIndex, 1);
  updated.splice(index, 0, draggedItem);

  setLocalCategories(updated);
  setIsOrderDirty(true);
  setDraggedIndex(null);
 };

 const handleMoveUp = (index: number) => {
  if (index === 0) return;
  const updated = [...localCategories];
  const temp = updated[index];
  updated[index] = updated[index - 1];
  updated[index - 1] = temp;
  setLocalCategories(updated);
  setIsOrderDirty(true);
 };

 const handleMoveDown = (index: number) => {
  if (index === localCategories.length - 1) return;
  const updated = [...localCategories];
  const temp = updated[index];
  updated[index] = updated[index + 1];
  updated[index + 1] = temp;
  setLocalCategories(updated);
  setIsOrderDirty(true);
 };

 const handleOrderInputChange = (index: number, val: string) => {
  const num = parseInt(val);
  if (isNaN(num)) return;
  
  const updated = [...localCategories];
  const item = { ...updated[index], order: num };
  updated[index] = item;
  
  updated.sort((a, b) => {
   const orderA = a.order ?? 0;
   const orderB = b.order ?? 0;
   if (orderA !== orderB) return orderA - orderB;
   return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  setLocalCategories(updated);
  setIsOrderDirty(true);
 };

 const handleSaveOrder = async () => {
  try {
   const orders = localCategories.map((c, index) => {
    const calculatedOrder = (currentPage - 1) * rowsPerPage + index;
    return {
     id: c._id,
     order: calculatedOrder
    };
   });

   await reorderCategories({ orders }).unwrap();
   toast.success("Categories order saved successfully");
   setIsOrderDirty(false);
   refetch();
   setIsSaveOrderModalOpen(false);
  } catch (err) {
   toast.error("Failed to save category order");
  }
 };

 return (
  <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
   {/* Header Section */}
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
     <Tooltip text="Refresh Categories">
      <Button shape="rounded-sm" variant="outline"
       className="border-gray-200 text-gray-500 group"
       iconLeft={<HiArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
       onClick={() => refetch()}
       disabled={isLoading || isFetching}
      >
       {isFetching ? "Refreshing..." : "Refresh"}
      </Button>
     </Tooltip>
     {canAccess("categories", "create") && (
      <Button shape="rounded-sm" variant="primary"
       className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold flex-1 sm:flex-initial"
       iconLeft={<Icon name="add" folder="icon" size="md" />}
       onClick={() => setIsAddModalOpen(true)}
      >
       Add Category
      </Button>
     )}
     <Button shape="rounded-sm" variant="primary"
      className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold flex-1 sm:flex-initial"
      iconLeft={<Icon name="add" folder="icon" size="md" />}
      onClick={() => setIsAttributesGlobalModalOpen(true)}
     >
      Product Attributes
     </Button>
     <Button shape="rounded-sm" variant="outline"
      className="flex-1 sm:flex-initial"
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
     className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg text-gray-400 hover:text-gray-900 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:border-brand-gold/30"
     onClick={() => scroll("left")}
    >
     <Icon name="chevron_left" folder="icon" size="sm" />
    </button>

    <div
     ref={scrollContainerRef}
     className="flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth px-1"
    >
     {localCategories.map((cat, i) => (
      <div key={i} className="flex-shrink-0 w-[220px] bg-white p-3 rounded-[6px] flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer hover:border-brand-gold/30 group/item border border-[#1C1C1C1A]">
       <div className="w-12 h-12 rounded-[6px] overflow-hidden bg-gray-50 flex items-center justify-center p-1 group-hover/item:bg-brand-gold/10 transition-colors">
        <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
       </div>
       <span className="text-sm font-bold text-[#121212] group-hover/item:text-brand-gold transition-colors">{cat.name}</span>
      </div>
     ))}
    </div>

    <button
     className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg text-gray-400 hover:text-gray-900 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:border-brand-gold/30"
     onClick={() => scroll("right")}
    >
     <Icon name="chevron_right" folder="icon" size="sm" />
    </button>
   </div>

   {/* Main Container */}
   <div className="bg-white flex flex-col pt-4 border border-[#1C1C1C1A] rounded-[6px]">
    {/* Fill Tabs & Controls */}
    <div className="px-6 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
     <TabFilter
      tabs={["All Categories", "Active", "Inactive"]}
      activeTab={activeTab}
      onChange={setActiveTab} id={""} />

     <div className="flex items-center gap-3 w-full md:w-auto">
      <Input shape="rounded-sm"
       type="text"
       placeholder="Search categories..."
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
       containerClassName="flex-1 md:w-96"
       className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
       suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
      />
      <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
      <Button shape="rounded-sm" variant="outline"
       className="!p-2 text-gray-400  ">
       <Icon name="sort" folder="dashboardIcon" size="sm" />
      </Button>
      <Button shape="rounded-sm" variant="outline"
       className="!p-2 text-gray-400  ">
       <Icon name="circle-plus" folder="dashboardIcon" size="sm" />
      </Button>
     </div>
    </div>

    {/* Table */}
    <div className="admin-table-container">
     <table>
      <thead>
       <tr>
        <th className="pl-6 w-12">
         <Checkbox
          checked={selectedIds.length === categories.length && categories.length > 0}
          onChange={toggleAll}
         />
        </th>
        <th className="w-24 text-center">Order</th>
        <th>Category Name</th>
        <th>Created At</th>
        <th>Attributes</th>
        <th>Products</th>
        <th className="text-right">Action</th>
       </tr>
      </thead>
      <tbody>
       {isLoading ? (
        <SVGLoaderFetch colSpan={7} text="Fetching Categories..." />
       ) : localCategories?.length === 0 ? (
        <NoRecordFound colSpan={7} text="No categories found" />
       ) : (
        localCategories?.map((c: any, idx: number) => (
         <tr
          key={c._id}
          className={`group transition-all duration-200 border-b border-gray-100 ${
           draggedIndex === idx ? "opacity-40 bg-gray-50 scale-[0.98]" : "hover:bg-gray-50/50"
          }`}
          draggable={!searchQuery && activeTab === "All Categories"}
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={(e) => handleDrop(e, idx)}
          onDragEnd={() => setDraggedIndex(null)}
         >
          <td className="pl-6">
           <Checkbox
            checked={selectedIds?.includes(c._id)}
            onChange={() => toggleItem(c._id)}
           />
          </td>
          <td className="text-center py-4 w-24" onClick={(e) => e.stopPropagation()}>
           <div className="flex items-center justify-center gap-2">
            <span
             className={`p-1.5 rounded transition-colors cursor-grab active:cursor-grabbing text-gray-400 hover:text-brand-gold ${
               (!searchQuery && activeTab === "All Categories") ? "" : "opacity-30 cursor-not-allowed hover:text-gray-400"
             }`}
             title={
               (!searchQuery && activeTab === "All Categories")
                 ? "Drag to reorder category"
                 : "Clear search and select 'All Categories' tab to reorder"
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
              value={c.order !== undefined && c.order !== null ? c.order : (currentPage - 1) * rowsPerPage + idx}
              onChange={(e) => handleOrderInputChange(idx, e.target.value)}
              className="w-12 h-7 text-center text-xs font-bold text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 rounded focus:border-brand-gold outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
             />
             <button
              type="button"
              onClick={() => handleMoveDown(idx)}
              disabled={idx === localCategories.length - 1}
              className={`p-0.5 rounded text-gray-400 hover:text-brand-gold transition-colors ${
                idx === localCategories.length - 1 ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
              }`}
             >
              <HiChevronDown className="w-3.5 h-3.5" />
             </button>
            </div>
           </div>
          </td>
          <td className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-[6px] overflow-hidden bg-gray-50 border border-gray-200 p-1">
            <img src={c.image} alt="" className="w-full h-full object-contain" />
           </div>
           <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
             {c.parent && (
              <>
               <span className="text-[10px] font-bold text-brand-gold uppercase bg-brand-gold/5 px-1.5 py-0.5 rounded">
                {typeof c.parent === 'object' ? c.parent.name : "Parent"}
               </span>
               <Icon name="chevron_right" folder="icon" size="xs" className="text-gray-300" />
              </>
             )}
             <span className="text-sm font-black text-gray-900 leading-tight block truncate max-w-[200px]">{c.name}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase truncate max-w-[200px]">{c.description || "No description"}</span>
           </div>
          </td>
          <td className="text-[11px] font-bold text-gray-400">
           {c.createdAt ? moment(c.createdAt).format('MMM DD, YYYY') : "-"}
          </td>
          <td className="py-5">
           <div
            className="flex gap-1 flex-wrap cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
             setSelectedCategoryForAttributes(c);
             setIsAttributeModalOpen(true);
            }}
           >
            {c.hasSize && <span className="px-2 py-0.5 bg-gray-50 text-brand-gold text-[9px] font-black rounded uppercase">Size</span>}
            {c.hasML && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-500 text-[9px] font-black rounded uppercase">Volume</span>}
            {(c.hasSex || c.hasGender) && <span className="px-2 py-0.5 bg-purple-50 text-purple-500 text-[9px] font-black rounded uppercase">Gender</span>}
            {c.hasScentFamily && <span className="px-2 py-0.5 bg-blue-50 text-blue-500 text-[9px] font-black rounded uppercase">Scent Family</span>}
            {c.hasCollection && <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-black rounded uppercase">Collection</span>}
            {c.hasGifting && <span className="px-2 py-0.5 bg-rose-50 text-rose-500 text-[9px] font-black rounded uppercase">Gifting</span>}
            {c.customAttributes?.length > 0 && (
             <span className="px-2 py-0.5 bg-indigo-50 text-indigo-500 text-[9px] font-black rounded uppercase">
              {c.customAttributes.length} Custom
             </span>
            )}
            {!c.hasSize && !c.hasML && !c.hasSex && !c.hasGender && !c.hasScentFamily && !c.hasCollection && !c.hasGifting && (!c.customAttributes || c.customAttributes.length === 0) && (
             <span className="text-[10px] text-gray-300 font-bold italic">No attributes</span>
            )}
           </div>
          </td>
          <td>
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-gold/5 border border-brand-gold/10 flex items-center justify-center">
             <span className="text-[11px] font-black text-brand-gold">{c.productCount || 0}</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Products</span>
           </div>
          </td>
          <td className="text-right">
           <div className="flex justify-end gap-2">
            <Tooltip text="View Products" position="top">
             <Button shape="rounded-sm" variant="outline"
              className="!p-1.5 text-gray-400 hover:text-white hover:bg-[#121212] hover:border-[#121212] transition-all"
              onClick={() => {
               setSelectedCategoryForView(c);
               setIsViewModalOpen(true);
              }}
             >
              <HiOutlineEye className="w-4 h-4" />
             </Button>
            </Tooltip>
            {canAccess("products", "create") && (
             <Tooltip text="Add Product to Category" position="top">
              <Button shape="rounded-sm" variant="outline"
               className="!p-1.5 text-gray-400 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all"
               onClick={() => {
                setSelectedCategoryForQuickAdd(c);
                setIsQuickAddModalOpen(true);
               }}
              >
               <Icon name="circle-plus" folder="dashboardIcon" size="sm" />
              </Button>
             </Tooltip>
            )}
            {canAccess("categories", "edit") && (
             <Tooltip text="Manage Attributes" position="top">
              <Button shape="rounded-sm" variant="outline"
               className="!p-1.5 text-gray-400 hover:text-white hover:bg-indigo-500 hover:border-indigo-500 transition-all"
               onClick={() => {
                setSelectedCategoryForGlobalAttributes(c._id);
                setIsAttributesGlobalModalOpen(true);
               }}
              >
               <Icon name="poll" folder="icon" size="sm" />
              </Button>
             </Tooltip>
            )}
            {canAccess("categories", "edit") && (
             <Tooltip text="Edit Category" position="top">
              <Button shape="rounded-sm" variant="outline"
               className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
               onClick={() => {
                setCategoryToEdit(c);
                setIsEditDrawerOpen(true);
               }}
              >
               <Icon name="settings" folder="dashboardIcon" size="sm" />
              </Button>
             </Tooltip>
            )}
            {canAccess("categories", "delete") && (
             <Tooltip text="Delete Category" position="top">
              <Button shape="rounded-sm" variant="outline"
               className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
               onClick={() => {
                setCategoryToDelete(c);
                setIsDeleteModalOpen(true);
               }}
              >
               <Icon name="Delete" folder="dashboardIcon" size="sm" />
              </Button>
             </Tooltip>
            )}
           </div>
          </td>
         </tr>
        ))
       )}
      </tbody>
     </table>
    </div>

    {/* Footer / Pagination */}
    <Pagination
     currentPage={currentPage}
     totalPages={totalPages}
     onPageChange={setCurrentPage}
    />
   </div>

   <AddCategoryModal
    isOpen={isAddModalOpen}
    onClose={() => setIsAddModalOpen(false)}
   />

   <CategoriesMoreActionsDrawer
    isOpen={isMoreActionsOpen && selectedIds.length === 0}
    onClose={() => setIsMoreActionsOpen(false)}
    onCleanEmpty={() => setIsDeleteModalOpen(true)}
    selectedIds={selectedIds}
    items={categories}
    onClearSelection={() => setSelectedIds([])}
    idProp="_id"
   />

   <BulkActionsDrawer
    isOpen={selectedIds.length > 0}
    onClose={() => setSelectedIds([])}
    selectedIds={selectedIds}
    items={categories}
    onClearSelection={() => setSelectedIds([])}
    title="Categories Selected"
    labelProp="name"
    idProp="_id"
    actions={[
     {
      id: "export",
      title: "Export Selected",
      icon: "cloud_download",
      folder: "icon",
      onClick: () => console.log("Exporting selected categories..."),
     },
     {
      id: "delete",
      title: "Delete Selected",
      icon: "Delete",
      folder: "dashboardIcon",
      variant: "danger",
      onClick: () => setIsDeleteModalOpen(true),
     },
    ]}
   />

   <ConfirmationModal
    isOpen={isBulkDeleteConfirmOpen}
    onClose={() => setIsBulkDeleteConfirmOpen(false)}
    onConfirm={() => {
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
    onClose={() => {
     setIsDeleteModalOpen(false);
     setCategoryToDelete(null);
    }}
    onConfirm={handleDeleteCategory}
    title="Delete Category"
    message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This will remove it from all associated products.`}
    confirmText="Yes, delete category"
    type="danger"
   />

   <ConfirmationModal
    isOpen={isSaveOrderModalOpen}
    onClose={() => {
     if (!isSavingOrder) setIsSaveOrderModalOpen(false);
    }}
    onConfirm={handleSaveOrder}
    title="Save Categories Order"
    message="Are you sure you want to save the new order of categories? This will update the boutique storefront sorting immediately."
    confirmText="Yes, save order"
    cancelText="Cancel"
    type="warning"
    isLoading={isSavingOrder}
   />

   <AttributeDetailModal
    isOpen={isAttributeModalOpen}
    onClose={() => {
     setIsAttributeModalOpen(false);
     setSelectedCategoryForAttributes(null);
    }}
    category={selectedCategoryForAttributes}
   />

   <QuickAddProductModal
    isOpen={isQuickAddModalOpen}
    onClose={() => {
     setIsQuickAddModalOpen(false);
     setSelectedCategoryForQuickAdd(null);
    }}
    category={selectedCategoryForQuickAdd}
   />

   <CategoryProductsModal
    isOpen={isViewModalOpen}
    onClose={() => {
     setIsViewModalOpen(false);
     setSelectedCategoryForView(null);
    }}
    category={selectedCategoryForView}
   />

   <ProductAttributesModal
    isOpen={isAttributesGlobalModalOpen}
    onClose={() => {
     setIsAttributesGlobalModalOpen(false);
     setSelectedCategoryForGlobalAttributes(undefined);
    }}
    initialCategoryId={selectedCategoryForGlobalAttributes}
   />
  </div>
 );
}
