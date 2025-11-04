import { ArrowLeft, BotMessageSquare } from 'lucide-react'
import { useActiveScreenStore } from '../../../zustand/store/ActiveScreenStore'
import { MoreVertical, Brush, Trash, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { useGlobalRefreshStore } from '../../../zustand/store/GlobalRefresh'
import { useUser } from '@clerk/clerk-react'
import { handleDeleteChatbotChat } from '../../../APIs/handlers/handleDeleteChatbotChat.handler'

const MoreButtonModal = ({ onClose }: { onClose: () => void }) => {

    const { setGlobalRefresh, globalRefresh } = useGlobalRefreshStore()
    const { user } = useUser()

    return (
        <div
            className="fixed z-40 top-0 left-0 w-full h-full bg-black/50 cursor-auto"
            style={{
                animation: "fade-in 0.3s ease-in-out forwards"
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
                onClose()
            }}
        >
            <div className=" p-2 fixed right-3 top-[50px] rounded-lg border border-[#303030] bg-[#0f0f0f] hover:cursor-auto"
                style={{
                    animation: "fade-in-slide-down 0.3s ease-in-out forwards"
                }}
            >
                <div className="flex flex-col">
                    <button
                        className="cursor-pointer flex gap-2 w-full items-center p-1 rounded-md hover:bg-[#303030]"
                        onClick={() => {
                            setGlobalRefresh(!globalRefresh)
                        }}
                        onMouseDown={(e) => e.preventDefault()}

                    >
                        <span>
                            <RefreshCcw size={18} />
                        </span>
                        <span>Refresh</span>
                    </button>
                    <button
                        className="cursor-pointer flex gap-2 w-full items-center p-1 rounded-md hover:bg-[#303030]"
                        onClick={() => alert("Feature coming soon!")}
                    >
                        <span>
                            <Brush size={18} />
                        </span>
                        <span>Set Wallpaper</span>
                    </button>
                </div>
                <div className="h-[1px] bg-[#303030] w-full my-1" />
                <div className="w-full">
                    <button
                        className="cursor-pointer flex gap-2 w-full items-center p-1 rounded-md hover:bg-[#303030]"
                        onClick={async () => {
                            const result = await handleDeleteChatbotChat(user?.id as string)
                            if (result === "Success") {
                                setGlobalRefresh(!globalRefresh)
                            } else if (result === "Error") {
                                return;
                            }
                        }}
                        onMouseDown={(e) => e.preventDefault()}

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

export default function ChatbotWindowNavbar() {

    const { setActiveScreen } = useActiveScreenStore()
    const [showModal, setShowModal] = useState<boolean>(false)

    return (
        <div className='navbar h-[60px] w-full bg-[#0f0f0f] border-b border-b-[#212121] sm:border-none px-3 flex justify-between items-center'>
            <div className='flex gap-3'>
                <button
                    className='cursor-pointer flex sm:hidden'
                    onClick={() => {
                        setActiveScreen("MainScreen")
                    }}>
                    <ArrowLeft />
                </button>
                <BotMessageSquare />
                <span className='font-bold'>Chatsify AI</span>
            </div>

            <div className=' z-45 h-8 w-8'>
                <button
                    className='cursor-pointer h-full w-full flex justify-center items-center p-1 rounded-full opacity-60 hover:opacity-100'
                    onClick={() => setShowModal(!showModal)}
                    style={{
                        backgroundColor: showModal ? "#303030" : "",
                        opacity: showModal ? 1 : ""
                    }}
                    onMouseDown={(e) => e.preventDefault()}

                >
                    <MoreVertical size={20} />
                </button>
            </div>

            {showModal && <MoreButtonModal onClose={() => setShowModal(false)} />}
        </div>
    )
}
