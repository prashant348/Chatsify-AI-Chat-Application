import { create } from "zustand";


interface SearchResultWindowType {
    showSearchResultWindow: boolean,
    setShowSearchResultWindow: (show: boolean) => void
}

export const useSearchResultWindow = create<SearchResultWindowType>((set) => ({
    showSearchResultWindow: false,
    setShowSearchResultWindow: (show) => set({ showSearchResultWindow: show })
}))
