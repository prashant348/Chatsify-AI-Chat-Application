import ChatBoxTemplate from "./ChatBoxTemplate"
import { useRef } from "react"
// import GeneralLoader from "../../GeneralLoader"
import { useAuth } from "@clerk/clerk-react"
import { useUser } from "@clerk/clerk-react"
// import { useGlobalRefreshStore } from "../../../zustand/store/GlobalRefresh"
import { fetchFriends } from "../../../APIs/services/fetchFriends.service"
import { useQuery } from "@tanstack/react-query"
import TripleDotLoader from "../../TripleDotLoader"

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
  // const [friendsArray, setFriendsArray] = useState<friend[]>([])
  // const [isLoading, setisLoading] = useState<boolean>(true)
  const { getToken } = useAuth()
  const { user } = useUser()
  // const [error, setError] = useState<string>("")
  // const [isRetryBtnClicked, setIsRetryBtnClicked] = useState<boolean>(false)
  // const globalRefresh = useGlobalRefreshStore(state => state.globalRefresh)

  const mainDivRef = useRef<HTMLDivElement>(null)
  const msgsContentRef = useRef<HTMLDivElement>(null)
  const touchStartYRef = useRef<number>(0)

  const fetchFriendsQuery = async () => {
    const result: friend[] | "error" = await fetchFriends(getToken, user?.id)
    if (result instanceof Array) {
      return result
    } else if (result === "error") {
      return result
    }
  }

  const {
    data: friendsArrayQuery = [],
    isLoading: isLoadingQuery,
    error: queryError,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["friends", user?.id],
    queryFn: fetchFriendsQuery,
    // cacheTime: 30 * 60 * 1000,       // 30 min tak cache me rahe
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!user?.id,             // user available tabhi fetch
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await fetchFriends(getToken, user?.id)
  //     if (result instanceof Array) {
  //       setisLoading(false)
  //       setFriendsArray(result)
  //       setError("")
  //     } else if (result === "Retry") {
  //       setisLoading(false)
  //       setError("Retry")
  //     }
  //   }

  //   fetchData()
  // }, [isRetryBtnClicked, globalRefresh])
  

  // remove button dabane ke baad ka auto refresh logic hai lekin isme problem hai isliye comment out kiya hai!
  // useEffect(() => {
  //   if (!isFetching && friendsArrayQuery.length) {
  //     console.log("refetching... from useEffect hook")
  //     refetch()
  //   }
  // }, [globalRefresh])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? 0
  }

  const handleTouchMoveBoundaryLocked = (e: React.TouchEvent<HTMLDivElement>) => {
    if (friendsArrayQuery === "error" || isLoadingQuery || isFetching) return
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

  return (
    <div
      ref={mainDivRef}
      className='h-full flex flex-col items-center overflow-y-auto scrollbar-thin scrollbar-track-[#0f0f0f] scrollbar-thumb-[#212121]'
      style={{
        justifyContent: isLoadingQuery || friendsArrayQuery === "error" || queryError || !friendsArrayQuery.length ? "center" : "",
        alignItems: isLoadingQuery || friendsArrayQuery === "error" || queryError || !friendsArrayQuery.length ? "center" : "",
        overscrollBehavior: "contain",
        touchAction: "pan-y"
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMoveBoundaryLocked}
    >
      <div
        ref={msgsContentRef}
        className=" w-full"
        style={{
          display: isFetching || isLoadingQuery ? "flex": "",
          justifyContent: isFetching || isLoadingQuery ? "center": ""
        }}
      >
        {isFetching && <TripleDotLoader loaderName='Loading' />}
        {/* {isLoadingQuery && <GeneralLoader />} */}
        {!isLoadingQuery && friendsArrayQuery.length === 0 && !queryError && <p className="h-full w-full flex justify-center items-center">No friends</p>}
        {/* {queryError && <p className="h-full w-full flex justify-center items-center">{queryError.message}</p>} */}
        {!isLoadingQuery
          && !isFetching
          && (friendsArrayQuery === "error" || queryError)
          &&
          <div className="h-full w-full flex flex-col gap-1 justify-center items-center">
            <span className="text-center">
              Unable to fetch friends!
              <br />
              {queryError?.message}
            </span>
            <button
              className="bg-[#212121] hover:bg-[#303030] p-2 border border-[#404040] rounded-md cursor-pointer"
              onClick={() => {
                // setisLoading(true)
                // setIsRetryBtnClicked(!isRetryBtnClicked)
                console.log("refetching...")
                refetch()
              }}>
              Retry
            </button>
          </div>
        }
        {/* {!isLoading && <ChatBoxTemplate
          key={1}
          username={"dummy_user"}
          lastMsg={"dummy_user joined Chatsify!"}
          lastMsgType={"sent"}
          imgUrl="fhfhf"
          userId="1234567890"
        />} */}

        {!isLoadingQuery && !queryError && friendsArrayQuery !== "error" && friendsArrayQuery.map((friend) => (
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
    </div>
  )
}

export default ChatBoxes