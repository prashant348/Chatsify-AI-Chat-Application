import ChatWindowNavbar from "./components/ChatWindowNavbar"
import ChatWindowBottomNavbar from "./components/ChatWindowBottomNavbar"
import ChatWindowChatsArea from "./components/ChatWindowChatsArea"
import { useEffect } from "react"
import { useChatWindowUsernameStore } from "../../zustand/store/ChatWindowUsername"
import "../../index.css"

const ChatWindowTemplate = () => {
  const chatWindowUsername = useChatWindowUsernameStore(state => state.chatWindowUsername)

  useEffect(() => {
    const setVh = () => {
      const vh = window.visualViewport ? window.visualViewport.height * 0.01 : window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.visualViewport?.addEventListener('resize', setVh);
    window.visualViewport?.addEventListener('scroll', setVh); // for Safari

    return () => {
      window.visualViewport?.removeEventListener('resize', setVh);
      window.visualViewport?.removeEventListener('scroll', setVh);
    };
  }, []);

  return (
    <div
      className="h-[calc(var(--vh)*100)] flex flex-col w-full bg-black"
      style={{
        animation: window.innerWidth <= 640 ? "slide-in-from-right 0.3s ease-in-out forwards" : ""
      }}
    >
      {/* Sticky top navbar */}
      <div className="sticky top-0 z-21 bg-[#0f0f0f]">
        <ChatWindowNavbar username={chatWindowUsername} />
      </div>
      {/* Chat area fills remaining space */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ChatWindowChatsArea />
      </div>
      {/* Sticky bottom navbar */}
      <div className="sticky bottom-0 z-20 bg-[#0f0f0f]">
        <ChatWindowBottomNavbar />
      </div>
    </div>
  )
}

export default ChatWindowTemplate
