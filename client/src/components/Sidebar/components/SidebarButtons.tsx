import { Users, Bookmark, ShipWheel, Settings, Moon, UserPlus, Sun, Inbox } from "lucide-react"
import { useAppThemeStore } from "../../../zustand/store/AppTheme"
import { useActiveScreenStore } from "../../../zustand/store/ActiveScreenStore"

export default function SidebarButtons() {

    // const [theme, setTheme] = useState<string>("dark")
    const { appTheme, setAppTheme } = useAppThemeStore((state) => state)
    const { setActiveScreen } = useActiveScreenStore((state) => state)

    return (
        <div>
            <div className="my-profile-box w-full py-[5px] border-b border-b-[#212121]">
                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer"
                >
                    <Users height={"20px"} />
                    <span className="">New Room</span>
                </button>

                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer"
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
                    onClick={() => setActiveScreen("ChatbotWindow")}
                >
                    <ShipWheel height={"20px"} />
                    <span>Chatsify AI</span>
                </button>

                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer"
                    onClick={() => setActiveScreen("InboxWindow")}
                >
                    <Inbox height={"20px"} />
                    <span className="">Inbox</span>
                </button>


                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121] cursor-pointer"
                >
                    <Settings height={"20px"} />
                    <span className="">Settings</span>
                </button>

                <button
                    className="w-full h-[40px] flex items-center px-6 text-sm hover:bg-[#212121] cursor-pointer"
                    onClick={() => setAppTheme(appTheme === "dark" ? "light" : "dark")}
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
