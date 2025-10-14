import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

const CurationScrollCard = ({ scroll, compact = false }) => {
    const bodyClasses = compact ? "card-body p-4" : "card-body p-6";

    return (
        <Link to={`/scroll/${scroll._id}`} className="block">
            <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow cursor-pointer">
                <div className={bodyClasses}>
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <BookOpen className="w-4 h-4 text-primary" />
                                        <h3 className={compact ? "font-medium text-sm" : "font-semibold text-lg"}>
                                            {scroll.name}
                                        </h3>
                                    </div>
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
                            <div className="flex items-center gap-4 text-xs text-base-content/50">
                                <span>{scroll.echos?.length || 0} echos</span>
                                <span>{scroll.savedBy?.length || 0} followers</span>
                                <span>{new Date(scroll.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        {!compact && (
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-lg font-bold text-primary">
                                    {scroll.echos?.length || 0}
                                </span>
                                <span className="text-xs text-base-content/50">echos</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CurationScrollCard;