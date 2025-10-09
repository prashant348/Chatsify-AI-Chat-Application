import { MenuIcon } from 'lucide-react'
import { useSidebarStore } from '../../../zustand/store/SidebarStore.ts'
import { useSearchResultWindow } from '../../../zustand/store/SearchResultWindow.ts'
import { useEffect, useRef, useState } from 'react'
import { useGeneralLoaderStore } from '../../../zustand/store/GeneralLoader.ts'
import { useFilteredUsersStore } from '../../../zustand/store/FilteredUsers.ts'
import { useSearchResultWindowResponseStore } from '../../../zustand/store/SearchResultWindowResponse.ts'



type User = {
  id: string
  username: string
  imageUrl: string
}



const Navbar = () => {
  const setShowSidebar = useSidebarStore((state) => state.setShowSidebar)
  const { showSearchResultWindow, setShowSearchResultWindow } = useSearchResultWindow()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState<string>("")
  const setIsLoading = useGeneralLoaderStore(state => state.setIsLoading)
  const setFilteredUsers = useFilteredUsersStore(state => state.setFilteredUsers)
  const setSearchResultWindowResponse = useSearchResultWindowResponseStore(state => state.setSearchResultWindowResponse)
  const controller = new AbortController();
  const { signal } = controller

  const handleHambtnClick = () => {
    setShowSidebar(true)
  }

  

  useEffect(() => {
    const fetchUsersByUsername: (param: string) => void = async (inputUsername) => {

      if (!inputUsername) {
        setFilteredUsers([])
        setSearchResultWindowResponse("Search people by their usernames!")
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, { signal })
        const data = await res.json()

        const matched = data.filter((user: User) => {
          return user.username.startsWith(inputUsername)
        })

        setFilteredUsers(matched)
        setIsLoading(false)

        if (matched.length > 0) {
          console.log("Found:", matched);
          console.log("Found for: ", query)
        }
        else if (matched.length === 0 && !inputUsername) {
          console.log("Search people by their usernames!")
          setSearchResultWindowResponse("Search people by their usernames!")
        }
        else if (matched.length === 0 && inputUsername) {
          console.log("No users found for: ", query)
          setSearchResultWindowResponse("No users found!")
        }

      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Previous request was cancelled!');
          return; // Kuch mat karo
        }
        console.error("error in fetching users: ", err)
      } 
    }
    fetchUsersByUsername(query)

    return () => {
      controller.abort()
    }

  }, [query])




  return (
    <div className='h-[60px] flex shrink-0'>
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

      <div className='w-full pr-2 py-3 '>
        <input
          ref={searchInputRef}
          type="text"
          className='bg-[#212121] outline-none hover:border hover:px-[15px] hover:border-[#363636] text-white rounded-r-full rounded-l-full w-full h-full px-4 '
          placeholder='Search people'
          onFocus={() => {
            console.log("focus")
            setShowSearchResultWindow(true)
            //  ye isliye likha kyuki: jab mai input mai kuch aisa likh ke chor deta tha jisse "no users found!" msg dikhe yaa loader ghum raha ho
            //  aur tab agr mai window minimize karke fir chalu karta tha toh input clear ho jata tha bina "onChange" event chale
            // jiski vajah msg "Search people by their username!" ki jagah "No users found!" msg dikh raha tha, jo ki ek logical bug tha!
            setFilteredUsers([])
            setSearchResultWindowResponse("Search people by their usernames!")
          }}
          onBlur={(e) => {
            console.log("onblur")
            setShowSearchResultWindow(false)
            e.target.value = ""
            setFilteredUsers([])
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

      </div>
    </div>
  )
}

export default Navbar