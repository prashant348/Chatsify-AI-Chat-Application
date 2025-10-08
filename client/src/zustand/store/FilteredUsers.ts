import { create } from "zustand";

type User = {
    id: string,
    username: string,
    imageUrl: string
}

interface FilteredUsersStoreType {
    filteredUsers: User[],
    setFilteredUsers: (show: User[]) => void
}

export const useFilteredUsersStore = create<FilteredUsersStoreType>((set) => ({
    filteredUsers: [],
    setFilteredUsers: (show) => set({ filteredUsers: show })
}))