import ChatBoxTemplate from "./ChatBoxTemplate"
import { useEffect, useState } from "react"
import GeneralLoader from "../../GeneralLoader"
import { useAuth } from "@clerk/clerk-react"
import { useUser } from "@clerk/clerk-react"
import { useGlobalRefreshStore } from "../../../zustand/store/GlobalRefresh"
import { fetchFriends } from "../../../APIs/services/fetchFriends.service"

interface Message {
  msg: string
  type: "sent" | "received"
}

type friend = {
  friendClerkId: string,
  friendUsername: string,
  friendAvatar: string
  messages: Message[],
}

const ChatBoxes = () => {
  const [friendsArray, setFriendsArray] = useState<friend[]>([])
  const [isLoading, setisLoading] = useState<boolean>(true)
  const { getToken } = useAuth()
  const { user } = useUser()
  const [error, setError] = useState<string>("")
  const [isRetryBtnClicked, setIsRetryBtnClicked] = useState<boolean>(false)
  const globalRefresh = useGlobalRefreshStore(state => state.globalRefresh)

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchFriends(getToken, user?.id)

      if (result instanceof Array) {
        setisLoading(false)
        setFriendsArray(result)
      } else if (result === "Retry") {
        setisLoading(false)
        setError("Retry")
      }
    }

    fetchData()
  }, [isRetryBtnClicked, globalRefresh])

  return (
    <div
      className='h-full flex flex-col items-center overflow-y-auto scrollbar-thin scrollbar-track-[#0f0f0f] scrollbar-thumb-[#212121]'
      style={{
        justifyContent: isLoading ? "center" : "start"
      }}
    >
      {isLoading && <GeneralLoader />}
      {!isLoading && friendsArray.length === 0 && !error && <p className="h-full w-full flex justify-center items-center">No friends</p>}
      {!isLoading
        && friendsArray.length === 0
        && error
        &&
        <p className="h-full w-full flex justify-center items-center">
          <button
            className="bg-[#303030] p-2 rounded-md cursor-pointer"
            onClick={() => {
              setisLoading(true)
              setIsRetryBtnClicked(!isRetryBtnClicked)
            }}>
            {error}
          </button>
        </p>
      }

      {!isLoading && friendsArray.map((friend) => (
        <ChatBoxTemplate
          username={friend.friendUsername}
          lastMsg={`${friend.messages[friend.messages.length - 1]?.msg === undefined ? "" : friend.messages[friend.messages.length - 1].msg}`}
          lastMsgType={friend.messages[friend.messages.length - 1]?.type}
          imgUrl={friend.friendAvatar} key={friend.friendUsername}
          userId={friend.friendClerkId}
        />

      ))}
    </div>
  )
}

export default ChatBoxes