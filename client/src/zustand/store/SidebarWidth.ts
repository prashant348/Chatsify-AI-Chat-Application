import { create } from "zustand";

interface SidebarWidthStoreType {
    sidebarWidth: number
    setSidebarWidth: (width: number) => void
}

export const useSidebarWidthStore = create<SidebarWidthStoreType>((set) => ({
    sidebarWidth: 0.4 * window.innerWidth,
    setSidebarWidth: (width: number) => set({ sidebarWidth: width })
}))