import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

const CurationScrollCard = ({ scroll, compact = false }) => {
    const bodyClasses = compact ? "card-body p-4" : "card-body p-6";

    return (
        <Link to={`/scroll/${scroll._id}`} className="block">
            <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow cursor-pointer h-40 flex flex-col">
                <div className={`${bodyClasses} flex-1 flex flex-col`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                                <h3 className={`${compact ? "font-medium text-sm" : "font-semibold text-lg"} line-clamp-2`}>
                                    {scroll.name}
                                </h3>
                            </div>
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

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-4 text-xs text-base-content/50">
                            <span>{scroll.echos?.length || 0} echos</span>
                            <span>{scroll.savedBy?.length || 0} followers</span>
                            <span>{new Date(scroll.createdAt).toLocaleDateString()}</span>
                        </div>
                        {!compact && (
                            <div className="flex flex-col items-center">
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