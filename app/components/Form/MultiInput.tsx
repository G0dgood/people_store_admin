"use client";

import React from "react";
import { Input } from "./Inputs";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface MultiInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  label?: string;
  placeholder?: string;
  addButtonLabel?: string;
  emptyMessage?: string;
}

export function MultiInput({
  values,
  onChange,
  label,
  placeholder = "Enter value...",
  addButtonLabel = "+ ADD ITEM",
  emptyMessage = "No items added yet. Click to add one.",
}: MultiInputProps) {
  const handleAdd = () => {
    onChange([...values, ""]);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, val: string) => {
    const newValues = [...values];
    newValues[index] = val;
    onChange(newValues);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
            {label}
          </label>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-brand-gold h-7 text-[10px] font-black hover:bg-brand-gold/5"
          onClick={handleAdd}
        >
          {addButtonLabel}
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {values.map((val, index) => (
          <div
            key={index}
            className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <Input
              placeholder={placeholder}
              value={val}
              onChange={(e) => handleUpdate(index, e.target.value)}
              className="h-11 border-gray-100 font-bold flex-1 bg-gray-50/30"
              shape="rounded-sm"
            />
            <Button
              type="button"
              variant="outline"
              shape="rounded-sm"
              className="w-11 h-11 p-0 text-gray-300 hover:text-rose-500 hover:border-rose-500 transition-all border-gray-100"
              onClick={() => handleRemove(index)}
            >
              <Icon name="Delete" folder="dashboardIcon" size="sm" />
            </Button>
          </div>
        ))}

        {values.length === 0 && (
          <div
            className="py-4 border-2 border-dashed border-gray-100 rounded-[6px] flex flex-col items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group"
            onClick={handleAdd}
          >
            <Icon
              name="circle-plus"
              folder="dashboardIcon"
              size="sm"
              className="text-gray-300 group-hover:text-brand-gold"
            />
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-brand-gold">
              {emptyMessage}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
