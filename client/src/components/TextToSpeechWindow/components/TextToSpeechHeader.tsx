import { ArrowLeft, AudioLines, MoreVertical, Brush, Trash, RefreshCcw } from "lucide-react"
import { useActiveScreenStore } from "../../../zustand/store/ActiveScreenStore"
import { useGlobalRefreshStore } from "../../../zustand/store/GlobalRefresh"
import { useUser } from "@clerk/clerk-react"
import { useState } from "react"
import { handleDeleteTextToSpeechAIChat } from "../../../APIs/handlers/handleDeleteTextToSpeechAIChat.handle"
import { handleDeleteSupabaseAudios } from "../../../APIs/handlers/handleDeleteSupabaseAudios.handler"

const MoreButtonModal = () => {
    const { setGlobalRefresh, globalRefresh } = useGlobalRefreshStore()
    const { user } = useUser()

    return (
        <div
            className="fixed z-40 top-0 left-0 w-full h-full bg-transparent cursor-not-allowed"
            style={{
                animation: "fade-in 0.2s ease-in-out forwards"
            }}
        >
            <div className=" p-2 fixed right-3 top-[60px] rounded-lg border border-[#303030] bg-[#0f0f0f] hover:cursor-auto">
                <div className="flex flex-col">
                    <button
                        className="cursor-pointer flex gap-1 w-full items-center p-1 rounded-md hover:bg-[#303030]"
                        onClick={() => {
                            console.log("refreh clicked!")
                            setGlobalRefresh(!globalRefresh)
                        }}
                    >
                        <span>
                            <RefreshCcw size={18} />
                        </span>
                        <span>Refresh</span>
                    </button>
                    <button className="cursor-pointer flex gap-1 w-full items-center p-1 rounded-md hover:bg-[#303030]">
                        <span>
                            <Brush size={18} />
                        </span>
                        <span>Set Wallpaper</span>
                    </button>
                </div>
                <div className="h-[1px] bg-[#303030] w-full my-1" />
                <div className="w-full">
                    <button
                        className="cursor-pointer flex gap-1 w-full items-center p-1 rounded-md hover:bg-[#303030]"
                        onClick={async () => {
                            const result = await handleDeleteTextToSpeechAIChat(user?.id as string)
                            if (result === "Success") {
                                setGlobalRefresh(!globalRefresh)
                                console.log("Success in mongodb...")
                                const supabaseResult = await handleDeleteSupabaseAudios(user?.id)
                                if (supabaseResult === "Success") console.log("supabase audios deleted!")
                                else if (supabaseResult === "Error") console.log("supabase audios deletion failed!")
                            } else if (result === "Error") {
                                return;
                            }
                        }}
                    >
                        <span>
                            <Trash size={18} className="text-red-500" />
                        </span>
                        <span className="text-red-500">Delete Chats</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function TextToSpeechHeader() {

    const [showModal, setShowModal] = useState<boolean>(false)
    const { setActiveScreen } = useActiveScreenStore()

    return (
        <div className='navbar h-[70px] w-full bg-[#0f0f0f] px-3 flex justify-between items-center'>
            <div className='flex gap-3'>
                <button
                    className='cursor-pointer flex sm:hidden'
                    onClick={() => {
                        setActiveScreen("MainScreen")
                    }}
                >
                    <ArrowLeft />
                </button>
                <AudioLines />
                <span className='font-bold'>Text-To-Speech</span>
            </div>

            <div className='flex z-45 items-center justify-center'>
                <button
                    className='cursor-pointer p-1 rounded-full opacity-60 hover:opacity-100'
                    onClick={() => setShowModal(!showModal)}
                    style={{
                        backgroundColor: showModal ? "#303030" : ""
                    }}
                >
                    <MoreVertical />
                </button>
            </div>
            {showModal && <MoreButtonModal />}
        </div>
    )
}
