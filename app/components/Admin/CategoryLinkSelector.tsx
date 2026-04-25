import React from "react";
import Dropdown from "../Form/Dropdown";

interface CategoryLinkSelectorProps {
 categories: string[];
 value: string;
 onChange: (val: string) => void;
}

export const CategoryLinkSelector: React.FC<CategoryLinkSelectorProps> = ({
 categories,
 value,
 onChange,
}) => {
 return (
  <div className="flex flex-col gap-1.5 pointer-events-auto">
   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Linked Category</label>
   <Dropdown
    options={[
     { value: "", label: "All Categories (General)" },
     ...categories.map(cat => ({ value: cat, label: cat }))
    ]}
    value={value}
    onChange={onChange}
    size="sm"
   />
  </div>
 );
};
