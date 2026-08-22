import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Timestamp } from '../../ui';

/**
 * The byline. Who wrote it and when — nothing else, because the entry's controls
 * all sit together at the foot of the row where a hand can reach them.
 */
const EchoHeader = memo(({ echo }) => {
    const author = echo.author;

    return (
        <header className="flex min-w-0 items-baseline gap-3">
            <Link
                to={`/user/${author?._id}`}
                onClick={(e) => e.stopPropagation()}
                className="link-rule truncate text-[0.875rem] font-medium tracking-[0.01em] text-ink"
            >
                @{author?.userName || 'anonymous'}
            </Link>
            <Timestamp date={echo.createdAt} className="t-readout shrink-0 text-rule-strong" />
        </header>
    );
});

EchoHeader.displayName = 'EchoHeader';

export default EchoHeader;
