import { useActiveScreenStore } from "../../../zustand/store/ActiveScreenStore"
import { useChatWindowUsernameStore } from "../../../zustand/store/ChatWindowUsername"
import { useChatWindowAvatarStore } from "../../../zustand/store/ChatWindowAvatar"

interface ChatBoxTemplatePropsType {
  username: string,
  latestMsg?: string,
  imgUrl: string
}



export default function ChatBoxTemplate({ username, latestMsg, imgUrl }: ChatBoxTemplatePropsType) {

  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen)
  const setChatWindowUsername = useChatWindowUsernameStore((state) => state.setChatWindowUsername)
  const setChatWindowAvatar = useChatWindowAvatarStore((state) => state.setChatWindowAvatar)
  return (
    <div
      className="chat-box px-[10px] min-h-[70px] max-h-[70px] hover:bg-[#212121] w-full flex justify-start items-center gap-[10px]"
      onClick={() => {
        setChatWindowAvatar(imgUrl)
        setChatWindowUsername(username)
        setActiveScreen("ChatWindow")
      }}
    >
      <div className="avatar-box  h-[50px] w-[50px] rounded-full overflow-hidden shrink-0 flex justify-center items-center">
        <img src={imgUrl} alt="user_avatar" />
      </div>

      <div className="user-username latest-msg flex flex-col">
        <p className="text-[16px] font-bold">{username}</p>
        <p className="last-seen-msg text-sm opacity-60">{latestMsg}</p>
      </div>

    </div>
  )
}
