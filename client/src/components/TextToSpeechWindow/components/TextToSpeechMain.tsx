import { useTextToSpeechMessageStore } from "../../../zustand/store/TextToSpeechMessageStore"
import { useRef, useEffect, useState } from "react"
import { fetchTextToSpeechAIChatMessages } from "../../../APIs/services/fetchTextToSpeechAIChatMessages.service"
import { useUser } from "@clerk/clerk-react"
import { useAuth } from "@clerk/clerk-react"
import { useGlobalRefreshStore } from "../../../zustand/store/GlobalRefresh"
import GeneralLoader from "../../GeneralLoader"
import { useChatTextToSpeechErrorStore } from "../../../zustand/store/ErrorStore"

function AudioPlayer({ audioUrl }: { audioUrl: string }) {
    const audioRef = useRef(null)
    console.log("audiourl: ", audioUrl)
    // const audioFileName = audioUrl.split("/")[9]
    // console.log(audioFileName)
    return (
        <audio
            ref={audioRef}
            src={audioUrl}
            controls
            preload="auto"
            className="w-[100%]"
            autoPlay={false}
        />
    )
}

export default function TextToSpeechMain() {
    const { allTextToSpeechMessages, setAllTextToSpeechMessages } = useTextToSpeechMessageStore()

    const bottomRef = useRef<HTMLDivElement>(null)
    const [isClicked, setIsClicked] = useState<boolean>(false)
    const { user } = useUser()
    const { getToken } = useAuth()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { globalRefresh } = useGlobalRefreshStore()

    const [isRetryBtnClicked, setIsRetryBtnClicked] = useState<boolean>(false)

    const controllerRef = useRef<AbortController | null>(null)
    const reqIdRef = useRef<number>(0)

    const initializedRef = useRef(false)
    const prevLenRef = useRef<number>(0)

    const { error, setError } = useChatTextToSpeechErrorStore()

    const touchStartYRef = useRef<number>(0)
    const mainDivRef = useRef<HTMLDivElement>(null)
    const msgsContentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isLoading && error === "" && allTextToSpeechMessages.length > 0) {
            console.log("auto scrolling to bottom of the chat area...")
            bottomRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [allTextToSpeechMessages, isLoading, error])

    useEffect(() => {
        console.log("fetching data")
        const fetchData = async () => {
            if (!user?.id) {
                setIsLoading(false)
                console.log("no userid given")
                return
            }

            controllerRef.current?.abort()

            const controller = new AbortController()
            controllerRef.current = controller
            const currentReqId = ++reqIdRef.current

            setIsLoading(true)
            setError("")

            const result = await fetchTextToSpeechAIChatMessages(getToken, user?.id, controller.signal)

            if (currentReqId !== reqIdRef.current) return

            if (result instanceof Array) {
                setAllTextToSpeechMessages(result)
                setIsLoading(false)
                setError("")
            } else if (result === "AbortError") {
                setIsLoading(false)
            } else {
                setIsLoading(false)
                setError("Retry")
            }
        }
        fetchData()
    }, [globalRefresh, isRetryBtnClicked])

    useEffect(() => {
        if (!isLoading && !initializedRef.current) {
            initializedRef.current = true
            // jump to bottom instantly on first render
            bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" })
            // set baseline length
            prevLenRef.current = allTextToSpeechMessages.length
        }
    }, [isLoading, allTextToSpeechMessages.length])

    useEffect(() => {
        if (!initializedRef.current) return
        const currLen = allTextToSpeechMessages.length
        const prevLen = prevLenRef.current
        prevLenRef.current = currLen
        if (currLen > prevLen) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
        }
    }, [allTextToSpeechMessages])

    useEffect(() => {
        const handler = () => {
            // slight delay helps after viewport resize due to keyboard
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
            }, 250)
        }
        window.addEventListener("scroll-to-bottom-chat" as any, handler as EventListener)
        return () => {
            window.removeEventListener("scroll-to-bottom-chat" as any, handler as EventListener)
        }
    }, [])

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        touchStartYRef.current = e.touches[0]?.clientY ?? 0
    }

    const handleTouchMoveBoundaryLocked = (e: React.TouchEvent<HTMLDivElement>) => {
        if (error === "Retry" || isLoading) return
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

    useEffect(() => {
        console.log("main div height: ", mainDivRef.current?.offsetHeight)
        console.log("inner content: ", msgsContentRef.current?.offsetHeight)
    }, [msgsContentRef.current?.offsetHeight, mainDivRef.current?.offsetHeight])

    return (
        <div
            ref={mainDivRef}
            className="h-full flex pb-0 flex-col p-2 w-full overflow-y-auto scrollbar-thin scrollbar-track-[#0f0f0f] scrollbar-thumb-[#212121]"
            style={{
                justifyContent: isLoading || error ? "center" : "",
                alignItems: isLoading || error ? "center" : "",
                overscrollBehavior: "contain",
                touchAction: "pan-y"
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMoveBoundaryLocked}
        >

            <div
                ref={msgsContentRef}
                className="messages-content w-full flex flex-col gap-2"
            >
                {isLoading && <GeneralLoader />}
                {!isLoading
                    && allTextToSpeechMessages.length === 0
                    && error
                    &&
                    <div className="h-full w-full flex flex-col gap-1 justify-center items-center">
                        <span className="text-center">
                            Unable to fetch chats!
                        </span>
                        <button
                            className="bg-[#212121] hover:bg-[#303030] p-2 border border-[#404040] rounded-md cursor-pointer"
                            onClick={() => {
                                setIsLoading(true)
                                setIsRetryBtnClicked(!isRetryBtnClicked)
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {error}
                        </button>
                    </div>
                }
                {!isLoading && allTextToSpeechMessages.map((chat, idx) => (
                    <div key={idx} className='flex flex-col gap-2'>
                        <div className='flex justify-end'>
                            <span className='bg-[#1a73e8] border border-blue-400 p-2 rounded-lg max-w-[70%]'>{chat.you}</span>
                        </div>
                        <div className='flex justify-start '>
                            <span
                                className='bg-[#0f0f0f] p-2 flex flex-col  gap-2 rounded-lg border border-[#404040] max-w-[70%]'

                            >
                                <span
                                    className={` hover:cursor-pointer bg-[#404040] p-1 px-2 rounded-lg`}
                                    style={{
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: isClicked ? "normal" : "nowrap",
                                        display: chat.bot === "" ? "none" : ""
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setIsClicked(!isClicked)
                                    }}
                                >
                                    {`Audio: ${chat.bot.split("/")[9]}`}
                                </span>
                                <span>
                                    {chat.bot === ""
                                        ? <div className="flex gap-2">
                                            <div>
                                                <GeneralLoader sizeInPixels={20} />
                                            </div>
                                            <div>
                                                Converting...
                                            </div>
                                        </div>
                                        : <AudioPlayer audioUrl={chat.bot} />}
                                </span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div ref={bottomRef}></div>
        </div>
    )
}
