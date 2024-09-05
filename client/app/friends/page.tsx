'use client';

import { Tabs, useTab } from '@/hooks';
import Image from 'next/image';
import { useEffect } from 'react';

export default function FriendSuggestion() {
  const { onChangeTab } = useTab();
  useEffect(() => {
    onChangeTab(Tabs.FRIEND);
  }, []);
  return (
    <div className="">
      <div className="mt-[56px] grid grid-cols-4 p-[6px] min-h-[calc(100vh-56px)] bg-[#18191a]">
        <div>
          <div className="w-1/4 p-[6px] mt-[60px] text-[#b0b3b8] font-bold text-[15px] fixed top-0">
            <div className="flex items-center gap-2 mt-[10px] p-2 rounded-lg hover:bg-[#3a3b3c] hover:cursor-pointer">
              <div className="w-[36px]">
                <Image src="/avatar.jpg" alt="" width={36} height={36} className="rounded-full" />
              </div>
              <p className="text-[#e4e6eb]">Nguyễn Văn An</p>
            </div>
            <div className="flex items-center gap-2 mt-[6px] p-2 rounded-lg hover:bg-[#3a3b3c] hover:cursor-pointer">
              <div className="w-[40px]">
                <div className="bg-[url('/shortcut-icon.png')] shortcut-friend-icon"></div>
              </div>
              <p>Friends</p>
            </div>
          </div>
        </div>
        <div className="col-span-3 p-[20px]">
          <h3 className="text-[20px] text-[#e4e6eb] font-bold mb-[16px]">People you may know</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2">
            <div className="shadow-border rounded-md overflow-hidden mt-1">
              <div className="">
                <Image src="/avatar.jpg" alt="" width={232} height={232} className="rounded-md" />
              </div>
              <div className="bg-[#242526] text-[#e4e6eb] font-semibold py-[8px] px-[12px] ">
                <h4 className="text-[17px] font-bold">Tên friend</h4>
                <h4 className="text-[15px] font-extralight">1 mutual friend</h4>
                <button className="w-full mb-1 mt-6 bg-[#233950] text-[#235bd2] py-2 rounded-md hover:brightness-125">
                  Add friend
                </button>
                <button className="w-full my-1 bg-[#3a3b3c] py-2 rounded-md hover:brightness-125">Remove</button>
              </div>
            </div>
            <div className="shadow-border rounded-md overflow-hidden mt-1">
              <div className="">
                <Image src="/avatar.jpg" alt="" width={232} height={232} className="rounded-md" />
              </div>
              <div className="bg-[#242526] text-[#e4e6eb] font-semibold py-[8px] px-[12px] ">
                <h4 className="text-[17px] font-bold">Tên friend</h4>
                <h4 className="text-[15px] font-extralight">1 mutual friend</h4>
                <button className="w-full mb-1 mt-6 bg-[#233950] text-[#235bd2] py-2 rounded-md hover:brightness-125">
                  Add friend
                </button>
                <button className="w-full my-1 bg-[#3a3b3c] py-2 rounded-md hover:brightness-125">Remove</button>
              </div>
            </div>
            <div className="shadow-border rounded-md overflow-hidden mt-1">
              <div className="">
                <Image src="/avatar.jpg" alt="" width={232} height={232} className="rounded-md" />
              </div>
              <div className="bg-[#242526] text-[#e4e6eb] font-semibold py-[8px] px-[12px] ">
                <h4 className="text-[17px] font-bold">Tên friend</h4>
                <h4 className="text-[15px] font-extralight">1 mutual friend</h4>
                <button className="w-full mb-1 mt-6 bg-[#233950] text-[#235bd2] py-2 rounded-md hover:brightness-125">
                  Add friend
                </button>
                <button className="w-full my-1 bg-[#3a3b3c] py-2 rounded-md hover:brightness-125">Remove</button>
              </div>
            </div>
            <div className="shadow-border rounded-md overflow-hidden mt-1">
              <div className="">
                <Image src="/avatar.jpg" alt="" width={232} height={232} className="rounded-md" />
              </div>
              <div className="bg-[#242526] text-[#e4e6eb] font-semibold py-[8px] px-[12px] ">
                <h4 className="text-[17px] font-bold">Tên friend</h4>
                <h4 className="text-[15px] font-extralight">1 mutual friend</h4>
                <button className="w-full mb-1 mt-6 bg-[#233950] text-[#235bd2] py-2 rounded-md hover:brightness-125">
                  Add friend
                </button>
                <button className="w-full my-1 bg-[#3a3b3c] py-2 rounded-md hover:brightness-125">Remove</button>
              </div>
            </div>
            <div className="shadow-border rounded-md overflow-hidden mt-1">
              <div className="">
                <Image src="/avatar.jpg" alt="" width={232} height={232} className="rounded-md" />
              </div>
              <div className="bg-[#242526] text-[#e4e6eb] font-semibold py-[8px] px-[12px] ">
                <h4 className="text-[17px] font-bold">Tên friend</h4>
                <h4 className="text-[15px] font-extralight">1 mutual friend</h4>
                <button className="w-full mb-1 mt-6 bg-[#233950] text-[#235bd2] py-2 rounded-md hover:brightness-125">
                  Add friend
                </button>
                <button className="w-full my-1 bg-[#3a3b3c] py-2 rounded-md hover:brightness-125">Remove</button>
              </div>
            </div>
            <div className="shadow-border rounded-md overflow-hidden mt-1">
              <div className="">
                <Image src="/avatar.jpg" alt="" width={232} height={232} className="rounded-md" />
              </div>
              <div className="bg-[#242526] text-[#e4e6eb] font-semibold py-[8px] px-[12px] ">
                <h4 className="text-[17px] font-bold">Tên friend</h4>
                <h4 className="text-[15px] font-extralight">1 mutual friend</h4>
                <button className="w-full mb-1 mt-6 bg-[#233950] text-[#235bd2] py-2 rounded-md hover:brightness-125">
                  Add friend
                </button>
                <button className="w-full my-1 bg-[#3a3b3c] py-2 rounded-md hover:brightness-125">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
