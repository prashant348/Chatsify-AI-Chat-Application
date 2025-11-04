import TextToSpeechHeader from "./components/TextToSpeechHeader"
import TextToSpeechMain from "./components/TextToSpeechMain"
import TextToSpeechFooter from "./components/TextToSpeechFooter"
import "../../index.css"


export default function TextToSpeechWindow() {

    return (
        <div
            className="h-[calc(var(--vh)*100)] flex flex-col w-full"
            style={{
                animation: window.innerWidth <= 640
                    ? "slide-in-from-right 0.3s ease-in forwards"
                    : ""
            }}
        >
            <div className="sticky top-0 z-21 bg-[#0f0f0f]">
                <TextToSpeechHeader />
            </div>
            <div 
            className='flex-1 min-h-0 bg-black w-full'
            >
                <TextToSpeechMain />
            </div>
            <div className="sticky bottom-0  z-20 bg-[#0f0f0f]">
                <TextToSpeechFooter />
            </div>
        </div>
    )
}
