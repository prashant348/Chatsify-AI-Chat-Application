import { useEffect, useState } from 'react'

export default function TripleDotLoader({ loaderName }: { loaderName: string }) {
    const [dotCount, setDotCount] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount(prevCount => prevCount === 3 ? 0 : prevCount + 1)
        }, 300)

        return () => clearInterval(interval)
    }, [])

    const dots = ".".repeat(dotCount)

    return (
        <span className="inline-flex items-center font-medium text-gray-300">
            <span className='italic'>{loaderName}</span>
            <span style={{ width: "20px", display: "inline-block" }}>{dots}</span>
        </span>
    )
}
