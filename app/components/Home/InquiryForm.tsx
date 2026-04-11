"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { Input, Textarea } from "@/app/components/Form";
import { Icon } from "@/app/components/Icon";

const InquiryForm = () => {
  return (
    <section className="w-full relative rounded-lg overflow-hidden min-h-[420px] shadow-sm">
      <Image 
        src="/web_images/Mask_group_two.png" 
        alt="Inquiry BG" 
        fill 
        className="object-cover" 
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2C7CF1] to-[#00d1ff]/50 mix-blend-multiply opacity-90"></div>
      
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="max-w-md text-white flex flex-col gap-4 z-10">
          <h2 className="text-2xl md:text-4xl font-bold leading-tight drop-shadow-md">
            An easy way to send requests to all suppliers
          </h2>
          <p className="text-sm opacity-90 hidden md:block leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="w-full max-w-[490px] bg-white p-6 md:p-8 rounded-lg shadow-2xl flex flex-col gap-5 z-10 border border-blue-50/50">
          <h3 className="text-xl font-bold text-gray-900">Send quote to suppliers</h3>
          <Input placeholder="What item you need?" className="h-10" />
          <Textarea placeholder="Type more details" rows={3} />
          <div className="flex gap-4">
            <Input placeholder="Quantity" className="w-full md:w-32 h-10" />
            <div className="w-full md:w-28 flex items-center justify-between px-3 border border-gray-300 rounded-lg bg-white cursor-pointer h-10 hover:border-brand-blue transition-colors">
              <span className="text-sm text-gray-400">Pcs</span>
              <Icon name="expand_more" size="xs" className="text-gray-400" />
            </div>
          </div>
          <Button className="w-fit bg-brand-blue text-white px-8 h-10 hover:bg-brand-blue/90 shadow-lg active:scale-95 transition-all">
            Send inquiry
          </Button>
        </div>
      </div>
    </section>
  );
};

export { InquiryForm };
