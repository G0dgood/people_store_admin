"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  className?: string;
  shape?: "rounded" | "rounded-sm" | "pill";
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Choose date",
  className = "",
  shape = "rounded",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const shapes = {
    rounded: "rounded-none",
    "rounded-sm": "rounded-sm",
    pill: "rounded-full",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDateSelect = (day: number) => {
    const newDate = new Date(year, month, day);
    onChange?.(newDate);
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    onChange?.(today);
    setViewDate(today);
    setIsOpen(false);
  };

  const handleClear = () => {
    // Note: This simplified version just resets the internal state
    setIsOpen(false);
  };

  const days = [];
  const startDay = firstDayOfMonth(year, month);
  const totalDays = daysInMonth(year, month);

  // Fill in empty spaces before the first day
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }

  // Fill in the actual days
  for (let d = 1; d <= totalDays; d++) {
    const isSelected = value?.getDate() === d && value?.getMonth() === month && value?.getFullYear() === year;
    const isToday = new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;

    days.push(
      <button
        key={d}
        onClick={() => handleDateSelect(d)}
        className={`
          w-8 h-8 text-xs font-semibold rounded-md flex items-center justify-center transition-colors
          ${isSelected ? "bg-brand-blue text-white" : isToday ? "text-brand-blue font-bold" : "text-gray-700 hover:bg-gray-100"}
        `}
      >
        {d}
      </button>
    );
  }

  return (
    <div className={`relative w-48 ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 w-full bg-white border py-2.5 px-4 text-sm transition-all ${shapes[shape]}
          ${isOpen ? "border-brand-blue ring-2 ring-brand-blue/20" : "border-gray-200 hover:border-gray-300"}
        `}
      >
        <Icon name="calendar_today" size="sm" className="text-gray-400" />
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? value.toLocaleDateString("en-GB") : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className={`absolute z-20 w-[280px] mt-1.5 bg-white border border-gray-200 ${shapes[shape]} shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200`}>
          <div className="flex items-center justify-between mb-4">
             <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                <Icon name="chevron_left" size="sm" />
             </button>
             <span className="text-sm font-bold text-gray-900">
                {monthNames[month]} {year}
             </span>
             <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                <Icon name="chevron_right" size="sm" />
             </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>

          <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
            <Button variant="ghost" size="sm" shape={shape} className="flex-1 text-brand-blue border border-gray-200" onClick={handleClear}>Clear</Button>
            <Button variant="ghost" size="sm" shape={shape} className="flex-1 text-brand-blue border border-gray-200" onClick={handleToday}>Today</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { DatePicker };
