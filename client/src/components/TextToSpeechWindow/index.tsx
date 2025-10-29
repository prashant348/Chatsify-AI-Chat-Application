import TextToSpeechHeader from "./components/TextToSpeechHeader"
import TextToSpeechMain from "./components/TextToSpeechMain"
import TextToSpeechFooter from "./components/TextToSpeechFooter"
import "../../index.css"

export default function TextToSpeechWindow() {

    return (
        <div
            className="flex flex-col h-full w-full"
            style={{
                animation: window.innerWidth <= 640
                    ? "slide-in-from-right 0.3s ease-in forwards"
                    : ""
            }}
        >
            <TextToSpeechHeader />
            <div className='response-area bg-black h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#303030] scrollbar-track-transparent'>
                <TextToSpeechMain />
            </div>
            <TextToSpeechFooter />
        </div>
    )
}
