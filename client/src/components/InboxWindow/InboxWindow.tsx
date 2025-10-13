import InboxMsgBoxTemplate from "./components/InboxMsgBoxTemplate"
import { ArrowLeft } from "lucide-react"
import { useActiveScreenStore } from "../../zustand/store/ActiveScreenStore"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { useAuth } from "@clerk/clerk-react"
import GeneralLoader from "../GeneralLoader"
import { useInboxMsgRemoveStore } from "../../zustand/store/InboxMsgRemove"
import { RefreshCcw } from "lucide-react"

interface inboxMsgType {
    userId: string
    username: string
    userAvatar: string
    msg: string
    receivedAt: string
}

const InboxWindow = () => {

    const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen)
    const { user } = useUser()
    const { getToken } = useAuth()
    const [ inboxMessages, setInboxMessages ] = useState<inboxMsgType[]>([])
    const [ isLoading, setIsLoading ] = useState<boolean>(true)
    const inboxMsgRemove = useInboxMsgRemoveStore((state) => state.inboxMsgRemove)
    const [ refresh, setRefresh ] = useState<boolean>(false)

    useEffect(() => {
        const fetchInboxMessages = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${user?.id}/inbox`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${await getToken()}`
                    }
                })

                const data = await res.json()
                console.log(data)
                const inboxMessages = data.inbox
                // console.log(inboxMessages)
                // will render reverse array for showing latest data first
                setInboxMessages([...inboxMessages].reverse())
                console.log("inbox fetched!")
            } catch (err) {
                console.error("error in fetching inbox messages: ", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchInboxMessages()
    }, [inboxMsgRemove, refresh])

    return (
        <div
            className='fixed top-0 left-0 z-100 h-screen w-full flex justify-center items-center bg-black/50 text-white'
            onClick={() => setActiveScreen("MainScreen")}
        >
            <div
                className='h-full w-full sm:h-[500px] sm:w-[600px] bg-[#0f0f0f] flex flex-col border border-[#363636] sm:rounded-2xl overflow-y-auto'
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-[60px] w-full flex items-center gap-4 sm:gap-0 px-4 border-b border-b-[#363636] text-xl">
                    <div className="sm:hidden flex justify-center items-center">
                        <button
                            className="opacity-50 hover:opacity-100 cursor-pointer"
                            onClick={() => setActiveScreen("MainScreen")}
                        >
                            <ArrowLeft />
                        </button>
                    </div>
                    <div className="flex h-full w-full items-center justify-between">
                        <div>Inbox</div> 
                        <div className=" flex justify-center items-center">
                            <button 
                            className="h-[36px] w-[36px] rounded-full cursor-pointer flex justify-center items-center hover:bg-[#2b2b2b] hover:rotate-[-180deg] transition-all duration-300"
                            onClick={() => {
                                setRefresh(!refresh)
                                setIsLoading(true)
                            }}
                            >
                                <RefreshCcw size={18} className="text-blue-400" />
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#303030] scrollbar-track-transparent"
                >
                    {inboxMessages.length !== 0 && !isLoading && inboxMessages.map((msg) => (
                        <InboxMsgBoxTemplate
                            key={msg.receivedAt}
                            receiverId={msg.userId}
                            receiverUsername={msg.username}
                            receiverAvatar={msg.userAvatar}
                            msg={msg.msg}
                            receivedAt={msg.receivedAt}
                        />
                    ))}
                    {inboxMessages.length === 0 && !isLoading && <div className="h-full w-full flex justify-center items-center">No messages</div>}
                    {isLoading && <div className="h-full w-full flex justify-center items-center"><GeneralLoader /></div>}
                </div>
            </div>
        </div>
    )
}

export default InboxWindow
