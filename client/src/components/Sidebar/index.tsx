
import "../../index.css"


const Sidebar = () => {

    return (
        <div
            className="fixed top-0 left-0 z-100 h-screen w-[274px] bg-[#0f0f0f] border-r border-r-[#212121]"
            style={{
                animation: "slide-in 0.3s ease-in-out forwards",
            }}
        >
            Sidebar
        </div>
    )
}

export default Sidebar
