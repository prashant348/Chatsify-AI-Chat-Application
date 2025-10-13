import { create } from "zustand";

interface InboxMsgRemoveStoreType {
    inboxMsgRemove: boolean;
    setInboxMsgRemove: (msgRemove: boolean) => void;
}

export const useInboxMsgRemoveStore = create<InboxMsgRemoveStoreType>((set) => ({
    inboxMsgRemove: false,
    setInboxMsgRemove: (msgRemove) => set({ inboxMsgRemove: msgRemove })
}))