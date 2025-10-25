import { SidebarIcon, MoreVerticalIcon, ArrowLeft } from "lucide-react"
import { useActiveScreenStore } from "../../../zustand/store/ActiveScreenStore"
import { useChatWindowAvatarStore } from '../../../zustand/store/ChatWindowAvatar.ts'
import { useFriendStatusStore } from "../../../zustand/store/FriendStatusStore.ts"
import { useState } from "react"
import { Trash, Mic, Brush } from "lucide-react"
import { useAuth } from "@clerk/clerk-react"
import { useUser } from "@clerk/clerk-react"
import { useChatWindowUserIdStore } from "../../../zustand/store/ChatWindowUserId.ts"
import { useGlobalRefreshStore } from "../../../zustand/store/GlobalRefresh.ts"
import "../../../index.css"

const MoreButtonModal = () => {

    const { getToken } = useAuth()
    const { user } = useUser()
    const { chatWindowUserId } = useChatWindowUserIdStore()
    const { setGlobalRefresh, globalRefresh } = useGlobalRefreshStore()

    const deleteChats = async () => {
        try {
            console.log("----------------------", chatWindowUserId)

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${user?.id}/${chatWindowUserId}/delete-chats`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${await getToken()}`
                },
                body: JSON.stringify({
                    yourId: user?.id,
                    friendId: chatWindowUserId
                })
            })

            const data = await res.json()
            console.log(data)
            console.log("you and your friend's chat deleted!")
            setGlobalRefresh(!globalRefresh)
        } catch (err) {
            console.error("err in deleting chats: ", err)
        }
    }


    return (
        <div 
        className="fixed z-40 top-0 left-0 w-full h-full bg-transparent cursor-not-allowed"
        style={{
            animation: "fade-in 0.2s ease-in-out forwards"
        }}
        >
            <div className=" p-2 fixed right-3 top-[60px] rounded-lg border border-[#303030] bg-[#0f0f0f] hover:cursor-auto">
                <div className="flex flex-col">
                    <button className="cursor-pointer flex gap-1 w-full items-center p-1 rounded-md hover:bg-[#303030]">
                        <span>
                            <Mic size={18} />
                        </span>
                        <span>Mute</span>
                    </button>
                    <button className="cursor-pointer flex gap-1 w-full items-center p-1 rounded-md hover:bg-[#303030]">
                        <span>
                            <Brush size={18} />
                        </span>
                        <span>Set Wallpaper</span>
                    </button>
                </div>
                <div className="h-[1px] bg-[#303030] w-full my-1" />
                <div className="w-full">
                    <button
                        className="cursor-pointer flex gap-1 w-full items-center p-1 rounded-md hover:bg-[#303030]"
                        onClick={deleteChats}
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
    const { status } = useFriendStatusStore()
    const [showModal, setShowModal] = useState<boolean>(false)


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
                    <p className="last-seen-msg text-sm text-green-500">{status ? status : ""}</p>
                </div>
            </div>

            <div className="right-side-of-navbar flex gap-3">
                <button className="opacity-60 hover:opacity-100 cursor-pointer rotate-180">
                    <SidebarIcon />
                </button>
                <button
                    className="opacity-60 z-45 hover:opacity-100 cursor-pointer rounded-full p-1"
                    onClick={() => {
                        setShowModal(!showModal)
                    }}
                    style={{
                        backgroundColor: showModal? "#303030": ""
                    }}
                >
                    <MoreVerticalIcon />
                </button>
            </div>


            {showModal && (
                <MoreButtonModal />
            )}
        </div>
    )
}

export default ChatWindowNavbar
