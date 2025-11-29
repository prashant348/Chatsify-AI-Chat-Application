import { useEffect, useRef } from "react"
import { useMessageStore } from "../../../zustand/store/MessageStore"
import { useUser } from "@clerk/clerk-react"
import { useGlobalRefreshStore } from "../../../zustand/store/GlobalRefresh"
import { useChatWindowUserIdStore } from "../../../zustand/store/ChatWindowUserId"
import { fetchChatMessages } from "../../../APIs/services/fetchChatMessages.service"
import GeneralLoader from "../../GeneralLoader"
import { useState } from "react"
import { useChatWindowErrorStore } from "../../../zustand/store/ErrorStore"

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

  const [isRetryBtnClicked, setIsRetryBtnClicked] = useState<boolean>(false)

  const controllerRef = useRef<AbortController | null>(null)
  const reqIdRef = useRef<number>(0)


  const initializedRef = useRef(false)
  const prevLenRef = useRef<number>(0)

  const { error, setError } = useChatWindowErrorStore()
  const mainDivRef = useRef<HTMLDivElement>(null)
  const msgsContentRef = useRef<HTMLDivElement>(null)

  const touchStartYRef = useRef<number>(0)

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

      const result = await fetchChatMessages(user?.id, chatWindowUserId)

      if (currentReqId !== reqIdRef.current) return

      if (result instanceof Array) {
        setMessagesFor(chatWindowUserId, result as any)
        setIsLoading(false)
        setError("")
      }
      else {
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
  // useEffect(() => {
  //   if (!isLoading && error === "Retry" && messages.length > 0) {
  //     console.log("auto scrolling...")
  //     bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  //   }
  // }, [messages, messages.length, chatWindowUserId, error, isLoading])


  useEffect(() => {
    if (!isLoading && !initializedRef.current) {
      initializedRef.current = true
      // jump to bottom instantly on first render
      bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" })
      // set baseline length
      prevLenRef.current = messages.length
    }
  }, [isLoading, messages.length])

  useEffect(() => {
    if (!initializedRef.current) return
    const currLen = messages.length
    const prevLen = prevLenRef.current
    prevLenRef.current = currLen
    if (currLen > prevLen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [messages])


  useEffect(() => {
    const handler = () => {
      // slight delay helps after viewport resize due to keyboard
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
      }, 250)
    }
    window.addEventListener("scroll-to-bottom-chat" as any, handler as EventListener)
    return () => {
      window.removeEventListener("scroll-to-bottom-chat" as any, handler as EventListener)
    }
  }, [])

  // const handleScroll = () => {
  //   const element = mainDivRef.current

  //   const isAtBottom =
  //     element?.scrollHeight - element?.scrollTop === element?.clientHeight

  //   if (isAtBottom) {
  //     console.log("✅ Scroll reached the bottom!");
  //     // yahan apna code likh sakta hai (API call, message load etc.)
  //   }
  // }


  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? 0
  }

  const handleTouchMoveBoundaryLocked = (e: React.TouchEvent<HTMLDivElement>) => {
    if (error === "Retry" || isLoading) return
    const mainBox = mainDivRef.current
    const contentBox = msgsContentRef.current
    if (!mainBox || !contentBox) return
    if (contentBox.offsetHeight < mainBox.offsetHeight) {
      return
    }

    const currentY = e.touches[0]?.clientY ?? 0
    const deltaY = currentY - touchStartYRef.current // >0 finger down (scroll up), <0 finger up (scroll down)

    const atTop = mainBox.scrollTop <= 0
    const atBottom = mainBox.scrollHeight - mainBox.scrollTop <= mainBox.clientHeight + 1

    // block scroll chaining/rubber-band at edges
    if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    // otherwise keep scroll confined to chat area
    e.stopPropagation()
  }

  useEffect(() => {
    console.log("main div height: ", mainDivRef.current?.offsetHeight)
    console.log("inner content: ", msgsContentRef.current?.offsetHeight)
  }, [msgsContentRef.current?.offsetHeight, mainDivRef.current?.offsetHeight])

  return (
    <div
      ref={mainDivRef}
      className="h-full w-full p-2 pb-0 flex flex-col overflow-y-auto scrollbar-thin scrollbar-track-[#0f0f0f] scrollbar-thumb-[#212121]"
      style={{
        justifyContent: isLoading || error ? "center" : "",
        alignItems: isLoading || error ? "center" : "",
        overscrollBehavior: "contain",
        touchAction: "pan-y"
      }}
      // onScroll={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMoveBoundaryLocked}
    >
      <div
        ref={msgsContentRef}
        className="messages-content w-full flex flex-col gap-2"
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
              onMouseDown={(e) => e.preventDefault()}
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
      </div>
      <div ref={bottomRef}></div> {/* this is taking space at bottom of the chat area that is why pb-0 applied on chat area */}
    </div>
  )
}

export default ChatWindowChatsArea


