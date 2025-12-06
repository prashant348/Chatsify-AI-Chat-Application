// ...existing code...
import { useActiveScreenStore } from "../../../zustand/store/ActiveScreenStore"
import { useChatWindowUsernameStore } from "../../../zustand/store/ChatWindowUsername"
import { useChatWindowAvatarStore } from "../../../zustand/store/ChatWindowAvatar"
import { Trash, Mic, Pin } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { useAuth } from "@clerk/clerk-react"
import { useUserIdStore } from "../../../zustand/store/UserIdStore"
// removed global context menu store import
import { useChatWindowUserIdStore } from "../../../zustand/store/ChatWindowUserId"
import { useGlobalRefreshStore } from "../../../zustand/store/GlobalRefresh"
import { useEffect, useState, useRef } from "react"
import "../../../index.css"
import { useContextMenuOffsetStore } from "../../../zustand/store/ContextMenuOffset"
import { delay } from "../../../libs/delay"
interface ChatBoxTemplatePropsType {
  username: string,
  lastMsg?: string,
  imgUrl: string,
  userId: string,
  lastMsgType: "sent" | "received"
}

export function ContextMenu({ friendId, onClose }: { friendId: string, onClose: () => void }) {
  const { user } = useUser()
  const { getToken } = useAuth()
  const { setGlobalRefresh, globalRefresh } = useGlobalRefreshStore()
  const { contextMenuOffsetLeft, contextMenuOffsetTop } = useContextMenuOffsetStore()
  const setActiveScreen = useActiveScreenStore(state => state.setActiveScreen)

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
      setActiveScreen("MainScreen")
      onClose()
    } catch (err) {
      console.error("error in removing friend: ", err)
      onClose()
    }
  }

  return (
    <div
      className="w-full h-full cursor-auto bg-black/50 fixed z-30 left-0 top-0"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }}
      style={{
        animation: "fade-in-slide-down 0.2s ease-in-out forwards"
      }}
    >

      <div
        className="fixed p-2 cursor-auto z-30  w-[140px] border border-[#303030] rounded-lg bg-[#0f0f0f]"
        style={{
          left: window.innerWidth > 640 ? contextMenuOffsetLeft - 140 : contextMenuOffsetLeft - 150,
          top: contextMenuOffsetTop + 60
        }}
      >
        <div className="flex flex-col">
          <button className="cursor-pointer flex gap-2 w-full items-center p-1 rounded-md hover:bg-[#303030]">
            <span>
              <Mic size={18} />
            </span>
            <span>Mute</span>
          </button>
          <button className="cursor-pointer flex gap-2 w-full items-center p-1 rounded-md hover:bg-[#303030]">
            <span>
              <Pin size={18} />
            </span>
            <span>Pin</span>
          </button>
        </div>
        <div className="h-[1px] bg-[#303030] w-full my-1" />
        <div className="w-full">
          <button
            className="cursor-pointer active:bg-[#212121] transition-all 0.3s ease-in-out flex gap-2 w-full items-center p-1 rounded-md hover:bg-[#303030]"
            onClick={async () => {
              await delay(0.3)
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
  const thisChatBoxTemplateRef = useRef<HTMLDivElement>(null)

  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen)
  const setChatWindowUsername = useChatWindowUsernameStore((state) => state.setChatWindowUsername)
  const setChatWindowUserId = useChatWindowUserIdStore((state) => state.setChatWindowUserId)
  const setChatWindowAvatar = useChatWindowAvatarStore((state) => state.setChatWindowAvatar)
  const { setUserId } = useUserIdStore()

  // single owner id in userId store controls which ChatBox's context menu is open
  const contextMenuOwnerId = useUserIdStore(state => state.userId)

  const { setContextMenuOffsetLeft, setContextMenuOffsetTop } = useContextMenuOffsetStore()
  const [windowInnerWidth, setWindowInnerWidth] = useState<number>(window.innerWidth)

  // ensure any global leftover is closed on mount (keeps previous behavior minimal)
  useEffect(() => {
    setUserId("") // clear global selected id if any (optional)
  }, [setUserId])


  useEffect(() => {
    setContextMenuOffsetLeft(thisChatBoxTemplateRef.current?.offsetWidth || 0)
    const handleResize = () => {
      setWindowInnerWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [windowInnerWidth])

  return (
    <div
      ref={thisChatBoxTemplateRef}
      className="chat-box bg-[#0f0f0f] active:bg-[#212121] transition-all 0.2s ease-in-out px-[10px] min-h-[70px] max-h-[70px] hover:bg-[#212121] w-full flex justify-between items-center cursor-pointer "
      onClick={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        await delay(0.3)
        setChatWindowAvatar(imgUrl)
        setChatWindowUsername(username)
        setChatWindowUserId(userId)
        setActiveScreen("ChatWindow")
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        setContextMenuOffsetTop(thisChatBoxTemplateRef.current?.offsetTop || 0)
        setContextMenuOffsetLeft(thisChatBoxTemplateRef.current?.offsetWidth || 0)
        setUserId(contextMenuOwnerId === userId ? "" : userId)
      }}
    >
      <div className="flex gap-[10px] items-center flex-1 min-w-0">

        <div className="avatar-box  h-[50px] w-[50px] rounded-full overflow-hidden shrink-0 flex justify-center items-center">
          <img src={imgUrl} alt="user_avatar" />
        </div>

        <div className="user-username latest-msg flex flex-col w-full flex-1 min-w-0 pr-2 overflow-hidden">
          <p className="text-[16px] font-bold truncate">{username}</p>
          <p
            className="last-seen-msg text-sm truncate"
            style={{
              opacity: lastMsgType === "sent" ? 1 : 0.6,
              color: lastMsgType === "sent" ? "#1a73e8" : "",
            }}
            title={lastMsg}
          >
            {lastMsg}
          </p>
        </div>
      </div>

      {/* <div 
      className=" shrink-0 ml-1"
      style={{
        zIndex: contextMenuOwnerId === userId ? 40 :  25 
      }}
      >
        <button
          className="cursor-pointer active:bg-[#303030] transition-all 0.2s ease-in-out flex justify-center items-center hover:bg-[#303030] h-10 w-10 rounded-full"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log(thisChatBoxTemplateRef.current?.offsetTop)
            console.log(thisChatBoxTemplateRef.current?.offsetWidth)
            setContextMenuOffsetTop(thisChatBoxTemplateRef.current?.offsetTop || 0)
            setContextMenuOffsetLeft(thisChatBoxTemplateRef.current?.offsetWidth || 0)
            // toggle local menu and set current userId for actions if needed
            // toggle context menu owner: opening one will close any other
            setUserId(contextMenuOwnerId === userId ? "" : userId)
          }}
          style={{
            backgroundColor: contextMenuOwnerId === userId ? "#303030" : ""
          }}
          
        >
          <MoreVertical />
        </button>
      </div> */}

      {contextMenuOwnerId === userId && <ContextMenu friendId={userId} onClose={() => setUserId("")} />}

    </div>
  )
}
// ...existing code...