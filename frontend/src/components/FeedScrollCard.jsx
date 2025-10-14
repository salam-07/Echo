import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

const FeedScrollCard = ({ scroll, compact = false }) => {
    const bodyClasses = compact ? "card-body p-4" : "card-body p-6";

    return (
        <Link to={`/scroll/${scroll._id}`} className="block">
            <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow cursor-pointer">
                <div className={bodyClasses}>
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className={compact ? "font-medium text-sm mb-1" : "font-semibold text-lg mb-2"}>
                                        {scroll.name}
                                    </h3>
                                    <p className="text-xs text-base-content/60 mb-2">
                                        by @{scroll.creator?.userName || 'Unknown'}
                                    </p>
                                </div>
                                <FollowButton scroll={scroll} size={compact ? 'xs' : 'sm'} />
                            </div>
                            {scroll.description && (
                                <p className={`text-base-content/70 mb-3 ${compact ? 'text-xs line-clamp-2' : 'text-sm'}`}>
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

                            <div className="flex items-center gap-4 text-xs text-base-content/50">
                                <span>Auto-feed</span>
                                <span>{scroll.savedBy?.length || 0} followers</span>
                                <span>{new Date(scroll.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default FeedScrollCard;