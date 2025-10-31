import { UserPlus, UserCheck, CircleCheck } from "lucide-react"
import { useState } from "react"
import { useUser } from "@clerk/clerk-react"
import GeneralLoader from "../../GeneralLoader"
import { useReqSentStore } from "../../../zustand/store/ReqSentStore"
import { handleSendFriendRequest } from "../../../APIs/handlers/handleSendFriendRequest.handler"
import "../../../index.css"

interface ChatBoxTemplatePropsType {
  username: string,
  latestMsg?: string,
  imgUrl: string,
  id: string
}

function Modal({ msg }: { msg: string }) {
  const { setIsReqSent } = useReqSentStore()

  return (
    <div
      className="h-screen w-full fixed left-0 top-0 z-100 flex justify-center items-start bg-black/50"
      onMouseDown={(e) => {
        // to save from onBlur event of input (search bar) tag from SidebarMainContent's Navbar.tsx
        e.preventDefault()
        e.stopPropagation()
        setIsReqSent(false)

      }}

    >
      <div
        className="px-3 py-2 mt-5 flex justify-center items-center rounded-xl bg-[#0f0f0f] border border-[#303030]"
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        style={{
          animation: "fade-in-slide-down 0.2s ease-in-out forwards"
        }}
      >
        <div className="flex justify-center items-center gap-2">
          <span className="font-bold">{msg}</span>
          <span>
            <CircleCheck size={18} color="#22c55e" />
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ChatBoxTemplate({ username, latestMsg, imgUrl, id }: ChatBoxTemplatePropsType) {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { user } = useUser()
  const [resMsg, setResMsg] = useState<string>("")
  const { isReqSent, setIsReqSent } = useReqSentStore()

  return (
    <>
      <div
        className="chat-box px-[10px] min-h-[70px] max-h-[70px] hover:bg-[#212121] w-full flex justify-between items-center"
        onMouseDown={(e) => {
          console.log("mousedown")
          e.preventDefault()
          e.stopPropagation()
          console.log("chatbox clicked: ", id)
        }}
      >

        <div className="flex items-center gap-[10px]">
          <div className="avatar-box  h-[50px] w-[50px] rounded-full overflow-hidden shrink-0 flex justify-center items-center">
            <img src={imgUrl} alt="user_avatar" />
          </div>

          <div className="user-username latest-msg flex flex-col">
            <p className="text-[16px] font-bold">{username}</p>
            <p className="last-seen-msg text-sm opacity-60">{latestMsg}</p>
          </div>
        </div>

        <div className="h-[36px] w-[36px]">
          <button
            className="opacity-60 hover:opacity-100 flex justify-center items-center h-full w-full rounded-full"
            onClick={async () => {
              setIsLoading(true)
              const result = await handleSendFriendRequest(user, id, username)
              if (result === "Error") {
                setIsLoading(false)
                setIsReqSent(false)
              } else {
                setResMsg(result)
                setIsLoading(false)
                setIsReqSent(true)
              }
            }}
            style={{
              opacity: isReqSent ? "1" : "",
              cursor: isReqSent ? "default" : "pointer"
            }}
          >
            {!isReqSent && !isLoading && <UserPlus />}
            {isLoading && <GeneralLoader />}
            {isReqSent && <UserCheck color="#22c55e" />}
          </button>
        </div>
      </div >
      {isReqSent && <Modal msg={resMsg} />}
    </>
  )
}
