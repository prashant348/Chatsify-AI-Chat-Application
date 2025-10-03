
import MainSidebar from "./components/MainSidebar"
import { useSidebarStore } from "../../zustand/store/SidebarStore"

const Sidebar = () => {

    const setShowSidebar = useSidebarStore(state => state.setShowSidebar)

    return (
        <div
            className="fixed top-0 left-0 z-10 h-screen w-full backdrop-brightness-[60%] "
            onClick={() => setShowSidebar(false)}
        >
            
            <MainSidebar
            // to stop click event propagation on sidebar 
            onClick={(e: React.MouseEvent) => e.stopPropagation()} 
            />

        </div> 
    )
}

export default Sidebar
