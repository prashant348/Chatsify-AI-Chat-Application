import GeneralLoader from '../GeneralLoader'
import { useGeneralLoaderStore } from '../../zustand/store/GeneralLoader'
import ChatBoxTemplate from './components/ChatBoxTemplate'
import { useSearchResultWindowResponseStore } from '../../zustand/store/SearchResultWindowResponse'
import type { SearchResultWindowPropsType } from '../../types/SearchResultWindow.types'
import "../../index.css"

const SearchResultWindow = ({ users }: SearchResultWindowPropsType) => {

  const { isLoading } = useGeneralLoaderStore()
  const searchResultWindowResponse = useSearchResultWindowResponseStore(state => state.searchResultWindowResponse)

  return (
    <div
      className='h-full flex justify-center'
      style={{
        alignItems: users.length === 0 && window.innerWidth > 640 ? 'center' : 'flex-start',
        animation: window.innerWidth > 640 ?"fade-in 0.2s ease-in forwards": "fade-in-slide-up 0.2s ease-in forwards"
      }}
    >
      {isLoading && 
      <div className='h-[70px] w-full'><GeneralLoader /></div>}
      {!isLoading && users.length === 0 && <p className='w-full flex justify-center items-center h-[70px]'>{searchResultWindowResponse}</p>}
      {!isLoading && (
        users.map((user) => (
          <ChatBoxTemplate
            key={user.id}
            username={user.username}
            imgUrl={user.imageUrl}
            id={user.id}

          />
        ))
      )}
    </div>
  )
}

export default SearchResultWindow

