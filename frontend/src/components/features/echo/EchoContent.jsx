import React, { memo } from 'react';
import { Link } from 'react-router-dom';

/**
 * The entry itself, at reading size, and the tags it was filed under.
 *
 * Tags are set as apparatus rather than as pills: `#tag` in the same register the
 * rule builder uses for them, so a tag looks the same wherever it appears — on an
 * entry, in a filter, on the tag sheet.
 */
const EchoContent = memo(({ echo }) => (
    <div className="mt-3">
        <Link to={`/echo/${echo._id}`} className="block">
            <p className="t-body whitespace-pre-wrap break-words text-ink">{echo.content}</p>
        </Link>

        {echo.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {echo.tags.map((tag) => (
                    <Link
                        key={tag._id}
                        to={`/tag/${tag.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="t-readout text-rule-strong transition-colors hover:text-ink"
                    >
                        #{tag.name}
                    </Link>
                ))}
            </div>
        )}
    </div>
));

EchoContent.displayName = 'EchoContent';

export default EchoContent;
