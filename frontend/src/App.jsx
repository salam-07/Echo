import React from "react";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import TagsPage from "./pages/TagsPage";
import ScrollsPage from "./pages/ScrollsPage";
import FeedScrollsPage from "./pages/FeedScrollsPage";
import CurationScrollsPage from "./pages/CurationScrollsPage";
import NewScrollPage from "./pages/NewScrollPage";
import ScrollViewPage from "./pages/ScrollViewPage";
import BrowseCommunityPage from "./pages/BrowseCommunityPage";
import BrowseScrollsPage from "./pages/BrowseScrollsPage";
import BrowseCurationPage from "./pages/BrowseCurationPage";
import BrowseTagsPage from "./pages/BrowseTagsPage";
import PopularEchosPage from "./pages/PopularEchosPage";
import LandingPage from "./pages/LandingPage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, useState } from "react";

import { Toaster } from "react-hot-toast";

import { Loader } from "lucide-react";

import SplashScreen from "./components/ui/SplashScreen";
import UserPage from "./pages/UserPage";
import EchoView from "./pages/EchoView";
import NewEcho from "./pages/NewEcho";



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
      <div className="bg-base-100 flex items-center justify-center h-screen">
        <SplashScreen />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-base-100 overflow-hidden">
      <div className="relative z-10 h-full overflow-y-auto">
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <LandingPage />} />

          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />

          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/" />} />
          <Route path="/user/:id" element={authUser ? <UserPage /> : <Navigate to="/" />} />

          <Route path="/echo/:id" element={authUser ? <EchoView /> : <Navigate to="/" />} />
          <Route path="/tag/:tagName" element={authUser ? <TagsPage /> : <Navigate to="/" />} />
          <Route path="/new" element={authUser ? <NewEcho /> : <Navigate to="/" />} />

          <Route path="/scrolls" element={authUser ? <ScrollsPage /> : <Navigate to="/" />} />
          <Route path="/scrolls/feeds" element={authUser ? <FeedScrollsPage /> : <Navigate to="/" />} />
          <Route path="/scrolls/curations" element={authUser ? <CurationScrollsPage /> : <Navigate to="/" />} />
          <Route path="/scroll/new" element={authUser ? <NewScrollPage /> : <Navigate to="/" />} />
          <Route path="/scroll/:id" element={authUser ? <ScrollViewPage /> : <Navigate to="/" />} />

          <Route path="/community" element={authUser ? <BrowseCommunityPage /> : <Navigate to="/" />} />
          <Route path="/browse/scrolls" element={authUser ? <BrowseScrollsPage /> : <Navigate to="/" />} />
          <Route path="/browse/curation" element={authUser ? <BrowseCurationPage /> : <Navigate to="/" />} />
          <Route path="/browse/tags" element={authUser ? <BrowseTagsPage /> : <Navigate to="/" />} />
          <Route path="/browse/popular" element={authUser ? <PopularEchosPage /> : <Navigate to="/" />} />
          <Route path="/browse-community" element={authUser ? <BrowseCommunityPage /> : <Navigate to="/" />} />

        </Routes>

        <Toaster
          toastOptions={{
            success: {
              style: {
                background: 'black',
                color: '#cacaca',
              },
            },
            error: {
              style: {
                background: 'black',
                color: '#cacaca',
              },
            },
          }}
        />
      </div>
    </div >
  );
};

export default App;