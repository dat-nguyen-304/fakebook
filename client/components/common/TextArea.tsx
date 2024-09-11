import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';

interface TextareaProps {
  value?: string;
  onChange: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  rows?: number;
  autoFocus?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({ value = '', onChange, placeholder = '', rows = 4, autoFocus = false }) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && ref.current) ref.current.focus();
  }, [ref.current, autoFocus]);

  return (
    <div className="mb-4">
      <textarea
        className="w-full p-3 border text-[#e4e6eb] border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 transition-all bg-transparent"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        ref={ref}
      />
    </div>
  );
};

export default Textarea;
