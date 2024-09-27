'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useMe } from '@hooks/api/user';
import { notificationSocket } from '@socket/socket';
import { INotification } from '@types';
import NotificationPopup from '@components/common/NotificationPopup';

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { data: user } = useMe();
  const [notification, setNotification] = useState<INotification | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    if (!notificationSocket.connected) notificationSocket.connect();

    notificationSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      const userId = user.id;
      notificationSocket.emit('join', userId);
    });

    notificationSocket.on('connect_error', err => {
      console.error('Connection error:', err);
    });

    notificationSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    notificationSocket.on('new-notification', data => {
      console.log('New notification received:', data);
      setNotification(data);
    });

    return () => {
      notificationSocket.disconnect();
    };
  }, [user?.id]);

  return (
    <>
      {children}
      {notification && (
        <NotificationPopup
          senderId={notification.sender}
          senderName={notification.senderName}
          avatar={notification.senderAvatar}
          type={notification.type}
          content={notification.content}
          createdAt={notification.createdAt}
        />
      )}
    </>
  );
};
