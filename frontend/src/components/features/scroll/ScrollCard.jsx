import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User as UserIcon } from 'lucide-react';
import { Card, Badge, UserLink } from '../../ui';
import FollowButton from './FollowButton';

const ScrollCard = ({
    scroll,
    compact = false,
    showIcon = false,
    icon: IconComponent = BookOpen,
    showTags = false
}) => {
    const bodyClasses = compact ? "p-4" : "p-6";

    return (
        <Link to={`/scroll/${scroll._id}`} className="block">
            <Card hover className="h-40 flex flex-col">
                <Card.Body className={`${bodyClasses} flex-1 flex flex-col`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {showIcon && (
                                    <IconComponent className="w-4 h-4 text-primary flex-shrink-0" />
                                )}
                                <h3 className={`${compact ? "font-medium text-sm" : "font-semibold text-lg"} line-clamp-2`}>
                                    {scroll.name}
                                </h3>
                            </div>
                            <div className="text-xs text-base-content/60 mb-2">
                                by <UserLink user={scroll.creator} showPrefix={true} />
                            </div>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                            <FollowButton scroll={scroll} size="xs" />
                        </div>
                    </div>

                    {scroll.description && (
                        <p className={`text-base-content/70 mb-3 flex-1 ${compact ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'}`}>
                            {scroll.description}
                        </p>
                    )}

                    {/* Tags and Authors for feed scrolls */}
                    {showTags && !compact && (
                        <div className="space-y-2 mb-3">
                            {/* Tags */}
                            {scroll.feedConfig?.includedTags && scroll.feedConfig.includedTags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {scroll.feedConfig.includedTags.slice(0, 3).map((tag) => (
                                        <Badge key={tag._id} variant="primary" size="xs">
                                            #{tag.name}
                                        </Badge>
                                    ))}
                                    {scroll.feedConfig.includedTags.length > 3 && (
                                        <Badge variant="ghost" size="xs">
                                            +{scroll.feedConfig.includedTags.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Authors */}
                            {scroll.feedConfig?.authors && scroll.feedConfig.authors.length > 0 && (
                                <div className="flex flex-wrap gap-1 items-center">
                                    <UserIcon className="w-3 h-3 text-base-content/50" />
                                    {scroll.feedConfig.authors.slice(0, 2).map((author) => (
                                        <Badge key={author._id} variant="secondary" size="xs">
                                            @{author.userName}
                                        </Badge>
                                    ))}
                                    {scroll.feedConfig.authors.length > 2 && (
                                        <Badge variant="ghost" size="xs">
                                            +{scroll.feedConfig.authors.length - 2}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-4 text-xs text-base-content/50">
                            {showTags && <span>Auto-feed</span>}
                            {!showTags && <span>{scroll.echos?.length || 0} echos</span>}
                            <span>{scroll.savedBy?.length || 0} followers</span>
                            <span>{new Date(scroll.createdAt).toLocaleDateString()}</span>
                        </div>
                        {!compact && !showTags && (
                            <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-primary">
                                    {scroll.echos?.length || 0}
                                </span>
                                <span className="text-xs text-base-content/50">echos</span>
                            </div>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Link>
    );
};

export default ScrollCard;