
import { Check, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import { useUser } from "@clerk/clerk-react"
import { useRequestPendingStore } from "../../../zustand/store/RequestsPending"

export default function RequestBoxTemplate({ senderUsername, senderAvatar, senderId, receivedAt }: { senderUsername: string, senderAvatar: string, senderId: string, receivedAt: string }) {

  const { getToken } = useAuth()
  const { user } = useUser()
  const [date] = useState<string>(new Date(receivedAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,   // 👈 ye important hai AM/PM ke liye
  }))
  const setIsReqPending = useRequestPendingStore(state => state.setIsReqPending)


  const handleReqAcceptClick = async () => {
    try {
       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/accept-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${await getToken()}`
        },
        body: JSON.stringify({
          senderUsername: senderUsername,
          senderAvatar: senderAvatar,
          senderId: senderId
        })
       })

       const data = await res.json()
       console.log(data)
       setIsReqPending(false)
    } catch(err) {
      console.error("err in accepting req: ", err)
    }
  }

  const handleReqRejectClick = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reject-request`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${await getToken()}`
        },
        body: JSON.stringify({
          senderId: senderId,
          receiverId: user?.id
        })
      })

      const data = await res.json()
      console.log(data)
      setIsReqPending(false)
    } catch (err) { 
      console.error("err in rejecting req: ", err)
    } 
  }



  return (
    <div className="h-[70px] w-full hover:bg-[#212121] flex justify-between items-center px-4 cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="h-[54px] w-[54px] bg-red-300 rounded-full overflow-hidden">
          <img src={senderAvatar} alt="user_avatar" className="h-full w-full" />
        </div>
        <p className="flex flex-col">
          <span className="text-xl">{senderUsername}</span>
          <span className="text-sm opacity-50">
            <span>{receivedAt.split("T")[0].split("-").reverse().join("/")}</span>
            <span>, {date.toUpperCase()}</span>
          </span>
        </p>


      </div>
      <div className="h-full flex items-center gap-3">

        <button 
        className="cursor-pointer h-[42px] w-[42px] flex justify-center items-center hover:bg-[#303030] rounded-full"
        onClick={() => {
          handleReqRejectClick()
        }}
        >
          <X color="#ef4444" />
        </button>

        <button 
        className="cursor-pointer h-[42px] w-[42px] flex justify-center items-center hover:bg-[#303030] rounded-full"
        onClick={() => {
          handleReqAcceptClick()
        }}
        >
          <Check color="#22c55e" />
        </button>

      </div>
    </div>
  )
}
