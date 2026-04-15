"use client";

import React, { useState } from "react";
import { Icon } from "../../../components/Icon";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Form/Inputs";
import { TabFilter } from "../../../components/Admin/TabFilter";
import { Pagination } from "../../../components/Admin/Pagination";

const mediaData = [
  { id: 1, name: "Product_Hero_01.png", size: "1.2 MB", date: "Oct 12, 2023", type: "image", url: "/dashboardImage/Electronics.png" },
  { id: 2, name: "Summer_Collection_Banner.jpg", size: "2.5 MB", date: "Oct 10, 2023", type: "image", url: "/dashboardImage/Fashion.png" },
  { id: 3, name: "iPhone15_Promo_Video.mp4", size: "45.8 MB", date: "Oct 08, 2023", type: "video", url: "/dashboardImage/Frame 4259 copy.png" },
  { id: 4, name: "Accessories_Grid.png", size: "850 KB", date: "Oct 05, 2023", type: "image", url: "/dashboardImage/Accessories.png" },
  { id: 5, name: "Model_Shoot_04.jpg", size: "3.1 MB", date: "Oct 03, 2023", type: "image", url: "/dashboardImage/T-Shirt.png" },
  { id: 6, name: "Warehouse_Stock_Video.mp4", size: "12.4 MB", date: "Sep 28, 2023", type: "video", url: "/dashboardImage/Webcam.png" },
  { id: 7, name: "New_Arrivals_Badge.png", size: "120 KB", date: "Sep 25, 2023", type: "image", url: "/dashboardImage/Cap.png" },
  { id: 8, name: "Customer_Review_Clip.mp4", size: "8.9 MB", date: "Sep 22, 2023", type: "video", url: "/dashboardImage/Headphones.png" },
];

export default function ProductMediaListing() {
  const [activeTab, setActiveTab] = useState("All media (250)");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
          <Button
            variant="primary"
            shape="rounded-sm"
            iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
          >
            Upload New
          </Button>
          <Button
            variant="outline"
            shape="rounded-sm"
            iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
          >
            More Action
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filter & Control Bar */}
        <div className="p-6 flex flex-col xl:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All media (250)", "Images", "Videos"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input
              type="text"
              placeholder="Search media filename"
              containerClassName="flex-1 xl:w-72"
              className="bg-gray-50/80 border-transparent focus:bg-white focus:border-gray-100 text-sm font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <div className="flex gap-2">
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                 <Icon name="grid" folder="dashboardIcon" size="sm" className="text-blue-500" />
              </button>
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="menu" folder="dashboardIcon" size="sm" />
              </button>
              <div className="w-px h-8 bg-gray-100 mx-1"></div>
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaData.map((item) => (
              <div key={item.id} className="group relative bg-white border border-gray-100 rounded-[6px] overflow-hidden hover:shadow-md hover:border-blue-100 transition-all">
                <div className="relative aspect-video bg-gray-50 flex items-center justify-center p-4">
                  <img src={item.url} alt={item.name} className="w-full h-full object-contain transition-transform group-hover:scale-105" />
                  
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors">
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                        <Icon name="play" folder="dashboardIcon" size="sm" className="text-[#1D3557] ml-0.5" />
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <button className="p-2 bg-white/95 rounded-[6px] shadow-sm hover:text-blue-500 transition-colors">
                      <Icon name="settings" folder="dashboardIcon" size="xs" />
                    </button>
                    <button className="p-2 bg-white/95 rounded-[6px] shadow-sm hover:text-rose-500 transition-colors">
                      <Icon name="Delete" folder="dashboardIcon" size="xs" />
                    </button>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-50 bg-white">
                  <h3 className="text-sm font-bold text-[#1D3557] truncate mb-1" title={item.name}>
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.size}</span>
                    <span className="text-[10px] font-medium text-gray-300">{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalPages={12}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
