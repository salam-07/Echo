import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../layouts/Layout';
import EchoCard from '../components/EchoCard';
import {
    User,
    MessageCircle,
    Scroll,
    Calendar,
    UserPlus,
    UserMinus
} from 'lucide-react';
import { useProfileStore } from '../store/useProfileStore';
import { useAuthStore } from '../store/useAuthStore';

const UserPage = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('echos');
    const { authUser } = useAuthStore();
    const {
        profile,
        userEchos,
        userScrolls,
        isLoadingProfile,
        isLoadingUserEchos,
        isLoadingUserScrolls,
        getProfile,
        getUserEchos,
        getUserScrolls,
        clearProfile
    } = useProfileStore();

    useEffect(() => {
        if (id) {
            getProfile(id);
            getUserEchos(id);
            getUserScrolls(id, 'created');
        }

        // Clear profile data when component unmounts or id changes
        return () => clearProfile();
    }, [id]);

    // Handle loading state
    if (isLoadingProfile || !profile) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-base-100 rounded-box p-6 text-center border border-base-300">
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

    const isOwnProfile = authUser?._id === id;
    const isFollowing = authUser?.following?.includes(id);

    const handleFollowToggle = () => {
        // TODO: Implement follow/unfollow functionality
        console.log(isFollowing ? 'Unfollow' : 'Follow', profile.userName);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'echos':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{isOwnProfile ? 'My' : `${profile.userName}'s`} Echos</h3>
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
                                <p className="text-base-content/60 mb-4">
                                    {isOwnProfile ? "No echos yet" : `${profile.userName} hasn't posted any echos yet`}
                                </p>
                            </div>
                        )}
                    </div>
                );

            case 'scrolls':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{isOwnProfile ? 'My' : `${profile.userName}'s`} Scrolls</h3>
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
                                            <span>Created by @{profile.userName}</span>
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
                                <p className="text-base-content/60 mb-4">
                                    {isOwnProfile ? "No scrolls yet" : `${profile.userName} hasn't created any scrolls yet`}
                                </p>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                {/* Smaller Profile Header */}
                <div className="bg-base-100 rounded-box p-6 mb-6 border border-base-300">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        {/* Profile Picture */}
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-8 h-8 text-primary" />
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-base-content mb-1">@{profile.userName}</h1>
                            {profile.bio && (
                                <p className="text-base-content/80 mb-3 max-w-2xl text-sm">{profile.bio}</p>
                            )}

                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-4 text-sm">
                                <span className="text-base-content/70">
                                    <span className="font-semibold text-base-content">{userEchos?.length || 0}</span> echos
                                </span>
                                <span className="text-base-content/70">
                                    <span className="font-semibold text-base-content">{userScrolls?.length || 0}</span> scrolls
                                </span>
                                <span className="text-base-content/70">
                                    <span className="font-semibold text-base-content">{profile.followers?.length || 0}</span> followers
                                </span>
                                <span className="text-base-content/70">
                                    <span className="font-semibold text-base-content">{profile.following?.length || 0}</span> following
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {!isOwnProfile && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleFollowToggle}
                                    className={`btn btn-sm ${isFollowing ? 'btn-outline' : 'btn-primary'}`}
                                >
                                    {isFollowing ? (
                                        <>
                                            <UserMinus className="w-4 h-4 mr-2" />
                                            Unfollow
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Follow
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
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

export default UserPage;