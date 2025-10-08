
import Navbar from './components/Navbar'
import ChatBoxes from './components/ChatBoxes'
import { useSearchResultWindow } from '../../zustand/store/SearchResultWindow'
import SearchResultWindow from '../SearchResultWindow'
import { useFilteredUsersStore } from '../../zustand/store/FilteredUsers'

const index = () => {

  const showSearchResultWindow = useSearchResultWindow(state => state.showSearchResultWindow)
  const filteredUsers = useFilteredUsersStore(state => state.filteredUsers)

  return (
    <div className='text-white h-full flex flex-col'>
      <Navbar />
      {showSearchResultWindow ? <SearchResultWindow users={filteredUsers} /> : <ChatBoxes />}
    </div>
  )
}

export default index