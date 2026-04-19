"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../Button";

const DiscountBanner = () => {
  return (
    <div className="w-full h-28 border border-gray-200 flex items-center justify-between overflow-hidden relative px-8">
       <Image 
         src="/web_images/twocolor_background.png" 
         alt="Discount Background" 
         fill 
         className="object-cover" 
       />
       
       <div className="flex flex-col gap-2 z-10">
          <h3 className="text-xl font-bold leading-tight text-white">Super discounts on more than 100 items</h3>
          <p className="text-sm text-white opacity-80">Have you ever finally just write dummy text</p>
       </div>

       <Button 
         variant="ghost" 
         className="text-white font-bold h-11 px-8 hover:opacity-90 transition-all z-10 cursor-pointer"
         style={{ backgroundColor: "#FF9017" }}
       >
          Shop now
       </Button>
    </div>
  );
};

export { DiscountBanner };
