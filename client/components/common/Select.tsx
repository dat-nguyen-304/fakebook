import React, { ChangeEvent } from 'react';

interface SelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder = 'Select an option', disabled }) => {
  return (
    <div className="relative w-full mb-4">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full p-3 border border-gray-300 text-[#d8dbdf] rounded-lg shadow-sm focus:outline-none focus:border-blue-500 transition-all bg-transparent appearance-none cursor-pointer"
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-transparent text-black">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute top-0 right-0 h-full px-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default Select;
