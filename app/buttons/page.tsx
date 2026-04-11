"use client";

import React from "react";
import { Button, ButtonGroup, ButtonDropdown } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";

const dropdownItems = [
 { label: "Profile", icon: "person" },
 { label: "Settings", icon: "settings" },
 { label: "Logout", icon: "lock" },
];

export default function ButtonsDemo() {
 return (
  <div className="min-h-screen bg-[#F0F7FF] p-12 font-sans">
   <div className="max-w-6xl mx-auto bg-white rounded-xl  p-16">
    <h1 className="text-5xl font-bold mb-16 text-black">Buttons</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
     {/* Default Buttons Section */}
     <section>
      <h2 className="text-2xl font-bold mb-8 text-black">Buttons</h2>
      <div className="border-[1.5px] border-dashed border-purple-200 rounded-xl p-8 flex flex-col gap-6">

       {/* Row 1: Primary with icons */}
       <div className="flex gap-4 items-center">
        <Button variant="primary" size="sm">Button</Button>
        <Button variant="primary" size="sm" iconLeft={<Icon name="grid_view" size="xs" />}>Button</Button>
        <Button variant="primary" size="sm" iconRight={<Icon name="grid_view" size="xs" />}>Button</Button>
        <Button variant="primary" size="sm" className="px-2">
         <Icon name="grid_view" size="xs" />
        </Button>
       </div>

       {/* Row 2: Medium */}
       <div className="flex gap-4 items-center">
        <Button variant="primary">Button</Button>
        <Button variant="primary" iconLeft={<Icon name="grid_view" size="sm" />}>Button</Button>
        <Button variant="primary" iconRight={<Icon name="grid_view" size="sm" />}>Button</Button>
        <Button variant="primary" className="px-2.5">
         <Icon name="grid_view" size="sm" />
        </Button>
       </div>

       {/* Row 3: Large / Pill */}
       <div className="flex gap-4 items-center">
        <Button variant="primary" size="lg" shape="pill" className="px-8">Button</Button>
        <Button variant="primary" size="lg" shape="pill" className="px-8" iconLeft={<Icon name="grid_view" size="md" />}>Button</Button>
        <Button variant="primary" size="lg" shape="pill" className="px-8" iconRight={<Icon name="grid_view" size="md" />}>Button</Button>
        <Button variant="primary" size="lg" shape="pill" className="px-4"><Icon name="grid_view" size="md" /></Button>
       </div>

       {/* Row 4: Secondary sm */}
       <div className="flex gap-4 items-center">
        <Button variant="secondary" size="sm">Button</Button>
        <Button variant="secondary" size="sm" iconLeft={<Icon name="grid_view" size="xs" />}>Button</Button>
        <Button variant="secondary" size="sm" iconRight={<Icon name="grid_view" size="xs" />}>Button</Button>
        <Button variant="secondary" size="sm" className="px-2"><Icon name="grid_view" size="xs" /></Button>
       </div>

       {/* Row 5: Secondary md */}
       <div className="flex gap-4 items-center">
        <Button variant="secondary">Button</Button>
        <Button variant="secondary" iconLeft={<Icon name="grid_view" size="sm" />}>Button</Button>
        <Button variant="secondary" iconRight={<Icon name="grid_view" size="sm" />}>Button</Button>
        <Button variant="secondary" className="px-2.5"><Icon name="grid_view" size="sm" /></Button>
       </div>

       {/* Row 6: Secondary lg */}
       <div className="flex gap-4 items-center">
        <Button variant="secondary" size="lg">Button</Button>
        <Button variant="secondary" size="lg" iconLeft={<Icon name="grid_view" size="md" />}>Button</Button>
        <Button variant="secondary" size="lg" iconRight={<Icon name="grid_view" size="md" />}>Button</Button>
        <Button variant="secondary" size="lg" className="px-4"><Icon name="grid_view" size="md" /></Button>
       </div>
      </div>
     </section>

     {/* Button Group Section */}
     <section>
      <h2 className="text-2xl font-bold mb-8 text-black">Button group</h2>
      <div className="border-[1.5px] border-dashed border-purple-200 rounded-xl p-8 flex flex-col gap-8">

       <div className="flex flex-col gap-6">
        <ButtonGroup>
         <Button size="sm">Button</Button>
         <Button size="sm">Button</Button>
         <Button size="sm">Button</Button>
        </ButtonGroup>

        <ButtonGroup>
         <Button>Button</Button>
         <Button>Button</Button>
         <Button>Button</Button>
        </ButtonGroup>

        <ButtonGroup isPill>
         <Button size="lg" shape="pill">Button</Button>
         <Button size="lg" shape="pill">Button</Button>
         <Button size="lg" shape="pill">Button</Button>
        </ButtonGroup>
       </div>

       <div className="flex flex-col gap-6">
        <ButtonGroup>
         <Button variant="secondary" size="sm">Button</Button>
         <Button variant="secondary" size="sm">Button</Button>
         <Button variant="secondary" size="sm">Button</Button>
        </ButtonGroup>

        <ButtonGroup>
         <Button variant="secondary">Button</Button>
         <Button variant="secondary">Button</Button>
         <Button variant="secondary">Button</Button>
        </ButtonGroup>

        <ButtonGroup isPill>
         <Button variant="secondary" size="lg" shape="pill">Button</Button>
         <Button variant="secondary" size="lg" shape="pill">Button</Button>
         <Button variant="secondary" size="lg" shape="pill">Button</Button>
        </ButtonGroup>
       </div>

       {/* Icon Groups */}
       <div className="flex flex-col gap-4">
        <div className="flex gap-4">
         <ButtonGroup>
          <Button size="sm" className="px-2">
           <Icon name="add" size="xs" />
          </Button>
          <Button size="sm" className="px-2">
           <Icon name="search" size="xs" />
          </Button>
          <Button size="sm" className="px-2">
           <Icon name="grid_view" size="xs" />
          </Button>
         </ButtonGroup>
         <ButtonGroup isPill>
          <Button size="sm" shape="pill" className="px-2">
           <Icon name="add" size="xs" />
          </Button>
          <Button size="sm" shape="pill" className="px-2"><Icon name="search" size="xs" /></Button>
          <Button size="sm" shape="pill" className="px-2"><Icon name="grid_view" size="xs" /></Button>
         </ButtonGroup>
        </div>
        <div className="flex gap-4">
         <ButtonGroup>
          <Button className="px-2.5">
           <Icon name="add" size="sm" />
          </Button>
          <Button className="px-2.5">
           <Icon name="search" size="sm" />
          </Button>
          <Button className="px-2.5">
           <Icon name="grid_view" size="sm" />
          </Button>
         </ButtonGroup>
         <ButtonGroup isPill>
          <Button shape="pill" className="px-2.5">
           <Icon name="add" size="sm" />
          </Button>
          <Button shape="pill" className="px-2.5">
           <Icon name="search" size="sm" />
          </Button>
          <Button shape="pill" className="px-2.5"><Icon name="grid_view" size="sm" /></Button>
         </ButtonGroup>
        </div>
        <div className="flex gap-4">
         <ButtonGroup>
          <Button size="lg" className="px-4">
           <Icon name="add" size="md" />
          </Button>
          <Button size="lg" className="px-4">
           <Icon name="search" size="md" />
          </Button>
          <Button size="lg" className="px-4">
           <Icon name="grid_view" size="md" />
          </Button>
         </ButtonGroup>
         <ButtonGroup isPill>
          <Button size="lg" shape="pill" className="px-4">
           <Icon name="add" size="md" />
          </Button>
          <Button size="lg" shape="pill" className="px-4">
           <Icon name="search" size="md" />
          </Button>
          <Button size="lg" shape="pill" className="px-4">
           <Icon name="grid_view" size="md" />
          </Button>
         </ButtonGroup>
        </div>
       </div>
      </div>
     </section>

     {/* Button Dropdown Section */}
     <section className="col-span-1">
      <h2 className="text-2xl font-bold mb-8 text-black">Button dropdown</h2>
      <div className="border-[1.5px] border-dashed border-purple-200 rounded-xl p-8 flex flex-col gap-4 max-w-[200px]">
       <ButtonDropdown label="Button" variant="primary" items={dropdownItems} />
       <ButtonDropdown label="Button" variant="secondary" items={dropdownItems} />
      </div>
     </section>
    </div>

    <div className="mt-24 pt-12 border-t border-gray-200">
     <h3 className="text-gray-400 font-semibold mb-8 uppercase tracking-wider">Base components</h3>
     <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" className="w-fit">Button small</Button>
      <Button variant="ghost" className="w-fit">Button normal</Button>
      <Button variant="ghost" size="lg" className="w-fit">Button large</Button>
     </div>
    </div>
   </div>
  </div>
 );
}
