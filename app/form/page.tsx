"use client";

import React, { useState } from "react";
import {
  Input,
  Textarea,
  Label,
  Hint,
  SearchInput,
  NumberInput,
  RichTextArea
} from "@/app/components/Form";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";

export default function FormDemo() {
  const [searchValue, setSearchValue] = useState("Typing|");
  const [numberValue, setNumberValue] = useState(2);

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-12 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl  p-16">
        <h1 className="text-5xl font-bold mb-16 text-black">Form - textfields</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">

          {/* Section 1: Base Inputs & Input Groups */}
          <div className="flex flex-col gap-12">
            <section>
              <h2 className="text-2xl font-bold mb-8 text-black">Base inputs</h2>
              <div className="flex flex-col gap-6">
                <Input placeholder="Type here" />
                <Textarea placeholder="Type here" />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-8 text-black">Input group</h2>
              <div className="flex flex-col gap-6">
                {/* Input with trailing icon button */}
                <div className="flex -space-x-px">
                  <Input placeholder="Type" containerClassName="rounded-r-none" />
                  <Button variant="primary" className="rounded-l-none px-3">
                    <Icon name="grid_view" size="sm" />
                  </Button>
                </div>

                {/* Input with trailing label button */}
                <div className="flex -space-x-px">
                  <Input placeholder="Type" containerClassName="rounded-r-none" />
                  <Button variant="primary" className="rounded-l-none px-6">Button</Button>
                </div>

                {/* Input with trailing text */}
                <div className="flex -space-x-px">
                  <Input placeholder="Type" containerClassName="rounded-r-none" />
                  <div className="flex items-center px-4 bg-gray-50 border border-gray-200 rounded-r-md text-sm text-gray-400">
                    Right txt
                  </div>
                </div>

                {/* Dual input with icon */}
                <div className="flex -space-x-px">
                  <Input placeholder="Type" containerClassName="flex-[2] rounded-r-none" />
                  <div className="relative flex-1">
                    <select className="w-full h-full bg-white border border-gray-200 py-2.5 px-4 text-sm text-gray-400 appearance-none focus:outline-none">
                      <option>Type</option>
                    </select>
                    <Icon name="expand_more" size="xs" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <div className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-r-md">
                    <div className="w-5 h-5 rounded bg-gray-400" />
                  </div>
                </div>

                {/* Select + Input */}
                <div className="flex -space-x-px">
                  <div className="relative w-24">
                    <select className="w-full h-full bg-white border border-gray-200 rounded-l-md py-2.5 px-4 text-sm text-gray-600 appearance-none focus:outline-none">
                      <option>Code</option>
                    </select>
                    <Icon name="expand_more" size="xs" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <Input placeholder="Type" containerClassName="rounded-l-none" />
                </div>
              </div>
            </section>
          </div>

          {/* Section 2: Input with Label */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-black">Input with label</h2>
            <div className="flex flex-col gap-8">
              <div>
                <Label>Label</Label>
                <Input placeholder="Type here" />
              </div>

              <div>
                <Label>Label</Label>
                <Input placeholder="Type here" />
                <Hint>Hint text for information</Hint>
              </div>

              <div>
                <Label>Label</Label>
                <Hint className="mt-0 mb-1.5">Hint text for information</Hint>
                <Input placeholder="Type here" />
              </div>

              <div>
                <Label>Label</Label>
                <div className="relative">
                  <select className="w-full bg-white border border-gray-200 rounded-md py-2.5 px-4 text-sm text-gray-400 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-gold/20">
                    <option>Select</option>
                  </select>
                  <Icon name="expand_more" size="sm" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <Label>Label</Label>
                <Textarea placeholder="Type here" />
              </div>

              <div>
                <Label>Label</Label>
                <RichTextArea placeholder="Type here" />
              </div>
            </div>
          </section>

          {/* Section 3: Search & Number */}
          <div className="flex flex-col gap-12">
            <section>
              <h2 className="text-2xl font-bold mb-8 text-black">Search</h2>
              <div className="flex flex-col gap-8">
                <SearchInput placeholder="Search" />

                <SearchInput
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onClear={() => setSearchValue("")}
                  className="border-brand-gold"
                />

                <Input
                  placeholder="Search"
                  suffixElement={<Icon name="search" size="sm" className="text-brand-gold" />}
                />

                <Input
                  placeholder="Typing"
                  suffixElement={<Icon name="search" size="sm" className="text-brand-gold" />}
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-8 text-black">Number</h2>
              <NumberInput
                value={numberValue}
                onChange={setNumberValue}
              />
            </section>
          </div>
        </div>

        {/* Base Components Footer */}
        <div className="mt-24 pt-12 border-t border-gray-200">
          <h3 className="text-gray-400 font-semibold mb-8 uppercase tracking-wider">Base components</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="flex flex-col gap-6">
              <Input placeholder="Type" suffixElement={<div className="w-4 h-4 rounded-sm bg-gray-400" />} />
              <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-400 text-center">Left txt</div>
            </div>

            <div className="flex flex-col gap-6">
              <Input placeholder="Type" suffixElement={<div className="w-4 h-4 rounded-sm bg-gray-400" />} />
              <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-400 text-center">Middle</div>
            </div>

            <div className="flex flex-col gap-6">
              <Input placeholder="Type" suffixElement={<div className="w-4 h-4 rounded-sm bg-gray-400" />} />
              <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-400 text-center">Right txt</div>
            </div>

            <div className="flex flex-col gap-4">
              <Label>Label</Label>
              <div className="flex items-center gap-2">
                <Label className="mb-0">Label with icon*</Label>
                <div className="w-4 h-4 rounded-sm bg-gray-400" />
              </div>
              <Hint>Hint text for information</Hint>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-orange-500" />
                <Hint className="mt-0">Hint text for information</Hint>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
