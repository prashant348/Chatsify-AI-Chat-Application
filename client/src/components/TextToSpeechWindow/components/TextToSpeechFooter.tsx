import { SendHorizonal } from "lucide-react"
import { useRef, useEffect } from "react"
import { useSocket } from "../../../hooks/useSocket"
import { Socket } from "socket.io-client"
import { useTextToSpeechMessageStore } from "../../../zustand/store/TextToSpeechMessageStore"

export default function TextToSpeechFooter() {

    const inputRef = useRef<HTMLInputElement>(null)
    const socket: Socket = useSocket()
    const { addYourMsg, addBotMsg } = useTextToSpeechMessageStore()

    useEffect(() => {
        socket.connect()

        socket.on("receive-audio", async (audioUrl: string) => {
            console.log("from server: ", audioUrl)
            addBotMsg(audioUrl)
        })

        return () => {
            socket.disconnect()
        }
    })

    const handleSend = (text: string): void => {
        if (!text) return
        socket.emit("send-text", text)
        addYourMsg(text)
        inputRef.current!.value = ""
    }

    return (
        <div
            className="h-[70px] w-full bg-[#0f0f0f] flex px-3 items-center justify-between"
        >
            <input
                ref={inputRef}
                type="text"
                placeholder="Enter text..."
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
                    console.log("text sent to ai...")
                    console.log(inputRef.current?.value.trim())
                    handleSend(inputRef.current?.value.trim())
                }}
            >
                <SendHorizonal />
            </button>
        </div>
    )
}
