import { UserPlus, UserCheck } from "lucide-react"
import { useState } from "react"
import { useUser } from "@clerk/clerk-react"
import GeneralLoader from "../../GeneralLoader"
import React from "react"

interface ChatBoxTemplatePropsType {
  username: string,
  latestMsg?: string,
  imgUrl: string,
  id: string
}


export default function ChatBoxTemplate({ username, latestMsg, imgUrl, id }: ChatBoxTemplatePropsType) {

  const [isReqSent, setIsReqSent] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { user } = useUser()


  const handleSendReqClick = async () => {

    try {
      console.log("handleSendReqClick")
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/send-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderUsername: user?.username,
          senderId: user?.id,
          senderEmail: user?.emailAddresses[0].emailAddress,
          senderAvatar: user?.imageUrl,
          receiverId: id,
          receiverUsername: username
        })
      });

      const data = await res.json()
      console.log(data)
    } catch (err) {
      console.error("error in sending req: ", err)
    } finally {
      setIsLoading(false)
      setIsReqSent(true)
    
    }
  }

  return (
    <div
      className="chat-box px-[10px] min-h-[70px] max-h-[70px] hover:bg-[#212121] w-full flex justify-between items-center"
      onMouseDown={(e) => {
        console.log("mousedown")
        e.preventDefault()
        e.stopPropagation()
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
          onClick={() => {
            setIsLoading(true)
            handleSendReqClick()
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
  )
}
