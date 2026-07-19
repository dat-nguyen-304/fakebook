'use client';

import { io } from 'socket.io-client';

// Socket origin is env-driven (baked at build via NEXT_PUBLIC_*). Behind an
// Ingress the browser reaches ws-service on the SAME origin as the app, so this
// points at the Ingress host (e.g. http://localhost:3005); falls back to the
// direct ws-service port for plain local dev.
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export const notificationSocket = io(`${SOCKET_URL}/notification`);
