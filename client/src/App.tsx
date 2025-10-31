import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { SignIn, SignUp } from "@clerk/clerk-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./Routes/ProtectedRoute";
import Loader from "./components/Loader";
import SidebarMainContent from "./components/SidebarMainContent/index";
import { useActiveScreenStore } from "./zustand/store/ActiveScreenStore";
import { useEffect, useState } from "react";
import About from "./pages/About";
import "./App.css"

const App = () => {
  const { activeScreen } = useActiveScreenStore();
  const [windowInnerWidth, setWindowInnerWidth] = useState<number>(window.innerWidth)

  useEffect(() => {
    const returnWindowInnerWidth = () => {
      setWindowInnerWidth(window.innerWidth)
    }
    window.addEventListener("resize", returnWindowInnerWidth)
    return () => {
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
            path="/about"
            element={
              <About />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Loader>
                <ProtectedRoute >
                  {(windowInnerWidth > 640 || windowInnerWidth <= 640) && (
                    activeScreen === "MainScreen"
                    || activeScreen === "ChatWindow"
                    || activeScreen === "FriendRequestsWindow"
                    || activeScreen === "InboxWindow"
                    || activeScreen === "ChatbotWindow"
                    || activeScreen === "TextToSpeechWindow"
                  ) && (
                      <Dashboard children={<SidebarMainContent />} />
   
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
