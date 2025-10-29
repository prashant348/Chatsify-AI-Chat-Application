import { PaperclipIcon } from "lucide-react"
import { SmileIcon, SendHorizonalIcon as SHI } from "lucide-react"
import { useEffect, useRef } from "react"
import { useUser } from "@clerk/clerk-react"
import { useSocket } from "../../../hooks/useSocket"
import { useMessageStore } from "../../../zustand/store/MessageStore"
import { useChatWindowUserIdStore } from "../../../zustand/store/ChatWindowUserId"

const ChatWindowBottomNavbar = () => {

    const msgInputRef = useRef<HTMLInputElement>(null)
    const socket = useSocket()
    const { user } = useUser()
    const { addReceived, addSent } = useMessageStore()
    const { chatWindowUserId } = useChatWindowUserIdStore()

    useEffect(() => {
        socket.connect()
        socket.on("private-message", (data) => {
            console.log("from server: ", data)

        })
        socket.on("receive-message", ({ message, from }) => {
            console.log("📨 New message:", message, "from:", from);
            addReceived(message)
        });
        return () => {
            socket.off("receive-message")
            socket.disconnect()
        }
    }, [])

    const sendMessage = (msg: string | undefined) => {
        if (!msg) return
        socket.emit("private-message", {
            to: chatWindowUserId,
            message: msg,
            from: user?.id
        })
        addSent(msg)
        msgInputRef.current!.value = ""
    }

    return (
        <div className="h-[60px] w-full flex justify-between items-center px-3 shrink-0 ">

            <div className="upload-file-media flex">
                <button className="opacity-60 hover:opacity-100">
                    <PaperclipIcon />
                </button>
            </div>

            <div className="w-full h-full flex items-center px-3">
                <input
                    ref={msgInputRef}
                    type="text"
                    className="w-full outline-none "
                    placeholder="Type a message..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if (!msgInputRef.current?.value.trim()) return
                            sendMessage(msgInputRef.current?.value)
                        }
                    }} />
            </div>

            <div className="right-side flex gap-5">
                <button className="opacity-60 hover:opacity-100">
                    <SmileIcon />
                </button>

                <button

                    className="opacity-60 hover:opacity-100"
                    onClick={() => {
                        if (!msgInputRef.current?.value.trim()) return
                        sendMessage(msgInputRef.current?.value)
                    }}
                >
                    <SHI />
                </button>
            </div>

        </div>
    )
}

export default ChatWindowBottomNavbar
