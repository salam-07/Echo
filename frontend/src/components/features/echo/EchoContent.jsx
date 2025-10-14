import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../ui';

const EchoContent = ({ echo }) => {
    return (
        <div className="space-y-2">
            {/* Main Content */}
            <Link to={`/echo/${echo._id}`} className="block">
                <p className="text-base-content leading-relaxed whitespace-pre-wrap">
                    {echo.content}
                </p>
            </Link>

            {/* Tags */}
            {echo.tags && echo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {echo.tags.map((tag) => (
                        <Link
                            key={tag._id}
                            to={`/tag/${tag.name}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Badge
                                variant="bg-base-content/20"
                                size="sm"
                                className="text-base-content/60 hover:badge-primary-focus transition-colors"
                            >
                                #{tag.name}
                            </Badge>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EchoContent;