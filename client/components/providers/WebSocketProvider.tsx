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

    const onConnect = () => {
      console.log('Connected to WebSocket server');
      notificationSocket.emit('join', user.id);
    };

    const onNotification = (data: INotification) => {
      console.log('New notification received:', data);
      setNotification(data);
    };

    const onConnectError = (err: any) => {
      console.error('Connection error:', err);
    };

    const onDisconnect = () => {
      console.log('Disconnected from WebSocket server');
    };

    if (notificationSocket.connected) {
      onConnect();
    } else {
      notificationSocket.connect();
    }

    notificationSocket.on('connect', onConnect);
    notificationSocket.on('connect_error', onConnectError);
    notificationSocket.on('disconnect', onDisconnect);
    notificationSocket.on('new-notification', onNotification);

    return () => {
      notificationSocket.off('connect', onConnect);
      notificationSocket.off('connect_error', onConnectError);
      notificationSocket.off('disconnect', onDisconnect);
      notificationSocket.off('new-notification', onNotification);
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
