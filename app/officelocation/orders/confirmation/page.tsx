"use client";

import { GoBackButton } from "../../../components/go-back-button";
import { IoCheckmark, IoDownloadOutline } from "react-icons/io5";
import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-[1000px]">
        {/* Go Back */}
        <div className="mb-20">
          <GoBackButton href="/customer" />
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          {/* Success Icon */}
          <div className="mb-8 flex h-[160px] w-[160px] items-center justify-center rounded-full bg-[#F2F8FF]">
            <IoCheckmark className="text-[80px] text-[#156BB6]" />
          </div>

          {/* Title */}
          <h1 className="mb-4 font-work text-[32px] font-medium text-[#1F1F1F]">
            Done
          </h1>

          {/* Message */}
          <p className="mb-2 max-w-md font-work text-base text-[#808080]">
            Thanks for shopping! Your order will be delivered to your address
          </p>

          {/* Address Link */}
          <Link
            href="#"
            className="mb-12 font-work text-base text-[#156BB6] underline decoration-[#156BB6] underline-offset-4"
          >
            20 Peace Avenue Ikeja Opebi
          </Link>

          {/* Download Receipt */}
          <button className="flex items-center gap-2 rounded-full border border-[#F4F4F4] px-6 py-3 text-[#808080] transition-colors hover:border-[#156BB6] hover:text-[#156BB6]">
            <IoDownloadOutline size={20} />
            <span className="font-work text-sm">Download Reciept</span>
          </button>
        </div>
      </div>
    </div>
  );
}
