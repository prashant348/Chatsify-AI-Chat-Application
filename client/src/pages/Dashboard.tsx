import React, { useState, useRef, useEffect } from "react"

interface ResizableSidebarProps {
  defaultWidth?: number,
  children: React.ReactNode
}

const ResizableSidebar: React.FC<ResizableSidebarProps> = ({ defaultWidth = 0.4 * window.innerWidth, children }) => {
  // Responsive width state
  const [sidebarWidth, setSidebarWidth] = useState<number>(0.4 * window.innerWidth)
  const sidebarRef = useRef<HTMLDivElement>(null);
  const minWidth: number = 251;
  const maxWidth: number = window.innerWidth - 384 // 384 is the width of the main content which is 24% of 1600
  const resizerRef = useRef<HTMLDivElement>(null)

  // Update widths on window resize
  useEffect(() => {

    const handleResize = () => {
      setSidebarWidth(0.4 * window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    console.log("mounted!")

    return () => {
      window.removeEventListener('resize', handleResize);
      console.log("unmounted!")
    }
  }, [])

  // update bg color of resizer when resize and resize stop!
  useEffect(() => {

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      resizerRef.current?.classList.add("bg-blue-500")
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      resizerRef.current?.classList.remove("bg-blue-500")
    }

    // if mousedown on and from resizer, call handleMouseDown
    resizerRef.current?.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    console.log("mount 2 !")

    return () => {
      resizerRef.current?.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      console.log("unmount 2 !")
    }

  }, [])

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();

    //Jab aap mouse se resizer ko pakadte ho, us waqt mouse ka X position (horizontal position) store ho jaata hai.
    // Ye starting point hai resize ka.
    const startX: number = e.clientX;

    // .offsetWidth ek DOM property hai jo kisi HTML element ki visible width (pixels me) return karti hai, including padding, border (lekin margin nahi).
    const initialSidebarWidth: number = sidebarRef.current?.offsetWidth || defaultWidth;


    const doResize = (e: MouseEvent) => {
      const dx: number = e.clientX - startX;
      // const newWidth = Math.min(Math.max(initialSidebarWidth + dx, minWidth), maxWidth);
      const newWidth: number = initialSidebarWidth + dx
      setSidebarWidth(newWidth);

    }


    const stopResizing = () => {
      document.removeEventListener('mousemove', doResize);
      document.removeEventListener('mouseup', stopResizing);
    };

    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResizing);
  }

  return (
    <div>
      <div className="dashboard-container h-screen sm:flex bg-black hidden">
        {/* sidebar */}
        <div
          ref={sidebarRef}
          className="sidebar"
          style={{
            width: sidebarWidth,
            minWidth: minWidth,
            maxWidth: maxWidth,
            backgroundColor: "#0f0f0f",
            position: "relative",
            overflow: "auto"
          }}
        >
          {children}
        </div>

        {/* resizer */}
        <div
          ref={resizerRef}
          className="resizer hover:bg-blue-500 bg-[#0f0f0f]"
          onMouseDown={startResizing}
          style={{
            width: 5,
            cursor: "e-resize",
            flexShrink: 0
          }}
        />

        {/* main content container  */}
        <div
          className="chat-window text-white min-w-[384px] flex justify-center items-center "
          style={{ flexGrow: 1 }}
        >
          <p className=" text-center ">Select a chat to start messaging</p>
        </div>
      </div>

    </div>
  )
}

export default ResizableSidebar
