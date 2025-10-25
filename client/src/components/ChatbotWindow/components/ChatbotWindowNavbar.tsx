import { ShipWheel, ArrowLeft } from 'lucide-react'
import { useActiveScreenStore } from '../../../zustand/store/ActiveScreenStore'
import { MoreVertical, Mic, Brush, Trash } from 'lucide-react'
import { useState } from 'react'
import { useGlobalRefreshStore } from '../../../zustand/store/GlobalRefresh'
import { useUser } from '@clerk/clerk-react'

const MoreButtonModal = () => {

    const { setGlobalRefresh, globalRefresh } = useGlobalRefreshStore()
    const { user } = useUser()

    const deleteChats = async () => {
        try {

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${user?.id}/delete-chatbot-chats`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    yourId: user?.id,
                })
            })

            const data = await res.json()
            console.log(data)
            console.log("you and your chatbot chats deleted!")
            setGlobalRefresh(!globalRefresh)
        } catch (err) {
            console.error("err in deleting chats: ", err)
        }
    }


    return (
        <div
            className="fixed z-40 top-0 left-0 w-full h-full bg-transparent cursor-not-allowed"
            style={{
                animation: "fade-in 0.2s ease-in-out forwards"
            }}
        >
            <div className=" p-2 fixed right-3 top-[60px] rounded-lg border border-[#303030] bg-[#0f0f0f] hover:cursor-auto">
                <div className="flex flex-col">
                    <button className="cursor-pointer flex gap-1 w-full items-center p-1 rounded-md hover:bg-[#303030]">
                        <span>
                            <Mic size={18} />
                        </span>
                        <span>Mute</span>
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
                        onClick={deleteChats}
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
        <div className='navbar h-[70px] w-full bg-[#0f0f0f] px-3 flex justify-between items-center'>
            <div className='flex gap-3'>
                <button
                    className='cursor-pointer flex sm:hidden'
                    onClick={() => {
                        setActiveScreen("MainScreen")
                    }}>
                    <ArrowLeft />
                </button>
                <ShipWheel />
                <span className='font-bold'>Chatsify AI</span>
            </div>

            <div className='flex z-45 items-center justify-center'>
                <button
                    className='cursor-pointer p-1 rounded-full opacity-60 hover:opacity-100'
                    onClick={() => setShowModal(!showModal)}
                    style={{
                        backgroundColor: showModal? "#303030": ""
                    }}
                >
                    <MoreVertical />
                </button>
            </div>

            {showModal && <MoreButtonModal />}
        </div>
    )
}
