
import { Check, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import { useUser } from "@clerk/clerk-react"
import { useRequestPendingStore } from "../../../zustand/store/RequestsPending"

import { handleAcceptFriendRequest, handleRejectFriendRequest } from "../../../APIs/handlers/FriendRequest.handlers"
interface RequestBoxTemplatePropsType {
  senderUsername: string,
  senderAvatar: string,
  senderId: string,
  receivedAt: string
}

export default function RequestBoxTemplate({
  senderUsername,
  senderAvatar,
  senderId,
  receivedAt
}: RequestBoxTemplatePropsType) {

  const { getToken } = useAuth()
  const { user } = useUser()
  const [date] = useState<string>(new Date(receivedAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,   // 👈 ye important hai AM/PM ke liye
  }))
  const setIsReqPending = useRequestPendingStore(state => state.setIsReqPending)
  const isReqPending = useRequestPendingStore(state => state.isReqPending)

  return (
    <div className="h-[70px] w-full hover:bg-[#1f1f1f] transition all duration-300 flex justify-between items-center px-4 cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="h-[54px] w-[54px] rounded-full overflow-hidden">
          <img src={senderAvatar} alt="user_avatar" className="h-full w-full" />
        </div>
        <p className="flex flex-col">
          <span className="text-xl">{senderUsername}</span>
          <span className="text-[12px] opacity-50">
            <span>{receivedAt.split("T")[0].split("-").reverse().join("/")}</span>
            <span> • {date.toUpperCase()}</span>
          </span>
        </p>


      </div>
      <div className="h-full flex items-center gap-3">

        <button
          className="cursor-pointer h-[36px] w-[36px] flex justify-center items-center transition-all duration-200 hover:bg-[#2b2b2b] rounded-full"
          onClick={async () => {
            const result = await handleRejectFriendRequest(getToken, senderId, user?.id)
            if (result === "Success") {
              setIsReqPending(!isReqPending)
            } else if (result === "Error") {
              return
            }
          }}
        >
          <X size={20} className="text-red-400" />
        </button>

        <button
          className="cursor-pointer h-[36px] w-[36px] flex justify-center items-center transition-all duration-200 hover:bg-[#2b2b2b] rounded-full"
          onClick={async () => {
            const result = await handleAcceptFriendRequest(getToken, senderUsername, senderAvatar, senderId)
            if (result === "Success") {
              setIsReqPending(!isReqPending)
            } else if (result === "Error") {
              return
            }
          }}
        >
          <Check size={20} className="text-green-400" />
        </button>

      </div>
    </div>
  )
}
