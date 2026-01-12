import React, { useState, memo, useCallback } from 'react';
import { useEchoStore } from '../../../store/useEchoStore';
import useAuthStore from '../../../store/useAuthStore';
import EchoHeader from './EchoHeader';
import EchoContent from './EchoContent';
import EchoActions from './EchoActions';
import EchoMenu from './EchoMenu';
import AddToScrollModal from './AddToScrollModal';

const EchoCard = memo(({ echo }) => {
    const { toggleLike, deleteEcho } = useEchoStore();
    const { authUser } = useAuthStore();
    const isLiked = echo.isLiked;
    const [showMenu, setShowMenu] = useState(false);
    const [showAddToScroll, setShowAddToScroll] = useState(false);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);
    const isOwnEcho = authUser?._id === echo.author?._id;

    const handleLike = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLikeAnimating(true);
        toggleLike(echo._id);
        setTimeout(() => setIsLikeAnimating(false), 300);
    }, [echo._id, toggleLike]);

    const handleDelete = useCallback(async () => {
        if (window.confirm('Are you sure you want to delete this echo?')) {
            try {
                await deleteEcho(echo._id);
                setShowMenu(false);
            } catch (error) {
                console.log('Error deleting echo:', error);
            }
        }
    }, [echo._id, deleteEcho]);

    const handleCopyLink = useCallback(() => {
        const link = `${window.location.origin}/echo/${echo._id}`;
        navigator.clipboard.writeText(link);
        setShowMenu(false);
    }, [echo._id]);

    const handleToggleMenu = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMenu(prev => !prev);
    }, []);

    const handleBookmark = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowAddToScroll(true);
    }, []);

    const handleCloseAddToScroll = useCallback(() => {
        setShowAddToScroll(false);
    }, []);

    return (
        <article className="group relative w-full">
            <div className="py-4 sm:py-5 border-b border-base-200/40">
                <div className="space-y-2.5 sm:space-y-3">
                    <EchoHeader echo={echo} onToggleMenu={handleToggleMenu} />
                    <EchoContent echo={echo} />
                    <EchoActions
                        echo={echo}
                        isLiked={isLiked}
                        isLikeAnimating={isLikeAnimating}
                        onLike={handleLike}
                        onToggleMenu={handleToggleMenu}
                        onBookmark={handleBookmark}
                    />
                </div>
            </div>

            {showMenu && (
                <EchoMenu
                    showMenu={showMenu}
                    setShowMenu={setShowMenu}
                    setShowAddToScroll={setShowAddToScroll}
                    handleDelete={handleDelete}
                    handleCopyLink={handleCopyLink}
                    isOwnEcho={isOwnEcho}
                />
            )}

            {showAddToScroll && (
                <AddToScrollModal
                    echoId={echo._id}
                    onClose={handleCloseAddToScroll}
                />
            )}
        </article>
    );
});

EchoCard.displayName = 'EchoCard';

export default EchoCard;