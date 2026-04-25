"use client";

import React from "react";
import Modal from "./Modal";
import { Button } from "../Button";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  const handleAccept = () => {
    if (onAccept) onAccept();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Terms and Conditions"
    >
      <div className="flex flex-col gap-6 py-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
        <section className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-gray-900">1. Introduction</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            Welcome to Store. By accessing or using our website, you agree to be bound by these terms and conditions and our privacy policy. If you do not agree with any part of these terms, you must not use our services.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-gray-900">2. User Accounts</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            To access certain features of the site, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-gray-900">3. Intellectual Property</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            All content on this site, including text, graphics, logos, and images, is the property of Store and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-gray-900">4. Limitation of Liability</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            Store shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services. This includes, but is not limited to, damages for loss of profits, data, or other intangible losses.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-gray-900">5. Governing Law</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Store operates, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-gray-900">6. Changes to Terms</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            We reserve the right to modify these terms at any time. Any changes will be effective immediately upon posting on the website. Your continued use of the site after changes are posted constitutes your acceptance of the modified terms.
          </p>
        </section>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          shape="rounded-sm"
          className="w-full md:w-auto px-8 h-11 font-bold"
          onClick={handleAccept}
        >
          I Understand
        </Button>
      </div>
    </Modal>
  );
};
