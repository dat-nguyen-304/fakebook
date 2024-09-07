import Image from 'next/image';
import { FaBell } from 'react-icons/fa';

interface NotificationItemProps {}
const NotificationItem: React.FC<NotificationItemProps> = () => {
  return (
    <div className="flex items-center gap-2 hover:bg-[#3a3b3c] hover:cursor-pointer p-[2px] rounded-lg my-1">
      <div className="w-[56px] h-[56px] m-[6px] relative">
        <Image src="/avatar.jpg" alt="" width={56} height={56} className="rounded-full" />
        <div className="absolute bottom-0 right-[-8px] w-[28px] h-[28px] rounded-full bg-[#65696f] flex justify-center items-center">
          <FaBell size={16} color="#ffffff" />
        </div>
      </div>
      <div className="p-[6px]">
        <p>
          <span className="font-bold text-[15px] text-[#e2e5e9]">Nguyễn Văn An </span>
          <span className="text-[#ced1d4]">accepted your friend request.</span>
        </p>
        <p className="flex items-center font-light text-[13px]">
          <span>12m</span>
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;
