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
        <div className="h-full w-full flex flex-col gap-1 justify-center items-center">
          <span className="text-center">
            Unable to fetch friends!
          </span>
          <button
            className="bg-[#212121] hover:bg-[#303030] p-2 border border-[#404040] rounded-md cursor-pointer"
            onClick={() => {
              setisLoading(true)
              setIsRetryBtnClicked(!isRetryBtnClicked)
            }}>
            {error}
          </button>
        </div>
      }
      {!isLoading && <ChatBoxTemplate 
        key={1}
        username={"dummy_user"}
        lastMsg={"dummy_user joined Chatsify!"}
        lastMsgType={"sent"}
        imgUrl="fhfhf"
        userId="1234567890"
      />}

      {!isLoading && friendsArray.map((friend) => (
        <ChatBoxTemplate
          // key={idx}
          key={friend.friendClerkId}
          username={friend.friendUsername}
          lastMsg={`${friend.messages[friend.messages.length - 1]?.msg === undefined ? "" : friend.messages[friend.messages.length - 1].msg}`}
          lastMsgType={friend.messages[friend.messages.length - 1]?.type}
          imgUrl={friend.friendAvatar}
          userId={friend.friendClerkId}
        />

      ))}
    </div>
  )
}

export default ChatBoxes