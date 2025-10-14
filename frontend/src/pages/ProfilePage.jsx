import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import EchoCard from '../components/features/echo/EchoCard';
import { Button, Card } from '../components/ui';
import {
    User,
    MessageCircle,
    Scroll,
    Edit3,
    Calendar
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('echos');
    const { authUser } = useAuthStore();
    const {
        myProfile,
        userEchos,
        userScrolls,
        isLoadingMyProfile,
        isLoadingUserEchos,
        isLoadingUserScrolls,
        getMyProfile,
        getUserEchos,
        getUserScrolls
    } = useProfileStore();

    useEffect(() => {
        if (authUser?._id) {
            getMyProfile();
            getUserEchos(authUser._id);
            getUserScrolls(authUser._id, 'created');
        }
    }, [authUser?._id]);

    // Handle loading state
    if (!authUser) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto p-3 sm:p-6">
                    <div className="bg-base-100 rounded-box p-8 text-center">
                        <div className="loading loading-spinner loading-lg mx-auto mb-4"></div>
                        <p className="text-base-content/60">Loading profile...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const tabs = [
        { id: 'echos', label: 'Echos', icon: MessageCircle },
        { id: 'scrolls', label: 'Scrolls', icon: Scroll }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'echos':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">My Echos</h3>
                            <Link to="/create-echo">
                                <Button variant="primary" size="sm" className="flex items-center gap-2">
                                    <Edit3 className="w-4 h-4" />
                                    New Echo
                                </Button>
                            </Link>
                        </div>

                        {isLoadingUserEchos ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-base-200 rounded-box p-4 animate-pulse">
                                        <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-base-300 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : userEchos?.length > 0 ? (
                            <div className="space-y-0">
                                {userEchos.map((echo) => (
                                    <EchoCard key={echo._id} echo={echo} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <MessageCircle className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
                                <p className="text-base-content/60 mb-4">No echos yet</p>
                                <Link to="/create-echo" className="btn btn-primary btn-sm">
                                    Create your first echo
                                </Link>
                            </div>
                        )}
                    </div>
                );

            case 'scrolls':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">My Scrolls</h3>
                            <Link to="/create-scroll" className="btn btn-primary btn-sm">
                                <Edit3 className="w-4 h-4 mr-2" />
                                New Scroll
                            </Link>
                        </div>

                        {isLoadingUserScrolls ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-base-200 rounded-box p-4 animate-pulse">
                                        <div className="h-5 bg-base-300 rounded w-1/2 mb-2"></div>
                                        <div className="h-4 bg-base-300 rounded w-3/4 mb-3"></div>
                                        <div className="h-3 bg-base-300 rounded w-1/4"></div>
                                    </div>
                                ))}
                            </div>
                        ) : userScrolls?.length > 0 ? (
                            <div className="space-y-4">
                                {userScrolls.map((scroll) => (
                                    <Link
                                        key={scroll._id}
                                        to={`/scroll/${scroll._id}`}
                                        className="block bg-base-200 rounded-box p-4 border border-base-300 hover:bg-base-300 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium text-base-content">{scroll.name}</h4>
                                            <span className="text-xs text-base-content/60">
                                                {new Date(scroll.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {scroll.description && (
                                            <p className="text-base-content/70 text-sm mb-3 line-clamp-2">
                                                {scroll.description}
                                            </p>
                                        )}

                                        <div className="flex justify-between items-center text-sm text-base-content/60">
                                            <span>Created by you</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(scroll.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Scroll className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
                                <p className="text-base-content/60 mb-4">No scrolls yet</p>
                                <Link to="/create-scroll" className="btn btn-primary btn-sm">
                                    Create your first scroll
                                </Link>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    // Use myProfile data if available, fallback to authUser
    const profileData = myProfile || authUser;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-3 sm:p-6">
                {/* Profile Header */}
                <div className="bg-base-100 rounded-box p-8 mb-6 border border-base-300">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

                        {/* Profile Info */}
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-base-content mb-2">@{profileData?.userName}</h1>
                            <p className="text-base-content/80 mb-4 max-w-2xl">{profileData?.bio || "No bio available"}</p>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-6 text-sm">
                                <span className="text-base-content/70">
                                    <span className="font-semibold text-base-content">{userEchos?.length || 0}</span> echos
                                </span>
                                <span className="text-base-content/70">
                                    <span className="font-semibold text-base-content">{userScrolls?.length || 0}</span> scrolls
                                </span>
                                <span className="text-base-content/70">
                                    <span className="font-semibold text-base-content">{profileData?.followers?.length || 0}</span> followers
                                </span>
                                <span className="text-base-content/70">
                                    <span className="font-semibold text-base-content">{profileData?.following?.length || 0}</span> following
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