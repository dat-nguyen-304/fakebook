'use client';

import { useChatBox } from '@hooks/client';
import Image from 'next/image';

interface ContactsProps {}
const Contacts: React.FC<ContactsProps> = () => {
  const { onChangeOpen, open } = useChatBox();
  return (
    <aside className="hidden lg:block w-[300px] shrink-0 self-start sticky top-[56px] max-h-[calc(100vh-56px)] overflow-y-auto py-4 pr-4 text-[#b0b3b8] text-[15px]">
      <h3 className="text-[17px] font-bold">Contacts</h3>
        <div
          onClick={() => onChangeOpen(!open)}
          className="flex items-center gap-2 mt-[10px] p-2 rounded-lg hover:bg-[#3a3b3c] hover:cursor-pointer"
        >
          <div className="w-[36px] relative">
            <Image src="/avatar.jpg" alt="" width={36} height={36} className="rounded-full" />
            <div className="absolute bottom-0 right-0 bg-[#31a24c] w-[12px] h-[12px] border-2 border-black rounded-full"></div>
          </div>
          <p className="text-[#e4e6eb]">Nguyễn Văn An</p>
        </div>
        <div className="flex items-center gap-2 mt-[10px] p-2 rounded-lg hover:bg-[#3a3b3c] hover:cursor-pointer">
          <div className="w-[36px] relative">
            <Image src="/avatar.jpg" alt="" width={36} height={36} className="rounded-full" />
            <div className="absolute bottom-0 right-0 bg-[#31a24c] w-[12px] h-[12px] border-2 border-black rounded-full"></div>
          </div>
          <p className="text-[#e4e6eb]">Nguyễn Văn An</p>
        </div>
        <div className="flex items-center gap-2 mt-[10px] p-2 rounded-lg hover:bg-[#3a3b3c] hover:cursor-pointer">
          <div className="w-[36px] relative">
            <Image src="/avatar.jpg" alt="" width={36} height={36} className="rounded-full" />
            <div className="absolute bottom-0 right-0 bg-[#31a24c] w-[12px] h-[12px] border-2 border-black rounded-full"></div>
          </div>
          <p className="text-[#e4e6eb]">Nguyễn Văn An</p>
        </div>
        <div className="flex items-center gap-2 mt-[10px] p-2 rounded-lg hover:bg-[#3a3b3c] hover:cursor-pointer">
          <div className="w-[36px] relative">
            <Image src="/avatar.jpg" alt="" width={36} height={36} className="rounded-full" />
            <div className="absolute bottom-0 right-0 bg-[#31a24c] w-[12px] h-[12px] border-2 border-black rounded-full"></div>
          </div>
          <p className="text-[#e4e6eb]">Nguyễn Văn An</p>
        </div>
        <div className="flex items-center gap-2 mt-[10px] p-2 rounded-lg hover:bg-[#3a3b3c] hover:cursor-pointer">
          <div className="w-[36px] relative">
            <Image src="/avatar.jpg" alt="" width={36} height={36} className="rounded-full" />
            <div className="absolute bottom-0 right-0 bg-[#31a24c] w-[12px] h-[12px] border-2 border-black rounded-full"></div>
          </div>
          <p className="text-[#e4e6eb]">Nguyễn Văn An</p>
        </div>
    </aside>
  );
};

export default Contacts;
