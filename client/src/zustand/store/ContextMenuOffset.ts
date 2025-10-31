import { create } from "zustand";


interface ContextMenuOffsetStoreType {
    contextMenuOffsetLeft: number
    contextMenuOffsetTop: number
    setContextMenuOffsetLeft: (left: number) => void
    setContextMenuOffsetTop: (top: number) => void

}

export const useContextMenuOffsetStore = create<ContextMenuOffsetStoreType>((set) => ({
    contextMenuOffsetLeft: 0,
    contextMenuOffsetTop: 0,
    setContextMenuOffsetLeft: (left: number) => set({ contextMenuOffsetLeft: left }),
    setContextMenuOffsetTop: (top: number) => set({ contextMenuOffsetTop: top })
}))
