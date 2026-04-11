"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/Button";

const categories = [
  "Automobiles", "Clothes and wear", "Home interiors",
  "Computer and tech", "Tools, equipments", "Sports and outdoor",
  "Animal and pets", "Machinery tools", "More category"
];

const HeroSection = () => {
  return (
    <section className="w-full bg-white border border-gray-200 rounded-lg p-0 md:p-5 flex flex-col lg:flex-row gap-5 overflow-hidden shadow-sm">
      {/* Sidebar - Desktop Only */}
      <div className="w-64 flex flex-col gap-1 hidden lg:flex">
        {categories.map((cat, idx) => (
          <Button
            key={idx}
            variant="ghost"
            className={`justify-start px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer border-none font-normal
              ${idx === 1 ? "bg-[#E5F1FF] font-black text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Banner */}
      <div className="flex-1 relative md:rounded-md overflow-hidden min-h-[250px] md:min-h-[400px]">
        <Image
          src="/web_images/Mask group.png"
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-center gap-4 md:gap-6 bg-black/5">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-3xl font-normal text-gray-900">Latest trending</h2>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Electronic items</h1>
          </div>
          <Link href="/products">
            <Button 
              variant="ghost" 
              className="w-fit bg-white text-gray-900 hover:bg-gray-100 font-bold border-none shadow-md px-6 h-10 md:h-11"
            >
              Learn more
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export { HeroSection };
