'use client';

import Image from 'next/image';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { RiShareForwardLine } from 'react-icons/ri';
import { BsThreeDots } from 'react-icons/bs';
import { MdPublic } from 'react-icons/md';
import cn from 'classnames';
import Modal from '@components/common/Modal';
import { usePostInteractions } from '@hooks/client/usePostInteractions';
import { IPost } from '@types';
import Comment from './Comment';
import CommentInput from './CommentInput';

interface PostModalProps {
  post: IPost;
  isOpen: boolean;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, isOpen, onClose }) => {
  const { comments, liked, likes, commentCount, addTopLevel, handleReply, toggleCommentLike, togglePostLike } =
    usePostInteractions(post);

  const footer = <CommentInput onSubmit={addTopLevel} placeholder="Write a comment..." />;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${post.authorName}'s post`}
      footer={footer}
      widthClassName="w-[700px]"
      bodyClassName="max-h-[75vh]"
    >
      <div className="flex flex-col gap-3">
        {/* Author */}
        <div className="flex items-center gap-2">
          <Image
            src={post.authorAvatar}
            alt={post.authorName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="text-[15px] font-semibold text-[#e4e6eb]">{post.authorName}</h4>
            <p className="flex items-center gap-1 text-[13px] font-light text-[#b0b3b8]">
              {post.createdAt} · <MdPublic size={12} />
            </p>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-[#b0b3b8] hover:bg-[#3a3b3c]">
            <BsThreeDots size={20} />
          </button>
        </div>

        {/* Content */}
        <p className="text-[15px] text-[#e4e6eb]">{post.content}</p>

        {/* Counts */}
        <div className="flex items-center justify-between text-[15px] font-light text-[#b0b3b8]">
          <div className="flex items-center gap-1">
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#0780ff]">
              <AiFillLike className="h-[11px] w-[11px] text-white" />
            </div>
            <span>{likes}</span>
          </div>
          <div className="flex gap-3">
            <span>{commentCount} comments</span>
            <span>{post.shares} shares</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 border-y border-[#3e4042] py-[2px]">
          <button
            onClick={togglePostLike}
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

        {/* Comments */}
        <div className="flex flex-col gap-4 pt-1">
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} onReply={handleReply} onToggleLike={toggleCommentLike} />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default PostModal;
