import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/clerk-react"
import { SignIn, SignUp } from "@clerk/clerk-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./Routes/ProtectedRoute";
import Loader from "./components/Loader";
import SidebarMainContent from "./components/SidebarMainContent/index";
import { useActiveScreenStore } from "./zustand/store/ActiveScreenStore";
import ChatWindowTemplate from "./components/ChatWindow/ChatWindowTemplate";
import { useEffect, useState } from "react";
import "./App.css"
import FriendRequestsWindow from "./components/FriendRequestsWindow/FriendRequestsWindow";
import InboxWindow from "./components/InboxWindow/InboxWindow";

const App = () => {

  const { activeScreen } = useActiveScreenStore();

  const [ windowInnerWidth, setWindowInnerWidth ] = useState<number>(window.innerWidth)

  useEffect(() => {
    const returnWindowInnerWidth = () => {
      setWindowInnerWidth(window.innerWidth)
      console.log(window.visualViewport)
    }
    
    window.addEventListener("resize", returnWindowInnerWidth)
    
    return () =>{
      window.removeEventListener("resize", returnWindowInnerWidth)
    }

  }, [])


  


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Loader><Home /></Loader>} />
          <Route
            path="/signin"
            element={
              <Loader>
                <SignIn forceRedirectUrl={"/dashboard"} />
              </Loader>
            }
          />
          <Route
            path="/signup"
            element={
              <Loader>
                <SignUp forceRedirectUrl={"/dashboard"} />
              </Loader>
            }
          />

          <Route
            path="/dashboard"
            element={
              <Loader>
                <ProtectedRoute >
                  {/* <Dashboard children={<SidebarMainContent />}/> */}


                  {windowInnerWidth > 640 && (activeScreen === "MainScreen" || activeScreen === "ChatWindow" || activeScreen === "FriendRequestsWindow" || activeScreen === "InboxWindow") && (
                    <Dashboard children={<SidebarMainContent />} />
                  )}


                  {windowInnerWidth <= 640 && activeScreen === "MainScreen" && (
                    <Dashboard children={<SidebarMainContent />} />
                  )}

                  {windowInnerWidth <= 640 && activeScreen === "ChatWindow" && (
                    <div 
                    className="fixed top-0 left-0 h-full w-full text-white "  
                    >
                      <ChatWindowTemplate />
                    </div>
                  )}

                  {windowInnerWidth <= 640 && activeScreen === "FriendRequestsWindow" && (
                    <div 
                    className="fixed top-0 left-0 h-full bg-transparent w-full text-white "  
                    >
                      <FriendRequestsWindow />
                    </div>
                  )}

                  {windowInnerWidth <= 640 && activeScreen === "InboxWindow" && (
                    <div 
                    className="fixed top-0 left-0 h-full bg-transparent w-full text-white "  
                    >
                      <InboxWindow />
                    </div>
                  )}


                </ProtectedRoute >
              </Loader>
            }
          />

        </Routes>
      </Router>
    </>
  )
}

export default App
