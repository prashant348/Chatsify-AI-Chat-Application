import { PaperclipIcon } from "lucide-react"
import { SmileIcon, SendHorizonalIcon as SHI } from "lucide-react"


const ChatWindowBottomNavbar = () => {
    return (
    <div className="h-[60px] w-full bg-[#0f0f0f] border-t border-t-[#212121] flex justify-between items-center px-3 shrink-0">

            <div className="upload-file-media flex">
                <button className="opacity-60 hover:opacity-100">
                    <PaperclipIcon />
                </button>
            </div>

            <div className="w-full h-full flex items-center px-3">
                <input type="text" className="w-full outline-none " placeholder="Type a message..." />
            </div>

            <div className="right-side flex gap-5">
                <button className="opacity-60 hover:opacity-100">
                    <SmileIcon />
                </button>

                <button className="opacity-60 hover:opacity-100">
                    <SHI />
                </button>
            </div>
        </div>
    )
}

export default ChatWindowBottomNavbar
