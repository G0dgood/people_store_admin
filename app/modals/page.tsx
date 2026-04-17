"use client";

import React, { useState } from "react";
import {
 Modal,
 ModalHeader,
 ModalBody,
 ModalFooter
} from "@/app/components/Modal";
import { Button } from "@/app/components/Button";
import { Input, Select, Checkbox } from "@/app/components/Form";

export default function ModalDemo() {
 const [openNormal, setOpenNormal] = useState(false);
 const [openLarge, setOpenLarge] = useState(false);
 const [openDelete, setOpenDelete] = useState(false);
 const [openError, setOpenError] = useState(false);

 return (
  <div className="min-h-screen bg-[#F0F7FF] p-12 font-sans">
   <div className="max-w-7xl mx-auto bg-white rounded-xl  p-16 text-black">
    <h1 className="text-5xl font-bold mb-16">Modal</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">

     {/* Normal Modal Mockup */}
     <div className="bg-gray-50/50 p-12 rounded-xl flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
       <ModalHeader title="Normal modal" onClose={() => { }} />
       <ModalBody>
        <p className="text-gray-500 text-sm leading-relaxed">Lorem ipsum dolor sit amet</p>
       </ModalBody>
       <ModalFooter>
        <Button variant="ghost" size="sm">Button</Button>
        <Button size="sm">Button</Button>
       </ModalFooter>
      </div>
     </div>

     {/* Large Modal Mockup */}
     <div className="bg-gray-50/50 p-12 rounded-xl flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
       <ModalHeader title="Large modal" onClose={() => { }} />
       <ModalBody>
        <div className="flex gap-4 mb-6">
         <div className="flex-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Your name</span>
          <Input placeholder="Type here" />
         </div>
         <div className="flex-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Country</span>
          <Select options={[]} placeholder="Select" />
         </div>
        </div>
        <div className="mt-8 mb-4">
         <Checkbox label="Yes I agree to do something" />
        </div>
       </ModalBody>
       <ModalFooter>
        <Button variant="ghost" size="sm">Button</Button>
        <Button size="sm">Button</Button>
       </ModalFooter>
      </div>
     </div>

     {/* Delete Modal Mockup */}
     <div className="bg-gray-50/50 p-12 rounded-xl flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
       <ModalHeader title="Delete 4 files?" onClose={() => { }} />
       <ModalBody>
        <p className="text-gray-500 text-sm leading-relaxed">Really want to delete all items.</p>
       </ModalBody>
       <ModalFooter>
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button size="sm" className="bg-red-500 hover:bg-red-600 focus:ring-red-500/20">Yes, delete</Button>
       </ModalFooter>
      </div>
     </div>

     {/* Error Dialog Mockup */}
     <div className="bg-gray-50/50 p-12 rounded-xl flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
       <ModalHeader title="Error dialog" onClose={() => { }} icon="warning" />
       <ModalBody>
        <p className="text-gray-500 text-sm leading-relaxed">Some error 422 happened because of something you made</p>
       </ModalBody>
       <ModalFooter>
        <Button size="sm" className="px-6">OK</Button>
       </ModalFooter>
      </div>
     </div>

    </div>

    {/* Real Triggers Section */}
    <div className="flex gap-4 mb-20 border-t pt-12">
     <Button onClick={() => setOpenNormal(true)}>Open Normal Modal</Button>
     <Button onClick={() => setOpenLarge(true)}>Open Large Modal</Button>
     <Button onClick={() => setOpenDelete(true)} className="bg-red-500">Open Delete Modal</Button>
     <Button onClick={() => setOpenError(true)} className="bg-orange-500">Open Error Dialog</Button>
    </div>

    {/* Base Components Footer */}
    <div className="mt-24 pt-12 border-t border-gray-200">
     <h3 className="text-gray-400 font-semibold mb-8 uppercase tracking-wider">Base components</h3>

     <div className="flex flex-col gap-12 p-12 border border-dashed border-purple-200 rounded-xl">
      <div className="flex items-center gap-24">
       <div className="w-[320px] bg-white border border-gray-100 rounded-t-xl">
        <ModalHeader title="Informative modal" icon="check_circle" onClose={() => { }} />
       </div>
       <div className="w-[320px] bg-white border border-gray-100 rounded-t-xl">
        <ModalHeader title="Medium modal" onClose={() => { }} />
       </div>
      </div>

      <div className="w-[320px] bg-white border border-gray-100 rounded-xl overflow-hidden ">
       <ModalFooter>
        <Button variant="ghost" size="sm">Button</Button>
        <Button size="sm">Button</Button>
       </ModalFooter>
      </div>
     </div>
    </div>
   </div>

   {/* Actual Modal Components */}
   <Modal isOpen={openNormal} onClose={() => setOpenNormal(false)} size="normal">
    <ModalHeader title="Normal modal" onClose={() => setOpenNormal(false)} />
    <ModalBody>
     <p className="text-gray-500 text-sm leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </ModalBody>
    <ModalFooter>
     <Button variant="ghost" size="sm" onClick={() => setOpenNormal(false)}>Cancel</Button>
     <Button size="sm" onClick={() => setOpenNormal(false)}>Confirm</Button>
    </ModalFooter>
   </Modal>

   <Modal isOpen={openLarge} onClose={() => setOpenLarge(false)} size="large">
    <ModalHeader title="Large modal" onClose={() => setOpenLarge(false)} />
    <ModalBody>
     <div className="flex gap-4 mb-6">
      <div className="flex-1">
       <span className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Full Name</span>
       <Input placeholder="Enter your name" />
      </div>
      <div className="flex-1">
       <span className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Location</span>
       <Select options={[{ value: "us", label: "United States" }]} placeholder="Choose country" />
      </div>
     </div>
     <div className="mt-8">
      <Checkbox label="I accept the terms and conditions" />
     </div>
    </ModalBody>
    <ModalFooter>
     <Button variant="ghost" size="sm" onClick={() => setOpenLarge(false)}>Close</Button>
     <Button size="sm" onClick={() => setOpenLarge(false)}>Save Changes</Button>
    </ModalFooter>
   </Modal>

   <Modal isOpen={openDelete} onClose={() => setOpenDelete(false)} size="normal">
    <ModalHeader title="Delete 4 files?" onClose={() => setOpenDelete(false)} />
    <ModalBody>
     <p className="text-gray-500 text-sm leading-relaxed">Are you absolutely sure you want to delete these items? This action cannot be undone.</p>
    </ModalBody>
    <ModalFooter>
     <Button variant="ghost" size="sm" onClick={() => setOpenDelete(false)}>Cancel</Button>
     <Button size="sm" className="bg-red-500 hover:bg-red-600 focus:ring-red-500/20" onClick={() => setOpenDelete(false)}>Yes, delete</Button>
    </ModalFooter>
   </Modal>

   <Modal isOpen={openError} onClose={() => setOpenError(false)} size="normal">
    <ModalHeader title="Error dialog" onClose={() => setOpenError(false)} icon="warning" />
    <ModalBody>
     <p className="text-gray-500 text-sm leading-relaxed">A critical error occurred while processing your request. Please check your connection and try again.</p>
    </ModalBody>
    <ModalFooter>
     <Button size="sm" className="px-8" onClick={() => setOpenError(false)}>OK</Button>
    </ModalFooter>
   </Modal>

  </div>
 );
}
