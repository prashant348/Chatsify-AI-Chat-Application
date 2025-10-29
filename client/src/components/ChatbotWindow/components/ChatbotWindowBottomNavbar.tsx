
import { useRef, useEffect } from 'react'
import { SendHorizonal } from 'lucide-react'
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
        <div className='input-box h-[70px] w-full bg-[#0f0f0f] flex justify-between items-center px-3'>
            <input
                ref={inputRef}
                type="text"
                placeholder='Ask anything'
                className='outline-none w-full h-full px-2'
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        if (!inputRef.current?.value.trim()) return
                        handleSend(inputRef.current!.value.trim())
                    }
                }}
            />

            <button
                className='cursor-pointer opacity-60 hover:opacity-100'
                onClick={() => {
                    if (!inputRef.current?.value.trim()) return
                    console.log("msg sent to chatbot...")
                    console.log(inputRef.current?.value.trim())
                    handleSend(inputRef.current?.value.trim())
                }}
            >
                <SendHorizonal />
            </button>
        </div>
    )
}
