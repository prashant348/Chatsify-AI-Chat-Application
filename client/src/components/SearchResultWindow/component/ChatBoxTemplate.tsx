import { UserPlus, UserCheck } from "lucide-react"
import { useState } from "react"

interface ChatBoxTemplatePropsType {
  username: string,
  latestMsg?: string,
  imgUrl: string
}


export default function ChatBoxTemplate({ username, latestMsg, imgUrl }: ChatBoxTemplatePropsType) {

  const [isReqSent, setIsReqSent] = useState<boolean>(false)

  return (
    <div
      className="chat-box px-[10px] min-h-[70px] max-h-[70px] hover:bg-[#212121] w-full flex justify-between items-center"
      onMouseDown={(e) => {
        console.log("mousedown")
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <div className="flex items-center gap-[10px]">
        <div className="avatar-box  h-[50px] w-[50px] rounded-full overflow-hidden shrink-0 flex justify-center items-center">
          <img src={imgUrl} alt="user_avatar" />
        </div>

        <div className="user-username latest-msg flex flex-col">
          <p className="text-[16px] font-bold">{username}</p>
          <p className="last-seen-msg text-sm opacity-60">{latestMsg}</p>
        </div>
      </div>

      <div className="h-[36px] w-[36px]">
        <button
          className="opacity-60 hover:opacity-100 flex justify-center items-center h-full w-full rounded-full"
          onClick={() => setIsReqSent(true)}
          style={{
            opacity: isReqSent ? "1" : "",
            cursor: isReqSent ? "default" : "pointer"
          }}
        >
          {isReqSent ? <UserCheck color="#22c55e" /> : <UserPlus />}
        </button>
      </div>
    </div >
  )
}
