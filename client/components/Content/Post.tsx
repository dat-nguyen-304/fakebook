'use client';

import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { RiShareForwardLine } from 'react-icons/ri';
import { MdPublic } from 'react-icons/md';
import Image from 'next/image';
import cn from 'classnames';
import { useState } from 'react';
import { IComment, IPost } from '@types';

interface PostProps {
  post: IPost;
  onOpen: () => void;
}

// Total comments including nested replies.
const countComments = (comments: IComment[]): number =>
  comments.reduce((total, c) => total + 1 + countComments(c.replies ?? []), 0);

const Post: React.FC<PostProps> = ({ post, onOpen }) => {
  const [liked, setLiked] = useState<boolean>(post.isLiked ?? false);
  const [likes, setLikes] = useState<number>(post.likes);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(prev => !prev);
    setLikes(prev => prev + (liked ? -1 : 1));
  };

  const commentCount = countComments(post.comments);

  return (
    <div className="my-4 rounded-md bg-[#242526] px-[16px] pt-[12px] text-[#b0b3b8]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Image
          src={post.authorAvatar}
          alt={post.authorName}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <h4 className="text-[15px] font-bold text-[#e4e6eb]">{post.authorName}</h4>
          <p className="flex items-center gap-1 text-[13px] font-light">
            {post.createdAt} · <MdPublic size={12} />
          </p>
        </div>
      </div>

      {/* Content (click to open modal) */}
      <div className="cursor-pointer" onClick={onOpen}>
        <p className="my-[10px] text-[15px] text-[#e4e6eb]">{post.content}</p>
        {post.image && (
          <Image
            src={post.image}
            alt="post image"
            width={640}
            height={360}
            className="mb-[10px] w-full rounded-lg object-cover"
            unoptimized
          />
        )}
      </div>

      {/* Counts */}
      <div className="flex items-center justify-between shadow-border-t">
        <div className="flex items-center gap-1 py-[10px]">
          <div className="ml-[2px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#0780ff]">
            <AiFillLike className="h-[11px] w-[11px] text-white" />
          </div>
          <p className="text-[15px] font-light">{likes}</p>
        </div>
        <div className="flex gap-3 py-[10px] text-[15px] font-light">
          <button onClick={onOpen} className="hover:cursor-pointer hover:underline">
            {commentCount} comments
          </button>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="shadow-border-t py-[4px]">
        <div className="grid grid-cols-3">
          <button
            onClick={toggleLike}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-md py-[6px] hover:bg-[#3a3b3c]',
              liked ? 'text-[#0866ff]' : 'text-[#b0b3b8]'
            )}
          >
            {liked ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
            <p className="text-[15px]">Like</p>
          </button>
          <button
            onClick={onOpen}
            className="flex w-full items-center justify-center gap-2 rounded-md py-[6px] hover:bg-[#3a3b3c]"
          >
            <FaRegComment size={18} />
            <p className="text-[15px]">Comment</p>
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-md py-[6px] hover:bg-[#3a3b3c]">
            <RiShareForwardLine size={20} />
            <p className="text-[15px]">Share</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
