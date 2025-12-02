import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useAuth } from '@clerk/clerk-react'
import { useChatbotMessageStore } from '../../../zustand/store/ChatbotMessageStore'
import GeneralLoader from '../../GeneralLoader'
import { useGlobalRefreshStore } from '../../../zustand/store/GlobalRefresh'
import { fetchChatbotChatMessages } from '../../../APIs/services/fetchChatbotChatMessages.service'
import { useChatbotErrorStore } from '../../../zustand/store/ErrorStore'
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import TripleDotLoader from '../../TripleDotLoader'

export default function ChatbotChatsArea() {

    const { user } = useUser()
    const { getToken } = useAuth()
    const { setAllChatbotMessages, allChatbotMessages } = useChatbotMessageStore()
    const bottomRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { globalRefresh } = useGlobalRefreshStore()
    const [isRetryBtnClicked, setIsRetryBtnClicked] = useState<boolean>(false)
    const controllerRef = useRef<AbortController | null>(null)
    const reqIdRef = useRef<number>(0)

    const initializedRef = useRef(false)
    const prevLenRef = useRef<number>(0)
    const { error, setError } = useChatbotErrorStore()

    const touchStartYRef = useRef<number>(0)
    const mainDivRef = useRef<HTMLDivElement>(null)
    const msgsContentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) {
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
            const result = await fetchChatbotChatMessages(getToken, user?.id, controller.signal)

            if (currentReqId !== reqIdRef.current) return

            if (result instanceof Array) {
                setAllChatbotMessages(result)
                setIsLoading(false)
                setError("")
            } else if (result === "AbortError") {
                setIsLoading(false)
            } else {
                setIsLoading(false)
                setError("Retry")
            }
        }
        fetchData()
    }, [globalRefresh, isRetryBtnClicked])

    useEffect(() => {
        if (!isLoading && !initializedRef.current) {
            initializedRef.current = true
            // jump to bottom instantly on first render
            bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" })
            // set baseline length
            prevLenRef.current = allChatbotMessages.length
        }
    }, [isLoading, allChatbotMessages.length])

    useEffect(() => {
        if (!initializedRef.current) return
        const currLen = allChatbotMessages.length
        const prevLen = prevLenRef.current
        prevLenRef.current = currLen
        if (currLen > prevLen) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
        }
    }, [allChatbotMessages])

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
            // e.preventDefault()
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
            className='h-full flex pb-0 flex-col p-2 w-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-[#0f0f0f] scrollbar-thumb-[#212121]'
            style={{
                justifyContent: isLoading || error ? "center" : "",
                alignItems: isLoading || error ? "center" : "",
                overscrollBehavior: "contain",
                touchAction: "pan-y"
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMoveBoundaryLocked}
        >
            <div
                ref={msgsContentRef}
                className="messages-content w-full flex flex-col gap-2"
            >

                {isLoading && <GeneralLoader />}
                {!isLoading
                    && allChatbotMessages.length === 0
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
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {error}
                        </button>
                    </div>
                }
                {!isLoading && allChatbotMessages.map((chat, idx) => (
                    <div key={idx} className='flex flex-col gap-2'>
                        <div className='flex justify-end'>
                            <span className='bg-blue-500 border border-blue-400 p-2 rounded-lg max-w-[80%]'>
                                {chat.you}
                            </span>
                        </div>
                        {/* ✅ Use div wrapper with proper constraints */}
                        <div className='flex justify-start' style={{ minWidth: 0, maxWidth: '100%' }}>
                            <div
                                className='bg-[#303030] border border-[#404040] p-2 rounded-lg chatbot-message-container'
                                style={{
                                    maxWidth: '80%',
                                    minWidth: 0,
                                    // overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                    whiteSpace:"pre-wrap",
                                    boxSizing: "border-box",
                                    textWrap: "wrap",
                                }}
                            >
                                {chat.bot === "" ? <TripleDotLoader loaderName='Pondering' /> : (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeHighlight]}
                                    >
                                        {chat.bot}
                                    </ReactMarkdown>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div ref={bottomRef}></div>
        </div>
    )
}
