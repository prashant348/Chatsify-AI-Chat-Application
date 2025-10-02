import React, { useState, useRef } from "react"



interface ResizableSidebarProps {
  defaultWidth?: number,
  maxWidth?: number,
  minWidth?: number,
  children: React.ReactNode
}


const ResizableSidebar: React.FC<ResizableSidebarProps> = ({ defaultWidth = 700, maxWidth = 1250, minWidth = 300, children }) => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(defaultWidth)
  const sidebarRef = useRef<HTMLDivElement>(null);






  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const initialSidebarWidth = sidebarRef.current?.offsetWidth || defaultWidth;

    const doResize = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const newWidth = Math.min(Math.max(initialSidebarWidth + dx, minWidth), maxWidth);
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
    <div className="app-container h-screen flex bg-black ">

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

        className="resizer hover:bg-blue-500 bg-transparent"
        onMouseDown={startResizing}

        style={{
          width: 5,
          cursor: "e-resize",
          flexShrink: 0
        }}
      />

      {/* main content container  */}

      <div
        className="main-content-area"
        style={{ flexGrow: 1, padding: "20px" }}
      >
        <h1>Main Content</h1>
        <p>This is the main content area.</p>
      </div>

    </div>
  )


}

export default ResizableSidebar
