import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/useAuthStore';
import { Moon, Sun, LogOut, User, Mail, Calendar, ChevronRight } from 'lucide-react';

const SettingsPage = () => {
    const { logout, authUser } = useAuthStore();
    const [theme, setTheme] = useState('light');

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    // Handle theme toggle
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // Handle logout
    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await logout();
        }
    };

    return (
        <Layout>
            <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">
                        Settings
                    </h1>
                    <p className="text-base-content/40">
                        Manage your preferences
                    </p>
                </div>

                {/* Settings Groups */}
                <div className="space-y-8">
                    {/* Account Info Section */}
                    <section>
                        <h2 className="text-xs font-medium text-base-content/30 uppercase tracking-wider mb-4">
                            Account
                        </h2>
                        <div className="space-y-0 border border-base-content/5 rounded-xl overflow-hidden">
                            {/* Username */}
                            <div className="flex items-center justify-between px-4 py-4 bg-base-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-base-content/5 flex items-center justify-center">
                                        <User className="w-4 h-4 text-base-content/40" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-base-content/40">Username</p>
                                        <p className="text-base-content font-medium">@{authUser?.userName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-base-content/5" />

                            {/* Email */}
                            <div className="flex items-center justify-between px-4 py-4 bg-base-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-base-content/5 flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-base-content/40" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-base-content/40">Email</p>
                                        <p className="text-base-content font-medium">{authUser?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-base-content/5" />

                            {/* Joined */}
                            <div className="flex items-center justify-between px-4 py-4 bg-base-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-base-content/5 flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-base-content/40" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-base-content/40">Joined</p>
                                        <p className="text-base-content font-medium">
                                            {authUser?.createdAt && new Date(authUser.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Appearance Section */}
                    <section>
                        <h2 className="text-xs font-medium text-base-content/30 uppercase tracking-wider mb-4">
                            Appearance
                        </h2>
                        <div className="border border-base-content/5 rounded-xl overflow-hidden">
                            <div
                                className="flex items-center justify-between px-4 py-4 bg-base-100 cursor-pointer"
                                onClick={toggleTheme}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === ' ' || e.key === 'Enter') {
                                        e.preventDefault();
                                        toggleTheme();
                                    }
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-base-content/5 flex items-center justify-center">
                                        {theme === 'dark' ? (
                                            <Moon className="w-4 h-4 text-base-content/40" />
                                        ) : (
                                            <Sun className="w-4 h-4 text-base-content/40" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-base-content font-medium">Dark Mode</p>
                                        <p className="text-sm text-base-content/40">
                                            {theme === 'dark' ? 'On' : 'Off'}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={`relative w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-base-content/30' : 'bg-base-content/10'
                                        }`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-base-content rounded-full transition-all ${theme === 'dark' ? 'left-6' : 'left-1'
                                        }`} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section>
                        <h2 className="text-xs font-medium text-base-content/30 uppercase tracking-wider mb-4">
                            Session
                        </h2>
                        <div className="border border-base-content/5 rounded-xl overflow-hidden">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-between px-4 py-4 bg-base-100 hover:bg-base-content/[0.02] transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center">
                                        <LogOut className="w-4 h-4 text-error/70" />
                                    </div>
                                    <div>
                                        <p className="text-error/80 font-medium">Sign Out</p>
                                        <p className="text-sm text-base-content/40">
                                            Sign out of your account
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-base-content/20" />
                            </button>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-base-content/5 text-center">
                    <p className="text-xs text-base-content/20">
                        Echo v1.0.0
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default SettingsPage;