
import { useRef, useEffect } from 'react'
// import { useAuth } from '@clerk/clerk-react'
// import { useUser } from '@clerk/clerk-react'
import { Send } from 'lucide-react'
import { useSocket } from '../../../hooks/useSocket'
import { Socket } from 'socket.io-client'
import { useChatbotMessageStore } from '../../../zustand/store/ChatbotMessageStore'

export default function ChatbotWindowBottomNavbar() {

    const inputRef = useRef<HTMLInputElement>(null)
    // const { getToken } = useAuth()
    // const { user } = useUser()
    const socket: Socket = useSocket()
    const {  addYourMsg, addBotMsg } = useChatbotMessageStore()



    useEffect(() => {
        socket.connect()

        socket.on("send-msg-chatbot", (msg) => {
            console.log(msg)
        })

        socket.on("receive-msg-chatbot", (response) => {
            console.log("from server: ", response)
            addBotMsg(response)
        })

        return () => {
            socket.off("receive-msg-chatbot")
            socket.off("send-msg-chatbot")
            socket.disconnect()
        }
    }, [])

    const handleSend = async (msg: string | undefined) => {

        if (!msg) return
        socket.emit("send-msg-chatbot", msg)
        addYourMsg(msg)
        inputRef.current!.value = ""
        // try {
        //     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${user?.id}/send-to-chatbot`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "authorization": `Bearer ${await getToken()}`
        //         },
        //         body: JSON.stringify({
        //             message: msg
        //         })
        //     })

        //     const data = await res.json()
        //     console.log(data)
        //     console.log(data.flaskData.reply)

        // } catch (err) {
        //     console.error("error in sending to chatbot: ", err)
        // }
    }



    return (
        <div className='input-box h-[60px] w-full bg-[#0f0f0f] flex justify-between items-center px-3'>
            <input
                ref={inputRef}
                type="text"
                placeholder='Ask anything'
                className='outline-none w-full h-full'
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSend(inputRef.current?.value.trim())
               
                    }
                }} 
            />
            
            <button
                className='cursor-pointer'
                onClick={() => {
                    console.log("msg sent to chatbot...")
                    console.log(inputRef.current?.value.trim())
                    handleSend(inputRef.current?.value.trim())
 
                }}
            >
                <Send />
            </button>
        </div>
    )
}
