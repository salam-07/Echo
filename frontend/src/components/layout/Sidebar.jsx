import React from 'react';
import { Link } from 'react-router-dom';
import {
    Home,
    Users,
    Compass,
    Scroll,
    Bookmark,
    Eye,
    User,
    Plus,
    Hash,
    TrendingUp,
    BookOpen,
    CompassIcon,
    Settings
} from 'lucide-react';
import { NavigationItem, SectionHeader, IconButton } from '../ui';
import ScrollSelector from '../features/scroll/ScrollSelector';
import useAuthStore from '../../store/useAuthStore';

const Sidebar = () => {
    const { authUser } = useAuthStore();

    return (
        <aside className="flex flex-col h-full w-60 bg-base-100 border-r border-base-300">
            {/* Header - Scroll Selector */}
            <div className="p-4 border-b border-base-300">
                <ScrollSelector />
            </div>

            {/* Scrollable Content */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Main Navigation */}
                <div className="space-y-1">
                    <NavigationItem to="/new" icon={Plus} variant="primary">
                        Create Echo
                    </NavigationItem>
                    <NavigationItem to="/" icon={Home}>
                        Feed
                    </NavigationItem>
                    <NavigationItem to="/scrolls" icon={Scroll}>
                        Scrolls
                    </NavigationItem>
                    <NavigationItem to="/browse-community" icon={CompassIcon}>
                        Explore
                    </NavigationItem>
                </div>

                {/* Scrolls Section */}
                <div>
                    <SectionHeader
                        title="Scrolls"
                        action={
                            <Link to="/scroll/new">
                                <IconButton size="sm" variant="ghost">
                                    <Plus className="w-4 h-4 text-base-content/60" />
                                </IconButton>
                            </Link>
                        }
                    />
                    <div className="space-y-1">
                        <NavigationItem to="/scrolls/feeds" icon={Scroll}>
                            Feed Scrolls
                        </NavigationItem>
                        <NavigationItem to="/scrolls/curations" icon={Bookmark}>
                            Curation Scrolls
                        </NavigationItem>
                        <NavigationItem to="/scrolls" icon={Eye}>
                            View All
                        </NavigationItem>
                    </div>
                </div>

                {/* Browse Section */}
                <div>
                    <SectionHeader title="Browse" />
                    <div className="space-y-1">
                        <NavigationItem to="/browse-community" icon={Users}>
                            Community Scroll
                        </NavigationItem>
                        <NavigationItem to="/browse/tags" icon={Hash}>
                            Tags
                        </NavigationItem>
                        <NavigationItem to="/browse/popular" icon={TrendingUp}>
                            Popular
                        </NavigationItem>
                    </div>
                </div>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-base-300 space-y-1">
                <NavigationItem
                    to={`/user/${authUser?._id}`}
                    icon={User}
                    variant="active"
                >
                    @{authUser?.userName}
                </NavigationItem>
                <NavigationItem
                    to={`/settings`}
                    icon={Settings}
                >
                    Settings
                </NavigationItem>
            </div>
        </aside>
    );
};

export default Sidebar;
