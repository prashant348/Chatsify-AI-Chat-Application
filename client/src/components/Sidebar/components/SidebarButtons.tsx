import { Users, Bookmark, ShipWheel, Settings, Moon } from "lucide-react"

export default function SidebarButtons() {
    return (
        <div>
            <div className="my-profile-box w-full py-[5px] border-b border-b-[#212121]">
                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121]"
                >
                    <Users height={"20px"} />
                    <span className="">New Room</span>
                </button>

                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121]"
                >
                    <Bookmark height={"20px"} />
                    <span className="">Saved Messages</span>
                </button>

                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121]"
                >
                    <ShipWheel height={"20px"} />
                    <span className="">Chatsify AI</span>
                </button>


                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121]"
                >
                    <Settings height={"20px"} />
                    <span className="">Settings</span>
                </button>

                <button
                    className="w-full h-[40px] flex items-center px-6 gap-4 text-sm hover:bg-[#212121]"
                >
                    <Moon height={"20px"} />
                    <span className="">Night Mode</span>
                </button>
            </div>
        </div>
    )
}
