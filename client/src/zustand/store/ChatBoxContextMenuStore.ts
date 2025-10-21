import { create } from "zustand";

interface ChatBoxContextMenuStoreType {
    showContextMenu: boolean,
    setShowContextMenu: (show: boolean) => void
}

export const useChatBoxContextMenuStore = create<ChatBoxContextMenuStoreType>((set) => ({
    showContextMenu: false,
    setShowContextMenu: (show) => set({ showContextMenu: show })
}))
