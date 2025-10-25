import { create } from "zustand";

interface GlobalRefreshStoreType {
    globalRefresh: boolean;
    setGlobalRefresh: (refresh: boolean) => void;
}

export const useGlobalRefreshStore = create<GlobalRefreshStoreType>((set) => ({
    globalRefresh: false,
    setGlobalRefresh: (refresh: boolean) => set({ globalRefresh: refresh }),
}));