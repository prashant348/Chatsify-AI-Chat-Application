import ChatbotChatsArea from './components/ChatbotChatsArea'
import ChatbotWindowBottomNavbar from './components/ChatbotWindowBottomNavbar'
import ChatbotWindowNavbar from './components/ChatbotWindowNavbar'
import "../../index.css"

export default function ChatbotWindow() {

    return (
        <div
            className='h-[calc(var(--vh)*100)] w-full flex flex-col'
            style={{
                animation: window.innerWidth <= 640 ? "slide-in-from-right 0.3s ease-in forwards" : ""
            }}
            
        >
            <div className="sticky top-0 z-21 bg-[#0f0f0f]">
                <ChatbotWindowNavbar />
            </div>
            <div 
            className='response-area bg-black flex-1 min-h-0 w-full'
            >
                <ChatbotChatsArea />
            </div>
            <div className=" sticky bottom-0  z-20 bg-[#0f0f0f]">
                <ChatbotWindowBottomNavbar />
            </div>
        </div>
    )
}
