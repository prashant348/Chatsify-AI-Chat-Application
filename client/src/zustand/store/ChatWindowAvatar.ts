import { create } from "zustand";

interface ChatWindowUsernameType {
    chatWindowAvatar: string;
    setChatWindowAvatar: (username: string) => void
}


export const useChatWindowAvatarStore = create<ChatWindowUsernameType>((set) => ({
    chatWindowAvatar: "",
    setChatWindowAvatar: (username) => set({ chatWindowAvatar: username })
}))
