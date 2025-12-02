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
import 'highlight.js/styles/github-dark.css';

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

  useEffect(() => {
    const handleTouchMove: EventListener = (e) => {
      e.preventDefault();
      e.stopPropagation()
      console.log('-- documentElement touch move:', e.timeStamp, e);
    };

    document.documentElement.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.documentElement.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);




  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Loader><Home /></Loader>} />
          <Route
            path="/signin"
            element={
              <Loader>
                <div className="h-full w-full flex justify-center items-center">
                  <SignIn forceRedirectUrl={"/dashboard"} />
                </div>
              </Loader>
            }
          />
          <Route
            path="/signup"
            element={
              <Loader>
                <div className="h-full w-full flex justify-center items-center">
                  <SignUp forceRedirectUrl={"/dashboard"} />
                </div>
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
