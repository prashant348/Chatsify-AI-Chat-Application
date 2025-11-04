import { io } from "socket.io-client";
import { useUser } from "@clerk/clerk-react";
import { Socket } from "socket.io-client";

export const useSocket: () => Socket = () => {
  const { user } = useUser();

  // Get server URL from environment variable
  const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const socket = io(SERVER_URL, {
    query: { userId: user?.id }, // 👈 ye bhej raha hai current logged-in user ka ID means you!
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 2000
  });

  return socket;
};
