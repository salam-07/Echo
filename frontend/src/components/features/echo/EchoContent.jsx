import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const EchoContent = memo(({ echo }) => {
    return (
        <div className="space-y-2">
            {/* Main Content */}
            <Link to={`/echo/${echo._id}`} className="block">
                <p className="text-base-content text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                    {echo.content}
                </p>
            </Link>

            {/* Tags */}
            {echo.tags && echo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {echo.tags.map((tag) => (
                        <Link
                            key={tag._id}
                            to={`/tag/${tag.name}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-base-content/30 hover:text-base-content/50 transition-colors"
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