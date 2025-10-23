import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useAuth } from '@clerk/clerk-react'
import { useChatbotMessageStore } from '../../../zustand/store/ChatbotMessageStore'
import GeneralLoader from '../../GeneralLoader'

export default function ChatbotChatsArea() {

    const { user } = useUser()
    const { getToken } = useAuth()
    const { setAllChatbotMessages, allChatbotMessages } = useChatbotMessageStore()
    const bottomRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${user?.id}/chatbot-chats`, {
                    method: "GET",
                    headers: {
                        contentType: "application/json",
                        "authorization": `Bearer ${await getToken()}`
                    }
                })

                const data = await res.json()
                console.log(data)

                console.log(data.chatbotChats)

                setAllChatbotMessages(data.chatbotChats)

                console.log("chatbot chats fetched!")
            } catch (err) {
                console.error("err in fetching chatbot chats: ", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchChats()
    }, [])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [allChatbotMessages])

    return (
        <div className='h-full w-full'>
            {isLoading && <GeneralLoader />}
            {!isLoading && allChatbotMessages.map((chat, idx) => (
                <div key={idx} className='flex flex-col p-2 gap-2'>
                    <p className='flex justify-end'>
                        <span className='bg-blue-500 p-2 rounded-lg max-w-[70%]'>{chat.you}</span>
                    </p>
                    <p className='flex justify-start '>
                        <span className='bg-[#303030] p-2 rounded-lg max-w-[70%]'>
                            {chat.bot === "" ? "Thinking..." : chat.bot}
                        </span>
                    </p>
                </div>
            ))}
            <div ref={bottomRef}></div>
        </div>
    )
}
