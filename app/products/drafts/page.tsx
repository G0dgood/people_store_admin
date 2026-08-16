"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { SearchInput } from "@/app/components/Form/SpecialInputs";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { Input } from "@/app/components/Form";
import { ProductsMoreActionsDrawer } from "@/app/components/Admin/ProductsMoreActionsDrawer";
import { EditProductDrawer } from "@/app/components/Admin/EditProductDrawer";
import { BulkActionsDrawer } from "@/app/components/Admin/BulkActionsDrawer";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { toast } from "sonner";
import { NoRecordFound, SVGLoaderFetch } from "@/app/components/Options";
import { Tooltip } from "@/app/components/Tooltip";

import { StockAdjustmentDrawer } from "@/app/components/Admin/StockAdjustmentDrawer";
import { useAddProductMutation, useGetProductsQuery, useDeleteProductMutation, useUpdateProductMutation, Product } from "@/lib/redux/services/productApi";
import { LuCopy, LuPackageSearch, LuZap, LuFileText } from "react-icons/lu";
import { HiPencil } from "react-icons/hi2";

const statusStyles = {
  Published: "text-emerald-600 bg-emerald-50/50 border border-emerald-200",
  Draft: "text-amber-600 bg-amber-50 border border-amber-300",
  "Out of Stock": "text-rose-500 bg-rose-50/50",
  "Low Stock": "text-amber-500 bg-amber-50/50",
};

export default function DraftProductsListing() {
  // Specifically fetch ONLY drafts from the server
  const { data: response, isLoading } = useGetProductsQuery({ status: "Draft" });
  const products = response?.data?.products || [];

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [addProduct, { isLoading: isDuplicating }] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isStockDrawerOpen, setIsStockDrawerOpen] = useState(false);
  const [productForStock, setProductForStock] = useState<Product | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const toggleAll = (visibleProducts: Product[]) => {
    if (selectedIds.length === visibleProducts.length && visibleProducts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleProducts.map(p => p._id));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      const newStatus = "Published"; // On the drafts page, we likely only want to publish
      await updateProduct({
        productId: product._id,
        data: { status: newStatus as any }
      }).unwrap();
      toast.success(`Product published successfully!`);
    } catch (err) {
      toast.error("Failed to publish product");
    }
  };

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage);

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete._id).unwrap();
      toast.success("Draft deleted successfully");
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      toast.error("Failed to delete draft");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      <div className="">
        <div className="flex flex-col gap-2 ">
          <h1 className="text-2xl font-black text-[#121212]">Product Drafts</h1>
          <p className="text-sm font-medium text-gray-400">Manage your unpublished products and prepare them for your storefront.</p>
        </div>
      </div>

      <div className="bg-white overflow-hidden flex flex-col border border-[#1C1C1C1A] rounded-[6px]">
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-[6px] text-xs font-bold uppercase tracking-widest border border-amber-100">
              {products.length} Drafts Pending
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input shape="rounded-sm"
              type="text"
              placeholder="Search drafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              containerClassName="flex-1 xl:w-96"
              className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
          </div>
        </div>

        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-10">
                  <Checkbox
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={() => toggleAll(filteredProducts)}
                  />
                </th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <SVGLoaderFetch colSpan={6} text={""} />
              ) : filteredProducts?.length === 0 ? (
                <NoRecordFound colSpan={6} />
              ) : paginatedProducts?.map((product: Product) => (
                <tr key={product._id} className="group">
                  <td>
                    <Checkbox
                      checked={selectedIds.includes(product._id)}
                      onChange={() => toggleItem(product._id)}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[6px] border border-gray-200 overflow-hidden bg-white p-1   ring-1 ring-gray-100">
                        <img src={product.productImage} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#121212] leading-tight group-hover:text-brand-gold transition-colors">{product.name}</span>
                        <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">ID: {product._id.slice(-6)}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm font-bold text-gray-500">{product.category?.name || "Uncategorized"}</span>
                  </td>
                  <td>
                    <span className="text-sm font-black text-brand-gold">₦{product.price.toLocaleString()}</span>
                  </td>
                  <td>
                    <Tooltip text={product.status === "Published" ? "Unpublish Product" : "Publish Product"} position="top">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold transition-all hover:ring-2 hover:ring-offset-1 group relative overflow-hidden min-w-[100px] flex items-center justify-center gap-2
                          ${product.status === "Published"
                            ? "text-emerald-500 bg-emerald-50/50 hover:bg-rose-500 hover:text-white"
                            : "text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white"
                          }`}
                      >
                        <LuZap size={14} className={product.status === "Published" ? "text-emerald-500 group-hover:text-white" : ""} />
                        <span className="group-hover:hidden">
                          {product.status === "Published" ? "Published" : "Publish Now"}
                        </span>
                        <span className="hidden group-hover:inline">
                          {product.status === "Published" ? "Unpublish" : "Go Live"}
                        </span>
                      </button>
                    </Tooltip>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Tooltip text="Full Edit" position="top">
                        <Link href={`/products/${product._id}`}>
                          <Button shape="rounded-sm" variant="outline"
                            className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-charcoal hover:border-brand-charcoal transition-all"
                          >
                            <HiPencil size={18} />
                          </Button>
                        </Link>
                      </Tooltip>

                      <Tooltip text="Quick Edit" position="top">
                        <Button shape="rounded-sm" variant="outline"
                          className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
                          onClick={() => {
                            setProductToEdit(product);
                            setIsEditDrawerOpen(true);
                          }}
                        >
                          <Icon name="settings" folder="dashboardIcon" size="sm" />
                        </Button>
                      </Tooltip>

                      <Button shape="rounded-sm" variant="outline"
                        className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
                        title="Delete Draft"
                        onClick={() => {
                          setProductToDelete(product);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Icon name="Delete" folder="dashboardIcon" size="sm" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <EditProductDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        product={productToEdit}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Draft"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This draft will be permanently removed.`}
        confirmText="Yes, delete draft"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
