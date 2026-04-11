"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownItem,
  DropdownSearch,
  DropdownFooterAction,
  DropdownEmptyState
} from "@/app/components/Dropdown";

export default function DropdownDemo() {
  const [searchValue, setSearchValue] = useState("");
  const [searchNotFound, setSearchNotFound] = useState("myword|");
  const [multiSelect, setMultiSelect] = useState(["active1", "active2"]);

  const toggleMulti = (id: string) => {
    setMultiSelect(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-12 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl  p-16">
        <h1 className="text-5xl font-bold mb-16 text-black">Dropdown selection</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

          {/* Section: Basic */}
          <section>
            <h2 className="text-gray-400 font-semibold mb-6 uppercase tracking-wider text-xs">Basic</h2>
            <DropdownMenu className="w-full">
              <DropdownItem label="Item selection" />
              <DropdownItem label="Disabled option" isDisabled />
              <DropdownItem label="Item hover" className="bg-gray-50" />
              <DropdownItem label="Item selection" />
              <DropdownItem label="Item active" isActive />
              <DropdownItem label="Item selection" />
              <DropdownItem label="Item selection" />
            </DropdownMenu>
          </section>

          {/* Section: Multi Select */}
          <section>
            <h2 className="text-gray-400 font-semibold mb-6 uppercase tracking-wider text-xs">Multi select</h2>
            <DropdownMenu className="w-full">
              <DropdownItem label="Check label" showCheckbox />
              <DropdownItem label="Check label" showCheckbox />
              <DropdownItem label="Check onhover" showCheckbox className="bg-gray-50" />
              <DropdownItem label="Check label" showCheckbox />
              <DropdownItem label="Check label" showCheckbox checked isActive />
              <DropdownItem label="Check label" showCheckbox checked isActive />
              <DropdownItem label="Check label" showCheckbox />
            </DropdownMenu>
          </section>

          {/* Section: With Search (Multiple versions) */}
          <section className="flex flex-col gap-12">
            <div>
              <h2 className="text-gray-400 font-semibold mb-6 uppercase tracking-wider text-xs">With search</h2>
              <DropdownMenu className="w-full">
                <DropdownSearch value={searchValue} onChange={setSearchValue} />
                <DropdownItem label="Item selection" />
                <DropdownItem label="Item selection" />
                <DropdownItem label="Item hover" className="bg-gray-50" />
                <DropdownItem label="Item active" isActive />
                <DropdownItem label="Item selection" />
                <DropdownFooterAction label="Create new" onClick={() => { }} />
              </DropdownMenu>
            </div>
          </section>

          <section>
            <h2 className="text-gray-400 font-semibold mb-6 uppercase tracking-wider text-xs opacity-0">Hidden Header</h2>
            <DropdownMenu className="w-full">
              <DropdownSearch value="" onChange={() => { }} />
              <DropdownItem label="Check label" showCheckbox />
              <DropdownItem label="Check label" showCheckbox />
              <DropdownItem label="Check onhover" showCheckbox className="bg-gray-50" />
              <DropdownItem label="Check label" showCheckbox />
              <DropdownItem label="Check label" showCheckbox checked isActive />
              <DropdownItem label="Check label" showCheckbox checked isActive />
              <DropdownItem label="Check label" showCheckbox />
            </DropdownMenu>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Section: Multi Text */}
          <section>
            <h2 className="text-gray-400 font-semibold mb-6 uppercase tracking-wider text-xs">Multi text</h2>
            <DropdownMenu className="w-full">
              <DropdownItem label="Selecting option" subtext="Extra informative text" />
              <DropdownItem label="Selecting option" subtext="Extra informative text" />
              <DropdownItem label="Selecting option hover" subtext="Extra informative text" className="bg-gray-50" />
              <DropdownItem label="Selecting option" subtext="Extra informative text" />
              <DropdownItem label="Selecting option" subtext="Extra informative text" />
            </DropdownMenu>
          </section>

          {/* Section: Not Found */}
          <section>
            <h2 className="text-gray-400 font-semibold mb-6 uppercase tracking-wider text-xs">Not found</h2>
            <DropdownMenu className="w-full">
              <DropdownSearch
                value={searchNotFound}
                onChange={setSearchNotFound}
                onClear={() => setSearchNotFound("")}
              />
              <DropdownEmptyState />
              <DropdownFooterAction label="Create new" onClick={() => { }} />
            </DropdownMenu>
          </section>
        </div>

        {/* Section: Hierarchical & Menus */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <section className="col-span-2">
            <h2 className="text-gray-400 font-semibold mb-6 uppercase tracking-wider text-xs">Menu grouped</h2>
            <div className="flex gap-4 items-start">
              <DropdownMenu width={240}>
                <DropdownItem label="Item selection" hasSubmenu />
                <DropdownItem label="Item hover" hasSubmenu className="bg-gray-50" />
                <DropdownItem label="Item selection" />
                <DropdownItem label="Item selection" />
                <DropdownItem label="Item selection" hasSubmenu />
                <DropdownItem label="Item selection" />
              </DropdownMenu>

              <div className="translate-y-12">
                <DropdownMenu width={200}>
                  <DropdownItem label="Item selection" hasSubmenu />
                  <DropdownItem label="Item hover" hasSubmenu className="bg-gray-50" />
                  <DropdownItem label="Item selection" />
                  <DropdownItem label="Item selection" />
                </DropdownMenu>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-gray-400 font-semibold mb-6 uppercase tracking-wider text-xs">Menu</h2>
            <DropdownMenu className="w-full">
              <DropdownItem label="Print" icon="print" />
              <DropdownItem label="Item hover" icon="archive" className="bg-gray-50" />
              <DropdownItem label="Archive" icon="archive" />
              <DropdownItem label="Edit" icon="create" />
              <DropdownItem label="Delete" icon="delete_outline" />
            </DropdownMenu>
          </section>

          <section>
            <h2 className="text-gray-400 font-semibold mb-6 uppercase tracking-wider text-xs text-transparent">Menu grouped Alt</h2>
            <DropdownMenu className="w-full">
              <DropdownItem label="Rename" icon="create" />
              <DropdownItem label="Item hover" icon="archive" className="bg-gray-50" />
              <DropdownItem label="Print" icon="print" />
              <DropdownItem label="Edit" icon="create" />
              <DropdownItem label="Delete" icon="delete_outline" />
            </DropdownMenu>
          </section>
        </div>

        {/* Base Components Footer */}
        <div className="mt-24 pt-12 border-t border-gray-200">
          <h3 className="text-gray-400 font-semibold mb-8 uppercase tracking-wider">Base components</h3>

          <div className="flex flex-col gap-12 p-12 border border-dashed border-purple-200 rounded-xl">
            <div className="flex items-center gap-12">
              <div className="min-w-60"><DropdownItem label="Item selection" hasSubmenu /></div>
              <div className="min-w-60"><DropdownItem label="Item selection" icon="archive" /></div>
              <div className="min-w-60"><DropdownItem label="Item selection" /></div>
              <div className="min-w-60"><DropdownItem label="Check label" showCheckbox /></div>
              <div className="min-w-60"><DropdownItem label="Selecting option" subtext="Extra informative text" /></div>
            </div>
            <div className="flex items-center gap-12">
              <div className="min-w-60"><DropdownItem label="Item hover" hasSubmenu className="bg-gray-50" /></div>
              <div className="min-w-60"><DropdownItem label="Item hover" icon="archive" className="bg-gray-50" /></div>
              <div className="min-w-60"><DropdownItem label="Item hover" className="bg-gray-50" /></div>
              <div className="min-w-60"><DropdownItem label="Check onhover" showCheckbox className="bg-gray-50" /></div>
              <div className="min-w-60"><DropdownItem label="Selecting option hover" subtext="Extra informative text" className="bg-gray-50" /></div>
            </div>
            <div className="flex items-center gap-12">
              <div className="min-w-60"><DropdownItem label="Item active" hasSubmenu isActive /></div>
              <div className="min-w-60"><DropdownItem label="Item active" icon="archive" isActive /></div>
              <div className="min-w-60"><DropdownItem label="Item active" isActive /></div>
              <div className="min-w-60"><DropdownItem label="Check label" showCheckbox checked isActive /></div>
            </div>
          </div>

          <div className="flex gap-12 mt-12">
            <div className="w-60">
              <DropdownSearch value="" onChange={() => { }} />
            </div>
            <div className="w-60">
              <DropdownFooterAction label="Create new" onClick={() => { }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
