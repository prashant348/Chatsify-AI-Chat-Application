import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/clerk-react"
import { SignIn, SignUp } from "@clerk/clerk-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";



const App = () => {
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
                  <Dashboard />
                </ProtectedRoute>
              </Loader>
            }
          />

        </Routes>
      </Router>
    </>
  )
}

export default App
