import { io } from "socket.io-client";

export const socket = io("https://intelshield-backend.onrender.com", {
  transports: ["websocket"],
});