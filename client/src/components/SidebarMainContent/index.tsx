import React from 'react'
import Navbar from './components/Navbar'
import MainContent from './components/MainContent'

const index = () => {
  return (
    <div className='text-white h-full flex flex-col'>
        <Navbar  />
        <MainContent />
    </div>
  )
}

export default index