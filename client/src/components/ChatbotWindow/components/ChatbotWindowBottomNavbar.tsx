
import { useRef, useEffect, useState } from 'react'
import { ArrowUpIcon, AtSign } from 'lucide-react'
import { useSocket } from '../../../hooks/useSocket'
import { Socket } from 'socket.io-client'
import { useChatbotMessageStore } from '../../../zustand/store/ChatbotMessageStore'
import { useGlobalRefreshStore } from '../../../zustand/store/GlobalRefresh'
import { useChatbotErrorStore } from '../../../zustand/store/ErrorStore'

export default function ChatbotWindowBottomNavbar() {

    const inputRef = useRef<HTMLInputElement>(null)
    const socket: Socket = useSocket()
    const { addYourMsg, addBotMsg } = useChatbotMessageStore()
    const { globalRefresh, setGlobalRefresh } = useGlobalRefreshStore()
    const [query, setQuery] = useState<string>("")
    const { error } = useChatbotErrorStore()

    useEffect(() => {
        // socket.connect()

        const handleSendMsgToChatbot = (prompt: string) => {
            console.log(prompt)
        }

        const handleReceiveMsgFromChatbot = (response: string) => {
            console.log("from server: ", response)
            addBotMsg(response)
        }

        const handleReceiveLimitReached = (data: string) => {
            console.log("from server: ", data)
            alert(data)
            setGlobalRefresh(!globalRefresh)
        }


        socket.on("send-msg-chatbot", handleSendMsgToChatbot)

        socket.on("receive-msg-chatbot", handleReceiveMsgFromChatbot)

        socket.on("receive-limit-reached", handleReceiveLimitReached)

        socket.on("disconnect", (reason) => {
            console.warn("Disconnected from server: ", reason)
            if (reason === "ping timeout") socket.connect()
        })

        return () => {
            socket.off("receive-msg-chatbot")
            socket.off("send-msg-chatbot")
            socket.off("receive-limit-reached")
            socket.off("disconnect") // optional, since disconnect auto clears on disconnect()
            socket.disconnect()
        }
    }, [])

    // wherever you emit
    const safeEmit = (event: string, payload: any) => {
        if (socket.connected) {
            socket.emit(event, payload);
        } else {
            socket.once("connect", () => socket.emit(event, payload));
        }
    };

    const handleSend = async (prompt: string) => {
        if (!prompt) return
        safeEmit("send-msg-chatbot", prompt)
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
                style={{
                    touchAction: "pan-x"
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        if (error === "Retry") return
                        if (!inputRef.current?.value.trim()) return
                        setQuery("")
                        handleSend(inputRef.current!.value.trim())
                    }
                }}
                onChange={(e) => {
                    setQuery(e.target.value.trim())
                }}
                onFocus={() => {
                    const myCustomEvent = new CustomEvent("scroll-to-bottom-chat")
                    window.dispatchEvent(myCustomEvent)
                }}
                onTouchMove={(e) => e.stopPropagation()}
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
                className='cursor-pointer h-[46px] w-[46px] bg-blue-500 active:bg-blue-400  flex-shrink-0 flex justify-center items-center rounded-full'
                onClick={() => {
                    if (error === "Retry") return
                    if (!inputRef.current?.value.trim()) return
                    setQuery("")
                    console.log("msg sent to chatbot...")
                    console.log(inputRef.current?.value.trim())
                    handleSend(inputRef.current?.value.trim())
                }}
                onMouseDown={(e) => e.preventDefault()}
                style={{
                    opacity: query && !error ? 1 : 0.6
                }}
            >
                <ArrowUpIcon />
            </button>
        </div>
    )
}
