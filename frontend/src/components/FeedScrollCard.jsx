import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

const FeedScrollCard = ({ scroll, compact = false }) => {
    const bodyClasses = compact ? "card-body p-4" : "card-body p-6";

    return (
        <Link to={`/scroll/${scroll._id}`} className="block">
            <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow cursor-pointer h-40 flex flex-col">
                <div className={`${bodyClasses} flex-1 flex flex-col`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                            <h3 className={`${compact ? "font-medium text-sm mb-1" : "font-semibold text-lg mb-2"} line-clamp-2`}>
                                {scroll.name}
                            </h3>
                            <p className="text-xs text-base-content/60 mb-2">
                                by @{scroll.creator?.userName || 'Unknown'}
                            </p>
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

                    {/* Tags */}
                    {!compact && scroll.feedConfig?.includedTags && scroll.feedConfig.includedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {scroll.feedConfig.includedTags.slice(0, 3).map((tag) => (
                                <span key={tag._id} className="badge badge-primary badge-xs">
                                    #{tag.name}
                                </span>
                            ))}
                            {scroll.feedConfig.includedTags.length > 3 && (
                                <span className="badge badge-ghost badge-xs">
                                    +{scroll.feedConfig.includedTags.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-base-content/50 mt-auto">
                        <span>Auto-feed</span>
                        <span>{scroll.savedBy?.length || 0} followers</span>
                        <span>{new Date(scroll.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default FeedScrollCard;