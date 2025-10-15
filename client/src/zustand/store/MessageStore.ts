// store/MessageStore.ts
import { create } from "zustand"

type Message = {
  msg: string
  type: "sent" | "received"
}

interface MessageStore {
  allMessages: Message[]
  addSent: (msg: string) => void
  addReceived: (msg: string) => void
  setAllMessages: (messages: Message[]) => void
}

export const useMessageStore = create<MessageStore>((set) => ({
  allMessages: [],
  addSent: (msg) =>
    set((state) => ({
      allMessages: [...state.allMessages, { msg: msg, type: "sent" }],
    })),
  addReceived: (msg) =>
    set((state) => ({
      allMessages: [...state.allMessages, { msg: msg, type: "received" }],
    })),
  setAllMessages: (messages) => set({ allMessages: messages }),
}))
