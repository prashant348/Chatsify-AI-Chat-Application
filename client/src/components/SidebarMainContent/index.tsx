import Navbar from './components/Navbar'
import ChatBoxes from './components/ChatBoxes'
import { useSearchResultWindow } from '../../zustand/store/SearchResultWindow'
import SearchResultWindow from '../SearchResultWindow'
import { useFilteredUsersStore } from '../../zustand/store/FilteredUsers'
import { BotMessageSquareIcon } from 'lucide-react'
import { useActiveScreenStore } from '../../zustand/store/ActiveScreenStore'
const SidebarMainContent = () => {

  const showSearchResultWindow = useSearchResultWindow(state => state.showSearchResultWindow)
  const filteredUsers = useFilteredUsersStore(state => state.filteredUsers)
  const setActiveScreen = useActiveScreenStore(state => state.setActiveScreen)
  return (
    <div className='text-white h-full flex flex-col'>
      <Navbar />
      {showSearchResultWindow? <SearchResultWindow users={filteredUsers} /> : <ChatBoxes />}
      {window.innerWidth <= 640 && !showSearchResultWindow && (
        <button 
        className='fixed z-10 bottom-5 right-5 active:bg-[#212121] bg-[#161616] transition-all 0.3s ease-in-out flex justify-center items-center h-[60px] w-[60px] border border-[#212121] rounded-full'      
        onClick={() => setActiveScreen("ChatbotWindow")}
        style={{
          boxShadow: "0px 0px 8px 0 rgba(8, 8, 8, 0.8)"
        }}
        >
          <BotMessageSquareIcon size={26} />
        </button>
      )}
    </div>
  )
}

export default SidebarMainContent