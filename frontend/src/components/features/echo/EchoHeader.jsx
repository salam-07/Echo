import React from 'react';
import { UserLink, Timestamp, IconButton } from '../../ui';
import { MoreHorizontal } from 'lucide-react';

const EchoHeader = ({ echo, onToggleMenu }) => {
    return (
        <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <UserLink user={echo.author} />
                <span className="text-xs text-base-content/50">·</span>
                <Timestamp date={echo.createdAt} />
            </div>

            <IconButton
                onClick={onToggleMenu}
                variant="ghost"
                size="sm"
                className="text-base-content/40"
                aria-label="More options"
            >
                <MoreHorizontal className="w-4 h-4" />
            </IconButton>
        </header>
    );
};

export default EchoHeader;