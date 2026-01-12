import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Timestamp } from '../../ui';
import { MoreHorizontal } from 'lucide-react';

const EchoHeader = memo(({ echo, onToggleMenu }) => {
    const author = echo.author;

    return (
        <header className="flex items-center justify-between gap-3">
            {/* Author info */}
            <div className="flex items-center gap-2 min-w-0">
                <Link
                    to={`/user/${author?._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium text-[13px] sm:text-sm text-base-content/70 hover:text-base-content transition-colors truncate"
                >
                    @{author?.userName || 'anonymous'}
                </Link>
                <span className="text-base-content/20 text-xs">·</span>
                <Timestamp
                    date={echo.createdAt}
                    className="text-xs text-base-content/35 flex-shrink-0"
                />
            </div>

            {/* Menu button */}
            <button
                onClick={onToggleMenu}
                className="flex-shrink-0 p-1.5 -mr-1 rounded-full text-base-content/20 hover:text-base-content/50 hover:bg-base-200/50 transition-colors"
                aria-label="More options"
            >
                <MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />
            </button>
        </header>
    );
});

EchoHeader.displayName = 'EchoHeader';

export default EchoHeader;