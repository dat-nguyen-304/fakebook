'use client';
import { IoHomeSharp } from 'react-icons/io5';

interface PostsProps {}
const Posts: React.FC<PostsProps> = () => {
    return (
        <>
            <div className="text-[#e4e6eb] w-1/3">
                <div className="bg-[#242526] py-[12px] px-[16px] rounded-md">
                    <h3 className="text-[20px] font-bold">Intro</h3>
                    <div className="w-full">
                        <p className="text-[15px] text-center my-[16px]">I love you</p>
                        <p className="text-[15px] flex items-center gap-2 my-[16px]">
                            <IoHomeSharp color="#e4e6eb" size={20} /> Lives in Ben Cat
                        </p>
                    </div>
                </div>
            </div>
            <div className="text-[#e4e6eb] w-2/3">
                <div className="bg-[#242526] py-[12px] px-[16px] rounded-md">
                    <h3 className="text-[20px] font-bold">Posts</h3>
                </div>
            </div>
        </>
    );
};

export default Posts;
