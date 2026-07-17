'use client';

import Image from 'next/image';
import { BsThreeDots } from 'react-icons/bs';
import { MdPublic } from 'react-icons/md';
import Modal from '@components/common/Modal';
import { usePostInteractions } from '@hooks/client/usePostInteractions';
import { IPost } from '@types';
import Comment from './Comment';
import CommentInput from './CommentInput';
import PostEngagement from './PostEngagement';

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

        {/* Counts + action bar */}
        <PostEngagement
          likes={likes}
          commentCount={commentCount}
          shares={post.shares}
          liked={liked}
          onToggleLike={togglePostLike}
        />

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
