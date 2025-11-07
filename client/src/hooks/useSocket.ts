import { io } from "socket.io-client";
import { useUser } from "@clerk/clerk-react";
import { Socket } from "socket.io-client";
import { useMemo, useEffect } from "react";

export const useSocket: () => Socket = () => {
  const { user } = useUser();

  // Get server URL from environment variable
  const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const socket = useMemo<Socket>(() => {
    return io(SERVER_URL, {
      query: { userId: user?.id }, // 👈 ye bhej raha hai current logged-in user ka ID means you!
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 20000
    })
  }, [SERVER_URL]);

    useEffect(() => {
    socket.auth = { userId: user?.id };
    socket.connect();

    // basic observability
    socket.on("connect_error", (e) => console.warn("connect_error", e.message));
    socket.on("reconnect_attempt", (n) => console.log("reconnect_attempt", n));
    socket.on("reconnect", (n) => console.log("reconnected", n));

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, [socket, user?.id]);

  return socket;
};
