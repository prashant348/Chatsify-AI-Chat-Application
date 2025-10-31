import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useAuth } from '@clerk/clerk-react'
import { useChatbotMessageStore } from '../../../zustand/store/ChatbotMessageStore'
import GeneralLoader from '../../GeneralLoader'
import { useGlobalRefreshStore } from '../../../zustand/store/GlobalRefresh'
import { fetchChatbotChatMessages } from '../../../APIs/services/fetchChatbotChatMessages.service'

export default function ChatbotChatsArea() {

    const { user } = useUser()
    const { getToken } = useAuth()
    const { setAllChatbotMessages, allChatbotMessages } = useChatbotMessageStore()
    const bottomRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { globalRefresh } = useGlobalRefreshStore()
    const [error, setError] = useState<string>("")
    const [isRetryBtnClicked, setIsRetryBtnClicked] = useState<boolean>(false)
    const controllerRef = useRef<AbortController | null>(null)
    const reqIdRef = useRef<number>(0)


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
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [allChatbotMessages])

    return (
        <div className='h-full w-full'>
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
                        }}>
                        {error}
                    </button>
                </div>
            }
            {!isLoading && allChatbotMessages.map((chat, idx) => (
                <div key={idx} className='flex flex-col p-2 gap-2'>
                    <p className='flex justify-end'>
                        <span className='bg-blue-500 border border-blue-400 p-2 rounded-lg max-w-[70%]'>{chat.you}</span>
                    </p>
                    <p className='flex justify-start '>
                        <span className='bg-[#303030] border border-[#404040] p-2 rounded-lg max-w-[70%]'>
                            {chat.bot === "" ? "Thinking..." : chat.bot}
                        </span>
                    </p>
                </div>
            ))}
            <div ref={bottomRef}></div>
        </div>
    )
}
