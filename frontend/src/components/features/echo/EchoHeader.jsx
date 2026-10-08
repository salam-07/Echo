import React, { memo } from 'react';
import { Timestamp, UserLink } from '../../ui';

/**
 * The byline. Who wrote it and when — nothing else, because the entry's controls
 * all sit together at the foot of the row where a hand can reach them.
 */
const EchoHeader = memo(({ echo }) => {
    const author = echo.author;

    return (
        <header className="flex min-w-0 items-baseline gap-3">
            <UserLink user={author} className="min-w-0 truncate text-[0.875rem] font-medium text-ink" />
            <Timestamp date={echo.createdAt} className="t-readout shrink-0 text-ink-quiet" />
        </header>
    );
});

EchoHeader.displayName = 'EchoHeader';

export default EchoHeader;
