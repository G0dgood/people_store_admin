"use client";

import React, { useState } from "react";
import { VerticalMenu, Tabs, Pagination } from "@/app/components/Navigation";
import { Icon } from "@/app/components/Icon";

export default function NavDemo() {
  const [activeMenu, setActiveMenu] = useState("active");
  const [activeTabPill, setActiveTabPill] = useState("active");
  const [activeTabUnderline, setActiveTabUnderline] = useState("tab-active");
  const [currentPage, setCurrentPage] = useState(2);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const menuItems = [
    { id: "active", label: "Active menu" },
    { id: "item1", label: "Menu item" },
    { id: "item2", label: "Menu item" },
    { id: "item3", label: "Menu item" },
  ];

  const tabItems = [
    { id: "active", label: "Active" },
    { id: "first", label: "First" },
    { id: "second", label: "Second" },
    { id: "third", label: "Third" },
  ];

  const underlineTabItems = [
    { id: "tab-active", label: "Tab active" },
    { id: "tab-menu-1", label: "Tab menu" },
    { id: "tab-menu-2", label: "Tab menu" },
  ];

  const iconTabs = [
    { id: "tab-1", icon: "grid_view" },
    { id: "tab-2", label: "Tab" },
    { id: "tab-3", label: "Tab" },
  ];

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-12 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl  p-16">
        <h1 className="text-5xl font-bold mb-16 text-black">Nav, Tab, Pagination</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* Vertical Menu Section */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-black">Vertical menu</h2>
            <VerticalMenu
              items={menuItems}
              activeId={activeMenu}
              onItemClick={setActiveMenu}
            />
          </section>

          {/* Tab Pills Section */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-black">Tab pills</h2>
            <div className="border border-gray-100 rounded-lg p-8 min-h-[250px] bg-white">
              <Tabs
                variant="pill"
                items={tabItems}
                activeId={activeTabPill}
                onTabChange={setActiveTabPill}
              />
            </div>
          </section>

          {/* Tabs Section */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-black">Tabs</h2>
            <div className="border border-gray-100 rounded-lg p-0 min-h-[250px] bg-white overflow-hidden">
              <Tabs
                variant="underline"
                items={underlineTabItems}
                activeId={activeTabUnderline}
                onTabChange={setActiveTabUnderline}
              />
            </div>
          </section>
        </div>

        {/* Pagination Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-black">Pagination</h2>
          <div className="flex flex-col gap-8">
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={setCurrentPage}
            />

            <Pagination
              currentPage={currentPage2}
              totalPages={3}
              onPageChange={setCurrentPage2}
              showSizeChanger={true}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </div>
        </section>

        <div className="mt-24 pt-12 border-t border-gray-200">
          <h3 className="text-gray-400 font-semibold mb-8 uppercase tracking-wider">Base components</h3>

          <div className="flex flex-col gap-12">
            {/* Base Tabs Variants */}
            <div className="flex items-center gap-12">
              <Tabs
                variant="underline"
                items={iconTabs.slice(0, 1)}
                activeId="tab-1"
                className="w-fit"
              />
              <Tabs
                variant="underline"
                items={iconTabs.slice(1, 2)}
                activeId="tab-2"
                className="w-fit"
              />
              <Tabs
                variant="underline"
                items={iconTabs.slice(2, 3)}
                activeId=""
                className="w-fit border-transparent"
              />
            </div>

            {/* Base Menu Variants */}
            <div className="flex items-center gap-12">
              <div className="w-48 bg-gray-50 p-2 rounded-md font-medium text-sm text-gray-900">
                Active menu
              </div>
              <div className="flex items-center gap-3 w-48 bg-gray-50 p-2 rounded-md font-medium text-sm text-gray-900">
                <Icon name="grid_view" size="sm" className="text-gray-500" />
                Active menu
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="w-48 p-2 font-medium text-sm text-gray-600">
                Menu item
              </div>
              <div className="flex items-center gap-3 w-48 p-2 font-medium text-sm text-gray-600">
                <Icon name="grid_view" size="sm" className="text-gray-400" />
                Menu item
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
