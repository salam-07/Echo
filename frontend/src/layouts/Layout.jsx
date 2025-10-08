import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-30 w-64
                transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
            `}>
                <Sidebar />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex flex-1 overflow-hidden">
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>

                    {/* Right Fixed Column - Desktop Only */}
                    <aside className="hidden lg:block w-64 p-4">
                        <h1 className="text-primary text-lg m-2">Trending Tags</h1>
                        <ul className="menu bg-base-200/30 rounded-box w-full mb-4">
                            <li><a>Item 1</a></li>
                            <li><a>Item 2</a></li>
                            <li><a>Item 3</a></li>
                        </ul>
                        <ul className="menu bg-base-200/30 rounded-box w-full mb-2">
                            <li><a>Item 1</a></li>
                            <li><a>Item 2</a></li>
                            <li><a>Item 3</a></li>
                        </ul>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Layout;
