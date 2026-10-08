import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationItem } from '../ui';
import useAuthStore from '../../store/useAuthStore';

/** Primary navigation, shared by the desktop sidebar and mobile menu. */
const Sidebar = ({ onNavigate }) => {
    const { authUser } = useAuthStore();

    return (
        <div className="flex h-full flex-col bg-paper">
            <div className="px-3 pt-5">
                <Link to="/new" onClick={onNavigate} className="act h-11 w-full px-5">
                    Post an Echo
                </Link>
                <Link
                    to="/scroll/new"
                    onClick={onNavigate}
                    className="act act-quiet mt-2 h-11 w-full px-5"
                >
                    Create a Scroll
                </Link>
            </div>

            <nav aria-label="Main navigation" className="mt-6 min-h-0 flex-1 overflow-y-auto pb-6">
                <NavigationItem to="/" end onNavigate={onNavigate}>
                    Feed
                </NavigationItem>
                <NavigationItem to="/scrolls" end onNavigate={onNavigate}>
                    Scrolls
                </NavigationItem>
                <NavigationItem to="/scrolls/curations" onNavigate={onNavigate}>
                    Curations
                </NavigationItem>
                <NavigationItem to="/community" onNavigate={onNavigate}>
                    Community
                </NavigationItem>
                <NavigationItem to="/browse/tags" onNavigate={onNavigate}>
                    Tags
                </NavigationItem>
            </nav>

            <div className="border-t border-rule py-3">
                <NavigationItem to={`/user/${authUser?._id}`} onNavigate={onNavigate}>
                    @{authUser?.userName}
                </NavigationItem>
            </div>
        </div>
    );
};

export default Sidebar;
