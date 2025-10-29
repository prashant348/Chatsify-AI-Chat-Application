import { useEffect, useRef} from "react"
import { useMessageStore } from "../../../zustand/store/MessageStore"
import { useUser } from "@clerk/clerk-react"
import { useGlobalRefreshStore } from "../../../zustand/store/GlobalRefresh"
import { useChatWindowUserIdStore } from "../../../zustand/store/ChatWindowUserId"
import { fetchChatMessages } from "../../../APIs/services/fetchChatMessages.service"
import GeneralLoader from "../../GeneralLoader"
import { useState } from "react"

const ChatWindowChatsArea = () => {
  const { allMessages, setAllMessages } = useMessageStore()
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { user } = useUser()
  const { globalRefresh } = useGlobalRefreshStore()
  const { chatWindowUserId } = useChatWindowUserIdStore()
  const [ isLoading, setIsLoading ] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const result = await fetchChatMessages(user?.id, chatWindowUserId)
      if (result instanceof Array) {
        setIsLoading(false)
        setAllMessages(result)
      } else if (result === "Error") {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user?.id, globalRefresh])

  // Auto-scroll to latest messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [allMessages])

  return (
    <div className="h-full w-full  flex flex-col overflow-y-auto scrollbar-thin scrollbar-track-[#0f0f0f] scrollbar-thumb-[#212121]">
      <div 
      className="flex flex-col h-full gap-2 p-3"
      style={{
        justifyContent: isLoading? "center": "",
        alignItems: isLoading? "center": ""
      }}
      >
        {isLoading && <GeneralLoader />}
        {!isLoading && allMessages.map((msg, index) => (
          <p
            key={index}
            className={`p-2 rounded-lg max-w-[70%] ${msg.type === "sent"
              ? "bg-[#1a73e8] border border-blue-400  text-white self-end"
              : "bg-[#303030] border border-[#404040] self-start"
              }`}
          >
            {msg.msg}
          </p>
        ))}
        <div ref={bottomRef}></div>
      </div>
    </div>
  )
}

export default ChatWindowChatsArea


