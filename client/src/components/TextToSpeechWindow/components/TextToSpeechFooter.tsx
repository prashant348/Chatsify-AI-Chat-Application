import { ArrowUpIcon, Gauge } from "lucide-react"
import { useRef, useEffect } from "react"
import { useSocket } from "../../../hooks/useSocket"
import { Socket } from "socket.io-client"
import { useTextToSpeechMessageStore } from "../../../zustand/store/TextToSpeechMessageStore"

import maleGenderSymbol from "../../../assets/male_gender_symbol.svg"
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
        <div className='input-box py-[12px] bg-black gap-2 shrink-0  h-[70px] w-full flex justify-between items-center px-3'>
            <input
                ref={inputRef}
                type="text"
                placeholder='Enter text...'
                className='outline-none w-full h-full px-4 pr-20 focus:pr-20  bg-[#1f1f1f] rounded-full focus:border-[#404040] focus:border focus:px-[15px]'
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        if (!inputRef.current?.value.trim()) return
                        handleSend(inputRef.current!.value.trim())
                    }
                }}
            />

            <button className="fixed hover:bg-[#303030]  h-9 w-9 shrink-0 flex justify-center items-center rounded-full"
                style={{
                    right: 110
                }}
                onClick={() => alert("Feature 'Set Rate of Speech' coming soon!")}
            >
                <Gauge size={20} />
            </button>

            <button className="fixed hover:bg-[#303030]  h-9 w-9 shrink-0 flex justify-center items-center rounded-full"
                style={{
                    right: 72
                }}
                onClick={() => alert("Feature 'Change Voice' coming soon!")}
            >   
                <img src={maleGenderSymbol} alt="male_gender_symbol" className="h-6 w-6" />
                
            </button>

            <button
                className='cursor-pointer h-[46px] w-[46px] bg-blue-500  flex-shrink-0 flex justify-center items-center rounded-full sm:hover:opacity-100 sm:opacity-60 '
                onClick={() => {
                    if (!inputRef.current?.value.trim()) return
                    console.log("msg sent to text to speech...")
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
