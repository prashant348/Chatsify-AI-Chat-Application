import ChatbotChatsArea from './components/ChatbotChatsArea'
import ChatbotWindowBottomNavbar from './components/ChatbotWindowBottomNavbar'
import ChatbotWindowNavbar from './components/ChatbotWindowNavbar'
import "../../index.css"

export default function ChatbotWindow() {
    // useEffect(() => {
    //     const setVh = () => {
    //         const vh = window.visualViewport ? window.visualViewport.height * 0.01 : window.innerHeight * 0.01;
    //         document.documentElement.style.setProperty('--vh', `${vh}px`);
    //     };

    //     setVh();
    //     window.visualViewport?.addEventListener('resize', setVh);
    //     window.visualViewport?.addEventListener('scroll', setVh); // for Safari

    //     return () => {
    //         window.visualViewport?.removeEventListener('resize', setVh);
    //         window.visualViewport?.removeEventListener('scroll', setVh);
    //     };
    // }, []);
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
            <div className='response-area bg-black flex-1 min-h-0 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#303030] scrollbar-track-transparent'>
                <ChatbotChatsArea />
            </div>
            <div className=" sticky bottom-0  z-20 bg-[#0f0f0f]">
                <ChatbotWindowBottomNavbar />
            </div>
        </div>
    )
}
