import Image from 'next/image';
import { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { PiMessengerLogoFill } from 'react-icons/pi';
import MessageList from './MessageList';
import NotificationList from './NotificationList';

interface HeaderNotificationProps {}

const HeaderNotification: React.FC<HeaderNotificationProps> = () => {
    const [isMessageOpen, setIsMessageOpen] = useState<boolean>(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

    return (
        <div className="flex items-center flex-row-reverse gap-3 mr-2 select-none">
            <div className="rounded-full">
                <Image src="/avatar.jpg" alt="" width={40} height={40} className="rounded-full" />
            </div>
            <div
                onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsMessageOpen(false);
                }}
                className="relative w-[40px] h-[40px] flex justify-center items-center bg-[#3a3b3c] rounded-full p-3 cursor-pointer hover:brightness-125"
            >
                <FaBell size={20} color="#e4e6eb" />
                <div className="absolute top-[-5px] right-[-5px] text-[13px] text-white flex justify-center items-center px-[6px] h-[19px] bg-[#e41e3f] rounded-full">
                    10
                </div>
            </div>
            <div
                onClick={() => {
                    setIsMessageOpen(!isMessageOpen);
                    setIsNotificationOpen(false);
                }}
                className="relative w-[40px] h-[40px] flex justify-center items-center bg-[#3a3b3c] rounded-full p-2 cursor-pointer hover:brightness-125"
            >
                <PiMessengerLogoFill size={20} color="#e4e6eb" />
                <div className="absolute top-[-5px] right-[-5px] text-[13px] text-white flex justify-center items-center px-[6px] h-[19px] bg-[#e41e3f] rounded-full">
                    9
                </div>
            </div>
            <MessageList isMessageOpen={isMessageOpen} />
            <NotificationList isNotificationOpen={isNotificationOpen} />
        </div>
    );
};

export default HeaderNotification;
