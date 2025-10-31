import { SidebarIcon, MoreVerticalIcon, ArrowLeft } from "lucide-react"
import { useActiveScreenStore } from "../../../zustand/store/ActiveScreenStore"
import { useChatWindowAvatarStore } from '../../../zustand/store/ChatWindowAvatar.ts'
import { useState } from "react"
import { Trash, Mic, Brush, RefreshCcw } from "lucide-react"
import { useAuth } from "@clerk/clerk-react"
import { useUser } from "@clerk/clerk-react"
import { useChatWindowUserIdStore } from "../../../zustand/store/ChatWindowUserId.ts"
import { useGlobalRefreshStore } from "../../../zustand/store/GlobalRefresh.ts"
import { handleDeleteUserChat } from "../../../APIs/handlers/handleDeleteUserChat.handler.ts"
import "../../../index.css"

import { useFriendStatusStoreBase } from "../../../zustand/store/FriendStatusStore.ts"
const MoreButtonModal = ({ onClose }: { onClose: () => void }) => {

    const { getToken } = useAuth()
    const { user } = useUser()
    const { chatWindowUserId } = useChatWindowUserIdStore()
    const { setGlobalRefresh, globalRefresh } = useGlobalRefreshStore()

    return (
        <div
            className="fixed z-40 top-0 bg-black/50 left-0 w-full h-full cursor-auto"
            style={{
                animation: "fade-in 0.3s ease-in-out forwards"
            }}
            onClick={() => {
                onClose()
            }}
        >
            <div 
            className=" p-2 fixed right-3 top-[50px] rounded-lg border border-[#303030] bg-[#0f0f0f] hover:cursor-auto"
            style={{
                animation: "fade-in-slide-down 0.3s ease-in-out forwards"
            }}
            >
                <div className="flex flex-col">
                    <button
                        className="cursor-pointer flex gap-2 w-full items-center p-1 rounded-md hover:bg-[#303030]"
                        onClick={() => {
                            setGlobalRefresh(!globalRefresh)
                        }}
                    >
                        <span>
                            <RefreshCcw size={18} />
                        </span>
                        <span>Refresh</span>
                    </button>
                    <button 
                    className="cursor-pointer flex gap-2 w-full items-center p-1 rounded-md hover:bg-[#303030]"
                    onClick={() => alert("Feature coming soon!")}
                    >
                        <span>
                            <Mic size={18} />
                        </span>
                        <span>Mute</span>
                    </button>
                    <button 
                    className="cursor-pointer flex gap-2 w-full items-center p-1 rounded-md hover:bg-[#303030]"
                    onClick={() => alert("Feature coming soon!")}
                    >
                        <span>
                            <Brush size={18} />
                        </span>
                        <span>Set Wallpaper</span>
                    </button>
                </div>
                <div className="h-[1px] bg-[#303030] w-full my-1" />
                <div className="w-full">
                    <button
                        className="cursor-pointer flex gap-2 w-full items-center p-1 rounded-md hover:bg-[#303030]"
                        onClick={async () => {
                            const result = await handleDeleteUserChat(getToken, user?.id, chatWindowUserId)
                            if (result === "Success") {
                                setGlobalRefresh(!globalRefresh)
                            } else if (result === "Error") {
                                return;
                            }
                        }}
                    >
                        <span>
                            <Trash size={18} className="text-red-500" />
                        </span>
                        <span className="text-red-500">Delete Chats</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

const ChatWindowNavbar = ({ username }: { username: string }) => {

    const setActiveScreen = useActiveScreenStore(state => state.setActiveScreen)
    const chatWindowAvatar = useChatWindowAvatarStore((state) => state.chatWindowAvatar)
    const [showModal, setShowModal] = useState<boolean>(false)
    const { chatWindowUserId } = useChatWindowUserIdStore()
    const statuses = useFriendStatusStoreBase(state => state.statuses)
    const displayStatus = statuses[chatWindowUserId]

    return (
        <div className="h-[60px] w-full bg-[#0f0f0f] px-3 border-b border-b-[#212121] sm:border-none flex justify-between items-center shrink-0">

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
                    <p className="last-seen-msg text-sm text-green-500">{displayStatus}</p>
                </div>
            </div>

            <div className=' z-45 flex items-center gap-2'>
                <button
                    className="cursor-pointer h-8 w-8 flex justify-center items-center p-1 rounded-full opacity-60 hover:opacity-100 rotate-180"
                    onClick={() => alert("Feature coming soon!")}
                >
                    <SidebarIcon size={20} />
                </button>
                <button
                    className='cursor-pointer h-8 w-8 flex justify-center items-center p-1 rounded-full opacity-60 hover:opacity-100'
                    onClick={() => setShowModal(!showModal)}
                    style={{
                        backgroundColor: showModal ? "#303030" : "",
                        opacity: showModal ? 1 : ""
                    }}
                >
                    <MoreVerticalIcon size={20} />
                </button>
            </div>


            {showModal && (
                <MoreButtonModal onClose={() => setShowModal(false)} />
            )}
        </div>
    )
}

export default ChatWindowNavbar
