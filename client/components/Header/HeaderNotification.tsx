import Image from 'next/image';
import { useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { PiMessengerLogoFill } from 'react-icons/pi';
import MessageList from '@components/header/MessageList';
import NotificationList from '@components/header/NotificationList';
import ProfileDropdown from '@components/header/ProfileDropdown';
import ModalWrapper from '@components/wrapper/ModalWrapper';
import cn from 'classnames';

interface HeaderNotificationProps {}

const HeaderNotification: React.FC<HeaderNotificationProps> = () => {
  const [isOpenMessage, setIsOpenMessage] = useState<boolean>(false);
  const messageTriggerRef = useRef<HTMLDivElement>(null);
  const [isOpenNotification, setIsOpenNotification] = useState<boolean>(false);
  const notificationTriggerRef = useRef<HTMLDivElement>(null);
  const [isOpenProfile, setIsOpenProfile] = useState<boolean>(false);
  const profileTriggerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-center flex-row-reverse gap-3 mr-2 select-none">
      <div
        className="rounded-full cursor-pointer"
        ref={profileTriggerRef}
        onClick={() => {
          setIsOpenProfile(!isOpenProfile);
        }}
      >
        <Image src="/avatar.jpg" alt="" width={40} height={40} className="rounded-full" />
      </div>
      <div
        ref={notificationTriggerRef}
        onClick={() => {
          setIsOpenNotification(!isOpenNotification);
        }}
        className={cn(
          'relative w-[40px] h-[40px] flex justify-center items-center rounded-full p-3 cursor-pointer hover:brightness-125',
          isOpenNotification ? 'bg-[#243a52]' : 'bg-[#3a3b3c]'
        )}
      >
        <FaBell size={20} color={cn(isOpenNotification ? '#0866ff' : '#e4e6eb')} />
        <div className="absolute top-[-5px] right-[-5px] text-[13px] text-white flex justify-center items-center px-[6px] h-[19px] bg-[#e41e3f] rounded-full">
          10
        </div>
      </div>
      <div
        ref={messageTriggerRef}
        onClick={() => {
          setIsOpenMessage(!isOpenMessage);
        }}
        className={cn(
          'relative w-[40px] h-[40px] flex justify-center items-center rounded-full p-2 cursor-pointer hover:brightness-125',
          isOpenMessage ? 'bg-[#243a52]' : 'bg-[#3a3b3c]'
        )}
      >
        <PiMessengerLogoFill size={20} color={cn(isOpenMessage ? '#0866ff' : '#e4e6eb')} />
        <div className="absolute top-[-5px] right-[-5px] text-[13px] text-white flex justify-center items-center px-[6px] h-[19px] bg-[#e41e3f] rounded-full">
          9
        </div>
      </div>
      <ModalWrapper isOpen={isOpenMessage} onClose={() => setIsOpenMessage(false)} triggerRef={messageTriggerRef}>
        <MessageList />
      </ModalWrapper>
      <ModalWrapper
        isOpen={isOpenNotification}
        onClose={() => setIsOpenNotification(false)}
        triggerRef={notificationTriggerRef}
      >
        <NotificationList />
      </ModalWrapper>
      <ModalWrapper isOpen={isOpenProfile} onClose={() => setIsOpenProfile(false)} triggerRef={profileTriggerRef}>
        <ProfileDropdown onOpen={setIsOpenProfile} />
      </ModalWrapper>
    </div>
  );
};

export default HeaderNotification;
