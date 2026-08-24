import React, { memo } from 'react';
import { Link } from 'react-router-dom';

/**
 * What you can do with an entry, printed as words.
 *
 * The icon set is gone. `Like` next to a numeral says the same thing a heart says
 * and says it in one reading, and the held state changes the word itself — `Like`
 * becomes `Liked`, at full ink, ruled underneath — so the state never rests on
 * colour or on a fill. Every target is 44px tall; the words sit inside that height
 * rather than being padded out to it.
 */
const ROW = 't-label flex h-11 items-center gap-2 transition duration-200';

const EchoActions = memo(({ echo, isLiked, onLike, onToggleMenu, onSave, menuOpen }) => {
    const replyCount = echo.replies?.length || 0;
    const likeCount = echo.likes || 0;

    return (
        <div className="-mb-2 mt-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
                <button
                    type="button"
                    onClick={onLike}
                    aria-pressed={isLiked}
                    className={`${ROW} active:scale-95 ${
                        isLiked
                            ? 't-label--ink underline decoration-1 underline-offset-4'
                            : 'hover:text-ink'
                    }`}
                >
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                    <span className="t-readout">{likeCount}</span>
                </button>

                <Link to={`/echo/${echo._id}`} className={`${ROW} hover:text-ink`}>
                    <span>Reply</span>
                    <span className="t-readout">{replyCount}</span>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                <button type="button" onClick={onSave} className={`${ROW} hover:text-ink`}>
                    Save
                </button>
                <button
                    type="button"
                    onClick={onToggleMenu}
                    aria-expanded={menuOpen}
                    className={`${ROW} hover:text-ink`}
                >
                    More
                </button>
            </div>
        </div>
    );
});

EchoActions.displayName = 'EchoActions';

export default EchoActions;
