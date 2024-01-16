'use client';

import Post from './Post';

interface NewsFeedProps {}
const NewsFeed: React.FC<NewsFeedProps> = () => {
    return (
        <div className="col-span-2 px-[48px]">
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
        </div>
    );
};

export default NewsFeed;
