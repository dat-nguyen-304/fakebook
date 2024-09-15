'use client';

import { io } from 'socket.io-client';

export const uploadImageSocket = io('http://localhost:3001/upload-image');
