import React from "react"
import { useNavigate } from "react-router-dom"
import { MoveRight } from "lucide-react"
const Home: React.FC = () => {

  const navigate = useNavigate()

  return (
    <div className="bg-black flex justify-between text-white w-full">
      <div>
        Home
      </div>

      <div>
        <button
          className="cursor-pointer border p-2 flex gap-2"
          onClick={() => navigate("/dashboard")}
        >
          <span>
            Dashboard
          </span>
          <span>
            <MoveRight />
          </span>
        </button>
      </div>
    </div>
  )
}

export default Home