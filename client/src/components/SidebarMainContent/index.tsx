
import Navbar from './components/Navbar'
import ChatBoxes from './components/ChatBoxes'

const index = () => {
  return (
    <div className='text-white h-full flex flex-col'>
        <Navbar  />
        <ChatBoxes />
    </div>
  )
}

export default index