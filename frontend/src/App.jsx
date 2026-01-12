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
    <>
      {authUser ? (
        <div className="relative h-screen w-full bg-base-100 overflow-hidden">
          <div className="relative z-10 h-full overflow-hidden">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<Navigate to="/" />} />
              <Route path="/login" element={<Navigate to="/" />} />

              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/user/:id" element={<UserPage />} />

              <Route path="/echo/:id" element={<EchoView />} />
              <Route path="/tag/:tagName" element={<TagsPage />} />
              <Route path="/new" element={<NewEcho />} />

              <Route path="/scrolls" element={<ScrollsPage />} />
              <Route path="/scrolls/feeds" element={<FeedScrollsPage />} />
              <Route path="/scrolls/curations" element={<CurationScrollsPage />} />
              <Route path="/scroll/new" element={<NewScrollPage />} />
              <Route path="/scroll/:id" element={<ScrollViewPage />} />

              <Route path="/community" element={<BrowseCommunityPage />} />
              <Route path="/browse/scrolls" element={<BrowseScrollsPage />} />
              <Route path="/browse/curation" element={<BrowseCurationPage />} />
              <Route path="/browse/tags" element={<BrowseTagsPage />} />
              <Route path="/browse/popular" element={<PopularEchosPage />} />
              <Route path="/browse-community" element={<BrowseCommunityPage />} />
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
        </div>
      ) : (
        <div className="bg-base-100">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" />} />
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
      )}
    </>
  );
};

export default App;