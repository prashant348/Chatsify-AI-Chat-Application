
import RequestBoxTemplate from "./components/RequestBoxTemplate"
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useActiveScreenStore } from "../../zustand/store/ActiveScreenStore"
import GeneralLoader from "../GeneralLoader"
import { ArrowLeft } from "lucide-react"
import { useRequestPendingStore } from "../../zustand/store/RequestsPending"


interface senderReqType {
  senderId: string,
  senderUsername: string,
  senderAvatar: string,
  receivedAt: string
}

export default function FriendRequestsWindow() {

  const { getToken } = useAuth()
  const [friendRequests, setFriendRequests] = useState<senderReqType[]>([])
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen)
  const [isLoading, setisLoading] = useState<boolean>(true)

  const isReqPending = useRequestPendingStore(state => state.isReqPending)

  useEffect(() => {

    const fetchReceivedFriendRequests = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/receive-request`, {
          method: "GET",
          headers: {     
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await getToken()}`
          }
        })
        const data = await res.json()

        const friendRequests = data.friendRequestsReceivedFrom_List
        setFriendRequests(friendRequests)
        console.log("frnd reqs arr: ", friendRequests)
        console.log("length: ", friendRequests.length)

      } catch (err) {
        console.error("error in fetching requests: ", err)
      } finally {
        setisLoading(false)
      }
    }

    fetchReceivedFriendRequests()
  }, [isReqPending])

  return (
    <div
      className='fixed top-0 left-0 z-100 h-screen w-full flex justify-center items-center bg-black/50 text-white'
      onClick={() => setActiveScreen("MainScreen")}
    >
      <div
        className='h-full w-full sm:h-[400px] sm:w-[400px] bg-[#0f0f0f] flex flex-col border border-[#363636] sm:rounded-2xl overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[50px] w-full flex items-center gap-4 sm:gap-0 px-4 border-b border-b-[#363636] text-xl">
          <div className="sm:hidden flex justify-center items-center">
            <button 
            className="opacity-50 hover:opacity-100 cursor-pointer"
            onClick={() => setActiveScreen("MainScreen")}
            >
              <ArrowLeft />
            </button>
          </div>
          <div>Friend Requests</div>
        </div>
        <div
          className="h-full w-full overflow-y-auto"
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
