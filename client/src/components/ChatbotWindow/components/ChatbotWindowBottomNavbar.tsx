
import { useRef, useEffect } from 'react'
import { ArrowUpIcon, AtSign } from 'lucide-react'
import { useSocket } from '../../../hooks/useSocket'
import { Socket } from 'socket.io-client'
import { useChatbotMessageStore } from '../../../zustand/store/ChatbotMessageStore'
import { useGlobalRefreshStore } from '../../../zustand/store/GlobalRefresh'
export default function ChatbotWindowBottomNavbar() {

    const inputRef = useRef<HTMLInputElement>(null)
    const socket: Socket = useSocket()
    const { addYourMsg, addBotMsg } = useChatbotMessageStore()
    const { globalRefresh, setGlobalRefresh } = useGlobalRefreshStore()

    useEffect(() => {
        socket.connect()

        socket.on("send-msg-chatbot", (prompt) => {
            console.log(prompt)
        })

        socket.on("receive-msg-chatbot", (response) => {
            console.log("from server: ", response)
            addBotMsg(response)
        })

        socket.on("receive-limit-reached", (data) => {
            console.log("from server: ", data)
            alert(data)
            setGlobalRefresh(!globalRefresh)
        })

        return () => {
            socket.off("receive-msg-chatbot")
            socket.off("send-msg-chatbot")
            socket.disconnect()
        }
    }, [])

    const handleSend = async (prompt: string) => {
        if (!prompt) return
        socket.emit("send-msg-chatbot", prompt)
        addYourMsg(prompt)
        inputRef.current!.value = ""
    }

    return (
        <div className='input-box py-[12px] bg-black gap-2 shrink-0  h-[70px] w-full flex justify-between items-center px-3'>
            <input
                ref={inputRef}
                type="text"
                placeholder='Ask anything...'
                className='outline-none w-full h-full px-4 pr-10 focus:pr-10  bg-[#1f1f1f] rounded-full focus:border-[#404040] focus:border focus:px-[15px]'
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        if (!inputRef.current?.value.trim()) return
                        handleSend(inputRef.current!.value.trim())
                    }
                }}
            />


            <button className="fixed hover:bg-[#303030]  h-9 w-9 shrink-0 flex justify-center items-center rounded-full"
                style={{
                    right: 72
                }}  
                onClick={() => alert("Feature 'Add Context' coming soon!")}
            >
                <AtSign size={20} />
            </button>

            <button
                className='cursor-pointer h-[46px] w-[46px] bg-blue-500  flex-shrink-0 flex justify-center items-center rounded-full sm:hover:opacity-100 sm:opacity-60 '
                onClick={() => {
                    if (!inputRef.current?.value.trim()) return
                    console.log("msg sent to chatbot...")
                    console.log(inputRef.current?.value.trim())
                    handleSend(inputRef.current?.value.trim())
                }}
                style={{
                    opacity: window.innerWidth <= 640 ? 1 : ""
                }}
            >
                <ArrowUpIcon />
            </button>
        </div>
    )
}
