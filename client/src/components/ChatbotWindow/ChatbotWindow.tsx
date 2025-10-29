import ChatbotChatsArea from './components/ChatbotChatsArea'
import ChatbotWindowBottomNavbar from './components/ChatbotWindowBottomNavbar'
import ChatbotWindowNavbar from './components/ChatbotWindowNavbar'
import "../../index.css"

export default function ChatbotWindow() {
    return (
        <div
            className=' h-full w-full flex flex-col'
            style={{
                animation: window.innerWidth <= 640 ? "slide-in-from-right 0.3s ease-in forwards" : ""
            }}
        >
            <ChatbotWindowNavbar />
            <div className='response-area bg-black h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#303030] scrollbar-track-transparent'>
                <ChatbotChatsArea />
            </div>
            <ChatbotWindowBottomNavbar />
        </div>
    )
}
