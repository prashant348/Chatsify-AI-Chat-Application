import { create } from "zustand";

interface ActiveScreenStoreType {
    activeScreen: string;
    setActiveScreen: (screen: string) => void;
}

export const useActiveScreenStore = create<ActiveScreenStoreType>((set) => ({
    activeScreen: "MainScreen",
    setActiveScreen: (screen) => set({ activeScreen: screen }),
}))
