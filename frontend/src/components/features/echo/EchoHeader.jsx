import React, { memo } from 'react';
import { UserLink, Timestamp } from '../../ui';
import { MoreHorizontal } from 'lucide-react';

const EchoHeader = memo(({ echo, onToggleMenu }) => {
    return (
        <header className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
                <UserLink
                    user={echo.author}
                    className="font-medium text-base-content hover:underline transition-colors"
                />
                <span className="text-base-content/30">·</span>
                <Timestamp
                    date={echo.createdAt}
                    className="text-base-content/40"
                />
            </div>

            <button
                onClick={onToggleMenu}
                className="p-1 rounded text-base-content/30 hover:text-base-content/60 hover:bg-base-200/50 transition-colors"
                aria-label="More options"
            >
                <MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />
            </button>
        </header>
    );
});

EchoHeader.displayName = 'EchoHeader';

export default EchoHeader;