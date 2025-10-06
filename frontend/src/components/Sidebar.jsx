import React from 'react';
import { Link } from 'react-router-dom';
import {
    Home,
    Users,
    Compass,
    Scroll,
    Bookmark,
    Archive,
    Eye,
    User,
    Settings
} from 'lucide-react';
import ScrollSelector from './ScrollSelector';

const Sidebar = () => {
    return (
        <aside className="flex flex-col h-full w-60 bg-base-100 border-r border-base-300">
            {/* Header - Scroll Selector */}
            <div className="p-4 border-b border-base-300">
                <ScrollSelector />
            </div>

            {/* Scrollable Content */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Main Navigation - No heading */}
                <div className="space-y-1">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/80 hover:text-base-content"
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Home</span>
                    </Link>
                    <Link
                        to="/community"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/80 hover:text-base-content"
                    >
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Community</span>
                    </Link>
                    <Link
                        to="/explore"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/80 hover:text-base-content"
                    >
                        <Compass className="w-5 h-5" />
                        <span className="font-medium">Explore</span>
                    </Link>
                </div>

                {/* Scrolls Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide">
                            Scrolls
                        </h3>
                        <button className="p-1 rounded hover:bg-base-200 transition-colors">
                            <div className="w-4 h-4 rounded-full bg-base-content/20 flex items-center justify-center">
                                <span className="text-xs text-base-content/60">+</span>
                            </div>
                        </button>
                    </div>
                    <div className="space-y-1">
                        <Link
                            to="/scrolls/my"
                            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/80 hover:text-base-content group"
                        >
                            <div className="flex items-center gap-3">
                                <Scroll className="w-4 h-4" />
                                <span className="text-sm">My Scrolls</span>
                            </div>
                            <span className="text-xs bg-base-content/10 text-base-content/60 px-1.5 py-0.5 rounded">4</span>
                        </Link>
                        <Link
                            to="/scrolls/saved"
                            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/80 hover:text-base-content group"
                        >
                            <div className="flex items-center gap-3">
                                <Bookmark className="w-4 h-4" />
                                <span className="text-sm">Saved Scrolls</span>
                            </div>
                            <span className="text-xs bg-base-content/10 text-base-content/60 px-1.5 py-0.5 rounded">12</span>
                        </Link>
                        <Link
                            to="/scrolls/archive"
                            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/80 hover:text-base-content group"
                        >
                            <div className="flex items-center gap-3">
                                <Archive className="w-4 h-4" />
                                <span className="text-sm">Archive Scrolls</span>
                            </div>
                            <span className="text-xs bg-base-content/10 text-base-content/60 px-1.5 py-0.5 rounded">8</span>
                        </Link>
                        <button className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg hover:bg-base-200 transition-colors text-base-content/60 hover:text-base-content">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">View All</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-base-300 space-y-1">
                <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/80 hover:text-base-content"
                >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                </Link>
                <Link
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/80 hover:text-base-content"
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;