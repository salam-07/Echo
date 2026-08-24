import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./store/useAuthStore";
import SplashScreen from "./components/ui/SplashScreen";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

import HomePage from "./pages/HomePage";
import WelcomePage from "./pages/WelcomePage";
import NewEcho from "./pages/NewEcho";
import EchoView from "./pages/EchoView";
import UserPage from "./pages/UserPage";
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
import SearchPage from "./pages/SearchPage";
import EchoSearchPage from "./pages/EchoSearchPage";
import ScrollSearchPage from "./pages/ScrollSearchPage";
import UserSearchPage from "./pages/UserSearchPage";

/**
 * A notice, printed. react-hot-toast portals to `body`, outside any scope, so
 * these values are written out rather than borrowed from a class: ink ground,
 * paper text, square, apparatus register. The library's status glyphs are
 * dropped — a notice in this world says what happened in words, and every
 * message the stores send already does.
 */
const NOTICE = {
    duration: 4000,
    icon: null,
    style: {
        background: "#1a1c1c",
        color: "#f9f9f9",
        borderRadius: 0,
        border: "1px solid #1a1c1c",
        padding: "0.875rem 1.125rem",
        maxWidth: "26rem",
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        fontSize: "0.8125rem",
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: "0.01em",
    },
};

const App = () => {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        checkAuth();
        const timer = setTimeout(() => setShowSplash(false), 1500);
        return () => clearTimeout(timer);
    }, [checkAuth]);

    /* The reader's motion preference, applied before any route paints. Settings
       writes it; the CSS reads it off the root alongside the OS setting. */
    useEffect(() => {
        if (localStorage.getItem("motion") === "reduce") {
            document.documentElement.setAttribute("data-motion", "reduce");
        }
    }, []);

    if ((isCheckingAuth && !authUser) || showSplash) {
        return <SplashScreen />;
    }

    return (
        <>
            {authUser ? (
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="/signup" element={<Navigate to="/" />} />
                    <Route path="/login" element={<Navigate to="/" />} />

                    <Route path="/profile" element={<UserPage />} />
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

                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/search/echos" element={<EchoSearchPage />} />
                    <Route path="/search/scrolls" element={<ScrollSearchPage />} />
                    <Route path="/search/users" element={<UserSearchPage />} />
                </Routes>
            ) : (
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            )}

            <Toaster position="bottom-center" toastOptions={NOTICE} />
        </>
    );
};

export default App;
