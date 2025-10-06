import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Settings, LogOut } from 'lucide-react';


const sidebarItems = [
    { to: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { to: '/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

const Sidebar = () => {
    return (
        <aside className="flex flex-col h-full w-60 bg-base-100 border-r border-base-300">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 p-6 border-b border-base-300">
                <span className="text-lg font-medium text-base-content">Echo</span>
            </div>

            {/* Scrollable Content */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="relative flex items-center pl-12 py-3 rounded-md hover:bg-base-200 transition-all duration-200 text-base-content group"
                    >
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 group-hover:text-base-content/60 transition-colors">
                            {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 z-10 p-4 border-t border-base-300">
                <button className="flex items-center gap-3 w-full text-left py-3 px-3 rounded-md hover:bg-base-200 transition-all duration-200 text-base-content/70 hover:text-base-content">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;