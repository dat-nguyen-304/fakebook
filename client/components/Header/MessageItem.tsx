import Image from 'next/image';

interface MessageItemProps {}
const MessageItem: React.FC<MessageItemProps> = () => {
    return (
        <div className="flex items-center gap-2 hover:bg-[#3a3b3c] hover:cursor-pointer p-[2px] rounded-lg my-1">
            <div className="w-[56px] p-[6px] relative">
                <Image src="/avatar.jpg" alt="" width={56} height={56} className="rounded-full" />
                <div className="absolute bottom-1 right-1 bg-[#31a24c] w-[16px] h-[16px] border-2 border-black rounded-full"></div>
            </div>
            <div className="p-[6px]">
                <h4 className="font-bold text-[15px] text-[#e4e6eb]">Nguyễn Văn An</h4>
                <p className="flex items-center font-light text-[13px]">
                    <span>Goodbye</span>
                    <div className="w-[2px] h-[2px] bg-[#e4e6eb] mx-1 rounded-full"></div>
                    <span>12m</span>
                </p>
            </div>
        </div>
    );
};

export default MessageItem;
