import { useState } from 'react';
import { IComment, IPost } from '@types';

// Count every comment plus all nested replies.
const countComments = (comments: IComment[]): number =>
  comments.reduce((total, c) => total + 1 + countComments(c.replies ?? []), 0);

// Immutably insert a reply under the comment whose id === parentId.
const insertReply = (comments: IComment[], parentId: string, reply: IComment): IComment[] =>
  comments.map(c => {
    if (c.id === parentId) {
      return { ...c, replies: [...(c.replies ?? []), reply] };
    }
    if (c.replies?.length) {
      return { ...c, replies: insertReply(c.replies, parentId, reply) };
    }
    return c;
  });

// Immutably toggle the like flag/count on the comment whose id matches.
const toggleLikeById = (comments: IComment[], id: string): IComment[] =>
  comments.map(c => {
    if (c.id === id) {
      const isLiked = !c.isLiked;
      return { ...c, isLiked, likes: c.likes + (isLiked ? 1 : -1) };
    }
    if (c.replies?.length) {
      return { ...c, replies: toggleLikeById(c.replies, id) };
    }
    return c;
  });

// Shared in-session interaction state for a post (likes + comment tree).
// Used by both the centered text-post modal and the photo theater modal.
export const usePostInteractions = (post: IPost) => {
  const [comments, setComments] = useState<IComment[]>(post.comments);
  const [liked, setLiked] = useState<boolean>(post.isLiked ?? false);
  const [likes, setLikes] = useState<number>(post.likes);

  const makeComment = (content: string): IComment => ({
    id: crypto.randomUUID(),
    authorName: 'You',
    authorAvatar: '/avatar.jpg',
    content,
    createdAt: 'Just now',
    likes: 0
  });

  const addTopLevel = (content: string) => {
    setComments(prev => [...prev, makeComment(content)]);
  };

  const handleReply = (parentId: string, content: string) => {
    setComments(prev => insertReply(prev, parentId, makeComment(content)));
  };

  const toggleCommentLike = (id: string) => {
    setComments(prev => toggleLikeById(prev, id));
  };

  const togglePostLike = () => {
    setLiked(prev => !prev);
    setLikes(prev => prev + (liked ? -1 : 1));
  };

  return {
    comments,
    liked,
    likes,
    commentCount: countComments(comments),
    addTopLevel,
    handleReply,
    toggleCommentLike,
    togglePostLike
  };
};
