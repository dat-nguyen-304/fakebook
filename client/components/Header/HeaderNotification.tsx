import Image from 'next/image';
import { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { PiMessengerLogoFill } from 'react-icons/pi';
import MessageList from './MessageList';
import NotificationList from './NotificationList';
import ProfileDropdown from './ProfileDropdown';
import cn from 'classnames';

enum TABS {
  PROFILE = 'profile',
  MESSAGE = 'message',
  NOTIFICATION = 'notification'
}

interface HeaderNotificationProps {}

const HeaderNotification: React.FC<HeaderNotificationProps> = () => {
  const [selectedTab, setSelectedTab] = useState<TABS | null>(null);

  return (
    <div className="flex items-center flex-row-reverse gap-3 mr-2 select-none">
      <div
        className="rounded-full cursor-pointer"
        onClick={() => {
          setSelectedTab(selectedTab === TABS.PROFILE ? null : TABS.PROFILE);
        }}
      >
        <Image src="/avatar.jpg" alt="" width={40} height={40} className="rounded-full" />
      </div>
      <div
        onClick={() => {
          setSelectedTab(selectedTab === TABS.NOTIFICATION ? null : TABS.NOTIFICATION);
        }}
        className={cn(
          'relative w-[40px] h-[40px] flex justify-center items-center rounded-full p-3 cursor-pointer hover:brightness-125',
          selectedTab === TABS.NOTIFICATION ? 'bg-[#243a52]' : 'bg-[#3a3b3c]'
        )}
      >
        <FaBell size={20} color={cn(selectedTab === TABS.NOTIFICATION ? '#0866ff' : '#e4e6eb')} />
        <div className="absolute top-[-5px] right-[-5px] text-[13px] text-white flex justify-center items-center px-[6px] h-[19px] bg-[#e41e3f] rounded-full">
          10
        </div>
      </div>
      <div
        onClick={() => {
          setSelectedTab(selectedTab === TABS.MESSAGE ? null : TABS.MESSAGE);
        }}
        className={cn(
          'relative w-[40px] h-[40px] flex justify-center items-center rounded-full p-2 cursor-pointer hover:brightness-125',
          selectedTab === TABS.MESSAGE ? 'bg-[#243a52]' : 'bg-[#3a3b3c]'
        )}
      >
        <PiMessengerLogoFill size={20} color={cn(selectedTab === TABS.MESSAGE ? '#0866ff' : '#e4e6eb')} />
        <div className="absolute top-[-5px] right-[-5px] text-[13px] text-white flex justify-center items-center px-[6px] h-[19px] bg-[#e41e3f] rounded-full">
          9
        </div>
      </div>
      <MessageList isMessageOpen={selectedTab === TABS.MESSAGE} />
      <NotificationList isNotificationOpen={selectedTab === TABS.NOTIFICATION} />
      <ProfileDropdown isProfileOpen={selectedTab === TABS.PROFILE} />
    </div>
  );
};

export default HeaderNotification;
