import { SidebarIcon, MoreVerticalIcon, ArrowLeft } from "lucide-react"
import { useActiveScreenStore } from "../../../zustand/store/ActiveScreenStore"
import { useChatWindowAvatarStore } from '../../../zustand/store/ChatWindowAvatar.ts'
import { useFriendStatusStore } from "../../../zustand/store/FriendStatusStore.ts"

const ChatWindowNavbar = ({ username }: { username: string }) => {

    const setActiveScreen = useActiveScreenStore(state => state.setActiveScreen)
    const chatWindowAvatar = useChatWindowAvatarStore((state) => state.chatWindowAvatar)
    const { status } = useFriendStatusStore()


    return (
        <div className="h-[60px] w-full bg-[#0f0f0f] px-3 flex justify-between items-center shrink-0">

            <div className="left-side-of-navbar flex gap-3 items-center">

                {window.innerWidth <= 640 && (
                    <button
                        className="opacity-60 hover:opacity-100 cursor-pointer"
                        onClick={() => setActiveScreen("MainScreen")}
                    >
                        <ArrowLeft />
                    </button>
                )}

                <div className="avatar-box h-[40px] w-[40px] rounded-full overflow-hidden flex justify-center items-center">
                    <img src={chatWindowAvatar} alt="user_avatar" />
                </div>

                <div className="user-username status flex flex-col">
                    <p className="text-[16px] font-bold">{username}</p>
                    <p className="last-seen-msg text-sm text-green-500">{status? status : ""}</p>
                </div>
            </div>

            <div className="right-side-of-navbar flex gap-3">
                <button className="opacity-60 hover:opacity-100 cursor-pointer rotate-180">
                    <SidebarIcon />
                </button>
                <button className="opacity-60 hover:opacity-100 cursor-pointer">
                    <MoreVerticalIcon />
                </button>
            </div>
        </div>
    )
}

export default ChatWindowNavbar
