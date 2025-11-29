import InboxMsgBoxTemplate from "./components/InboxMsgBoxTemplate"
import { ArrowLeft } from "lucide-react"
import { useActiveScreenStore } from "../../zustand/store/ActiveScreenStore"
import { useEffect, useRef, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { useAuth } from "@clerk/clerk-react"
import GeneralLoader from "../GeneralLoader"
import { useInboxMsgRemoveStore } from "../../zustand/store/InboxMsgRemove"
import { RefreshCcw } from "lucide-react"
import { fetchInboxMessages } from "../../APIs/services/fetchInboxMessages"
import "../../index.css"

interface InboxMsgType {
    userId: string
    username: string
    userAvatar: string
    msg: string
    receivedAt: string
}

const InboxWindow = () => {

    const [inboxMessages, setInboxMessages] = useState<InboxMsgType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [ error, setError ] = useState<string>("");
    const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen)
    const { user } = useUser()
    const { getToken } = useAuth()
    const inboxMsgRemove = useInboxMsgRemoveStore((state) => state.inboxMsgRemove)
    const navbarRef = useRef<HTMLDivElement>(null)
    const mainDivRef = useRef<HTMLDivElement>(null)
    const msgsContentRef = useRef<HTMLDivElement>(null)
    const touchStartYRef = useRef<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            const result = await fetchInboxMessages(getToken, user?.id)
            if (result === "Error" || result === undefined) {
                setIsLoading(false)
                setError("Something went wrong!")
            } else  {
                setIsLoading(false)
                setError("")
                setInboxMessages(result)
            } 
        }
        fetchData()
    }, [inboxMsgRemove, refresh])

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        touchStartYRef.current = e.touches[0]?.clientY ?? 0
    }

    const handleTouchMoveBoundaryLocked = (e: React.TouchEvent<HTMLDivElement>) => {
        // if (isLoading) return
        const mainBox = mainDivRef.current
        const contentBox = msgsContentRef.current
        if (!mainBox || !contentBox) return
        if (contentBox.offsetHeight < mainBox.offsetHeight) {
            return
        }

        const currentY = e.touches[0]?.clientY ?? 0
        const deltaY = currentY - touchStartYRef.current // >0 finger down (scroll up), <0 finger up (scroll down)

        const atTop = mainBox.scrollTop <= 0
        const atBottom = mainBox.scrollHeight - mainBox.scrollTop <= mainBox.clientHeight + 1

        // block scroll chaining/rubber-band at edges
        if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
            // e.preventDefault()
            e.stopPropagation()
            return
        }

        // otherwise keep scroll confined to chat area
        e.stopPropagation()
    }

    // useEffect(() => {
    //     console.log("main div height: ", mainDivRef.current?.offsetHeight)
    //     console.log("inner content: ", msgsContentRef.current?.offsetHeight)
    // }, [msgsContentRef.current?.offsetHeight, mainDivRef.current?.offsetHeight])


    return (
        <div
            className='fixed top-0 left-0 z-100 h-[calc(var(--vh)*100))] w-full flex justify-center items-center bg-black/50 text-white'
            onClick={() => setActiveScreen("MainScreen")}
            style={{
                animation: window.innerWidth <= 640 ? "slide-in-from-right 0.3s ease-in forwards" : "fade-in-slide-down 0.3s ease-in forwards"
            }}
        >
            <div
                className='h-full w-full sm:h-[500px] sm:w-[600px] bg-[#0f0f0f] flex flex-col sm:border sm:border-[#363636] sm:rounded-2xl'
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    ref={navbarRef}
                    className="h-[60px] flex-shrink-0 w-full flex items-center gap-4 sm:gap-0 px-4 text-xl"
                    style={{
                        borderBottom: window.innerWidth > 640 ? "1px solid #363636" : ""
                    }}
                >

                    <div className="sm:hidden flex justify-center items-center">
                        <button
                            className="opacity-60 hover:opacity-100 cursor-pointer"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setActiveScreen("MainScreen")}
                        >
                            <ArrowLeft />
                        </button>
                    </div>
                    <div className="flex h-full w-full items-center justify-between">
                        <div>Inbox</div>
                        <div className=" flex justify-center items-center">
                            <button
                                className={`h-[36px] w-[36px] rounded-full cursor-pointer flex justify-center items-center hover:bg-[#2b2b2b] ${isLoading ? "animate-spin" : ""}`}
                                onClick={() => {
                                    setIsLoading(true)
                                    setRefresh(!refresh)
                                }}
                                onMouseDown={(e) => e.preventDefault()}

                            >
                                <RefreshCcw size={18} className="text-blue-400" />
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className="border-line h-[1px] w-full bg-[#363636]"
                    style={{
                        display: window.innerWidth > 640 ? "none" : ""
                    }}
                />
                <div
                    ref={mainDivRef}
                    className="relative h-full w-full flex flex-col overflow-y-auto overscroll-contain touch-pan-y scrollbar-thin scrollbar-thumb-[#303030] scrollbar-track-transparent"
                    style={{
                        justifyContent: (inboxMessages.length === 0 || isLoading) ? "center" : "flex-start",
                        // overscrollBehavior: "contain",
                        // touchAction: "pan-y"
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMoveBoundaryLocked}
                >
                    <div className="pointer-events-auto touch-none absolute -top-3 left-0 right-0 h-6" />
                    <div
                        ref={msgsContentRef}
                        className=""
                    >
                        {isLoading && <div className="h-full w-full flex justify-center items-center"><GeneralLoader /></div>}
                        {inboxMessages.length === 0 && !isLoading && <div className="h-full w-full flex justify-center items-center">No messages</div>}
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InboxWindow
