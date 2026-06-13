'use client';

import { useState } from 'react';
import Post from './Post';
import PostModal from './PostModal';
import PhotoTheaterModal from './PhotoTheaterModal';
import { posts } from '@mock/posts';
import { IPost } from '@types';

interface NewsFeedProps {}
const NewsFeed: React.FC<NewsFeedProps> = () => {
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  const close = () => setSelectedPost(null);

  return (
    <div className="flex-1 min-w-0 max-w-[800px] mx-auto py-4">
      {posts.map(post => (
        <Post key={post.id} post={post} onOpen={() => setSelectedPost(post)} />
      ))}

      {/* Image posts open the full-screen theater; text posts use the centered popup. */}
      {selectedPost &&
        (selectedPost.image ? (
          <PhotoTheaterModal key={selectedPost.id} post={selectedPost} isOpen onClose={close} />
        ) : (
          <PostModal key={selectedPost.id} post={selectedPost} isOpen onClose={close} />
        ))}
    </div>
  );
};

export default NewsFeed;
