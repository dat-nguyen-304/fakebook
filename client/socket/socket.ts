'use client';

import { io } from 'socket.io-client';

export const notificationSocket = io('http://localhost:4000/notification');
