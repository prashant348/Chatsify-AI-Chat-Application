import React, { useState, useRef, useEffect } from "react"
import { useSidebarStore } from "../zustand/store/SidebarStore"
import Sidebar from "../components/Sidebar"
import ChatWindowTemplate from "../components/ChatWindow/ChatWindowTemplate"
import { useActiveScreenStore } from "../zustand/store/ActiveScreenStore"
import FriendRequestsWindow from "../components/FriendRequestsWindow/FriendRequestsWindow"
import { useUser } from "@clerk/clerk-react"
import InboxWindow from "../components/InboxWindow/InboxWindow"
import ChatbotWindow from "../components/ChatbotWindow/ChatbotWindow"
import type { DashboardProps } from "../types/Dashboard.types"
import { useSocket } from "../hooks/useSocket"
import { createUser } from "../APIs/services/createUser.service"
import TextToSpeechWindow from "../components/TextToSpeechWindow"
import "../index.css"
import { useFriendStatusStoreBase } from "../zustand/store/FriendStatusStore"


const ResizableSidebar: React.FC<DashboardProps> = ({ defaultWidth = 0.4 * window.innerWidth, children }) => {
  // Responsive width state
  const [sidebarWidth, setSidebarWidth] = useState<number>(0.4 * window.innerWidth)
  const sidebarRef = useRef<HTMLDivElement>(null);
  const minWidth: number = 251;
  const maxWidth: number = window.innerWidth - 384 // 384 is the width of the main content which is 24% of 1600
  const resizerRef = useRef<HTMLDivElement>(null)

  const setShowSidebar = useSidebarStore(state => state.setShowSidebar)
  const showSidebar = useSidebarStore(state => state.showSidebar)

  const { activeScreen } = useActiveScreenStore()
  const { user } = useUser()

  const controller = new AbortController()
  const { signal } = controller

  const socket = useSocket()
  const { setStatusForUser } = useFriendStatusStoreBase()


  useEffect(() => {
    const createData = async () => {
      const result = await createUser(
        user?.id,
        user?.username,
        user?.emailAddresses[0].emailAddress,
        user?.imageUrl,
        signal
      )

      if (result === "Success") {
        console.log("user created successfully")
      } else if (result === "Error") {
        console.log("error in creating user(you): ")
      }
    }
    createData()
    return () => {
      controller.abort()
    }
  }, [])

  // Update widths on window resize
  useEffect(() => {

    const handleResize = () => {

      // vese toh iski jarurat nahi lekin safety ke liye
      if (window.innerWidth <= 640) {
        setSidebarWidth(window.innerWidth); // full width
      } else {
        setSidebarWidth(0.4 * window.innerWidth);
      }

    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [])

  // update bg color of resizer when resize and resize stop!
  useEffect(() => {

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      resizerRef.current?.classList.add("bg-blue-500")
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      resizerRef.current?.classList.remove("bg-blue-500")
    }

    // if mousedown on and from resizer, call handleMouseDown
    resizerRef.current?.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)


    return () => {
      resizerRef.current?.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)

    }

  }, [])

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();

    //Jab aap mouse se resizer ko pakadte ho, us samay mouse ka X position (horizontal position) store ho jaata hai.
    // Ye starting point hai resize ka.
    const startX = e.clientX;

    // .offsetWidth ek DOM property hai jo kisi HTML element ki visible width (pixels me) return karti hai, including padding, border (lekin margin nahi).
    const initialSidebarWidth = sidebarRef.current?.offsetWidth || defaultWidth;


    const doResize = (e: MouseEvent) => {

      // vese toh iski jarurat nahi lekin safety ke liye
      if (window.innerWidth <= 640) {
        setSidebarWidth(window.innerWidth)
        return;
      }

      const dx: number = e.clientX - startX;
      const newWidth: number = initialSidebarWidth + dx
      setSidebarWidth(newWidth);
    }


    const stopResizing = () => {
      document.removeEventListener('mousemove', doResize);
      document.removeEventListener('mouseup', stopResizing);
    };

    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResizing);
  }


  useEffect(() => {
    socket.connect()

    // join a room named by this user's clerk id so server can target this socket via io.to(userId)
    if (user?.id) {
      socket.emit("join-room", { userId: user.id })
      // then announce presence
      socket.emit("send-status", {
        from: user.id,
        status: "online"
      })
    }
    socket.on("receive-status", ({ from, status }) => {
      console.log("from server: ", { from, status })
      setStatusForUser(from, status)
    })

    const handleUnload = () => {
      console.log("tab closed!")
      if (user?.id) {
        socket.emit("send-status", {
          from: user.id,
          status: ""
        })
      }
    }

    window.addEventListener("beforeunload", handleUnload)
    return () => {
      socket.disconnect()
      window.removeEventListener("beforeunload", handleUnload)
    }
  }, [])




  // update slide distance dynamically
  useEffect(() => {
    // initial set
    document.documentElement.style.setProperty(
      "--slide-distance",
      `${window.innerWidth}px`
    );

    // update on resize
    const handleResize = () => {
      document.documentElement.style.setProperty(
        "--slide-distance",
        `${window.innerWidth}px`
      );
    };

    window.addEventListener("resize", handleResize);

    // cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  return (
    <>
      <div
        className={showSidebar ? "brightness-50  transition duration-300 ease-in" : ""}
        onClick={() => {
          if (showSidebar) {
            setShowSidebar(false)
          }
        }}
        style={{
          pointerEvents: "auto",
        }}
        onMouseDown={(e) => {
          if (showSidebar) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
      >
        <div
          className="dashboard-container h-screen flex bg-black"
          style={{
            pointerEvents: showSidebar ? "none" : "auto"
          }}
        >
          {/* sidebar */}
          <div
            ref={sidebarRef}
            className="sidebar flex-shrink-0"
            style={{
              width: window.innerWidth <= 640 ? "100%" : sidebarWidth,
              minWidth: window.innerWidth <= 640 ? "100%" : minWidth,
              maxWidth: window.innerWidth <= 640 ? "100%" : maxWidth,
              backgroundColor: "#0f0f0f",
              position: "relative",
              overflow: "auto"
            }}

          >
            {children}
          </div>

          {/* resizer */}
          {window.innerWidth > 640 && (
            <div
              ref={resizerRef}
              className="resizer hover:bg-blue-500 bg-[#0f0f0f] "
              onMouseDown={startResizing}
              style={{
                width: 5,
                cursor: "e-resize",
                flexShrink: 0
                
              }}
            />
          )}

          {/* rightside chat window  */}
          {window.innerWidth > 640 && (
            <div
              className="chat-window text-white flex justify-center items-center "
              style={{ flexGrow: 1 }}
            >
              {activeScreen === "ChatWindow" ? <ChatWindowTemplate /> : ""}
              {activeScreen === "MainScreen" ? <p>Select a chat to start messaging</p> : ""}
              {activeScreen === "ChatbotWindow" ? <ChatbotWindow /> : ""}
              {activeScreen === "TextToSpeechWindow" ? <TextToSpeechWindow /> : ""}
            </div>
          )}

        </div>

      </div>

      {/* another method: */}
      {/* Overlay to block all interaction when sidebar is open */}
      {/* {showSidebar && (
        <div
          className="fixed inset-0 z-40"
          style={{ pointerEvents: "auto" }}
          onClick={() => setShowSidebar(false)}
        />
      )} */}

      {/* for mobile */}
      {window.innerWidth <= 640 && activeScreen === "ChatWindow" && (
        <div className=" fixed top-0 left-0 z-40 h-full w-full text-white">
          <ChatWindowTemplate />
        </div>
      )}
      {window.innerWidth <= 640 && activeScreen === "ChatbotWindow" && (
        <div className=" fixed top-0 left-0 z-40 h-full w-full text-white">
          <ChatbotWindow />
        </div>
      )}
      {window.innerWidth <= 640 && activeScreen === "TextToSpeechWindow" && (
        <div className=" fixed top-0 left-0 z-40 h-full w-full text-white">
          <TextToSpeechWindow />
        </div>
      )}
      {showSidebar && <Sidebar />}
      {/* for desktop and mobile both */}
      {activeScreen === "FriendRequestsWindow" ? <FriendRequestsWindow /> : ""}
      {activeScreen === "InboxWindow" ? <InboxWindow /> : ""}

    </>
  )
}

export default ResizableSidebar
