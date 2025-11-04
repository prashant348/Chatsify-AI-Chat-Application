import { create } from "zustand";


interface ErrorStoreType {
    error: string,
    setError: (errorName: string) => void
}

export const useChatbotErrorStore = create<ErrorStoreType>((set) => ({
    error: "",
    setError: (errorName: string) => set({ error: errorName })
}))

export const useChatWindowErrorStore = create<ErrorStoreType>((set) => ({
    error: "",
    setError: (errorName: string) => set({ error: errorName })
}))

export const useChatTextToSpeechErrorStore = create<ErrorStoreType>((set) => ({
    error: "",
    setError: (errorName: string) => set({ error: errorName })
}))