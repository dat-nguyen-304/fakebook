'use client';

import Posts from '@components/profile/Posts';
import Image from 'next/image';
import { FaPencilAlt } from 'react-icons/fa';

interface ContentProps {}
const Content: React.FC<ContentProps> = () => {
  return (
    <div>
      <div className="mt-[56px] bg-gradient-to-b from-[#4c4a47] to-[#242526]">
        <div className="w-full max-w-[1100px] mx-auto">
          <Image
            src="/background.png"
            alt=""
            width={1280}
            height={853}
            className="w-full h-[406px] object-cover rounded-md"
          />
          <div className="px-[32px]">
            <div className="grid grid-cols-5 shadow-border-b h-[108px]">
              <div className="translate-y-[-50%] flex h-[168px] w-[168px]">
                <Image
                  src="/avatar.jpg"
                  alt=""
                  width={168}
                  height={168}
                  className="rounded-full object-cover w-[168px] h-[168px]"
                />
              </div>
              <div className="flex items-center justify-between w-full col-span-4 h-[96px]">
                <div className="">
                  <h3 className="text-[#e4e6eb] text-[32px] font-bold">Nguyễn Văn An</h3>
                  <p className="text-[#b3b0b8] text-[15px]">500 friends</p>
                </div>
                <div>
                  <button className="text-[#e4e6eb] text-[15px] font-semibold flex items-center gap-2 bg-[#3a3b3c] rounded-md px-[12px] py-[6px]">
                    <FaPencilAlt />
                    Edit profile
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center py-1 h-[54px]">
              <div
                className={`mx-[4px] px-4 flex justify-center items-center cursor-pointer h-full border-b-[4px] border-b-[#0866ff] text-[#0866ff] `}
              >
                Posts
              </div>
              <div
                className={`mx-[4px] px-4 flex justify-center items-center cursor-pointer h-[48px] rounded-lg hover:bg-[#3a3b3c] text-[#b0b3b8]`}
              >
                Friends
              </div>
              <div
                className={`mx-[4px] px-4 flex justify-center items-center cursor-pointer h-[48px] rounded-lg hover:bg-[#3a3b3c] text-[#b0b3b8]`}
              >
                Photos
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#18191a]">
        <div className="w-full max-w-[1036px] mx-auto h-[100vh] py-[16px] flex justify-between gap-4">
          <Posts />
        </div>
      </div>
    </div>
  );
};

export default Content;
