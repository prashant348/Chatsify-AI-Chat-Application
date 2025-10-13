import { X } from "lucide-react"
import { useAuth } from "@clerk/clerk-react"
import { useInboxMsgRemoveStore } from "../../../zustand/store/InboxMsgRemove"
import { useUser } from "@clerk/clerk-react"
import GeneralLoader from "../../GeneralLoader"
import { useState } from "react"

interface InboxMsgBoxTemplatePropsType {
    receiverId?: string,
    receiverUsername: string,
    receiverAvatar: string,
    msg: string,
    receivedAt: string
}

export default function InboxMsgBoxTemplate(
    { receiverId, receiverUsername, receiverAvatar, msg, receivedAt }: InboxMsgBoxTemplatePropsType
) {

    const formattedDate = new Date(receivedAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    })

    const formattedTime = new Date(receivedAt).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    })

    const { getToken } = useAuth()
    const setInboxMsgRemove = useInboxMsgRemoveStore(state => state.setInboxMsgRemove)
    const inboxMsgRemove = useInboxMsgRemoveStore(state => state.inboxMsgRemove)
    const { user } = useUser()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleRemoveBtnClick = async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${user?.id}/inbox`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${await getToken()}`
                },
                body: JSON.stringify({
                    userId: receiverId,
                    receivedAt: receivedAt
                })
            })

            const data = await res.json()
            console.log(data)
            console.log("inbox msg deleted!")
        } catch (err) {
            console.error("error in removing msg: ", err)
        } finally {
            setIsLoading(false)
            setInboxMsgRemove(!inboxMsgRemove)
        }
    }

    return (
        <div className="group w-full flex items-center justify-between hover:bg-[#1f1f1f] transition-all duration-200 p-3 mb-2 shadow-sm">

            {/* Left Section - Avatar + Info */}
            <div className="flex items-center gap-3 overflow-hidden">

                {/* Avatar */}
                <div className="h-[56px] w-[56px] rounded-full overflow-hidden flex-shrink-0">
                    <img src={receiverAvatar} alt="receiver_avatar" className="h-full w-full object-cover" />
                </div>

                {/* Username, Msg, Time */}
                <div className="flex flex-col justify-center">
                    <p className="text-[17px] font-semibold text-white">{receiverUsername}</p>
                    <p 
                    className="text-[14px] font-medium"
                    style={{
                        color: msg.startsWith("A")? "#22c55e" : "#ef4444"
                    }}
                    >
                        {msg}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 tracking-wide">
                        {formattedDate} • {formattedTime.toUpperCase()}
                    </p>
                </div>
            </div>

            {/* Right Section - Delete Button */}
            <button
                className="opacity-60 hover:opacity-100 cursor-pointer transition-all duration-200 hover:bg-[#2b2b2b] rounded-full p-2"
                title="Delete message"
                onClick={handleRemoveBtnClick}
            >
                {isLoading && <GeneralLoader />}
                {!isLoading && <X size={18} className="text-gray-400 hover:text-red-400" /> }
    
            </button>

        </div>
    )
}

