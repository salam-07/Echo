import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import EchoCard from '../components/features/echo/EchoCard';
import {
    MessageCircle,
    Scroll,
    Edit3,
    Users,
    UserPlus,
    UserMinus,
    Layers,
    Filter,
    ArrowRight
} from 'lucide-react';
import { useProfileStore } from '../store/useProfileStore';
import { useAuthStore } from '../store/useAuthStore';

const UserPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('echos');
    const { authUser } = useAuthStore();
    const {
        profile,
        myProfile,
        userEchos,
        userScrolls,
        isLoadingProfile,
        isLoadingMyProfile,
        isLoadingUserEchos,
        isLoadingUserScrolls,
        getProfile,
        getMyProfile,
        getUserEchos,
        getUserScrolls,
        clearProfile
    } = useProfileStore();

    // Determine if viewing own profile
    const isOwnProfile = !id || id === authUser?._id;
    const targetUserId = isOwnProfile ? authUser?._id : id;

    useEffect(() => {
        if (isOwnProfile && authUser?._id) {
            // Viewing own profile
            getMyProfile();
            getUserEchos(authUser._id);
            getUserScrolls(authUser._id, 'created');
        } else if (id) {
            // Viewing someone else's profile
            getProfile(id);
            getUserEchos(id);
            getUserScrolls(id, 'created');
        }

        return () => clearProfile();
    }, [id, authUser?._id, isOwnProfile]);

    // Get the appropriate profile data
    const profileData = isOwnProfile ? (myProfile || authUser) : profile;
    const isLoading = isOwnProfile ? isLoadingMyProfile : isLoadingProfile;

    // Handle loading state
    if (isLoading || !profileData) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-base-content/20 border-t-base-content/60 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-base-content/40 text-sm">Loading profile...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const isFollowing = authUser?.following?.includes(id);

    const handleFollowToggle = () => {
        // TODO: Implement follow/unfollow functionality
        console.log(isFollowing ? 'Unfollow' : 'Follow', profileData.userName);
    };

    const stats = [
        { label: 'Echos', value: userEchos?.length || 0 },
        { label: 'Scrolls', value: userScrolls?.length || 0 },
        { label: 'Followers', value: profileData?.followers?.length || 0 },
        { label: 'Following', value: profileData?.following?.length || 0 },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'echos':
                return (
                    <div className="space-y-0">
                        {isLoadingUserEchos ? (
                            <div className="space-y-0">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="py-6 border-b border-base-content/5 animate-pulse">
                                        <div className="h-4 bg-base-content/5 rounded w-1/4 mb-3"></div>
                                        <div className="h-3 bg-base-content/5 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-base-content/5 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : userEchos?.length > 0 ? (
                            userEchos.map((echo) => (
                                <EchoCard key={echo._id} echo={echo} />
                            ))
                        ) : (
                            <div className="py-16 text-center">
                                <MessageCircle className="w-10 h-10 mx-auto text-base-content/10 mb-4" strokeWidth={1} />
                                <p className="text-base-content/40 text-sm mb-6">
                                    {isOwnProfile ? 'No echos yet' : `@${profileData.userName} hasn't posted any echos yet`}
                                </p>
                                {isOwnProfile && (
                                    <Link
                                        to="/create-echo"
                                        className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-base-content transition-colors"
                                    >
                                        Create your first echo
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                );

            case 'scrolls':
                return (
                    <div className="space-y-0">
                        {isLoadingUserScrolls ? (
                            <div className="space-y-0">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="py-6 border-b border-base-content/5 animate-pulse">
                                        <div className="h-4 bg-base-content/5 rounded w-1/3 mb-3"></div>
                                        <div className="h-3 bg-base-content/5 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : userScrolls?.length > 0 ? (
                            userScrolls.map((scroll) => (
                                <Link
                                    key={scroll._id}
                                    to={`/scroll/${scroll._id}`}
                                    className="group block py-5 border-b border-base-content/5 last:border-0"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="w-6 h-6 rounded flex items-center justify-center bg-base-content/5">
                                                    {scroll.type === 'feed' ? (
                                                        <Filter className="w-3 h-3 text-base-content/40" />
                                                    ) : (
                                                        <Layers className="w-3 h-3 text-base-content/40" />
                                                    )}
                                                </div>
                                                <h4 className="font-medium text-base-content group-hover:text-base-content/70 transition-colors truncate">
                                                    {scroll.name}
                                                </h4>
                                            </div>
                                            {scroll.description && (
                                                <p className="text-sm text-base-content/40 line-clamp-1 ml-9">
                                                    {scroll.description}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs text-base-content/30 shrink-0">
                                            {scroll.type === 'curation' && `${scroll.echos?.length || 0} echos`}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="py-16 text-center">
                                <Scroll className="w-10 h-10 mx-auto text-base-content/10 mb-4" strokeWidth={1} />
                                <p className="text-base-content/40 text-sm mb-6">
                                    {isOwnProfile ? 'No scrolls yet' : `@${profileData.userName} hasn't created any scrolls yet`}
                                </p>
                                {isOwnProfile && (
                                    <Link
                                        to="/create-scroll"
                                        className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-base-content transition-colors"
                                    >
                                        Create your first scroll
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}
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
            <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
                {/* Hero Section - Large Username */}
                <div className="mb-12">
                    {/* Username - Hero Element */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-base-content tracking-tight mb-4">
                        @{profileData?.userName}
                    </h1>

                    {/* Bio */}
                    <p className="text-lg text-base-content/50 max-w-xl leading-relaxed mb-8">
                        {profileData?.bio || (isOwnProfile ? "No bio yet" : "")}
                    </p>

                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-6 sm:gap-10 mb-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="group">
                                <div className="text-2xl sm:text-3xl font-semibold text-base-content mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-xs text-base-content/30 uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Button */}
                    {isOwnProfile ? (
                        <Link
                            to="/settings"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-base-content/70 border border-base-content/10 rounded-full hover:border-base-content/20 hover:text-base-content transition-all"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Profile
                        </Link>
                    ) : (
                        <button
                            onClick={handleFollowToggle}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-full transition-all ${isFollowing
                                    ? 'text-base-content/70 border border-base-content/10 hover:border-base-content/20 hover:text-base-content'
                                    : 'bg-base-content text-base-100 hover:bg-base-content/90'
                                }`}
                        >
                            {isFollowing ? (
                                <>
                                    <UserMinus className="w-4 h-4" />
                                    Unfollow
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Follow
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Divider */}
                <div className="h-px bg-base-content/5 mb-8" />

                {/* Tabs */}
                <div className="flex gap-8 mb-8">
                    {[
                        { id: 'echos', label: 'Echos', count: userEchos?.length || 0 },
                        { id: 'scrolls', label: 'Scrolls', count: userScrolls?.length || 0 }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative pb-2 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'text-base-content'
                                    : 'text-base-content/30 hover:text-base-content/50'
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-2 ${activeTab === tab.id ? 'text-base-content/50' : 'text-base-content/20'}`}>
                                {tab.count}
                            </span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-base-content" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div>
                    {renderTabContent()}
                </div>
            </div>
        </Layout>
    );
};

export default UserPage;