// import React from 'react'
// import { UserButton } from '@clerk/clerk-react'
import { MenuIcon } from 'lucide-react'
import { useSidebarStore } from '../../../zustand/store/SidebarStore.ts'


const Navbar = () => {
  const setShowSidebar = useSidebarStore((state) => state.setShowSidebar)

  const handleHambtnClick = () => {
    setShowSidebar(true)
  }

  return (

    <div className='h-[60px] flex shrink-0'>
      <div className='w-[60px] shrink-0 flex justify-center items-center'>
        <button
          className='hambtn hover:bg-[#212121] rounded-full p-2'
          onClick={handleHambtnClick}
        >
          <MenuIcon />
        </button>
      </div>

      <div className='w-full pr-2 py-3 '>
        <input type="text" className='bg-[#212121] outline-none text-white rounded-r-full rounded-l-full w-full h-full px-4 ' placeholder='Search' />
      </div>
    </div>

  )
}

export default Navbar