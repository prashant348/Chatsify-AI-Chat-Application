import { io } from "socket.io-client";
import { useUser } from "@clerk/clerk-react";

export const useSocket = () => {
  const { user } = useUser();

  const socket = io("http://localhost:5000", {
    query: { userId: user?.id }, // 👈 ye bhej raha hai current logged-in user ka ID
    

});

  return socket;
};
