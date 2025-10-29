import "../../index.css"
import { useUser, UserButton, UserProfile } from "@clerk/clerk-react"
import { useState } from "react"
import SidebarButtons from "./components/SidebarButtons"
import { UserIcon } from "lucide-react"

const Sidebar = () => {
    const [isUserProfileOpen, setIsUserProfileOpen] = useState<boolean>(false)
    const { user } = useUser()

    return (
        <div className="overflow-y-auto" onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
        }}>
            <div
                className="fixed top-0 left-0 z-50 bg-[#0f0f0f] h-screen w-[254px] sm:w-[274px] border-r border-r-[#212121] text-white"
                style={{
                    animation: "slide-in 0.3s ease-in-out forwards",
                }}
            >

                <div className="main-box w-full h-[134px]  border-b border-b-[#212121] pt-6 px-6">

                    <UserButton appearance={{
                        elements: {
                            avatarBox: {
                                width: "48px",
                                height: "48px"
                            },
                            popoverBox: {
                                width: window.innerWidth <= 640 ? "274px" : ""
                            }
                        }
                    }} />

                    <p className="mt-2 text-xl flex justify-between items-center">
                        {user?.username}
                    </p>

                </div>

                <div className="my-profile-box h-[50px] w-full py-[5px] border-b border-b-[#212121]">
                    <button
                        className="w-full h-full flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer"
                        onClick={() => setIsUserProfileOpen(true)}
                    >
                        <UserIcon height={"20px"} />
                        <span className="">My Profile</span>
                    </button>
                </div>

                <div className="sidebar-buttons">
                    <SidebarButtons />
                </div>

            </div>

            {isUserProfileOpen && (
                <div
                    className="fixed left-0 top-0 z-60 w-full h-full flex justify-center pt-6 bg-black/50 overflow-y-auto"
                    onClick={() => {
                        setIsUserProfileOpen(false)
                    }}
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <UserProfile />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sidebar
