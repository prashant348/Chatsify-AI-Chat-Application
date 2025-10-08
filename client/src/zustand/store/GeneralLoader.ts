import { create } from "zustand";


interface GeneralLoaderType {
    isLoading: boolean,
    setIsLoading: (show: boolean) => void
}

export const useGeneralLoaderStore = create<GeneralLoaderType>((set) => ({
    isLoading: false,
    setIsLoading: (show) => set({ isLoading: show })
}))