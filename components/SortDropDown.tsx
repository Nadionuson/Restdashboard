// components/SortDropdown.tsx
"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type SortKey = "date" | "rating" | "name";

type Props = {
  value: SortKey;
  onChange: (value: SortKey) => void;
};

export const SortDropdown: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (v: SortKey) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex justify-center items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-gray-50"
      >
        Sort by: {value.charAt(0).toUpperCase() + value.slice(1)}
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {["date", "rating", "name"].map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option as SortKey)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  value === option ? "bg-gray-100 font-medium" : ""
                }`}
              >
                {option === "date" && "Date Created"}
                {option === "rating" && "Rating"}
                {option === "name" && "Name"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
