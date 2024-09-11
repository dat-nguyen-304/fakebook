'use client';

import Post from '@components/content/Post';

interface PostsProps {}
const Posts: React.FC<PostsProps> = () => {
  return (
    <div className="text-[#e4e6eb] w-3/5">
      <div className="bg-[#242526] py-[12px] px-[16px] rounded-md">
        <h3 className="text-[20px] font-bold">Posts</h3>
      </div>
      <div>
        <Post />
        <Post />
        <Post />
      </div>
    </div>
  );
};

export default Posts;
