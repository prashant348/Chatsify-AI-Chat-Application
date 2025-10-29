import GeneralLoader from '../GeneralLoader'
import { useGeneralLoaderStore } from '../../zustand/store/GeneralLoader'
import ChatBoxTemplate from './components/ChatBoxTemplate'
import { useSearchResultWindowResponseStore } from '../../zustand/store/SearchResultWindowResponse'
import type { SearchResultWindowPropsType } from '../../types/SearchResultWindow.types'

const SearchResultWindow = ({ users }: SearchResultWindowPropsType) => {

  const { isLoading } = useGeneralLoaderStore()
  const searchResultWindowResponse = useSearchResultWindowResponseStore(state => state.searchResultWindowResponse)

  return (
    <div
      className='h-full flex justify-center'
      style={{
        alignItems: users.length === 0 ? 'center' : 'flex-start'
      }}
    >
      {isLoading && <GeneralLoader />}
      {!isLoading && users.length === 0 && <p>{searchResultWindowResponse}</p>}
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

