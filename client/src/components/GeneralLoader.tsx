interface GeneralLoaderProps {
  sizeInPixels?: number;
}

const GeneralLoader = ({ sizeInPixels = 24 }: GeneralLoaderProps) => {

  return (
    <div className="h-full flex items-center justify-center w-full">
      <div
        className={` border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin`}
        style={{
          width: sizeInPixels,
          height: sizeInPixels
        }}
      >
      </div>
    </div>
  )
}

export default GeneralLoader
