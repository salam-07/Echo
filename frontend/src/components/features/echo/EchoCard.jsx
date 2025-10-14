import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../ui';
import { useEchoStore } from '../../../store/useEchoStore';
import useAuthStore from '../../../store/useAuthStore';
import EchoHeader from './EchoHeader';
import EchoContent from './EchoContent';
import EchoActions from './EchoActions';
import EchoMenu from './EchoMenu';
import AddToScrollModal from './AddToScrollModal';

const EchoCard = ({ echo }) => {
    const { toggleLike, deleteEcho } = useEchoStore();
    const { authUser } = useAuthStore();
    const isLiked = echo.isLiked;
    const [showMenu, setShowMenu] = useState(false);
    const [showAddToScroll, setShowAddToScroll] = useState(false);
    const isOwnEcho = authUser?._id === echo.author?._id;

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLike(echo._id);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this echo?')) {
            try {
                await deleteEcho(echo._id);
                setShowMenu(false);
            } catch (error) {
                console.log('Error deleting echo:', error);
            }
        }
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/echo/${echo._id}`;
        navigator.clipboard.writeText(link);
        setShowMenu(false);
    };

    const handleToggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowAddToScroll(true);
    };

    return (
        <article className="group relative">
            <Card className="border-b border-base-300/30 transition-all duration-200">
                <Card.Body className="p-5">
                    <EchoHeader echo={echo} onToggleMenu={handleToggleMenu} />
                    <EchoContent echo={echo} />
                    <EchoActions
                        echo={echo}
                        isLiked={isLiked}
                        onLike={handleLike}
                        onToggleMenu={handleToggleMenu}
                        onBookmark={handleBookmark}
                    />
                </Card.Body>
            </Card>

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
                    onClose={() => setShowAddToScroll(false)}
                />
            )}
        </article>
    );
};

export default EchoCard;