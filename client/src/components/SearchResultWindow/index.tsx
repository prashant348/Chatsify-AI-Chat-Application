import GeneralLoader from '../GeneralLoader'
import { useGeneralLoaderStore } from '../../zustand/store/GeneralLoader'
import ChatBoxTemplate from './component/ChatBoxTemplate'
import { useSearchResultWindowResponseStore } from '../../zustand/store/SearchResultWindowResponse'

type User = {
  id: string
  username: string
  imageUrl: string
}

interface SearchResultWindowPropsType {
  users: User[]
}

const SearchResultWindow = ({ users }: SearchResultWindowPropsType) => {

  const { isLoading } = useGeneralLoaderStore()
  const searchResultWindowResponse  = useSearchResultWindowResponseStore(state => state.searchResultWindowResponse)

  return (
    <div 
    className='h-full flex justify-center'
    style={{
      alignItems: users.length === 0? 'center' : 'flex-start'
    }}
    // onMouseDown={(e) => {
    //   console.log("mousedown")
    //   e.preventDefault()
    //   e.stopPropagation()
    // }}
    >
      { isLoading && <GeneralLoader /> }
      { !isLoading && users.length === 0 && <p>{searchResultWindowResponse}</p> }
      { !isLoading && (
        users.map((user) => (
          <ChatBoxTemplate
            key={user.id}
            username={user.username}
            imgUrl={user.imageUrl}
          />
        ))
      )}
    </div>
  )
}

export default SearchResultWindow

