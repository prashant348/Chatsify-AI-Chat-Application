
import RequestBoxTemplate from "./components/RequestBoxTemplate"
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useActiveScreenStore } from "../../zustand/store/ActiveScreenStore"
import GeneralLoader from "../GeneralLoader"
import { ArrowLeft, RefreshCcw } from "lucide-react"
import { useRequestPendingStore } from "../../zustand/store/RequestsPending"
import { fetchReceivedFriendRequests } from "../../APIs/services/fetchReceivedFriendRequests.service"
import "../../index.css"

interface FriendRequetsType {
  senderId: string,
  senderUsername: string,
  senderAvatar: string,
  receivedAt: string
}

export default function FriendRequestsWindow() {

  const { getToken } = useAuth()
  const [friendRequests, setFriendRequests] = useState<FriendRequetsType[]>([])
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [refresh, setRefresh] = useState<boolean>(false)
  const isReqPending = useRequestPendingStore(state => state.isReqPending)

  const navbarRef = useRef<HTMLDivElement>(null)
  const mainDivRef = useRef<HTMLDivElement>(null)
  const msgsContentRef = useRef<HTMLDivElement>(null)
  const touchStartYRef = useRef<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchReceivedFriendRequests(getToken)
      if (result === "Error") {
        setIsLoading(false)
      } else {
        setIsLoading(false)
        setFriendRequests(result)
      }
    }
    fetchData()
  }, [isReqPending, refresh])






  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? 0
  }

  const handleTouchMoveBoundaryLocked = (e: React.TouchEvent<HTMLDivElement>) => {
    // if (isLoading) return
    const mainBox = mainDivRef.current
    const contentBox = msgsContentRef.current
    if (!mainBox || !contentBox) return
    if (contentBox.offsetHeight < mainBox.offsetHeight) {
      return
    }

    const currentY = e.touches[0]?.clientY ?? 0
    const deltaY = currentY - touchStartYRef.current // >0 finger down (scroll up), <0 finger up (scroll down)

    const atTop = mainBox.scrollTop <= 0
    const atBottom = mainBox.scrollHeight - mainBox.scrollTop <= mainBox.clientHeight + 1

    // block scroll chaining/rubber-band at edges
    if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
      // e.preventDefault()
      e.stopPropagation()
      return
    }

    // otherwise keep scroll confined to chat area
    e.stopPropagation()
  }

  // useEffect(() => {
  //     console.log("main div height: ", mainDivRef.current?.offsetHeight)
  //     console.log("inner content: ", msgsContentRef.current?.offsetHeight)
  // }, [msgsContentRef.current?.offsetHeight, mainDivRef.current?.offsetHeight])

  return (
    <div
      className='fixed top-0 left-0 z-100 h-[calc(var(--vh)*100))] w-full flex justify-center items-center bg-black/50 text-white'
      onClick={() => {
        setActiveScreen("MainScreen")
      }}
      style={{
        animation: window.innerWidth <= 640 ? "slide-in-from-right 0.3s ease-in forwards" : "fade-in-slide-down 0.3s ease-in forwards"
      }}
    >
      <div
        className='h-full w-full sm:h-[400px] sm:w-[400px] bg-[#0f0f0f] flex flex-col sm:border sm:border-[#363636] sm:rounded-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={navbarRef}
          className="h-[60px] flex-shrink-0 w-full flex items-center gap-4 sm:gap-0 px-4 text-xl"
          style={{
            borderBottom: window.innerWidth > 640 ? "1px solid #363636" : ""
          }}
        >
          <div className="sm:hidden flex justify-center items-center">
            <button
              className="opacity-60 hover:opacity-100 cursor-pointer"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setActiveScreen("MainScreen")
              }}
            >
              <ArrowLeft />
            </button>
          </div>
          <div className="flex h-full w-full items-center justify-between">
            <div>Friend Requests</div>
            <div className=" flex justify-center items-center">
              <button
                className={`h-[36px] w-[36px] rounded-full cursor-pointer flex justify-center items-center hover:bg-[#2b2b2b] ${isLoading ? "animate-spin" : ""}`}
                onClick={() => {
                  setRefresh(!refresh)
                  setIsLoading(true)
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <RefreshCcw size={18} className="text-blue-400" />
              </button>
            </div>
          </div>
        </div>

        <div
          className="border-line h-[1px] w-full bg-[#363636]"
          style={{
            display: window.innerWidth > 640 ? "none" : ""
          }}
        />

        <div
          ref={mainDivRef}
          className="relative h-full w-full flex flex-col overflow-y-auto overscroll-contain touch-pan-y scrollbar-thin scrollbar-thumb-[#363636] scrollbar-track-trasparent"
          style={{
            justifyContent: (friendRequests.length === 0 || isLoading) ? "center" : "flex-start",
            // overscrollBehavior: "contain",
            // touchAction: "pan-y"
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMoveBoundaryLocked}
        >
          <div className="pointer-events-auto touch-none absolute -top-3 left-0 right-0 h-6" />
          <div
            ref={msgsContentRef}
            className=""
          >
            {isLoading && <GeneralLoader />}
            {!isLoading && !friendRequests.length && (
            <p className="h-full w-full flex justify-center items-center">No Friend Requests</p>
          )}
            {!isLoading && friendRequests.length !== 0 && friendRequests.map((req) => (
              <RequestBoxTemplate
                key={req.senderId}
                senderUsername={req.senderUsername}
                senderAvatar={req.senderAvatar}
                receivedAt={req.receivedAt}
                senderId={req.senderId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
