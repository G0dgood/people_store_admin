"use client";

import Dropdown from "./Form/Dropdown";



interface RowsPerPageProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  label?: string;
}

export function RowsPerPage({
  value,
  onChange,
  options = [5, 10, 20, 50, 100, 200, 500],
  label = "Rows per page:"
}: RowsPerPageProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-500 whitespace-nowrap">{label}</span>
      <Dropdown
        value={value > 0 ? value.toString() : options[0].toString()}
        onChange={(val) => onChange(Number(val))}
        options={options.map(opt => ({ label: opt.toString(), value: opt.toString() }))}
        className="w-[80px]"
        size="sm"
        variant="minimal"
      />
    </div>
  );
}
