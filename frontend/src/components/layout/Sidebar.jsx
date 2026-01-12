import React from 'react';
import { Link } from 'react-router-dom';
import {
    Home,
    Users,
    Scroll,
    Bookmark,
    User,
    Plus,
    Hash,
    TrendingUp,
    Compass,
    Settings
} from 'lucide-react';
import { NavigationItem } from '../ui';
import ScrollSelector from '../features/scroll/ScrollSelector';
import useAuthStore from '../../store/useAuthStore';

const Sidebar = () => {
    const { authUser } = useAuthStore();

    return (
        <aside className="flex flex-col h-full w-56 bg-base-100 border-r border-base-200/60">
            {/* Scroll Selector */}
            <div className="px-3 py-4 border-b border-base-200/60">
                <ScrollSelector />
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                {/* Primary Actions */}
                <div className="mb-6">
                    <NavigationItem to="/new" icon={Plus} variant="primary">
                        New Echo
                    </NavigationItem>
                </div>

                {/* Main */}
                <div className="space-y-0.5 mb-6">
                    <NavigationItem to="/" icon={Home}>
                        Feed
                    </NavigationItem>
                    <NavigationItem to="/scrolls" icon={Scroll}>
                        My Scrolls
                    </NavigationItem>
                    <NavigationItem to="/browse-community" icon={Compass}>
                        Explore
                    </NavigationItem>
                </div>

                {/* Scrolls */}
                <div className="mb-6">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <span className="text-xs font-medium text-base-content/40 uppercase tracking-wider">
                            Scrolls
                        </span>
                        <Link
                            to="/scroll/new"
                            className="text-base-content/30 hover:text-base-content/60 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="space-y-0.5">
                        <NavigationItem to="/scrolls/feeds" icon={Scroll}>
                            Feeds
                        </NavigationItem>
                        <NavigationItem to="/scrolls/curations" icon={Bookmark}>
                            Curations
                        </NavigationItem>
                    </div>
                </div>

                {/* Discover */}
                <div className="mb-6">
                    <div className="px-2 mb-2">
                        <span className="text-xs font-medium text-base-content/40 uppercase tracking-wider">
                            Discover
                        </span>
                    </div>
                    <div className="space-y-0.5">
                        <NavigationItem to="/browse-community" icon={Users}>
                            Community
                        </NavigationItem>
                        <NavigationItem to="/browse/tags" icon={Hash}>
                            Tags
                        </NavigationItem>
                    </div>
                </div>
            </nav>

            {/* User */}
            <div className="p-3 border-t border-base-200/60">
                <NavigationItem to={`/user/${authUser?._id}`} icon={User}>
                    @{authUser?.userName}
                </NavigationItem>
                <NavigationItem to="/settings" icon={Settings}>
                    Settings
                </NavigationItem>
            </div>
        </aside>
    );
};

export default Sidebar;
