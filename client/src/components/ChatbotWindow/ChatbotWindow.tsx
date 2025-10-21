

import ChatbotChatsArea from './components/ChatbotChatsArea'
import ChatbotWindowBottomNavbar from './components/ChatbotWindowBottomNavbar'
import ChatbotWindowNavbar from './components/ChatbotWindowNavbar'
export default function ChatbotWindow() {


    return (
        <div className='h-full w-full flex flex-col'>
            <ChatbotWindowNavbar />

            <div className='response-area h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#303030] scrollbar-track-transparent'>
                <ChatbotChatsArea />
            </div>

            <ChatbotWindowBottomNavbar />
        </div>
    )
}
