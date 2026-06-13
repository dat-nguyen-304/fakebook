'use client';

import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaFacebook } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { MdPublic } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { usePostInteractions } from '@hooks/client/usePostInteractions';
import { useOpenModal } from '@hooks/client/useOpenModal';
import { useMe } from '@hooks/api/user';
import HeaderNotification from '@components/header/HeaderNotification';
import { IPost } from '@types';
import Comment from './Comment';
import CommentInput from './CommentInput';
import PostEngagement from './PostEngagement';

interface PhotoTheaterModalProps {
  post: IPost;
  isOpen: boolean;
  onClose: () => void;
}

const PhotoTheaterModal: React.FC<PhotoTheaterModalProps> = ({ post, isOpen, onClose }) => {
  const { comments, liked, likes, commentCount, addTopLevel, handleReply, toggleCommentLike, togglePostLike } =
    usePostInteractions(post);
  const { onModalOpen, onModalClose } = useOpenModal();
  const { data: user } = useMe();
  const router = useRouter();

  const goHome = () => {
    onClose();
    router.push('/');
  };

  // Portal targets document.body, which only exists on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll, flag the shared modal state (header reacts to it),
  // and close on Escape while open.
  useEffect(() => {
    if (!isOpen) return;
    onModalOpen();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '16px';
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      onModalClose();
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[300] flex bg-black">
      {/* Left: photo on a dark backdrop. Clicking the margin closes. */}
      <div className="relative flex flex-1 items-center justify-center" onClick={onClose}>
        {/* Exit + Facebook logo, top-left over the photo */}
        <div
          className="absolute left-0 top-0 z-10 flex items-center gap-2 px-4 py-2"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3a3b3c] text-[#e4e6eb] hover:brightness-125"
          >
            <RxCross1 size={20} />
          </button>
          <button onClick={goHome} aria-label="Go to homepage" className="hover:brightness-110">
            <FaFacebook size={40} className="text-[#0866ff]" />
          </button>
        </div>
        {post.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt="post"
            className="max-h-[94vh] max-w-full object-contain"
            onClick={e => e.stopPropagation()}
          />
        )}
      </div>

      {/* Right: comment sidebar */}
      <aside className="flex h-screen w-[360px] flex-col bg-[#242526] xl:w-[440px]">
        {/* Top nav icons — same functional buttons (messages/notifications/profile) as the app header */}
        {user && (
          <div className="flex items-center justify-end px-2 py-2 border-b border-[#3e4042]">
            <HeaderNotification user={user} />
          </div>
        )}
        {/* Author header */}
        <div className="flex items-center gap-2 p-4 shadow-border-b">
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

        {/* Scrollable body: caption + counts + actions + comments.
            min-h-0 lets this flex child shrink and scroll instead of growing
            to fit all comments — which is what pins the composer to the bottom. */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <p className="text-[15px] text-[#e4e6eb]">{post.content}</p>

          <div className="mt-3">
            <PostEngagement
              likes={likes}
              commentCount={commentCount}
              shares={post.shares}
              liked={liked}
              onToggleLike={togglePostLike}
            />
          </div>

          <div className="mt-3 flex flex-col gap-4">
            {comments.map(comment => (
              <Comment key={comment.id} comment={comment} onReply={handleReply} onToggleLike={toggleCommentLike} />
            ))}
          </div>

          {/* Composer sits right below the latest comment (flows with the list) */}
          <div className="mt-4">
            <CommentInput onSubmit={addTopLevel} placeholder="Write a comment..." />
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
};

export default PhotoTheaterModal;
