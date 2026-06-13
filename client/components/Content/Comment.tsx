'use client';

import { useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { IComment } from '@types';
import CommentInput from './CommentInput';

interface CommentProps {
  comment: IComment;
  onReply: (parentId: string, content: string) => void;
  onToggleLike: (id: string) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onReply, onToggleLike }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleReply = (content: string) => {
    onReply(comment.id, content);
    setShowReplyInput(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <Image
          src={comment.authorAvatar}
          alt={comment.authorName}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />
        <div className="flex flex-col">
          {/* Comment bubble */}
          <div className="w-fit rounded-2xl bg-[#3a3b3c] px-3 py-2">
            <h5 className="text-[13px] font-semibold text-[#e4e6eb]">{comment.authorName}</h5>
            <p className="text-[15px] text-[#e4e6eb]">{comment.content}</p>
          </div>
          {/* Actions row */}
          <div className="flex items-center gap-3 px-3 pt-1 text-[12px] font-semibold text-[#b0b3b8]">
            <span>{comment.createdAt}</span>
            <button
              onClick={() => onToggleLike(comment.id)}
              className={cn('hover:underline', comment.isLiked && 'text-[#0866ff]')}
            >
              Like
            </button>
            <button onClick={() => setShowReplyInput(prev => !prev)} className="hover:underline">
              Reply
            </button>
            {comment.likes > 0 && (
              <span className="flex items-center gap-1 font-normal">
                <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#0866ff] text-[9px] text-white">
                  👍
                </span>
                {comment.likes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Replies (indented) + inline reply composer */}
      {(comment.replies?.length || showReplyInput) && (
        <div className="ml-[40px] mt-2 flex flex-col gap-3 border-l-2 border-[#3e4042] pl-3">
          {comment.replies?.map(reply => (
            <Comment key={reply.id} comment={reply} onReply={onReply} onToggleLike={onToggleLike} />
          ))}
          {showReplyInput && (
            <CommentInput
              size="sm"
              autoFocus
              placeholder={`Reply to ${comment.authorName}...`}
              onSubmit={handleReply}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
