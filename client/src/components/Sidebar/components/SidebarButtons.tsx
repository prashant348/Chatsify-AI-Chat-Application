import { Users, Bookmark, Moon, UserPlus, Sun, Inbox, Settings2Icon, BotMessageSquareIcon } from "lucide-react"
import { useAppThemeStore } from "../../../zustand/store/AppTheme"
import { useActiveScreenStore } from "../../../zustand/store/ActiveScreenStore"
import { useSidebarStore } from "../../../zustand/store/SidebarStore"
export default function SidebarButtons() {
    const { appTheme, setAppTheme } = useAppThemeStore((state) => state)
    const { setActiveScreen } = useActiveScreenStore((state) => state)
    const { setShowSidebar } = useSidebarStore()

    return (
        <div>
            <div className="my-profile-box w-full py-[5px] border-b border-b-[#212121]">
                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer"
                    onClick={() => {
                        alert("Feature coming soon!")
                    }}
                >
                    <Users height={"20px"} />
                    <span className="">New Room</span>
                </button>

                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer"
                    onClick={() => {
                        alert("Feature coming soon!")
                    }}
                >
                    <Bookmark height={"20px"} />
                    <span className="">Saved Messages</span>
                </button>

                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer"
                    onClick={() => setActiveScreen("FriendRequestsWindow")}
                >
                    <UserPlus height={"20px"} />
                    <span className="">Friend Requests</span>
                </button>

                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer"
                    onClick={() => {
                        setShowSidebar(false)
                        setActiveScreen("ChatbotWindow")
                    }}
                >
                    <BotMessageSquareIcon height={"20px"} />
                    <span>Chatsify AI</span>
                </button>

                {/* <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer"
                    onClick={() => {
                        setShowSidebar(false)
                        setActiveScreen("TextToSpeechWindow")
                    }}
                >
                    <AudioLines height={"20px"} />
                    <span className="">Text-To-Speech</span>
                </button> */}

                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer"
                    onClick={() => setActiveScreen("InboxWindow")}
                >
                    <Inbox height={"20px"} />
                    <span className="">Inbox</span>
                </button>


                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer"
                    onClick={() => {
                        alert("Feature coming soon!")
                    }}
                >
                    <Settings2Icon height={"20px"} />
                    <span className="">Settings</span>
                </button>

                <button
                    className="w-full h-[40px] flex items-center px-6 text-sm hover:bg-[#212121] cursor-pointer"
                    onClick={() => {
                        alert("Feature coming soon!")
                        setAppTheme(appTheme === "dark" ? "light" : "dark")
                    }}
                >
                    {appTheme === "dark" && (
                        <div className="flex items-center gap-4">
                            <Moon height={"20px"} />
                            <span>Dark Mode</span>
                        </div>
                    )}
                    {appTheme === "light" && (
                        <div className="flex items-center gap-4">
                            <Sun height={"20px"} />
                            <span>Light Mode</span>
                        </div>
                    )}

                </button>
            </div>
        </div>
    )
}
