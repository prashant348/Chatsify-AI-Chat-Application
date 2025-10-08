import { create } from "zustand";


interface SearchResultWindowResponseStoreType {
    searchResultWindowResponse: string,
    setSearchResultWindowResponse: (show: string) => void
}

export const useSearchResultWindowResponseStore = create<SearchResultWindowResponseStoreType>((set) => ({
    searchResultWindowResponse: "Search people by their usernames!",
    setSearchResultWindowResponse: (show) => set({ searchResultWindowResponse: show })
}))

