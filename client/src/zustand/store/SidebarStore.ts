import { create } from "zustand";

interface SidebarStoreType {
    showSidebar: boolean;
                    // isko function type bolte hai
    setShowSidebar: (show: boolean) => void; // matlab: setShowSidebar ek function hai jo ek param lega aur kuch return nahi karega, void!
}

//  ye jo create function hai ye ek hook return karta hai aur ham use hook ko useSidebarStore se assign kar rahe hai 
// to ab vo hook useSidebarStore ban gaya aur iss hook ko call karne ke do tarike hai:
// 1. pehela direct useSidebarStore() 
//    pehele wale mai destructuring hoga: const { showSidebar, setShowSidebar } = useSidebarStore()

// 2. dusra: selecter function pass karke: useSidebarStore(state => state.showSidebar) 
//    specific state ko select karne ke liye: 
//    const showSidebar = useSidebarStore(state => state.showSidebar)
//    const setShowSidebar = useSidebarStore(state => state.showSidebar)

export const useSidebarStore = create<SidebarStoreType>((set) => ({
    showSidebar: false,
    setShowSidebar: (show) => set({ showSidebar: show }),
    // ye setShowSidebar ek boolean lega aur fir set() function call karega
    // aur set function ek object leta hai, jisme ham batate hai ki konsa state change karna hai
}));
