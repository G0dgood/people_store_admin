"use client";

import React from "react";
import { Modal, ModalBody } from "@/app/components/Modal";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { toast } from "sonner";
import { HiOutlineClipboard, HiOutlineShare } from "react-icons/hi2";

interface BusinessLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessLink: string;
  officeName?: string;
}

export function BusinessLinkModal({
  isOpen,
  onClose,
  businessLink,
  officeName,
}: BusinessLinkModalProps) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(businessLink);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={officeName ? `Share Office Link - ${officeName}` : "Your Business Link"}
      size="md"
    >
      <ModalBody className="flex flex-col gap-8 py-6">
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <HiOutlineShare className="text-brand-gold" />
            Office Landing Page URL
          </span>
          
          <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100 group transition-all hover:border-brand-gold/30">
            {businessLink === "No subdomain set" ? (
              <div className="flex-1 px-4 py-3 text-sm font-bold text-rose-500 bg-rose-50/50 rounded-lg flex items-center gap-2">
                <Icon name="warning" size="sm" />
                Missing Subdomain
              </div>
            ) : (
              <input
                type="text"
                readOnly
                value={businessLink}
                className="flex-1 bg-transparent px-4 py-3 text-sm font-bold text-gray-700 outline-none truncate"
              />
            )}
            <Button
              shape="rounded-sm"
              variant="primary"
              className="px-6 h-10 shadow-lg shadow-brand-gold/10"
              onClick={handleCopyLink}
              disabled={businessLink === "No subdomain set"}
              iconLeft={<HiOutlineClipboard size={16} />}
            >
              Copy
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 font-medium italic">
            {businessLink === "No subdomain set" 
              ? "Please edit this office location and set a subdomain to generate a shareable link." 
              : `This link points directly to the ${officeName || "office"}'s specialized landing page on your storefront.`}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Or share via social channels</span>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {[
              { icon: "instagram", label: "Instagram", folder: "icon/social" },
              { icon: "twitter", label: "X (Twitter)", folder: "icon/social" },
              { icon: "facebook", label: "Facebook", folder: "icon/social" },
              { icon: "whatsapp", label: "WhatsApp", folder: "icon/social" },
              { icon: "linkedin", label: "LinkedIn", folder: "icon/social" },
              { icon: "youtube", label: "YouTube", folder: "icon/social" },
            ].map((social) => (
              <button
                key={social.label}
                type="button"
                className="flex flex-col items-center gap-2 group"
                title={social.label}
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center transition-all group-hover:border-brand-gold group-hover:shadow-xl group-hover:shadow-brand-gold/5 group-hover:-translate-y-1">
                  <Icon name={social.icon} folder={social.folder as any} size="md" />
                </div>
                <span className="text-[9px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors uppercase tracking-tighter">
                  {social.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
