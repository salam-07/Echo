import React, { useRef, useEffect } from 'react';

/**
 * The rest of what you can do with an entry, on a small sheet laid over the row.
 * Ink border, no shadow — the border is what says "over", the same as the modal.
 *
 * Destructive work is the one place colour is allowed, and it is still a word
 * first: `Delete echo`, in alarm, ruled off from the rest.
 */
const ITEM =
    'flex min-h-11 w-full items-center px-4 text-left text-[0.875rem] text-ink transition-colors hover:bg-ink hover:text-paper';

const EchoMenu = ({ setShowMenu, setShowAddToScroll, handleDelete, handleCopyLink, isOwnEcho }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setShowMenu(false);
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setShowMenu(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setShowMenu]);

    return (
        <div
            ref={menuRef}
            className="absolute bottom-12 right-0 z-30 w-56 border border-ink bg-paper"
        >
            <button type="button" onClick={handleCopyLink} className={ITEM}>
                Copy link
            </button>
            <button
                type="button"
                onClick={() => {
                    setShowMenu(false);
                    setShowAddToScroll(true);
                }}
                className={`${ITEM} border-t border-rule`}
            >
                Save to a Scroll
            </button>
            {isOwnEcho ? (
                <button
                    type="button"
                    onClick={handleDelete}
                    className="flex min-h-11 w-full items-center border-t border-rule px-4 text-left text-[0.875rem] text-alarm transition-colors hover:bg-alarm hover:text-chalk"
                >
                    Delete echo
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => setShowMenu(false)}
                    className={`${ITEM} border-t border-rule`}
                >
                    Report
                </button>
            )}
        </div>
    );
};

export default EchoMenu;
