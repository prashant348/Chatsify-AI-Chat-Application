import { PaperclipIcon } from "lucide-react"
import { SmileIcon, SendHorizonalIcon as SHI } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { useSocket } from "../../../hooks/useSocket"
import { useChatWindowUsernameStore } from "../../../zustand/store/ChatWindowUsername"
import { useMessageStore } from "../../../zustand/store/MessageStore"

const ChatWindowBottomNavbar = () => {

    const msgInputRef = useRef<HTMLInputElement>(null)
    const { chatWindowUsername } = useChatWindowUsernameStore()
    const socket = useSocket()
    const [receiverUserId, setReceiverUserId] = useState<string>("")
    const { user } = useUser()
    const { addReceived, addSent } = useMessageStore()
    useEffect(() => {
        const fetchReceiverId = async (receiverUsername: string) => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${receiverUsername}`, {
                    method: "GET",
                    headers: {
                        contentType: "application/json"
                    }
                })

                const data = await res.json()
                console.log(data)
                setReceiverUserId(data.userId)

            } catch (err) {
                console.error("err in fetching user clerk id based on username", err)
            }
        }

        fetchReceiverId(chatWindowUsername)
    }, [])

    useEffect(() => {
        socket.connect()

        socket.on("private-message", (data) => {
            console.log("from server: ", data)

        })

        socket.on("receive-message", ({ message, from }) => {
            console.log("📨 New message:", message, "from:", from);
            // yahan pe message ko state me daal ke UI render karwao
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
            to: receiverUserId,
            message: msg,
            from: user?.id
        })

        // setSentMessage()
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
                    onClick={() => sendMessage(msgInputRef.current?.value)}
                >
                    <SHI />
                </button>
            </div>

        </div>
    )
}

export default ChatWindowBottomNavbar
