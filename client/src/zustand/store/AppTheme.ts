import { create } from "zustand";

interface AppThemeStoreType {
    appTheme: string;
    setAppTheme: (theme: string) => void;
}

export const useAppThemeStore = create<AppThemeStoreType>((set) => ({
    appTheme: "dark",
    setAppTheme: (theme: string) => set({ appTheme: theme }),
}));
