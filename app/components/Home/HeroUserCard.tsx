"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { useAuthModal } from "@/app/context/AuthModalContext";

const HeroUserCard = () => {
  const { openLogin, openRegister } = useAuthModal();

  return (
    <div className="hidden md:flex w-full xl:w-64 flex-col gap-2.5 px-4 pb-4 md:p-0">
      {/* Profile Card */}
      <div className="bg-[#E3F0FF] p-5 flex md:flex-col gap-3 items-center md:items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-blue-100 flex items-center justify-center">
            <Image src="/avatars/avatar=pic1.jpg" alt="User" width={48} height={48} />
          </div>
          <div className="text-sm text-gray-900 leading-tight font-medium">
            Hi, user <br />let’s get started
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col gap-2">
          <Button onClick={openRegister} size="sm" className="w-full bg-brand-gold text-white hover:bg-brand-gold/90 border-none transition-colors cursor-pointer">Join now</Button>
          <Button onClick={openLogin} variant="ghost" size="sm" className="w-full bg-white text-brand-gold border-none hover:bg-gray-50 transition-colors cursor-pointer">Log in</Button>
        </div>
      </div>

      {/* Promo Cards */}
      <div className="flex flex-col gap-2.5">
        <div className="bg-[#F38332] p-4 pr-12 text-white transition-shadow cursor-pointer">
          <p className="text-sm font-normal">Get ₦5,000 off with a new supplier</p>
        </div>
        <div className="bg-[#55BDC3] p-4 pr-12 text-white transition-shadow cursor-pointer">
          <p className="text-sm font-normal">Send quotes with supplier preferences</p>
        </div>
      </div>
    </div>
  );
};

export { HeroUserCard };
