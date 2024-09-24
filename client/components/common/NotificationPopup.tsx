import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import cn from 'classnames';
import { useRouter } from 'next/navigation';

interface NotificationPopupProps {
  senderId: string;
  senderName: string;
  avatar: string;
  content: string;
  createdAt: Date;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ senderId, senderName, avatar, content, createdAt }) => {
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(false), 5000);
    setVisible(true);
    setShouldRender(true);
    return () => clearTimeout(timerRef.current as NodeJS.Timeout);
  }, [senderId, senderName, avatar, content, createdAt]);

  useEffect(() => {
    if (hovered) {
      clearTimeout(timerRef.current as NodeJS.Timeout);
      setVisible(true);
    }
    return () => clearTimeout(timerRef.current as NodeJS.Timeout);
  }, [hovered]);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => setShouldRender(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleAccept = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log('accept');
  };

  const handleReject = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log('reject');
  };

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        'fixed bottom-5 left-5 cursor-pointer bg-[#242526] shadow-xl text-white p-4 rounded-lg flex items-center transition-opacity duration-[2000ms]',
        visible ? 'opacity-100' : 'opacity-0'
      )}
      onClick={() => {
        router.push(`/${senderId}`);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image src={avatar} width={60} height={60} alt={`${senderName}'s avatar`} className="rounded-full mr-2" />
      <div>
        <p className="text-[15px]">
          <span className="font-semibold">{senderName} </span>
          <span className="font-light">{content}</span>
        </p>
        <small className="text-[#0b60e9] text-[13px]">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </small>
        <div className="mt-2 flex gap-1">
          <button
            onClick={e => handleAccept(e)}
            className="bg-[#0866ff] text-white px-[12px] py-[6px] rounded-md text-[13px]"
          >
            Accept
          </button>
          <button
            onClick={e => handleReject(e)}
            className="bg-[#505153] text-white px-[12px] py-[6px] rounded-md text-[13px]"
          >
            Reject
          </button>
        </div>
      </div>
      <div className="ml-2 w-2 h-2 bg-[#0b60e9] rounded-full"></div>
    </div>
  );
};

export default NotificationPopup;
