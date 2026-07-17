'use client';

import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { RiShareForwardLine } from 'react-icons/ri';
import cn from 'classnames';

interface PostEngagementProps {
  likes: number;
  commentCount: number;
  shares: number;
  liked: boolean;
  onToggleLike: () => void;
}

// Reaction counts + Like/Comment/Share bar, shared by PostModal and PhotoTheaterModal.
const PostEngagement: React.FC<PostEngagementProps> = ({ likes, commentCount, shares, liked, onToggleLike }) => (
  <div>
    <div className="flex items-center justify-between text-[15px] font-light text-[#b0b3b8]">
      <div className="flex items-center gap-1">
        <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#0780ff]">
          <AiFillLike className="h-[11px] w-[11px] text-white" />
        </div>
        <span>{likes}</span>
      </div>
      <div className="flex gap-3">
        <span>{commentCount} comments</span>
        <span>{shares} shares</span>
      </div>
    </div>

    <div className="mt-2 grid grid-cols-3 border-y border-[#3e4042] py-[2px]">
      <button
        onClick={onToggleLike}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-md py-[6px] font-semibold hover:bg-[#3a3b3c]',
          liked ? 'text-[#0866ff]' : 'text-[#b0b3b8]'
        )}
      >
        {liked ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
        <span className="text-[15px]">Like</span>
      </button>
      <button className="flex w-full items-center justify-center gap-2 rounded-md py-[6px] text-[#b0b3b8] hover:bg-[#3a3b3c]">
        <FaRegComment size={18} />
        <span className="text-[15px]">Comment</span>
      </button>
      <button className="flex w-full items-center justify-center gap-2 rounded-md py-[6px] text-[#b0b3b8] hover:bg-[#3a3b3c]">
        <RiShareForwardLine size={20} />
        <span className="text-[15px]">Share</span>
      </button>
    </div>
  </div>
);

export default PostEngagement;
