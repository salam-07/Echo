import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollStore } from '../../store/useScrollStore';
import { Scroll, Bookmark, Plus, ArrowRight } from 'lucide-react';

const RightSidebar = () => {
    const { scrolls, getScrolls } = useScrollStore();

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    const feedScrolls = scrolls
        .filter(scroll => scroll.type === 'feed')
        .slice(0, 4);

    const curationScrolls = scrolls
        .filter(scroll => scroll.type === 'curation')
        .slice(0, 3);

    return (
        <aside className="hidden lg:block w-56 py-4 px-3 border-l border-base-200/60">
            <div className="space-y-6">
                {/* Feed Scrolls */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <span className="text-xs font-medium text-base-content/40 uppercase tracking-wider">
                            Feeds
                        </span>
                        <Link
                            to="/scroll/new"
                            className="text-base-content/30 hover:text-base-content/60 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-0.5">
                        {feedScrolls.length > 0 ? (
                            feedScrolls.map((scroll) => (
                                <Link
                                    key={scroll._id}
                                    to={`/scroll/${scroll._id}`}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-base-content/60 hover:text-base-content hover:bg-base-200/50 transition-colors"
                                >
                                    <Scroll className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                                    <span className="truncate">{scroll.name}</span>
                                </Link>
                            ))
                        ) : (
                            <p className="px-2 py-3 text-xs text-base-content/30">
                                No feed scrolls yet
                            </p>
                        )}

                        {feedScrolls.length > 0 && (
                            <Link
                                to="/scrolls/feeds"
                                className="flex items-center gap-1 px-2 py-1.5 text-xs text-base-content/40 hover:text-base-content/60 transition-colors"
                            >
                                View all <ArrowRight className="w-3 h-3" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Curation Scrolls */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <span className="text-xs font-medium text-base-content/40 uppercase tracking-wider">
                            Curations
                        </span>
                    </div>

                    <div className="space-y-0.5">
                        {curationScrolls.length > 0 ? (
                            curationScrolls.map((scroll) => (
                                <Link
                                    key={scroll._id}
                                    to={`/scroll/${scroll._id}`}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-base-content/60 hover:text-base-content hover:bg-base-200/50 transition-colors"
                                >
                                    <Bookmark className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                                    <span className="truncate">{scroll.name}</span>
                                </Link>
                            ))
                        ) : (
                            <p className="px-2 py-3 text-xs text-base-content/30">
                                No curations yet
                            </p>
                        )}

                        {curationScrolls.length > 0 && (
                            <Link
                                to="/scrolls/curations"
                                className="flex items-center gap-1 px-2 py-1.5 text-xs text-base-content/40 hover:text-base-content/60 transition-colors"
                            >
                                View all <ArrowRight className="w-3 h-3" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Trending Tags */}
                <div>
                    <div className="px-2 mb-2">
                        <span className="text-xs font-medium text-base-content/40 uppercase tracking-wider">
                            Explore
                        </span>
                    </div>

                    <div className="space-y-0.5">
                        <Link
                            to="/browse/tags"
                            className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-base-content/60 hover:text-base-content hover:bg-base-200/50 transition-colors"
                        >
                            Browse Tags
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;