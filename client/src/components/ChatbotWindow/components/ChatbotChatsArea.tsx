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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const result = await fetchChatbotChatMessages(getToken, user?.id)
            if (result instanceof Array) {
                setIsLoading(false)
                setAllChatbotMessages(result)
            } else if (result === "Error") {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [globalRefresh])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [allChatbotMessages])

    return (
        <div className='h-full w-full'>
            {isLoading && <GeneralLoader />}
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
