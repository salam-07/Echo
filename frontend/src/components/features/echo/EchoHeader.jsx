import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Timestamp } from '../../ui';
import { MoreHorizontal } from 'lucide-react';

const EchoHeader = memo(({ echo, onToggleMenu }) => {
    const author = echo.author;
    const initials = author?.userName?.charAt(0)?.toUpperCase() || '?';

    return (
        <header className="flex items-start gap-3">
            {/* Author info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <Link
                        to={`/user/${author?._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-sm text-base-content hover:underline truncate"
                    >
                        @{author?.userName || 'anonymous'}
                    </Link>
                    <span className="text-base-content/20">·</span>
                    <Timestamp
                        date={echo.createdAt}
                        className="text-xs text-base-content/40 flex-shrink-0"
                    />
                </div>
            </div>

            {/* Menu button */}
            <button
                onClick={onToggleMenu}
                className="flex-shrink-0 p-1.5 -mr-1.5 rounded-full text-base-content/25 hover:text-base-content/50 hover:bg-base-200/60 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="More options"
            >
                <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
            </button>
        </header>
    );
});

EchoHeader.displayName = 'EchoHeader';

export default EchoHeader;