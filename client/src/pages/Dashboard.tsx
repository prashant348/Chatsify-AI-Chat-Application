import React, { useState, useRef, useEffect } from "react"
import { useSidebarStore } from "../zustand/store/SidebarStore"
import Sidebar from "../components/Sidebar"
import ChatWindowTemplate from "../components/ChatWindow/ChatWindowTemplate"
import { useActiveScreenStore } from "../zustand/store/ActiveScreenStore"
import FriendRequestsWindow from "../components/FriendRequestsWindow/FriendRequestsWindow"
import { useUser } from "@clerk/clerk-react"
import InboxWindow from "../components/InboxWindow/InboxWindow"



interface ResizableSidebarProps {
  defaultWidth?: number,
  children: React.ReactNode
}



const ResizableSidebar: React.FC<ResizableSidebarProps> = ({ defaultWidth = 0.4 * window.innerWidth, children }) => {
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

  useEffect(() => {
    console.log({
      clerkUserId: user?.id,
      username: user?.username,
      email: user?.emailAddresses[0].emailAddress,
      avatar: user?.imageUrl
    })
    const sendYourData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${user?.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            clerkUserId: user?.id,
            username: user?.username,
            email: user?.emailAddresses[0].emailAddress,
            avatar: user?.imageUrl
          }),
          signal
        })
        const data = await res.json()
        console.log(data)
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("request aborted")
          return
        }
        console.error("error in sending your data: ", err)
      }
    }
    sendYourData()

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

    //Jab aap mouse se resizer ko pakadte ho, us waqt mouse ka X position (horizontal position) store ho jaata hai.
    // Ye starting point hai resize ka.
    const startX: number = e.clientX;

    // .offsetWidth ek DOM property hai jo kisi HTML element ki visible width (pixels me) return karti hai, including padding, border (lekin margin nahi).
    const initialSidebarWidth: number = sidebarRef.current?.offsetWidth || defaultWidth;


    const doResize = (e: MouseEvent) => {

      // vese toh iski jarurat nahi lekin safety ke liye
      if (window.innerWidth <= 640) {
        setSidebarWidth(window.innerWidth)
        return;
      }

      const dx: number = e.clientX - startX;
      // const newWidth = Math.min(Math.max(initialSidebarWidth + dx, minWidth), maxWidth);
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


  return (
    <>
      <div
        className={showSidebar? "brightness-50 transition duration-300 ease-in" : ""}
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
        <div className="dashboard-container h-screen flex bg-black" style={{ pointerEvents: showSidebar ? "none" : "auto" }} >
          {/* sidebar */}
          <div
            ref={sidebarRef}
            className="sidebar"
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
              className="chat-window text-white flex justify-center items-center min-w-[384px]"
              style={{ flexGrow: 1 }}
            >
              {activeScreen === "ChatWindow" ? <ChatWindowTemplate /> : <p>Select a Chat to start messaging</p>}
              {}
            </div>
          )}
        </div>

      </div>

      {/* ye bhi ek tarika hai */}
      {/* Overlay to block all interaction when sidebar is open */}
      {/* {showSidebar && (
        <div
          className="fixed inset-0 z-40"
          style={{ pointerEvents: "auto" }}
          onClick={() => setShowSidebar(false)}
        />
      )} */}

      {showSidebar && <Sidebar />}
      {activeScreen === "FriendRequestsWindow" ? <FriendRequestsWindow /> : ""}
      {activeScreen === "InboxWindow" ? <InboxWindow /> : ""}
    </>
  )
}

export default ResizableSidebar
