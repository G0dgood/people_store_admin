"use client";

import React, { useState } from "react";
import { Select, DatePicker, Tag, Label } from "@/app/components/Form";
import { Icon } from "../components/Icon";

export default function FormSelectDemo() {
 const [select1, setSelect1] = useState("");
 const [select2, setSelect2] = useState("active");
 const [select3, setSelect3] = useState("selected");
 const [selectMulti, setSelectMulti] = useState(["s1", "s2", "other"]);
 const [tagInput, setTagInput] = useState(["tag1", "tag2"]);
 const [dateValue, setDateValue] = useState<Date | undefined>(undefined);
 const [dateValue2, setDateValue2] = useState<Date | undefined>(new Date(2022, 10, 16));

 const options = [
  { value: "select", label: "Select" },
  { value: "active", label: "Active selected" },
  { value: "selected", label: "Selected" },
  { value: "s1", label: "Select 1" },
  { value: "s2", label: "Select 2" },
  { value: "other", label: "Other select" },
 ];

 const tagOptions = [
  { value: "tag1", label: "Tag input" },
  { value: "tag2", label: "Tag input" },
  { value: "tag3", label: "Tag input" },
 ];

 return (
  <div className="min-h-screen bg-[#F0F7FF] p-12 font-sans">
   <div className="max-w-4xl mx-auto bg-white rounded-xl  p-16">
    <h1 className="text-5xl font-bold mb-16 text-black">Form - select</h1>

    <div className="flex flex-col gap-20">

     {/* Select Section */}
     <section>
      <h2 className="text-2xl font-bold mb-8 text-black">Select</h2>
      <div className="flex flex-col gap-6 max-w-xs">
       <Select
        options={[options[0]]}
        value={select1}
        onChange={(v) => setSelect1(v as string)}
        placeholder="Select"
       />

       <Select
        options={[options[1]]}
        value={select2}
        onChange={(v) => setSelect2(v as string)}
        className="border-brand-blue"
       />

       <Select
        options={[options[2]]}
        value={select3}
        onChange={(v) => setSelect3(v as string)}
       />

       <Select
        options={options}
        value={selectMulti}
        onChange={(v) => setSelectMulti(v as string[])}
        isMulti
       />

       <Select
        options={tagOptions}
        value={tagInput}
        onChange={(v) => setTagInput(v as string[])}
        isMulti
        placeholder="Tag input"
       />
      </div>
     </section>

     {/* Datepicker Section */}
     <section>
      <h2 className="text-2xl font-bold mb-8 text-black">Datepicker</h2>
      <div className="flex gap-8 items-start">
       <div className="flex flex-col gap-4">
        <DatePicker
         value={dateValue}
         onChange={setDateValue}
        />

        {/* Visual Calendar Mockup to match Design */}
        <div className="w-[280px] bg-white border border-gray-200 rounded-md shadow-xl p-4">
         <div className="flex items-center justify-between mb-4">
          <button className="p-1 text-gray-400">
           <Icon name="chevron_left" size="sm" />
          </button>
          <span className="text-sm font-bold text-gray-900">November 2022</span>
          <button className="p-1 text-gray-400">
           <Icon name="chevron_right" size="sm" />
          </button>
         </div>
         <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
           <div key={d} className="text-[10px] font-bold text-gray-400">{d}</div>
          ))}
         </div>
         <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
           <div key={d} className={`w-8 h-8 text-xs font-semibold rounded-md flex items-center justify-center ${d === 16 ? "bg-brand-blue text-white" : "text-gray-700 hover:bg-gray-50 pointer-events-none"}`}>
            {d}
           </div>
          ))}
         </div>
         <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
          <button className="flex-1 py-2 text-xs font-bold text-brand-blue border border-gray-200 rounded-md">Clear</button>
          <button className="flex-1 py-2 text-xs font-bold text-brand-blue border border-gray-200 rounded-md">Today</button>
         </div>
        </div>
       </div>

       <DatePicker
        value={dateValue2}
        onChange={setDateValue2}
       />
      </div>
     </section>

     {/* Base Components Footer */}
     <section className="mt-12 pt-12 border-t border-gray-200">
      <h3 className="text-gray-400 font-semibold mb-8 uppercase tracking-wider">Base components</h3>
      <div className="flex items-center gap-12">
       <span className="text-sm text-gray-400">30</span>
       <Tag label="Tag input" onRemove={() => { }} />
      </div>
     </section>
    </div>
   </div>
  </div>
 );
}
