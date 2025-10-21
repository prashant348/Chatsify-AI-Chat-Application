import { useEffect, useRef, useState } from "react"
import { useMessageStore } from "../../../zustand/store/MessageStore"
import { useUser } from "@clerk/clerk-react"
import { useChatWindowUsernameStore } from "../../../zustand/store/ChatWindowUsername"


// interface Chats {
//   text: string
//   type: "sent" | "received"

// }
const ChatWindowChatsArea = () => {
  const { allMessages, setAllMessages } = useMessageStore()
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { user } = useUser()
  const [ friendId, setFriendId ] = useState<string>("")
  const { chatWindowUsername } = useChatWindowUsernameStore()
  // const [ chats, setChats ] = useState<Chats[]>()

  useEffect(() => {
    const fetchReceiverId = async (receiverUsername: string) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${receiverUsername}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })

        const data = await res.json()
        console.log(data)
        setFriendId(data.userId)
        
      } catch (err) {
        console.error("err in fetching user clerk id based on username", err)
      }
    }

    fetchReceiverId(chatWindowUsername)
  }, [])


  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${user?.id}/${friendId}/chats`, {
          method: "GET",
          headers: {
            contentType: "application/json"
          }
        })

        const data = await res.json()
        console.log(data)
        setAllMessages(data.chats)
      } catch (err) {
        console.log("err in fetching chat messages: ", err)
      }
    }

    fetchChatMessages()
  }, [user?.id, friendId])


  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [allMessages])



  return (
    <div className="h-full w-full  flex flex-col overflow-y-auto scrollbar-thin scrollbar-track-[#0f0f0f] scrollbar-thumb-[#212121]">
      <div className="flex flex-col gap-2 p-3">
        {allMessages.map((msg, index) => (
          <p
            key={index}
            className={`p-2 rounded-lg max-w-[70%] ${msg.type === "sent"
              ? "bg-[#1a73e8] text-white self-end"
              : "bg-[#303030] self-start"
              }`}
          >
            {msg.msg}
          </p>
        ))}
        {/* {chats.map((msg, index) => (
          <p
            key={index}
            className={`p-2 rounded-lg max-w-[70%] ${msg.type === "sent"
              ? "bg-[#1a73e8] text-white self-end"
              : "bg-[#303030] self-start"
              }`}
          >
            {msg.text}
          </p>
        ))} */}
        <div ref={bottomRef}></div>
      </div>
    </div>
  )
}

export default ChatWindowChatsArea


