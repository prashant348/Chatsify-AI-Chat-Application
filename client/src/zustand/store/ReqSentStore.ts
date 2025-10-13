import { create } from "zustand";

interface ReqSentStoreType {
    isReqSent: boolean,
    setIsReqSent: (reqSent: boolean) => void
}

export const useReqSentStore = create<ReqSentStoreType>((set) => ({
    isReqSent: false,
    setIsReqSent: (reqSent: boolean) => set({ isReqSent: reqSent })
}))


