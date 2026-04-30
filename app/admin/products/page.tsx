"use client";

import React, { useState, useEffect } from "react";
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
import { ViewProductModal } from "../../components/Admin/ViewProductModal";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { toast } from "sonner";
import { NoRecordFound, SVGLoaderFetch } from "@/app/components/Options";
import { Tooltip } from "../../components/Tooltip";
import { HiArrowPath, HiOutlineEye } from "react-icons/hi2";

import { StockAdjustmentDrawer } from "../../components/Admin/StockAdjustmentDrawer";
import { useAddProductMutation, useGetProductsQuery, useDeleteProductMutation, useUpdateProductMutation, Product } from "@/lib/redux/services/productApi";
import { LuCopy, LuPackageSearch, LuZap } from "react-icons/lu";
import { HiPencil } from "react-icons/hi2";
import { usePrivilege } from "@/lib/contexts/PrivilegeContext";
import { useApiError } from "../../hooks/useApiError";

const statusStyles = {
  Published: "text-emerald-500 bg-emerald-50/50",
  Draft: "text-gray-400 bg-gray-50",
  "Out of Stock": "text-rose-500 bg-rose-50/50",
  "Low Stock": "text-amber-500 bg-amber-50/50",
};

export default function ProductListing() {
  const { data: response, isLoading, refetch, isFetching } = useGetProductsQuery();
  const products = response?.data?.products || [];

  const [deleteProduct, { isLoading: isDeleting, isError: isDeleteError, error: deleteError }] = useDeleteProductMutation();
  const [addProduct, { isLoading: isDuplicating, isError: isAddError, error: addError }] = useAddProductMutation();
  const [updateProduct, { isError: isUpdateError, error: updateError }] = useUpdateProductMutation();

  useApiError(isDeleteError, deleteError, "Failed to delete product");
  useApiError(isAddError, addError, "Failed to duplicate product");
  useApiError(isUpdateError, updateError, "Failed to update product");
  const { canAccess } = usePrivilege();

  const [activeTab, setActiveTab] = useState("Published");
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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProductForView, setSelectedProductForView] = useState<Product | null>(null);
  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [productForStatusToggle, setProductForStatusToggle] = useState<Product | null>(null);

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

  const handleDuplicateAsDraft = async (product: Product) => {
    try {
      const formData = new FormData();
      formData.append("name", `${product?.name || "Product"} (Copy)`);
      formData.append("description", product?.description || "");
      formData.append("price", (product?.price || 0).toString());
      formData.append("category", product?.category?._id || "");
      if (product?.brand) {
        formData.append("brand", typeof product.brand === 'object' ? product.brand._id : product.brand);
      }
      formData.append("stock", "0");
      formData.append("status", "Draft");

      if (product.productImage) {
        try {
          const response = await fetch(product.productImage);
          const blob = await response.blob();
          const file = new File([blob], "product-image.jpg", { type: blob.type });
          formData.append("media", file);
        } catch (imageErr) {
          console.error("Failed to fetch image for duplication:", imageErr);
        }
      }

      await addProduct(formData).unwrap();
      toast.success("Product duplicated as draft!");
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleToggleStatus = async () => {
    if (!productForStatusToggle) return;
    try {
      const newStatus = productForStatusToggle.status === "Published" ? "Draft" : "Published";
      await updateProduct({
        productId: productForStatusToggle._id,
        data: { status: newStatus as any }
      }).unwrap();
      toast.success(`Product marked as ${newStatus}`);
      setIsStatusConfirmOpen(false);
      setProductForStatusToggle(null);
    } catch (err) {
      // Error handled by hook
    }
  };

  // ... existing filter logic ...
  const filteredProducts = products.filter((product: Product) => {
    if (!product) return false;
    const matchesSearch = (product.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "All products") return true;
    if (activeTab === "Low Stock") return product.stock > 0 && product.stock < 10;
    if (activeTab === "Draft") return product.status === "Draft";
    return product.status === activeTab;
  });

  // ... existing pagination logic ...
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage);

  // Sync pagination reset on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, rowsPerPage]);

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete._id).unwrap();
      toast.success("Product deleted successfully");
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => deleteProduct(id).unwrap()));
      toast.success(`${selectedIds.length} products deleted successfully`);
      setSelectedIds([]);
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Some products failed to delete");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="bg-white p-6 rounded-[6px] border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Products</span>
            <span className="text-2xl font-black text-[#1D3557]">{products.length}</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-[6px] text-brand-gold">
            <LuPackageSearch size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[6px] border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Products</span>
            <span className="text-2xl font-black text-emerald-600">{products.filter(p => p.status === "Published").length}</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-[6px] text-emerald-500">
            <LuZap size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[6px] border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Drafts</span>
            <span className="text-2xl font-black text-amber-600">{products.filter(p => p.status === "Draft").length}</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-[6px] text-amber-500">
            <LuCopy size={24} />
          </div>
        </div>
      </div>

      {/* Header Area */}
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
          <Tooltip text="Refresh Product List">
            <Button shape="rounded-sm" variant="outline"
              className="border-gray-200 text-gray-500 group"
              iconLeft={<HiArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </Tooltip>
          {canAccess("products", "create") && (
            <Link href="/admin/products/new">
              <Button shape="rounded-sm" variant="primary"
                iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
                className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
              >
                Add New Product
              </Button>
            </Link>
          )}
          <Button shape="rounded-sm" variant="outline"
            iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            onClick={() => setIsMoreActionsOpen(true)}
          >
            More Action
          </Button>
        </div>
      </div>

      <div className="bg-white overflow-hidden flex flex-col border border-[#1C1C1C1A] rounded-[6px]">
        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All products", "Published", "Draft", "Low Stock"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input shape="rounded-sm"
              type="text"
              placeholder="Search product name, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              containerClassName="flex-1 xl:w-96"
              className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

            <div className="flex gap-2">
              <Button shape="rounded-sm" variant="outline"
                className="!p-2.5 text-gray-400">
                <Icon name="sort" folder="dashboardIcon" size="sm" />
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
                    onChange={() => toggleAll(filteredProducts)}
                  />
                </th>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <SVGLoaderFetch colSpan={7} text={""} />
              ) : filteredProducts?.length === 0 ? (
                <NoRecordFound colSpan={7} />
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
                      <div className="w-12 h-12 rounded-[6px] border border-gray-200 overflow-hidden bg-white p-1 shadow-sm ring-1 ring-gray-100">
                        <img src={product?.productImage} alt={product?.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1D3557] leading-tight group-hover:text-brand-gold transition-colors">{product?.name}</span>
                        <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">ID: {product?._id?.slice(-6) || "N/A"}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm font-bold text-gray-500">{product?.category?.name || "Uncategorized"}</span>
                  </td>
                  <td>
                    <span className="text-xs font-bold text-brand-gold bg-brand-gold/5 px-2 py-1 rounded-[4px]">
                      {(product?.brand as any)?.name || "Independent"}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm font-black text-brand-gold">₦{product?.price?.toLocaleString() || "0"}</span>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1 whitespace-nowrap">
                      <span className={`text-sm font-bold ${product?.stock === 0 ? "text-rose-500" : "text-gray-700"}`}>
                        {product?.stock || 0} units
                      </span>
                    </div>
                  </td>
                  <td>
                    <Tooltip text={product.status === "Published" ? "Unpublish Product" : "Publish Product"} position="top">
                      <button
                        onClick={() => {
                          setProductForStatusToggle(product);
                          setIsStatusConfirmOpen(true);
                        }}
                        className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold transition-all hover:ring-2 hover:ring-offset-1 group relative overflow-hidden min-w-[80px]
                  ${product.status === "Published"
                            ? "text-emerald-500 bg-emerald-50/50 hover:bg-rose-500 hover:text-white"
                            : "text-gray-400 bg-gray-50 hover:bg-emerald-500 hover:text-white"
                          }`}
                      >
                        <span className="group-hover:hidden">{product.status}</span>
                        <span className="hidden group-hover:inline">
                          {product.status === "Published" ? "Unpublish" : "Publish"}
                        </span>
                      </button>
                    </Tooltip>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Tooltip text="View Details" position="top">
                        <Button shape="rounded-sm" variant="outline"
                          className="!p-1.5 text-gray-400 hover:text-white hover:bg-blue-500 hover:border-blue-500 transition-all"
                          onClick={() => {
                            setSelectedProductForView(product);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <HiOutlineEye size={18} />
                        </Button>
                      </Tooltip>
                      <Tooltip text="Adjust Stock" position="top">
                        <Button shape="rounded-sm" variant="outline"
                          className="!p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 hover:border-emerald-100 transition-all"
                          onClick={() => {
                            setProductForStock(product);
                            setIsStockDrawerOpen(true);
                          }}
                        >
                          <LuPackageSearch size={18} />
                        </Button>
                      </Tooltip>

                      <Tooltip text="Duplicate as Draft" position="top">
                        <Button shape="rounded-sm" variant="outline"
                          className="!p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-100 transition-all"
                          onClick={() => handleDuplicateAsDraft(product)}
                        >
                          <LuCopy size={18} />
                        </Button>
                      </Tooltip>

                      {canAccess("products", "edit") && (
                        <Tooltip text="Full Edit" position="top">
                          <Link href={`/admin/products/${product._id}`}>
                            <Button shape="rounded-sm" variant="outline"
                              className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-charcoal hover:border-brand-charcoal transition-all"
                            >
                              <HiPencil size={18} />
                            </Button>
                          </Link>
                        </Tooltip>
                      )}

                      {canAccess("products", "edit") && (
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
                      )}

                      {canAccess("products", "delete") && (
                        <Tooltip text="Delete Product" position="top">
                          <Button shape="rounded-sm" variant="outline"
                            className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
                            onClick={() => {
                              setProductToDelete(product);
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

      <StockAdjustmentDrawer
        isOpen={isStockDrawerOpen}
        onClose={() => setIsStockDrawerOpen(false)}
        product={productForStock}
      />

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
            onClick: handleBulkDelete,
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
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={productToDelete ? handleDelete : handleBulkDelete}
        title={productToDelete ? "Delete Product" : "Delete Multiple Products"}
        message={
          productToDelete
            ? `Are you sure you want to delete "${productToDelete.name}"? This action will permanently remove it from the catalog and storefront.`
            : `Are you sure you want to delete ${selectedIds.length} selected products? This action cannot be undone.`
        }
        confirmText={productToDelete ? "Yes, delete product" : "Yes, delete all selected"}
        type="danger"
        isLoading={isDeleting}
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

      <ConfirmationModal
        isOpen={isStatusConfirmOpen}
        onClose={() => {
          setIsStatusConfirmOpen(false);
          setProductForStatusToggle(null);
        }}
        onConfirm={handleToggleStatus}
        title={productForStatusToggle?.status === "Published" ? "Unpublish Product" : "Publish Product"}
        message={
          productForStatusToggle?.status === "Published"
            ? `Are you sure you want to unpublish "${productForStatusToggle?.name}"? It will be hidden from the storefront boutique.`
            : `Are you sure you want to publish "${productForStatusToggle?.name}"? It will become visible and available for purchase on the storefront.`
        }
        confirmText={productForStatusToggle?.status === "Published" ? "Yes, unpublish" : "Yes, publish"}
        type={productForStatusToggle?.status === "Published" ? "danger" : "success"}
      />
      <ViewProductModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedProductForView(null);
        }}
        product={selectedProductForView}
      />
    </div>
  );
}
