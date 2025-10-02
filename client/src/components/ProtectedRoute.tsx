import { useUser } from "@clerk/clerk-react"
import { Navigate } from "react-router-dom"
import React from "react"


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useUser()


  if (!isSignedIn) {
    return <Navigate to={"/signin"} />
  }

  return (
    <>{children}</>
  )
}

export default ProtectedRoute