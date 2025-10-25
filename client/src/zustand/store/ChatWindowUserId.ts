import { create } from "zustand";

interface ChatWindowUserIdStoreType {
    chatWindowUserId: string
    setChatWindowUserId: (id: string) => void
}

export const useChatWindowUserIdStore = create<ChatWindowUserIdStoreType>((set) => ({
    chatWindowUserId: "",
    setChatWindowUserId: (id: string) => set({ chatWindowUserId: id })
}))


