import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, useState } from "react";

import { Toaster } from "react-hot-toast";

import { Loader } from "lucide-react";

import SplashScreen from "./components/SplashScreen";



const App = () => {


  const { authUser, checkAuth, isCheckingAuth, isAdmin } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    checkAuth();
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  // Show splash for at least 2 seconds, regardless of loading state
  if ((isCheckingAuth && !authUser) || showSplash) {
    return (
      <div className="bg-black flex items-center justify-center h-screen">
        <SplashScreen />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <div className="relative z-10 h-full overflow-y-auto">
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        </Routes>
      </div>
      <Toaster />
    </div >
  );
};

export default App;