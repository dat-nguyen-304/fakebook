'use client';

import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { TiMessages } from 'react-icons/ti';
import Image from 'next/image';

interface PostProps {}
const Post: React.FC<PostProps> = () => {
  return (
    <div className="px-[16px] pt-[12px] rounded-md my-4 bg-[#242526] text-[#b0b3b8]">
      <div className="flex items-center gap-2">
        <div className="w-[40px]">
          <Image src="/avatar.jpg" alt="" width={40} height={40} className="rounded-full" />
        </div>
        <div className="">
          <h4 className="font-bold text-[15px] text-[#e4e6eb]">Nguyễn Văn An</h4>
          <p className="font-light text-[13px]">12m</p>
        </div>
      </div>
      <p className="my-[10px] text-[15px]">Hello how are you</p>
      <div className="flex justify-between items-center shadow-border-t">
        <div className="flex items-center py-[10px] gap-1">
          <div className="ml-[2px] w-[18px] h-[18px] bg-[#0780ff] rounded-full flex justify-center items-center">
            <AiFillLike className="w-[11px] h-[11px] text-white" />
          </div>
          <p className="text-[15px] font-light">18</p>
        </div>
        <div className="py-[10px] hover:underline hover:cursor-pointer">
          <p className="text-[15px] font-light">18 comments</p>
        </div>
      </div>
      <div className="shadow-border-t py-[4px]">
        <div className="grid grid-cols-2">
          <button className="w-full py-[6px] rounded-md flex items-center justify-center gap-2 hover:bg-[#3a3b3c]">
            <AiOutlineLike size={20} />
            <p className="text-[15px]">Like</p>
          </button>
          <button className="w-full py-[6px] rounded-md flex items-center justify-center gap-2 hover:bg-[#3a3b3c]">
            <TiMessages size={20} />
            <p className="text-[15px]">Comment</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
