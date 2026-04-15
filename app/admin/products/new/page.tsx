"use client";

import React, { useState } from "react";
import { Icon } from "../../../components/Icon";
import { Button } from "../../../components/Button";
import { Select } from "../../../components/Form/Select";
import { Switch } from "../../../components/Form/Switch";
import { Input, Textarea } from "../../../components/Form/Inputs";
import { ConfirmationModal } from "../../../components/Admin/ConfirmationModal";
import Modal from "../../../components/Modal/Modal";
import ModalBody from "../../../components/Modal/ModalBody";
import ModalFooter from "../../../components/Modal/ModalFooter";
import { useRouter } from "next/navigation";
import { UploadMediaModal } from "../../../components/Admin/UploadMediaModal";
import { HiPhoto, HiArrowPath } from "react-icons/hi2";

export default function CreateProduct() {
  const router = useRouter();
  const [stockStatus, setStockStatus] = useState("In Stock");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);
  const [isPublishSuccessOpen, setIsPublishSuccessOpen] = useState(false);
  const [isDraftConfirmOpen, setIsDraftConfirmOpen] = useState(false);
  const [isDraftSuccessOpen, setIsDraftSuccessOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Top Header / Action Bar */}
      <div className="flex flex-col xl:flex-row justify-end items-start xl:items-center gap-4">

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <Input
            type="text"
            placeholder="Search product for add"
            containerClassName="flex-1 xl:w-96"
            className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
            suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
          />

          <div className="flex gap-2">
            <Button
              variant="primary"
              shape="rounded-sm"
              size="md"
              onClick={() => setIsPublishConfirmOpen(true)}
            >
              Publish Product
            </Button>
            <Button
              variant="outline"
              shape="rounded-sm"
              size="md"
              iconLeft={<Icon name="ticket" folder="dashboardIcon" size="xs" className="opacity-70" />}
              onClick={() => setIsDraftConfirmOpen(true)}
            >
              Save to draft
            </Button>
            <Button
              variant="outline"
              shape="rounded-sm"
              className="px-2"
              onClick={() => setIsResetConfirmOpen(true)}
            >
              <Icon name="circle-plus" folder="dashboardIcon" size="sm" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Column (Main Details) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Basic Details */}
          <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-base font-bold text-[#1D3557]">Basic Details</h3>

            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-[#1D3557]">Product Name</label>
              <Input
                type="text"
                defaultValue="iPhone 15"
                className="bg-gray-50/80 border-gray-50 text-sm font-medium text-gray-700"
              />
            </div>

            <div className="flex flex-col gap-2.5 relative">
              <label className="text-xs font-bold text-[#1D3557]">Product Description</label>
              <div className="relative group">
                <Textarea
                  rows={6}
                  defaultValue="The iPhone 15 delivers cutting-edge performance with the A16 Bionic chip, an immersive Super Retina XDR display, advanced dual-camera system, and exceptional battery life, all encased in stunning aerospace-grade aluminum."
                  className="bg-gray-50/80 border-gray-50 text-sm font-medium text-gray-700 resize-none leading-relaxed"
                />
                <div className="absolute bottom-4 right-4 flex gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-gray-100 rounded-[6px]"><Icon name="settings" folder="dashboardIcon" size="xs" /></button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-[6px]"><Icon name="star" folder="dashboardIcon" size="xs" /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-base font-bold text-[#1D3557]">Pricing</h3>

            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-[#1D3557]">Product Price</label>
              <Input
                type="text"
                defaultValue="$999.89"
                className="bg-gray-50/80 border-gray-50 text-sm font-bold text-gray-900"
                suffixElement={
                  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-[6px] cursor-pointer shadow-sm">
                    <img src="/dashboardIcon/usa.svg" alt="USA" className="w-5 h-3 object-cover rounded-[1px]" />
                    <Icon name="material-symbols_arrow-downward-rounded" folder="dashboardIcon" size="xs" className="text-gray-400" />
                  </div>
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-gray-400">Discounted Price <span className="text-gray-300 font-medium">(Optional)</span></label>
                <div className="bg-gray-50/80 border border-gray-50 rounded-[6px] px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400">$</span>
                    <span className="text-sm font-bold text-gray-900">99</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 italic">Sale= $900.89</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-[#1D3557]">Tax Included</label>
                <div className="flex items-center gap-6 py-3">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border-2 border-brand-blue flex items-center justify-center p-0.5">
                      <div className="w-full h-full bg-brand-blue rounded-full"></div>
                    </div>
                    <span className="text-xs font-bold text-[#1D3557]">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border border-gray-200 group-hover:border-gray-300"></div>
                    <span className="text-xs font-bold text-gray-400">No</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-[#1D3557]">Expiration</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  placeholder="Start"
                  className="bg-gray-50/80 border-gray-50 text-xs font-bold text-gray-400"
                  suffixElement={<Icon name="ticket" folder="dashboardIcon" size="xs" className="text-gray-300 mr-1" />}
                />
                <Input
                  type="text"
                  placeholder="End"
                  className="bg-gray-50/80 border-gray-50 text-xs font-bold text-gray-400"
                  suffixElement={<Icon name="ticket" folder="dashboardIcon" size="xs" className="text-gray-300 mr-1" />}
                />
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-sm font-bold text-[#1D3557]">Inventory</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-[#1D3557]">Stock Quantity</label>
                <Input
                  type="text"
                  defaultValue="Unlimited"
                  className="bg-gray-50/80 border-gray-50 text-sm font-bold text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-[#1D3557]">Stock Status</label>
                <Select
                  value={stockStatus}
                  onChange={(val) => setStockStatus(val as string)}
                  options={[
                    { label: "In Stock", value: "In Stock" },
                    { label: "Out of Stock", value: "Out of Stock" },
                  ]}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center justify-between w-full max-w-[200px]">
                <Switch checked={true} readOnly label={<span className="text-xs font-bold text-gray-900">Unlimited</span>} />
              </div>

              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div className="w-4 h-4 rounded-[3px] border border-blue-500 bg-blue-500 flex items-center justify-center">
                  <Icon name="Delivered" folder="dashboardIcon" size="xs" className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-400 underline underline-offset-4 decoration-gray-200">Highlight this product in a featured section.</span>
              </label>
            </div>

            <div className="flex gap-3 justify-end mt-4 pt-6 border-t border-gray-50">
              <button
                type="button"
                className="bg-white border border-gray-100 text-[#1D3557] px-6 py-2.5 rounded-[6px] text-xs font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
                onClick={() => setIsDraftConfirmOpen(true)}
              >
                <Icon name="ticket" folder="dashboardIcon" size="xs" className="opacity-70" />
                Save to draft
              </button>
              <Button
                variant="primary"
                shape="rounded-sm"
                className="px-8 py-2.5"
                onClick={() => setIsPublishConfirmOpen(true)}
              >
                Publish Product
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column (Media & Meta) */}
        <div className="flex flex-col gap-6">
          {/* Upload Media */}
          <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-base font-bold text-[#1D3557]">Upload Product Image</h3>

            <div className="flex flex-col gap-4">
              <label className="text-xs font-bold text-[#1D3557]">Product Image</label>
              <div className="relative aspect-square w-full rounded-[6px] bg-gray-50/50 border border-gray-100 overflow-hidden group">
                <img src="/dashboardImage/Frame 4259 copy.png" alt="Preview" className="w-full h-full object-contain p-8" />

                <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2">
                  <Button
                    variant="outline"
                    shape="rounded-sm"
                    className="bg-white/90 backdrop-blur-sm shadow-sm py-2 px-6 text-[10px]"
                    iconLeft={<HiPhoto />}
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    Browse
                  </Button>
                  <Button
                    variant="outline"
                    shape="rounded-sm"
                    className="bg-white/90 backdrop-blur-sm shadow-sm py-2 px-6 text-[10px]"
                    iconLeft={<HiArrowPath />}
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    Replace
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="relative aspect-square rounded-[6px] border border-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-100">
                  <img src="/dashboardImage/Frame 4259 copy.png" alt="Thumb" className="w-full h-full object-contain p-2" />
                  <button className="absolute top-1 right-1 w-4 h-4 bg-white/80 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500">
                    <Icon name="menu-close" folder="dashboardIcon" size="xs" />
                  </button>
                </div>
                <div className="relative aspect-square rounded-[6px] border border-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-100">
                  <img src="/dashboardImage/Frame 4259 copy.png" alt="Thumb" className="w-full h-full object-contain p-2 opacity-60" />
                  <button className="absolute top-1 right-1 w-4 h-4 bg-white/80 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500">
                    <Icon name="menu-close" folder="dashboardIcon" size="xs" />
                  </button>
                </div>
                <div
                  className="aspect-square border-2 border-dashed border-blue-200 rounded-[6px] flex flex-col items-center justify-center gap-2 bg-brand-blue-light hover:bg-brand-blue-light transition-all cursor-pointer group"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                    <Icon name="circle-plus" folder="dashboardIcon" size="xs" />
                  </div>
                  <span className="text-[10px] font-bold text-[#2196F3]">Add Image</span>
                </div>
              </div>
            </div>
          </div>

          {/* Categorization */}
          <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-base font-bold text-[#1D3557]">Categories</h3>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <label className="text-[11px] font-bold text-[#1D3557]">Product Categories</label>
                <Select
                  value={category}
                  onChange={(val) => setCategory(val as string)}
                  placeholder="Select your product"
                  options={[
                    { label: "Electronics", value: "Electronics" },
                    { label: "Smartphone", value: "Smartphone" },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-[11px] font-bold text-[#1D3557]">Product Tag</label>
                <Select
                  value={tag}
                  onChange={(val) => setTag(val as string)}
                  placeholder="Select your product"
                  options={[
                    { label: "New Arrival", value: "New Arrival" },
                    { label: "Best Seller", value: "Best Seller" },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-[11px] font-bold text-[#1D3557]">Select your color</label>
                <div className="flex flex-wrap gap-3">
                  {["#D2E8C4", "#EAC7CC", "#D3DBE0", "#E8E5CB", "#3D4144"].map((color, i) => (
                    <button
                      key={i}
                      style={{ backgroundColor: color }}
                      className="w-10 h-10 rounded-[6px] shadow-inner border border-black/5 hover:scale-110 transition-transform"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isPublishConfirmOpen}
        onClose={() => setIsPublishConfirmOpen(false)}
        onConfirm={() => {
          setIsPublishConfirmOpen(false);
          setIsPublishSuccessOpen(true);
        }}
        title="Confirm Publication"
        message="Are you sure you want to publish this product? It will be immediately visible to all customers on the storefront."
        confirmText="Yes, publish now"
        type="success"
      />

      <ConfirmationModal
        isOpen={isDraftConfirmOpen}
        onClose={() => setIsDraftConfirmOpen(false)}
        onConfirm={() => {
          setIsDraftConfirmOpen(false);
          setIsDraftSuccessOpen(true);
        }}
        title="Save as Draft"
        message="Are you sure you want to save this product as a draft? It will be stored in your catalog but hidden from the storefront."
        confirmText="Yes, save draft"
        type="info"
      />

      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          console.log("Resetting form...");
          setIsResetConfirmOpen(false);
        }}
        title="Reset Form"
        message="Are you sure you want to clear all fields and start a new product entry? This action will discard your current progress."
        confirmText="Yes, start over"
        type="warning"
      />

      <Modal
        isOpen={isPublishSuccessOpen}
        onClose={() => setIsPublishSuccessOpen(false)}
        title=""
        size="md"
      >
        <ModalBody className="flex flex-col items-center text-center py-10 gap-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 shadow-inner">
            <Icon name="task_alt" folder="icon" size="lg" className="w-10 h-10" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black text-[#1D3557]">Product Published!</h2>
            <p className="text-sm font-medium text-gray-400 max-w-[280px] mx-auto leading-relaxed">
              Your new product has been successfully uploaded and is now live on the storefront.
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col gap-3 pb-8">
          <Button
            variant="primary"
            className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
            onClick={() => {
              setIsPublishSuccessOpen(false);
              router.push("/admin/products");
            }}
          >
            Done, back to products
          </Button>
          <Button
            variant="ghost"
            className="w-full h-12 text-[11px] font-bold text-gray-400"
            onClick={() => setIsPublishSuccessOpen(false)}
          >
            View live product
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={isDraftSuccessOpen}
        onClose={() => setIsDraftSuccessOpen(false)}
        title=""
        size="md"
      >
        <ModalBody className="flex flex-col items-center text-center py-10 gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue shadow-inner border border-blue-100">
            <Icon name="drafts" folder="icon" size="lg" className="w-10 h-10" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black text-[#1D3557]">Saved to Drafts</h2>
            <p className="text-sm font-medium text-gray-400 max-w-[280px] mx-auto leading-relaxed">
              The product has been securely stored. You can find it in the "Draft" tab of the product listing.
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col gap-3 pb-8">
          <Button
            variant="primary"
            className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
            onClick={() => {
              setIsDraftSuccessOpen(false);
              router.push("/admin/products");
            }}
          >
            Back to catalog
          </Button>
          <Button
            variant="ghost"
            className="w-full h-12 text-[11px] font-bold text-gray-400"
            onClick={() => setIsDraftSuccessOpen(false)}
          >
            Continue editing
          </Button>
        </ModalFooter>
      </Modal>

      <UploadMediaModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
