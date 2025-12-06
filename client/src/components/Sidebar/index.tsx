import "../../index.css"
import { useUser, UserButton, UserProfile } from "@clerk/clerk-react"
import React, { useRef, useState } from "react"
import SidebarButtons from "./components/SidebarButtons"
import { UserIcon, InfoIcon, HelpCircleIcon, SquareArrowOutUpRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { delay } from "../../libs/delay"
const Sidebar = () => {
    const [isUserProfileOpen, setIsUserProfileOpen] = useState<boolean>(false)
    const { user } = useUser()
    const navigate = useNavigate()
    const sidebarWrapperRef = useRef<HTMLDivElement>(null)
    const touchStartYRef = useRef<number>(0)

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        touchStartYRef.current = e.touches[0]?.clientY ?? 0
    }

    const handleTouchMoveBoundaryLocked = (e: React.TouchEvent<HTMLDivElement>) => {

        const element = sidebarWrapperRef.current
        if (!element) return;

        const currentY = e.touches[0]?.clientY ?? 0

        // > 0 finger down (scroll up), < 0 finger up (scroll down)
        const deltaY = currentY - touchStartYRef.current

        const atTop = element.scrollTop <= 0
        const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 1

        if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
            e.preventDefault()
            e.stopPropagation()
            return;
        }

        e.stopPropagation()
    }


    return (
        <>
            <div
                ref={sidebarWrapperRef}
                className="sidebar-wrapper bg-transparent z-50 fixed top-0 bottom-0 left-0 h-[calc(var(--vh)*100)] overflow-y-auto "
                style={{
                    animation: "slide-in 0.3s ease-in-out forwards",
                    overscrollBehavior: "contain",
                    touchAction: "pan-y"
                }}
                onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMoveBoundaryLocked}

            >
                <div

                    className="sidebar flex flex-col bg-[#0f0f0f] min-h-full w-[254px] sm:w-[274px] border-r border-r-[#212121] text-white"
                    style={{
                        animation: "slide-in 0.3s ease-in-out forwards",
                    }}
                >

                    <div
                        className="main-box w-full shrink-0 h-[134px]  border-b border-b-[#212121] pt-6 px-6"
                        onTouchMove={(e) => e.stopPropagation()}
                    >

                        <UserButton appearance={{
                            elements: {
                                avatarBox: {
                                    width: "48px",
                                    height: "48px"
                                },
                                popoverBox: {
                                    width: window.innerWidth <= 640 ? "274px" : ""
                                },
                                userButtonPopoverActionButton__manageAccount: {
                                    display: "none"
                                }
                            }
                        }} />

                        <p className="mt-2 text-xl flex justify-between items-center">
                            {user?.username}
                        </p>

                    </div>

                    <div className="my-profile-box h-[50px] shrink-0 w-full py-[5px] border-b border-b-[#212121]">
                        <button
                            className="w-full h-full flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => setIsUserProfileOpen(true)}
                        >
                            <UserIcon height={"20px"} />
                            <span className="">My Profile</span>
                        </button>
                    </div>

                    <div className="sidebar-buttons">
                        <SidebarButtons />
                    </div>

                    {/* another option for mt-auto is "flex-1 justify end" this will also give same result as mt-auto */}
                    <div className="last-sidebar-btns-box mt-auto w-full flex flex-col"
                    >
                        <div className=" border-t border-t-[#212121] py-[5px]">

                            <div className="my-profile-box h-[40px] w-full">
                                <button
                                    className="w-full h-full flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer active:bg-[#212121] transition-all 0.2s ease-in-out"
                                    onClick={async () => {
                                        await delay(0.3)
                                        navigate("/about")
                                    }}
                                >

                                    <InfoIcon height={"20px"} className="flex-shrink-0" />

                                    <span className="flex justify-between w-full items-center">
                                        <span>
                                            About
                                        </span>
                                        <span className="opacity-60">
                                            <SquareArrowOutUpRight size={14} />
                                        </span>
                                    </span>
                                </button>
                            </div>
                            <div className="my-profile-box h-[40px] w-full">
                                <button
                                    className="w-full h-full flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer active:bg-[#212121] transition-all 0.2s ease-in-out"
                                    onClick={async () => {
                                        await delay(0.3)
                                        alert("Feature coming soon!")
                                    }}
                                >
                                    <HelpCircleIcon height={"20px"} />
                                    <span className="">Help</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            {isUserProfileOpen && (
                <div
                    className="fixed left-0 top-0 z-60 w-full h-[calc(var(--vh)*100)] py-6 flex justify-center bg-black/50"
                    onClick={() => {
                        setIsUserProfileOpen(false)
                    }}
                >
                    <div
                        className="overflow-y-auto rounded-2xl"
                        onTouchMove={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <UserProfile appearance={{
                            elements: {
                                cardBox: {
                                    backgroundColor: "#0f0f0f"
                                }
                            }
                        }} />
                    </div>
                </div>
            )}
        </>
    )
}

export default Sidebar
