'use client';

import { useState } from 'react';
import Post from '@components/content/Post';
import PostModal from '@components/content/PostModal';
import PhotoTheaterModal from '@components/content/PhotoTheaterModal';
import { posts } from '@mock/posts';
import { IPost } from '@types';

interface PostsProps {}
const Posts: React.FC<PostsProps> = () => {
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  const close = () => setSelectedPost(null);

  return (
    <div className="text-[#e4e6eb] w-3/5">
      <div className="bg-[#242526] py-[12px] px-[16px] rounded-md">
        <h3 className="text-[20px] font-bold">Posts</h3>
      </div>
      <div>
        {posts.map(post => (
          <Post key={post.id} post={post} onOpen={() => setSelectedPost(post)} />
        ))}
      </div>

      {selectedPost &&
        (selectedPost.image ? (
          <PhotoTheaterModal key={selectedPost.id} post={selectedPost} isOpen onClose={close} />
        ) : (
          <PostModal key={selectedPost.id} post={selectedPost} isOpen onClose={close} />
        ))}
    </div>
  );
};

export default Posts;
