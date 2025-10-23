import { io } from "socket.io-client";
import { useUser } from "@clerk/clerk-react";
import { Socket } from "socket.io-client";

export const useSocket: () => Socket = () => {
  const { user } = useUser();

  const socket = io("http://localhost:5000", {
    query: { userId: user?.id }, // 👈 ye bhej raha hai current logged-in user ka ID means you!
  });

  return socket;
};
