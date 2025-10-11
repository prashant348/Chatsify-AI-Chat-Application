import { create } from "zustand";

interface RequestPendingStoreType {
    isReqPending: boolean
    setIsReqPending: (reqPending: boolean) => void
}

export const useRequestPendingStore = create<RequestPendingStoreType>((set) => ({
    isReqPending: true,
    setIsReqPending: (reqPending) => set({ isReqPending: reqPending })
}))

