
import RequestBoxTemplate from "./components/RequestBoxTemplate"
import { useEffect, useState } from 'react'
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

  return (
    <div
      className='fixed top-0 left-0 z-100 h-screen w-full flex justify-center items-center bg-black/50 text-white'
      onClick={() => {
        setActiveScreen("MainScreen")
      }}
      style={{
        animation: window.innerWidth <= 640 ? "slide-in-from-right 0.3s ease-in forwards" : ""
      }}
    >
      <div
        className='h-full w-full sm:h-[400px] sm:w-[400px] bg-[#0f0f0f] flex flex-col border border-[#363636] sm:rounded-2xl overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[60px] w-full flex items-center gap-4 sm:gap-0 px-4 border-b border-b-[#363636] text-xl">
          <div className="sm:hidden flex justify-center items-center">
            <button
              className="opacity-50 hover:opacity-100 cursor-pointer"
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
                className="h-[36px] w-[36px] rounded-full cursor-pointer flex justify-center items-center hover:bg-[#2b2b2b] hover:rotate-[-180deg] transition-all duration-300"
                onClick={() => {
                  setRefresh(!refresh)
                  setIsLoading(true)
                }}
              >
                <RefreshCcw size={18} className="text-blue-400" />
              </button>
            </div>
          </div>
        </div>

        <div
          className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#363636] scrollbar-track-trasparent"
          style={{
            alignItems: isLoading ? 'center' : 'flex-start'
          }}
        >
          {isLoading && <GeneralLoader />}
          {!isLoading && friendRequests.length !== 0 && friendRequests.map((req) => (
            <RequestBoxTemplate
              key={req.senderId}
              senderUsername={req.senderUsername}
              senderAvatar={req.senderAvatar}
              receivedAt={req.receivedAt}
              senderId={req.senderId}
            />
          ))}
          {!isLoading && !friendRequests.length && (
            <p className="h-full w-full flex justify-center items-center">No Friend Requests</p>
          )}
        </div>
      </div>
    </div>
  )
}
