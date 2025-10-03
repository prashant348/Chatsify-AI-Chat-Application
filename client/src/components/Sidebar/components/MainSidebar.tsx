

const MainSidebar = ({ onClick }: { onClick: (e: React.MouseEvent) => void }) => {
  return (
    <div 
    className='h-full w-[274px] flex justify-center items-center bg-[#0f0f0f] border-r border-r-[#212121] '
    onClick={onClick}
    >
      Main sidebar
    </div>
  )
}

export default MainSidebar
