import { create } from "zustand";

type StatusMap = Record<string, string>;

interface FriendStatusStoreType3 {
    statuses: StatusMap;
    setStatusForUser: (from: string, status: string) => void;
    getStatus: (from: string) => string;
}

export const useFriendStatusStoreBase = create<FriendStatusStoreType3>((set, get) => ({
    statuses: {},
    setStatusForUser: (from: string, status: string) =>
        set((prev) => ({ statuses: { ...prev.statuses, [from]: status } })),
    getStatus: (from: string) => {
        const s = get().statuses[from];
        return s ?? "";
    },
}));