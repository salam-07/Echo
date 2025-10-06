import React, { useState } from 'react';
import Layout from '../layouts/Layout';
import {
    User,
    Calendar,
    Users,
    Scroll,
    Edit3
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('scrolls');
    const { authUser } = useAuthStore();

    // Handle loading state
    if (!authUser) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-base-100 rounded-box p-8 text-center">
                        <div className="loading loading-spinner loading-lg mx-auto mb-4"></div>
                        <p className="text-base-content/60">Loading profile...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const tabs = [
        { id: 'scrolls', label: 'Scrolls', icon: Scroll },
        { id: 'connections', label: 'Connections', icon: Users }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'scrolls':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">My Scrolls</h3>
                            <button className="btn btn-primary btn-sm">
                                <Edit3 className="w-4 h-4 mr-2" />
                                New Scroll
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {[1, 2, 3].map((scroll) => (
                                <div key={scroll} className="bg-base-200 rounded-box p-4 border border-base-300">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium">Sample Scroll {scroll}</h4>
                                        <span className="text-xs text-base-content/60">2 days ago</span>
                                    </div>
                                    <p className="text-base-content/70 text-sm mb-3">
                                        This is a sample scroll description that shows what the content might look like...
                                    </p>
                                    <div className="flex justify-between items-center text-sm text-base-content/60">
                                        <span>12 echoes</span>
                                        <span>45 views</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'connections':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Followers ({authUser.followers?.length?.toLocaleString() || 0})</h3>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((follower) => (
                                        <div key={follower} className="flex items-center gap-3 p-3 bg-base-200 rounded-box">
                                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">user{follower}</div>
                                                <div className="text-sm text-base-content/60">Joined recently</div>
                                            </div>
                                            <button className="btn btn-outline btn-sm">Follow</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Following ({authUser.following?.length || 0})</h3>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((following) => (
                                        <div key={following} className="flex items-center gap-3 p-3 bg-base-200 rounded-box">
                                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">following{following}</div>
                                                <div className="text-sm text-base-content/60">Active user</div>
                                            </div>
                                            <button className="btn btn-outline btn-sm">Unfollow</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                {/* Profile Header */}
                <div className="bg-base-100 rounded-box p-8 mb-6 border border-base-300">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

                        {/* Profile Info */}
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-base-content mb-2">@{authUser.userName}</h1>
                            <p className="text-base-content/80 mb-4 max-w-2xl">{authUser.bio || "No bio available"}</p>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-6 text-sm">
                                <span className="text-base-content/70">
                                    <span className="font-semibold text-base-content">{authUser.createdScrolls?.length || 0}</span> scrolls
                                </span>
                                <span className="text-base-content/70">
                                    <span className="font-semibold text-base-content">{authUser.followers?.length || 0}</span> followers
                                </span>
                                <span className="text-base-content/70">
                                    <span className="font-semibold text-base-content">{authUser.following?.length || 0}</span> following
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button className="btn btn-outline">
                                <Edit3 className="w-4 h-4 mr-2" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-base-100 rounded-box border border-base-300">
                    {/* Tab Navigation */}
                    <div className="border-b border-base-300">
                        <nav className="flex overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap
                                            ${activeTab === tab.id
                                                ? 'border-primary text-primary font-medium'
                                                : 'border-transparent text-base-content/60 hover:text-base-content hover:border-base-300'
                                            }
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;