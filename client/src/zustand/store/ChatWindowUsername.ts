import { create } from "zustand";

interface ChatWindowUsernameType {
    chatWindowUsername: string;
    setChatWindowUsername: (username: string) => void
}


export const useChatWindowUsernameStore = create<ChatWindowUsernameType>((set) => ({
    chatWindowUsername: "",
    setChatWindowUsername: (username) => set({ chatWindowUsername: username })
}))
