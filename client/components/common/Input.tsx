import { ChangeEvent } from 'react';

interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ placeholder, value, onChange, required = false }) => {
  return (
    <input
      onChange={onChange}
      value={value}
      type="text"
      placeholder={placeholder}
      required={required}
      className="text-sm w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200 ease-in-out text-[#d8dbdf] bg-transparent"
    />
  );
};

export default Input;
