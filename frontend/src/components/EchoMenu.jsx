import React, { useRef, useEffect } from 'react';
import { Trash2, Bookmark, Copy, Flag } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const EchoMenu = ({
    showMenu,
    setShowMenu,
    setShowAddToScroll,
    handleDelete,
    handleCopyLink,
    isOwnEcho
}) => {
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu, setShowMenu]);

    return showMenu ? (
        <div ref={menuRef} className="absolute right-0 top-full mt-1 w-48 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 py-1">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCopyLink();
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-base-content hover:bg-base-200 transition-colors"
            >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowMenu(false);
                    setShowAddToScroll(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-base-content hover:bg-base-200 transition-colors"
            >
                <Bookmark className="w-4 h-4" />
                <span>Save to Scroll</span>
            </button>
            {isOwnEcho ? (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Echo</span>
                </button>
            ) : (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMenu(false);
                        // TODO: Implement report
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-base-content hover:bg-base-200 transition-colors"
                >
                    <Flag className="w-4 h-4" />
                    <span>Report</span>
                </button>
            )}
        </div>
    ) : null;
};

export default EchoMenu;
