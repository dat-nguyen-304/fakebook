'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { IoMdSend } from 'react-icons/io';

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  avatar?: string;
  size?: 'sm' | 'md';
}

const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  placeholder = 'Write a comment...',
  autoFocus = false,
  avatar = '/avatar.jpg',
  size = 'md'
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const avatarSize = size === 'sm' ? 28 : 32;

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Image
        src={avatar}
        alt="your avatar"
        width={avatarSize}
        height={avatarSize}
        className="rounded-full object-cover"
        style={{ width: avatarSize, height: avatarSize }}
      />
      <div className="flex flex-1 items-center bg-[#3a3b3c] rounded-full pl-3 pr-1">
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-2 text-[15px] text-[#e4e6eb] placeholder:text-[#b0b3b8] focus:outline-none"
        />
        <button
          onClick={submit}
          disabled={!value.trim()}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#0866ff] hover:bg-[#4e4f50] disabled:text-[#65686c] disabled:hover:bg-transparent"
        >
          <IoMdSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
