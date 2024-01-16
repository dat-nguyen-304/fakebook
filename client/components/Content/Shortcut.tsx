'use client';

import Image from 'next/image';

interface ShortcutProps {}
const Shortcut: React.FC<ShortcutProps> = () => {
    return (
        <div>
            <div className="p-[6px] mt-[56px] text-[#b0b3b8] font-bold text-[15px] fixed top-0">
                <div className="flex items-center gap-2 mt-[10px] p-2 rounded-lg hover:bg-[#3a3b3c] hover:cursor-pointer">
                    <div className="w-[36px]">
                        <Image src="/avatar.jpg" alt="" width={36} height={36} className="rounded-full" />
                    </div>
                    <p className="text-[#e4e6eb]">Nguyễn Văn An</p>
                </div>
                <div className="flex items-center gap-2 mt-[6px] p-2 rounded-lg hover:bg-[#3a3b3c] hover:cursor-pointer">
                    <div className="w-[40px]">
                        <div className="bg-[url('/shortcut-icon.png')] shortcut-friend-icon"></div>
                    </div>
                    <p>Friends</p>
                </div>
            </div>
        </div>
    );
};

export default Shortcut;
