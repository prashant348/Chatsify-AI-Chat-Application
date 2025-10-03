import React from 'react'
import { UserButton } from '@clerk/clerk-react'

const Navbar = () => {
  return (
    <div className='h-[60px] flex shrink-0'>
        <div className='w-[60px] shrink-0  flex place-content-center'>
            <UserButton />
        </div>

        <div className= 'w-full pr-2 py-3 '>
            <input type="text" className='bg-[#212121] outline-none text-white rounded-r-full rounded-l-full w-full h-full px-4 ' placeholder='Search' />
        </div>
    </div>
  )
}

export default Navbar