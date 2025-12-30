import { io } from "socket.io-client";

export const socket = io("http://localhost:8000", {
  autoConnect: true,
});
if (import.meta.env.DEV) {
  window.__INTELSHIELD_SOCKET__ = socket;
}