import { useTextToSpeechMessageStore } from "../../../zustand/store/TextToSpeechMessageStore"
import { useRef, useEffect, useState } from "react"
import { fetchTextToSpeechAIChatMessages } from "../../../APIs/services/fetchTextToSpeechAIChatMessages.service"
import { useUser } from "@clerk/clerk-react"
import { useAuth } from "@clerk/clerk-react"
import { useGlobalRefreshStore } from "../../../zustand/store/GlobalRefresh"
import GeneralLoader from "../../GeneralLoader"


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
    const [ error, setError ] = useState<string>("")
    const [ isRetryBtnClicked, setIsRetryBtnClicked ] = useState<boolean>(false)

    const controllerRef = useRef<AbortController | null>(null)
    const reqIdRef = useRef<number>(0)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [allTextToSpeechMessages])

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

    return (
        <div
            className="h-full w-full"
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
                        }}>
                        {error}
                    </button>
                </div>
            }
            {!isLoading && allTextToSpeechMessages.map((chat, idx) => (
                <div key={idx} className='flex flex-col p-2 gap-2'>
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
            <div ref={bottomRef}></div>
        </div>
    )
}
