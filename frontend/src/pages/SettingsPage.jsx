import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/useAuthStore';
import { Settings, Moon, Sun, LogOut, Palette } from 'lucide-react';

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
            <div className="max-w-2xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-base-content flex items-center gap-3">
                        <Settings className="w-7 h-7 text-primary" />
                        Settings
                    </h1>
                    <p className="text-base-content/60 mt-1">
                        Manage your account preferences and settings
                    </p>
                </div>

                {/* Settings Sections */}
                <div className="space-y-6">
                    {/* Theme Settings */}
                    <div className="bg-base-100 border border-base-300 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Palette className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-base-content">
                                Appearance
                            </h2>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-base-content">
                                    Dark Mode
                                </h3>
                                <p className="text-sm text-base-content/60">
                                    Switch between light and dark themes
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Sun className={`w-4 h-4 transition-colors ${theme === 'light' ? 'text-primary' : 'text-base-content/40'
                                    }`} />
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={theme === 'dark'}
                                    onChange={toggleTheme}
                                />
                                <Moon className={`w-4 h-4 transition-colors ${theme === 'dark' ? 'text-primary' : 'text-base-content/40'
                                    }`} />
                            </div>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="bg-base-100 border border-base-300 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <LogOut className="w-5 h-5 text-error" />
                            <h2 className="text-lg font-semibold text-base-content">
                                Account
                            </h2>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-base-content">
                                    Sign Out
                                </h3>
                                <p className="text-sm text-base-content/60">
                                    Sign out of your account on this device
                                </p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="btn btn-error btn-outline gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-base-100 border border-base-300 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-5 h-5 bg-primary rounded-full"></div>
                            <h2 className="text-lg font-semibold text-base-content">
                                Account Information
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-base-content/70">
                                    Username
                                </span>
                                <span className="text-sm text-base-content font-medium">
                                    @{authUser?.userName}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-base-content/70">
                                    Email
                                </span>
                                <span className="text-sm text-base-content font-medium">
                                    {authUser?.email}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-base-content/70">
                                    Joined
                                </span>
                                <span className="text-sm text-base-content font-medium">
                                    {authUser?.createdAt && new Date(authUser.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SettingsPage;