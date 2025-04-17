// ui/select.tsx
import * as React from "react";

interface SelectProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ id, value, onChange, options, placeholder }) => {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded"
    >
      <option value="">{placeholder || 'Select'}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
