import { useRef } from 'react'
import GeneralLoader from '../GeneralLoader'
import { useGeneralLoaderStore } from '../../zustand/store/GeneralLoader'
import ChatBoxTemplate from './components/ChatBoxTemplate'
import { useSearchResultWindowResponseStore } from '../../zustand/store/SearchResultWindowResponse'
import type { SearchResultWindowPropsType } from '../../types/SearchResultWindow.types'
import "../../index.css"
import { useGlobalRefreshStore } from '../../zustand/store/GlobalRefresh'
const SearchResultWindow = ({ users }: SearchResultWindowPropsType) => {

  const { isLoading } = useGeneralLoaderStore()
  const searchResultWindowResponse = useSearchResultWindowResponseStore(state => state.searchResultWindowResponse)
  const { globalRefresh, setGlobalRefresh } = useGlobalRefreshStore()

  const mainDivRef = useRef<HTMLDivElement>(null)
  const msgsContentRef = useRef<HTMLDivElement>(null)
  const touchStartYRef = useRef<number>(0)

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? 0
  }

  const handleTouchMoveBoundaryLocked = (e: React.TouchEvent<HTMLDivElement>) => {
    if (searchResultWindowResponse === "Retry" || isLoading) return
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
      className='h-full overflow-y-auto flex flex-col'
      style={{
        justifyContent: users.length === 0 || isLoading ? "center": "flex-start",
        // alignItems: users.length === 0 ? 'center' : 'flex-start',
        animation: window.innerWidth > 640 ? "fade-in 0.2s ease-in forwards" : "fade-in-slide-up 0.2s ease-in forwards",
        overscrollBehavior: "contain",
        touchAction: "pan-y"
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMoveBoundaryLocked}
    >
      <div className="pointer-events-auto touch-none absolute -top-3 left-0 right-0 h-6" />
      <div
        ref={msgsContentRef}
        className=""
      >

        {isLoading &&
          <div className='h-[70px] w-full'><GeneralLoader /></div>}
        {!isLoading
          && users.length === 0
          && <p className='w-full h-full flex justify-center items-center'>
            {searchResultWindowResponse === "Retry"
              ? <div
                className="flex flex-col gap-1 p-2 justify-center items-center"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <span className="text-center">
                  Unable to fetch users!
                </span>
                <button
                  className="bg-[#212121] hover:bg-[#303030] p-2 border border-[#404040] rounded-md cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    setGlobalRefresh(!globalRefresh)
                  }}
                >
                  {searchResultWindowResponse}
                </button>
              </div>
              : searchResultWindowResponse
            }
          </p>
        }
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
    </div>
  )
}

export default SearchResultWindow

