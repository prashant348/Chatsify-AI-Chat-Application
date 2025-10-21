import { create } from "zustand";

interface UserIdStoreType {
    userId: string;
    setUserId: (id: string) => void;
}

export const useUserIdStore = create<UserIdStoreType>((set) => ({
    userId: "",
    setUserId: (id: string) => set({ userId: id }),
}))
