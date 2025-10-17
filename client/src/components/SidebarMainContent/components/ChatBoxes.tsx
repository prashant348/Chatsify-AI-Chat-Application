import ChatBoxTemplate from "./ChatBoxTemplate"
import { useEffect, useState } from "react"
import GeneralLoader from "../../GeneralLoader"
import { useAuth } from "@clerk/clerk-react"
import { useUser } from "@clerk/clerk-react"

type friend = {
  id?: string,
  friendUsername: string,
  friendAvatar: string
  messages: {
    msg: string,
    type: "sent" | "received"
  }[],
}

const ChatBoxes = () => {
  const [ friendsArray, setFriendsArray ] = useState<friend[]>([])
  const [ isLoading, setisLoading ] = useState<boolean>(true)
  const { getToken } = useAuth()
  const { user } = useUser()


  // dummy data for testing 

  // const chatBoxes = [
  //   { username: "Prashant", latestMsg: "Prashant joined Chatsify", uniqueKey: 1 },
  //   { username: "John", latestMsg: "John joined Chatsify", uniqueKey: 2 },
  //   { username: "Babu", latestMsg: "Babu joined Chatsify", uniqueKey: 3 },
  //   { username: "Rahul", latestMsg: "Hey! How are you doing?", uniqueKey: 4 },
  //   { username: "Priya", latestMsg: "See you at the meeting!", uniqueKey: 5 },
  //   { username: "Amit", latestMsg: "Thanks for your help bro 🙏", uniqueKey: 6 },
  //   { username: "Sneha", latestMsg: "Can we reschedule tomorrow?", uniqueKey: 7 },
  //   { username: "Vijay", latestMsg: "Check out this new feature!", uniqueKey: 8 },
  //   { username: "Anjali", latestMsg: "Good morning! ☀️", uniqueKey: 9 },
  //   { username: "Dev", latestMsg: "Code review done ✅", uniqueKey: 10 },
  //   { username: "Rohan", latestMsg: "Let's grab coffee sometime", uniqueKey: 11 },
  //   { username: "Kavya", latestMsg: "Happy Birthday! 🎉", uniqueKey: 12 },
  //   { username: "Arjun", latestMsg: "Meeting at 5 PM", uniqueKey: 13 },
  //   { username: "Neha", latestMsg: "Dinner plans tonight?", uniqueKey: 14 },
  //   { username: "Sanjay", latestMsg: "Project deadline extended!", uniqueKey: 15 },
  //   { username: "Meera", latestMsg: "Loved the presentation 👏", uniqueKey: 16 },
  //   { username: "Karan", latestMsg: "Can you send me that file?", uniqueKey: 17 },
  //   { username: "Riya", latestMsg: "See you soon!", uniqueKey: 18 },
  //   { username: "Aditya", latestMsg: "Working on the new design", uniqueKey: 19 },
  //   { username: "Pooja", latestMsg: "Great job on the launch! 🚀", uniqueKey: 20 }
  // ]


  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${user?.id}/friends`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await getToken()}`
          }
        })
        const data = await res.json()
        console.log(data)
        const friends: friend[] = data.userFriends
        setFriendsArray(friends)
      } catch (err) {
        console.error("error in fetching friends: ", err)
      } finally {
        setisLoading(false)
      }
    }
    getUsers()
  }, [])

  return (
    <div
      className='h-full flex flex-col items-center overflow-y-auto scrollbar-thin scrollbar-track-[#0f0f0f] scrollbar-thumb-[#212121]'
      style={{
        justifyContent: isLoading ? "center" : "start"
      }}
    >
      {/* {chatBoxes.map(chatBox => (
        <ChatBoxTemplate username={chatBox.username} latestMsg={chatBox.latestMsg} key={chatBox.uniqueKey} />
      ))} */}

      {isLoading && <GeneralLoader />}
      {!isLoading && friendsArray.length === 0 && <p className="h-full w-full flex justify-center items-center">No friends</p>}
      {!isLoading && friendsArray.map((friend) => (
        <ChatBoxTemplate 
        username={friend.friendUsername} 
        lastMsg={`${friend.messages[friend.messages.length - 1]?.msg === undefined? "": friend.messages[friend.messages.length - 1].msg}`} 
        lastMsgType={friend.messages[friend.messages.length - 1]?.type}
        imgUrl={friend.friendAvatar} key={friend.friendUsername} />
      ))}

    </div>
  )
}

export default ChatBoxes