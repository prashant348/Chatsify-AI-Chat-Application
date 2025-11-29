import { MenuIcon, X } from 'lucide-react'
import { useSidebarStore } from '../../../zustand/store/SidebarStore.ts'
import { useSearchResultWindow } from '../../../zustand/store/SearchResultWindow.ts'
import { useEffect, useRef, useState } from 'react'
import { useGeneralLoaderStore } from '../../../zustand/store/GeneralLoader.ts'
import { useFilteredUsersStore } from '../../../zustand/store/FilteredUsers.ts'
import { useSearchResultWindowResponseStore } from '../../../zustand/store/SearchResultWindowResponse.ts'
import { useReqSentStore } from '../../../zustand/store/ReqSentStore.ts'
import { fetchUsersGlobaly } from '../../../APIs/services/fetchUsersGloably.service.ts'
import { useGlobalRefreshStore } from '../../../zustand/store/GlobalRefresh.ts'
// import { Globe } from 'lucide-react'
// import globe from "../../../assets/globe.svg"

const Navbar: React.FC = () => {

  const setShowSidebar = useSidebarStore((state) => state.setShowSidebar)
  const { showSearchResultWindow, setShowSearchResultWindow } = useSearchResultWindow()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState<string>("")
  const setIsLoading = useGeneralLoaderStore(state => state.setIsLoading)
  const setFilteredUsers = useFilteredUsersStore(state => state.setFilteredUsers)
  const setSearchResultWindowResponse = useSearchResultWindowResponseStore(state => state.setSearchResultWindowResponse)
  const controller: AbortController = new AbortController();
  const { signal } = controller
  const { setIsReqSent } = useReqSentStore()

  const navbarRef = useRef<HTMLDivElement>(null)
  const { globalRefresh } = useGlobalRefreshStore()

  const handleHambtnClick = (): void => {
    setShowSidebar(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchUsersGlobaly(query, signal, setFilteredUsers, setIsLoading)
      if (result === "Error") {
        setIsLoading(false)
        setSearchResultWindowResponse("Retry")
        return;
      } else if (result === "Search people by their usernames!") {
        setSearchResultWindowResponse(result)
      } else if (result === "No users found!") {
        setSearchResultWindowResponse(result)
      } else if (result === "AbortError") {
        return
      }
    }
    fetchData()
    return () => {
      controller.abort()
    }
  }, [query, globalRefresh])

  return (
    <div ref={navbarRef} className='h-[60px] flex shrink-0'>
      <div className='w-[60px] shrink-0 flex justify-center items-center'>
        <button
          className='hambtn hover:bg-[#212121] rounded-full p-2 cursor-pointer'
          onClick={handleHambtnClick}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <MenuIcon />
        </button>
      </div>

      <div className='global-search-bar w-full h-full pr-2 py-3 '>
        <input
          ref={searchInputRef}
          type="text"
          className='bg-[#212121] outline-none hover:border hover:px-[15px] pr-8 hover:border-[#363636] text-white rounded-r-full rounded-l-full w-full h-full px-4'
          placeholder='Search people globaly'
          onFocus={() => {
            console.log("focus")
            setShowSearchResultWindow(true)
            setFilteredUsers([])
            setSearchResultWindowResponse("Search people by their usernames!")
            setIsReqSent(false)
          }}
          onBlur={(e) => {
            console.log("onblur")
            setShowSearchResultWindow(false)
            e.target.value = ""
            setFilteredUsers([])
            // becoz last seacrh get saved in query state and when you search that again
            // then query state get same value -> means no change -> means code inside useEffect will not get executed! 
            setQuery("")
          }}

          style={{
            border: showSearchResultWindow ? "1px solid #363636" : "",
            paddingLeft: showSearchResultWindow ? "15px" : "",
          }}

          onChange={(e) => {
            console.log("change")
            setQuery(e.target.value.toLowerCase().trim())
          }}
        />
        {/* <div className='fixed top-[16px] left-[64px] h-7 w-7 rounded-full overflow-hidden'>
          <button
            className='h-full w-full flex justify-center items-center'
          >
            <img src={globe} alt="globe_icon" width={22} height={22} />
          </button>
        </div> */}
        {query && (<div className='fixed top-[16px] rounded-r-full  h-7 w-7'
          style={{
            left: navbarRef.current?.offsetWidth ? navbarRef.current.offsetWidth - 40 : ""
          }}
        >
          <button
            className='h-full w-full rounded-full hover:bg-[#303030] flex justify-center items-center'
            onMouseDown={(e) => {
              e.preventDefault()
            }}
            onClick={() => {
              setQuery("")
              searchInputRef.current!.value = ""
            }}
          >
            <X size={16} />
          </button>
        </div>)}
      </div>
    </div>
  )
}

export default Navbar