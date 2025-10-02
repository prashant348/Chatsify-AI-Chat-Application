import React from 'react'
import { useUser } from '@clerk/clerk-react'

const Loader = ({ children }: { children: React.ReactNode }) => {

    const { isLoaded } = useUser()

    if (!isLoaded) {
        return (
            <>
                <div className="h-screen flex items-center justify-center bg-black">
                    <div className="w-6 h-6 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                </div>
            </>
        )
    }

    return (
        <div className='h-screen flex justify-center items-center'>{children}</div>
    )
}

export default Loader