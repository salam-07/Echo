import React, { useState, memo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useEchoStore } from '../../../store/useEchoStore';
import useAuthStore from '../../../store/useAuthStore';
import EchoHeader from './EchoHeader';
import EchoContent from './EchoContent';
import EchoActions from './EchoActions';
import EchoMenu from './EchoMenu';
import AddToScrollModal from './AddToScrollModal';

/**
 * One entry in the corpus. Byline, then the text, then the tags it was filed
 * under, then what you can do about it — in that order, ruled off below.
 *
 * No box, no avatar, no hover lift. The row is a row of a printed document, and
 * the only thing in it that changes appearance is the word you are pointing at.
 */
const EchoCard = memo(({ echo }) => {
    const { toggleLike, deleteEcho } = useEchoStore();
    const { authUser } = useAuthStore();
    const [showMenu, setShowMenu] = useState(false);
    const [showAddToScroll, setShowAddToScroll] = useState(false);
    const isOwnEcho = authUser?._id === echo.author?._id;

    const handleLike = useCallback(() => {
        toggleLike(echo._id);
    }, [echo._id, toggleLike]);

    const handleDelete = useCallback(async () => {
        if (!window.confirm('Delete this echo? This cannot be undone.')) return;
        try {
            await deleteEcho(echo._id);
            setShowMenu(false);
        } catch {
            // deleteEcho raises its own toast; the row simply stays put.
        }
    }, [echo._id, deleteEcho]);

    const handleCopyLink = useCallback(async () => {
        setShowMenu(false);
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/echo/${echo._id}`);
            toast.success('Link copied');
        } catch {
            toast.error('Couldn’t copy the link');
        }
    }, [echo._id]);

    return (
        <article className="relative border-b border-rule py-6">
            <EchoHeader echo={echo} />
            <EchoContent echo={echo} />
            <EchoActions
                echo={echo}
                isLiked={echo.isLiked}
                onLike={handleLike}
                onToggleMenu={() => setShowMenu((prev) => !prev)}
                onSave={() => setShowAddToScroll(true)}
                menuOpen={showMenu}
            />

            {showMenu && (
                <EchoMenu
                    setShowMenu={setShowMenu}
                    setShowAddToScroll={setShowAddToScroll}
                    handleDelete={handleDelete}
                    handleCopyLink={handleCopyLink}
                    isOwnEcho={isOwnEcho}
                />
            )}

            {showAddToScroll && (
                <AddToScrollModal echoId={echo._id} onClose={() => setShowAddToScroll(false)} />
            )}
        </article>
    );
});

EchoCard.displayName = 'EchoCard';

export default EchoCard;
