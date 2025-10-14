import React, { useEffect } from 'react';
import { useScrollStore } from '../../store/useScrollStore';
import { Scroll, Bookmark, Plus } from 'lucide-react';

const RightSidebar = () => {
    const { scrolls, getScrolls } = useScrollStore();

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    // Filter scrolls by type and limit
    const feedScrolls = scrolls
        .filter(scroll => scroll.type === 'feed')
        .slice(0, 5);

    const curationScrolls = scrolls
        .filter(scroll => scroll.type === 'curation')
        .slice(0, 3);

    const handleFeedScrollClick = (scroll) => {
        // For future navigation to feed page
        console.log('Navigate to feed:', scroll.name);
    };

    const handleCurationScrollClick = (scroll) => {
        // For future navigation to curation page
        console.log('Navigate to curation:', scroll.name);
    };

    return (
        <aside className="hidden lg:block w-64 p-4 bg-base-50/50 border-l border-base-300/50">
            <div className="space-y-6">
                {/* Feed Scrolls Section */}
                <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300/30">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Scroll className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-base-content">Feed Scrolls</h3>
                        </div>
                        <span className="text-xs text-base-content/50 bg-base-200 px-2 py-1 rounded-full">
                            {feedScrolls.length}
                        </span>
                    </div>

                    <div className="space-y-1">
                        {feedScrolls.length > 0 ? (
                            feedScrolls.map((scroll) => (
                                <button
                                    key={scroll._id}
                                    onClick={() => handleFeedScrollClick(scroll)}
                                    className="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 hover:bg-base-200/60 text-base-content/80 hover:text-base-content group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium truncate flex-1">
                                            {scroll.name}
                                        </span>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                        </div>
                                    </div>
                                    {scroll.description && (
                                        <p className="text-xs text-base-content/60 mt-1 truncate">
                                            {scroll.description}
                                        </p>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <Scroll className="w-8 h-8 text-base-content/30 mx-auto mb-2" />
                                <p className="text-sm text-base-content/60">No feed scrolls</p>
                                <p className="text-xs text-base-content/40 mt-1">Create your first feed</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Curation Scrolls Section */}
                <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300/30">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Bookmark className="w-4 h-4 text-secondary" />
                            <h3 className="font-semibold text-base-content">My Curations</h3>
                        </div>
                        <span className="text-xs text-base-content/50 bg-base-200 px-2 py-1 rounded-full">
                            {curationScrolls.length}
                        </span>
                    </div>

                    <div className="space-y-1">
                        {curationScrolls.length > 0 ? (
                            curationScrolls.map((scroll) => (
                                <button
                                    key={scroll._id}
                                    onClick={() => handleCurationScrollClick(scroll)}
                                    className="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 hover:bg-base-200/60 text-base-content/80 hover:text-base-content group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium truncate flex-1">
                                            {scroll.name}
                                        </span>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                                        </div>
                                    </div>
                                    {scroll.description && (
                                        <p className="text-xs text-base-content/60 mt-1 truncate">
                                            {scroll.description}
                                        </p>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <Bookmark className="w-8 h-8 text-base-content/30 mx-auto mb-2" />
                                <p className="text-sm text-base-content/60">No curations</p>
                                <p className="text-xs text-base-content/40 mt-1">Start curating content</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;