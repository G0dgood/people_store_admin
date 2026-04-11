"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/app/components/Button";

const HeroUserCard = () => {
  return (
    <div className="hidden md:flex w-full xl:w-64 flex-col gap-2.5 px-4 pb-4 md:p-0">
      {/* Profile Card */}
      <div className="bg-[#E3F0FF] p-5 rounded-lg flex md:flex-col gap-3 items-center md:items-start shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-blue-100 flex items-center justify-center">
            <Image src="/avatars/avatar=pic1.jpg" alt="User" width={48} height={48} />
          </div>
          <p className="text-sm text-gray-900 leading-tight font-medium">
            Hi, user <br />let’s get started
          </p>
        </div>
        <div className="flex-1 w-full flex flex-col gap-2">
          <Button size="sm" className="w-full bg-brand-blue text-white hover:bg-brand-blue/90 border-none transition-colors">Join now</Button>
          <Button variant="ghost" size="sm" className="w-full bg-white text-brand-blue border-none shadow-sm hover:bg-gray-50 transition-colors">Log in</Button>
        </div>
      </div>

      {/* Promo Cards */}
      <div className="flex flex-col gap-2.5">
        <div className="bg-[#F38332] p-4 pr-12 rounded-lg text-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-sm font-normal">Get US $10 off with a new supplier</p>
        </div>
        <div className="bg-[#55BDC3] p-4 pr-12 rounded-lg text-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-sm font-normal">Send quotes with supplier preferences</p>
        </div>
      </div>
    </div>
  );
};

export { HeroUserCard };
