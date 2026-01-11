import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const EchoContent = memo(({ echo }) => {
    return (
        <div className="space-y-2.5">
            {/* Main Content */}
            <Link to={`/echo/${echo._id}`} className="block group">
                <p className="text-base-content leading-relaxed whitespace-pre-wrap text-[15px]">
                    {echo.content}
                </p>
            </Link>

            {/* Tags */}
            {echo.tags && echo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {echo.tags.map((tag) => (
                        <Link
                            key={tag._id}
                            to={`/tag/${tag.name}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-base-content/40 hover:text-base-content/70 transition-colors"
                        >
                            #{tag.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
});

EchoContent.displayName = 'EchoContent';

export default EchoContent;