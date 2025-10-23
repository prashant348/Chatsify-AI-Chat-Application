import { ShipWheel, ArrowLeft } from 'lucide-react'
import { useActiveScreenStore } from '../../../zustand/store/ActiveScreenStore'

export default function ChatbotWindowNavbar() {
    
    const { setActiveScreen } = useActiveScreenStore()
    
    return (
        <div className='navbar h-[60px] w-full bg-[#0f0f0f] px-3 flex items-center'>
            <div className='flex gap-3'>
                <button 
                className='cursor-pointer flex sm:hidden'
                onClick={() => {
                    setActiveScreen("MainScreen")
                }}>
                    <ArrowLeft />
                </button>
                <ShipWheel />
                <span className='font-bold'>Chatsify AI</span>
            </div>
        </div>
    )
}
