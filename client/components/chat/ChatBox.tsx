'use client';

import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { TbPhotoFilled } from 'react-icons/tb';
import { BiSolidSend } from 'react-icons/bi';
import { useState } from 'react';
import { useChatBox } from '@hooks/client';

interface ChatBoxProps {}
const ChatBox: React.FC<ChatBoxProps> = () => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const { open, onChangeOpen } = useChatBox();
  if (!open) return null;
  return (
    <div
      className="fixed group bottom-0 right-[96px] h-[455px] w-[328px] rounded-md bg-[#242526] text-[#b0b3b8]"
      onClick={() => setIsFocus(true)}
    >
      <div className="flex justify-between items-center p-[8px] shadow-border-b">
        <div className="flex items-center gap-2">
          <div className="w-[32px]">
            <Image src="/avatar.jpg" alt="" width={32} height={32} className="rounded-full" />
          </div>
          <div className="">
            <h4 className="font-bold text-[15px] text-[#e4e6eb]">Nguyễn Văn An</h4>
            <p className="font-light text-[13px]">Active 12m ago</p>
          </div>
        </div>
        <div
          onClick={() => onChangeOpen(false)}
          className="bg-[#242526] rounded-full cursor-pointer hover:brightness-125 w-[32px] h-[32px] flex items-center justify-center"
        >
          <IoClose color="#0084ff" size={24} />
        </div>
      </div>
      <div className="p-[8px] h-[347px] overflow-y-scroll">
        <div className="my-[8px] flex items-end gap-[4px]">
          <div className="w-[32px]">
            <Image src="/avatar.jpg" alt="" width={28} height={28} className="rounded-full" />
          </div>
          <div className="bg-[#303030] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e0e2e6] font-[15px]">Van minh</p>
          </div>
        </div>
        <div className="my-[8px] flex flex-row-reverse">
          <div className="bg-[#0084ff] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e4f2ff] font-[15px]">Van minh</p>
          </div>
        </div>
        <div className="my-[8px] flex items-end gap-[4px]">
          <div className="w-[32px]">
            <Image src="/avatar.jpg" alt="" width={28} height={28} className="rounded-full" />
          </div>
          <div className="bg-[#303030] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e0e2e6] font-[15px]">Van minh</p>
          </div>
        </div>
        <div className="my-[8px] flex flex-row-reverse">
          <div className="bg-[#0084ff] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e4f2ff] font-[15px]">Van minh</p>
          </div>
        </div>
        <div className="my-[8px] flex items-end gap-[4px]">
          <div className="w-[32px]">
            <Image src="/avatar.jpg" alt="" width={28} height={28} className="rounded-full" />
          </div>
          <div className="bg-[#303030] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e0e2e6] font-[15px]">Van minh</p>
          </div>
        </div>
        <div className="my-[8px] flex flex-row-reverse">
          <div className="bg-[#0084ff] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e4f2ff] font-[15px]">Van minh</p>
          </div>
        </div>
        <div className="my-[8px] flex items-end gap-[4px]">
          <div className="w-[32px]">
            <Image src="/avatar.jpg" alt="" width={28} height={28} className="rounded-full" />
          </div>
          <div className="bg-[#303030] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e0e2e6] font-[15px]">Van minh</p>
          </div>
        </div>
        <div className="my-[8px] flex flex-row-reverse">
          <div className="bg-[#0084ff] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e4f2ff] font-[15px]">Van minh</p>
          </div>
        </div>
        <div className="my-[8px] flex items-end gap-[4px]">
          <div className="w-[32px]">
            <Image src="/avatar.jpg" alt="" width={28} height={28} className="rounded-full" />
          </div>
          <div className="bg-[#303030] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e0e2e6] font-[15px]">Van minh</p>
          </div>
        </div>
        <div className="my-[8px] flex flex-row-reverse">
          <div className="bg-[#0084ff] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e4f2ff] font-[15px]">Van minh</p>
          </div>
        </div>
        <div className="my-[8px] flex items-end gap-[4px]">
          <div className="w-[32px]">
            <Image src="/avatar.jpg" alt="" width={28} height={28} className="rounded-full" />
          </div>
          <div className="bg-[#303030] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e0e2e6] font-[15px]">Van minh</p>
          </div>
        </div>
        <div className="my-[8px] flex flex-row-reverse">
          <div className="bg-[#0084ff] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e4f2ff] font-[15px]">Van minh</p>
          </div>
        </div>
        <div className="my-[8px] flex items-end gap-[4px]">
          <div className="w-[32px]">
            <Image src="/avatar.jpg" alt="" width={28} height={28} className="rounded-full" />
          </div>
          <div className="bg-[#303030] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e0e2e6] font-[15px]">Van minh</p>
          </div>
        </div>
        <div className="my-[8px] flex flex-row-reverse">
          <div className="bg-[#0084ff] rounded-2xl px-[12px] py-[8px]">
            <p className="text-[#e4f2ff] font-[15px]">Van minh</p>
          </div>
        </div>
      </div>

      <div className=" p-[8px] flex items-center gap-2 py-1">
        <TbPhotoFilled className={`${isFocus ? 'text-[#0084ff]' : 'text-[#666768]'} `} size={24} />
        <div className="px-1 h-[36px] bg-[#3a3b3c] rounded-full flex-[1] flex items-center">
          <input
            className="ml-2 text-[15px] font-thin outline-none bg-transparent text-white"
            placeholder="Aa"
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
        </div>
        <BiSolidSend size={24} className={`${isFocus ? 'text-[#0084ff]' : 'text-[#666768]'} `} />
      </div>
    </div>
  );
};

export default ChatBox;
