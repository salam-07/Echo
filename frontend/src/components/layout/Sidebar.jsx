import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationItem } from '../ui';
import RuleDrum from '../features/scroll/RuleDrum';
import useAuthStore from '../../store/useAuthStore';

/**
 * The index column — the document's contents page, kept open beside whatever
 * sheet you are reading.
 *
 * The §-numbers are not ornament and not a sequence to be admired: they are the
 * addresses the running head prints back at you, so the place you are is named
 * the same way in two places at once. Held is inversion. Nothing here is an icon.
 *
 * One thing in this column is not a printed line: the rule drum. Everything else
 * here takes you somewhere; the drum *sets* something, and it is the one setting
 * the product is about. It is the only element in the column with a frame around
 * it, which is the whole reason it reads as the instrument and the rest reads as
 * contents.
 *
 * `onNavigate` closes the mobile contents overlay; on desktop it is not passed.
 */
const Sidebar = ({ onNavigate }) => {
    const { authUser, logout } = useAuthStore();

    return (
        <div className="flex h-full flex-col bg-paper">
            <div className="px-3 pt-5">
                <Link to="/new" onClick={onNavigate} className="act h-11 w-full px-5">
                    New Echo
                </Link>
                <Link
                    to="/scroll/new"
                    onClick={onNavigate}
                    className="act act-outline mt-2 h-11 w-full px-5"
                >
                    New Scroll
                </Link>
            </div>

            <nav className="mt-7 flex-1 overflow-y-auto pb-6">
                <p className="t-label border-b border-rule px-3 pb-2">Contents</p>
                <div className="mt-2">
                    <NavigationItem to="/" end reference="§01" onNavigate={onNavigate}>
                        Feed
                    </NavigationItem>
                    <NavigationItem to="/scrolls" reference="§02" onNavigate={onNavigate}>
                        Scrolls
                    </NavigationItem>
                    <NavigationItem to="/browse-community" reference="§03" onNavigate={onNavigate}>
                        Community
                    </NavigationItem>
                    <NavigationItem to="/search" reference="§04" onNavigate={onNavigate}>
                        Search
                    </NavigationItem>
                </div>

                <div className="mt-8">
                    <RuleDrum onNavigate={onNavigate} />
                </div>

                <div className="mt-8">
                    <p className="t-label border-b border-rule px-3 pb-2">Curations</p>
                    <div className="mt-2">
                        <NavigationItem to="/scrolls/curations" onNavigate={onNavigate}>
                            Your curations
                        </NavigationItem>
                        <NavigationItem to="/browse/tags" onNavigate={onNavigate}>
                            Tags
                        </NavigationItem>
                    </div>
                </div>
            </nav>

            <div className="border-t border-rule py-3">
                <NavigationItem to={`/user/${authUser?._id}`} onNavigate={onNavigate}>
                    @{authUser?.userName}
                </NavigationItem>
                <NavigationItem to="/settings" onNavigate={onNavigate}>
                    Settings
                </NavigationItem>
                <button
                    type="button"
                    onClick={logout}
                    className="t-label flex min-h-11 w-full items-center px-3 text-left text-ink-quiet transition-colors duration-200 hover:bg-paper-dim hover:text-ink"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
