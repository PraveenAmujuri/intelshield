import { io } from "socket.io-client";

export const socket = io("https://intelshield.onrender.com", {
  transports: ["websocket"],
});