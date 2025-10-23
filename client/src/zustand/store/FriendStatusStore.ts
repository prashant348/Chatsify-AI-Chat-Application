import { create } from "zustand";

interface FriendStatusStoreType {
    status: string
    setStatus: (status: string) => void
}

export const useFriendStatusStore = create<FriendStatusStoreType>((set) => ({
    status: "",
    setStatus: (status: string) => set({ status }),
}))
