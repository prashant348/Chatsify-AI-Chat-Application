import { useEffect, useRef } from "react"
import { useMessageStore } from "../../../zustand/store/MessageStore"
import { useUser } from "@clerk/clerk-react"
import { useGlobalRefreshStore } from "../../../zustand/store/GlobalRefresh"
import { useChatWindowUserIdStore } from "../../../zustand/store/ChatWindowUserId"
import { fetchChatMessages } from "../../../APIs/services/fetchChatMessages.service"
import GeneralLoader from "../../GeneralLoader"
import { useState } from "react"


const EMPTY_MESSAGES: any[] = []

const ChatWindowChatsArea = () => {

  const { chatWindowUserId } = useChatWindowUserIdStore()
  const messages = useMessageStore(state => {
    const key = chatWindowUserId ?? ""
    return state.messages[key] ?? EMPTY_MESSAGES
  })

  const setMessagesFor = useMessageStore(state => state.setMessagesFor)

  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { user } = useUser()
  const { globalRefresh } = useGlobalRefreshStore()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [isRetryBtnClicked, setIsRetryBtnClicked] = useState<boolean>(false)


  const controllerRef = useRef<AbortController | null>(null)
  const reqIdRef = useRef<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || !chatWindowUserId) {
        setIsLoading(false)
        return
      }
      // abort previous pending request (if any)
      controllerRef.current?.abort()

      // create new controller + request id
      const controller = new AbortController()
      controllerRef.current = controller
      const currentReqId = ++reqIdRef.current

      setIsLoading(true)
      setError("")

      const result = await fetchChatMessages(user?.id, chatWindowUserId, controller.signal)
      
      if (currentReqId !== reqIdRef.current) return
      
      if (result instanceof Array) {
        setMessagesFor(chatWindowUserId, result as any)
        setIsLoading(false)
        setError("")
      } else if (result === "AbortError") {
        // intentionally aborted — do not treat as error
        // keep UI consistent: stop loader (or keep it if you start next request immediately)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        setError("Retry")
      }
    }
    fetchData()

    return () => {
      controllerRef.current?.abort()
    }
  }, [user?.id, globalRefresh, chatWindowUserId, isRetryBtnClicked])

  // Auto-scroll to latest messages
  useEffect(() => {
    console.log("auto scrolling...")
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, messages.length, chatWindowUserId])

  return (
    <div
      className="h-full w-full gap-2 p-2 pb-0 flex flex-col overflow-y-auto scrollbar-thin scrollbar-track-[#0f0f0f] scrollbar-thumb-[#212121]"
      style={{
        justifyContent: isLoading ? "center" : "",
        alignItems: isLoading ? "center" : ""
      }}
    >
      {isLoading && <GeneralLoader />}
      {!isLoading
        && messages.length === 0
        && error
        &&
        <div className="h-full w-full flex flex-col gap-1 justify-center items-center">
          <span className="text-center">
            Unable to fetch chats!
          </span>
          <button
            className="bg-[#212121] hover:bg-[#303030] p-2 border border-[#404040] rounded-md cursor-pointer"
            onClick={() => {
              setIsLoading(true)
              setIsRetryBtnClicked(!isRetryBtnClicked)
            }}>
            {error}
          </button>
        </div>
      }
      {!isLoading && messages.map((msg, index) => (
        <p
          key={index}
          className={`p-2 rounded-lg  max-w-[70%] ${msg.type === "sent"
            ? "sent-class bg-[#1a73e8] border border-blue-400  text-white self-end"
            : "received-class bg-[#303030] border border-[#404040] self-start"
            }`}
        >
          {msg.msg}
        </p>
      ))}
      <div ref={bottomRef}></div> {/* this is taking space at bottom of the chat area that is why pb-0 applied on chat area */}
    </div>
  )
}

export default ChatWindowChatsArea


