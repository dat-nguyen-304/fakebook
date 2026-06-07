# client — CLAUDE.md

**Purpose:** Next.js (App Router) web frontend. Talks to api-gateway over HTTP (cookie auth) and to ws-service over Socket.IO for real-time notifications.

## Runtime
- Framework: Next.js App Router, React.
- State/data: `@tanstack/react-query` (server state), `zustand` (client state).
- UI: `react-icons`, `react-select`, `react-dropzone`, `react-toastify`, `date-fns`, `classnames`.
- Start: `npm run dev`.

## Config / env
- `NEXT_PUBLIC_BACKEND_BASE_URL` — api-gateway base (`config/index.ts` → `config.backendBaseUrl`).
- Axios clients (`axios/`): `axios-client` (JSON) and `axios-form-data` (uploads), both `withCredentials: true`; a response interceptor calls `/auth/refresh` on 401.
- Socket: `socket/socket.ts` → `io('http://localhost:4000/notification')` (hardcoded).

## Routes (`app/`)
- `/` (`page.tsx`) — home / feed.
- `/login` — auth.
- `/friends` — friend list / suggestions.
- `/[id]` — user profile.

## API calls (`hooks/api/`)
Auth (`auth.ts`): `POST /auth/signin`, `/auth/signup`, `/auth/refresh`, `/auth/logout`.
User (`user.ts`):
- `GET /user/me`, `GET /user`.
- `PATCH /user/:id` — profile.
- `POST /user/image/:id` — multipart `image` (via `axios-form-data`).
- `GET /user/friend-suggestions/:id`.
- `POST /user/send-friend-request/:id`, `/accept-friend-request/:id`, `/decline-friend-request/:id`.

## Socket events (`components/providers/WebSocketProvider.tsx`)
- On connect: emit `join` with the current `userId` to subscribe to its room.
- Receive `new-notification` — incoming friend request/accept notification.
- Receive `image-ready` `{ imageUrl, type }` — avatar/cover finished processing (consumed in `Profile/ProfileHeader.tsx`, `Header/ProfileDropdown.tsx`).

## Key files
- `app/layout.tsx` — wraps app in `ReactQueryProvider` + `WebSocketProvider`.
- `components/providers/WebSocketProvider.tsx` — socket lifecycle, `join`, event listeners.
- `components/providers/ReactQueryProvider.tsx` — React Query client.
- `axios/` — configured axios instances + refresh interceptor.
- `hooks/api/` — `auth.ts`, `user.ts` (React Query hooks).
- `hooks/client/` — `useOpenModal`, `useTab` (zustand UI state).
- `components/` — `Auth`, `Header`, `Profile`, `Content`, `common`, `wrapper`.

## Gotchas
- The socket URL is hardcoded to `localhost:4000`; only the HTTP base is env-driven.
- ws-service Socket.IO CORS allows only origin `http://localhost` (port 80). Running `next dev` on `:3000` won't be allowed to connect (or call the gateway) until a reverse proxy serves the client on `:80`.
- The client must emit `join` after connecting or it receives no real-time events.
