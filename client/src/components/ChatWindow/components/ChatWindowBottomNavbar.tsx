import { PaperclipIcon } from "lucide-react"
import { ArrowUpIcon, SmilePlus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { useSocket } from "../../../hooks/useSocket"
import { useMessageStore } from "../../../zustand/store/MessageStore"
import { useChatWindowUserIdStore } from "../../../zustand/store/ChatWindowUserId"
import { useChatWindowErrorStore } from "../../../zustand/store/ErrorStore"

const ChatWindowBottomNavbar = () => {

    const msgInputRef = useRef<HTMLInputElement>(null)
    const socket = useSocket()
    const { user } = useUser()
    const { addReceived, addSent } = useMessageStore()
    const { chatWindowUserId } = useChatWindowUserIdStore()
    const [query, setQuery] = useState<string>("")
    const { error } = useChatWindowErrorStore()


    useEffect(() => {
        socket.connect()
        socket.on("private-message", (data) => {
            console.log("from server: ", data)

        })
        socket.on("receive-message", ({ message, from }) => {
            console.log("📨 New message:", message, "from:", from);
            addReceived(from, message)
        });
        return () => {
            socket.off("receive-message")
            socket.disconnect()
        }
    }, [])

    const sendMessage = (msg: string | undefined) => {
        if (!msg) return
        if (!chatWindowUserId) {
            console.warn("no chatWindowUserId set - cannot send message")
            return
        }

        // optimistic update: add sent message to local store immediately
        addSent(chatWindowUserId, msg)

        // then emit to server
        socket.emit("private-message", {
            to: chatWindowUserId,
            message: msg,
            from: user?.id
        })

        msgInputRef.current!.value = ""
    }

    return (
        <div className='input-box  py-[12px] bg-black gap-2 shrink-0  h-[70px] w-full flex justify-between items-center px-3'>
            <input
                ref={msgInputRef}
                type="text"
                placeholder='Type a message...'
                className='outline-none w-full h-full px-4 pr-20 focus:pr-20   bg-[#1f1f1f] rounded-full focus:border-[#404040] focus:border focus:px-[15px]'
                
                style={{
                    touchAction: "pan-x"
                }}

                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        if (error === "Retry") return;
                        if (!msgInputRef.current?.value.trim()) return;
                        setQuery("")
                        sendMessage(msgInputRef.current!.value.trim())
                    }
                }}
                onChange={(e) => {
                    setQuery(e.target.value.trim())
                }}
                onTouchMove={(e) => e.stopPropagation()}
                onFocus={() => {
                    const myCustomEvent = new CustomEvent("scroll-to-bottom-chat")
                    window.dispatchEvent(myCustomEvent)
                }}
            />

            <button className="fixed hover:bg-[#303030]  h-9 w-9 shrink-0 flex justify-center items-center rounded-full"
                style={{
                    right: 110
                }}
                onClick={() => alert("Feature 'Emoji Store' coming soon!")}
            >
                <SmilePlus size={20} />
            </button>

            <button className="fixed hover:bg-[#303030]  h-9 w-9 shrink-0 flex justify-center items-center rounded-full"
                style={{
                    right: 72
                }}
                onClick={() => alert("Feature 'Add Media Files' coming soon!")}
            >
                <PaperclipIcon size={20} />
            </button>

            <button
                className='cursor-pointer h-[46px] w-[46px] bg-blue-500  flex-shrink-0 flex justify-center items-center rounded-full'
                onClick={() => {
                    if (error === "Retry") return
                    if (!msgInputRef.current?.value.trim()) return
                    setQuery("")
                    console.log(msgInputRef.current?.value.trim())
                    sendMessage(msgInputRef.current?.value.trim())
                }}
                style={{
                    opacity: query && !error ? 1 : 0.6
                }}
                onMouseDown={(e) => e.preventDefault()}
            >
                <ArrowUpIcon />
            </button>
        </div>
    )
}

export default ChatWindowBottomNavbar
