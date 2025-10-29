import { useActiveScreenStore } from "../../../zustand/store/ActiveScreenStore"
import { useChatWindowUsernameStore } from "../../../zustand/store/ChatWindowUsername"
import { useChatWindowAvatarStore } from "../../../zustand/store/ChatWindowAvatar"
import { MoreVertical } from "lucide-react"
import { useSidebarWidthStore } from "../../../zustand/store/SidebarWidth"
import { Trash, Mic, Pin } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { useAuth } from "@clerk/clerk-react"
import { useUserIdStore } from "../../../zustand/store/UserIdStore"
import { useChatBoxContextMenuStore } from "../../../zustand/store/ChatBoxContextMenuStore"
import { useChatWindowUserIdStore } from "../../../zustand/store/ChatWindowUserId"
import { useGlobalRefreshStore } from "../../../zustand/store/GlobalRefresh"
import { useEffect } from "react"
import "../../../index.css"

interface ChatBoxTemplatePropsType {
  username: string,
  lastMsg?: string,
  imgUrl: string,
  userId: string,
  lastMsgType: "sent" | "received"
}

export function ContextMenu() {
  const { sidebarWidth } = useSidebarWidthStore()
  const { user } = useUser()
  const { getToken } = useAuth()
  const friendId = useUserIdStore(state => state.userId)
  const { setGlobalRefresh, globalRefresh } = useGlobalRefreshStore()

  const handleRemoveButton = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${user?.id}/remove-friend`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${await getToken()}`
        },
        body: JSON.stringify({
          friendId: friendId
        })
      })

      const data = await res.json()
      console.log(data)
      console.log("client: friend removed!")
      setGlobalRefresh(!globalRefresh)
    } catch (err) {
      console.error("error in removing friend: ", err)
    }
  }

  return (
    <div
      className="w-full h-full bg-transparent cursor-not-allowed fixed z-30 left-0 top-0"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      style={{
        animation: "fade-in 0.2s ease-in-out forwards"
      }}
    >

      <div
        className="fixed p-2 cursor-auto z-30  w-[140px] border border-[#303030] rounded-lg bg-[#0f0f0f]"
        style={{
          left: window.innerWidth <= 640 ? window.innerWidth - 140 : sidebarWidth - 140,
          top: 120
        }}
      >
        <div className="flex flex-col">
          <button className="cursor-pointer flex gap-1 w-full items-center p-1 rounded-md hover:bg-[#303030]">
            <span>
              <Mic size={18} />
            </span>
            <span>Mute</span>
          </button>
          <button className="cursor-pointer flex gap-1 w-full items-center p-1 rounded-md hover:bg-[#303030]">
            <span>
              <Pin size={18} />
            </span>
            <span>Pin</span>
          </button>
        </div>
        <div className="h-[1px] bg-[#303030] w-full my-1" />
        <div className="w-full">
          <button
            className="cursor-pointer flex gap-1 w-full items-center p-1 rounded-md hover:bg-[#303030]"
            onClick={() => {
              handleRemoveButton()
            }}
          >
            <span>
              <Trash size={18} className="text-red-500" />
            </span>
            <span className="text-red-500">Remove</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ChatBoxTemplate({ username, lastMsg, lastMsgType, imgUrl, userId }: ChatBoxTemplatePropsType) {

  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen)
  const setChatWindowUsername = useChatWindowUsernameStore((state) => state.setChatWindowUsername)
  const setChatWindowUserId = useChatWindowUserIdStore((state) => state.setChatWindowUserId)
  const setChatWindowAvatar = useChatWindowAvatarStore((state) => state.setChatWindowAvatar)
  const { showContextMenu, setShowContextMenu } = useChatBoxContextMenuStore()
  const { setUserId } = useUserIdStore()


  // after removing friend and then if friend sends you req and when 
  // you accept and when friend chatbox renders on yu dashboard, it renders with context menu opened,
  // that is why this logic will check if context menu is open, and if open then it will close it
  useEffect(() => {
    if (showContextMenu) {
      setShowContextMenu(!showContextMenu)
    }
  }, [])

  return (
    <div
      className="chat-box px-[10px] min-h-[70px] max-h-[70px] hover:bg-[#212121] w-full flex justify-between items-center cursor-pointer"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setChatWindowAvatar(imgUrl)
        setChatWindowUsername(username)
        setChatWindowUserId(userId)
        setActiveScreen("ChatWindow")
      }}
    >
      <div className="flex gap-[10px] items-center">

        <div className="avatar-box  h-[50px] w-[50px] rounded-full overflow-hidden shrink-0 flex justify-center items-center">
          <img src={imgUrl} alt="user_avatar" />
        </div>

        <div className="user-username latest-msg flex flex-col">
          <p className="text-[16px] font-bold">{username}</p>
          <p
            className="last-seen-msg text-sm"
            style={{
              opacity: lastMsgType === "sent" ? 1 : 0.6,
              color: lastMsgType === "sent" ? "#1a73e8" : ""
            }}
          >
            {lastMsg}
          </p>
        </div>
      </div>

      <div className="z-40">
        <button
          className="cursor-pointer flex justify-center items-center hover:bg-[#303030] h-10 w-10 rounded-full"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowContextMenu(!showContextMenu)
            setUserId(userId)
          }}
          style={{
            backgroundColor: showContextMenu ? "#303030" : ""
          }}
        >
          <MoreVertical />
        </button>
      </div>

      {showContextMenu && <ContextMenu />}

    </div>
  )
}
