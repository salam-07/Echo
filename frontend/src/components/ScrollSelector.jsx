import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useScrollStore } from '../store/useScrollStore';

const ScrollSelector = () => {
    const { scrolls, selectedScroll, setSelectedScroll, getScrolls, isLoadingScrolls } = useScrollStore();
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Filter only feed type scrolls and conditionally add "All Echos" option
    const feedScrolls = scrolls.filter(scroll => scroll.type === 'feed');
    const allScrollOptions = feedScrolls.length > 0
        ? [{ _id: 'all', name: 'All Echos', type: 'feed' }, ...feedScrolls]
        : feedScrolls;

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    useEffect(() => {
        if (selectedScroll) {
            const index = allScrollOptions.findIndex(s => s._id === selectedScroll._id);
            setSelectedIndex(index !== -1 ? index : 0);
        } else {
            setSelectedIndex(0);
        }
    }, [selectedScroll, allScrollOptions]);

    const handleSelection = (index) => {
        setSelectedIndex(index);
        const scroll = allScrollOptions[index];
        setSelectedScroll(scroll._id === 'all' ? null : scroll);
    };

    const navigateUp = () => {
        if (selectedIndex > 0) handleSelection(selectedIndex - 1);
    };

    const navigateDown = () => {
        if (selectedIndex < allScrollOptions.length - 1) handleSelection(selectedIndex + 1);
    };

    const getVisibleScrolls = () => {
        const total = allScrollOptions.length;
        let startIndex, endIndex;

        if (selectedIndex === 0) {
            // Top position: show selected + 2 below
            startIndex = 0;
            endIndex = Math.min(2, total - 1);
        } else if (selectedIndex === total - 1) {
            // Bottom position: show 2 above + selected
            startIndex = Math.max(0, total - 3);
            endIndex = total - 1;
        } else {
            // Middle position: show 1 above + selected + 1 below
            startIndex = selectedIndex - 1;
            endIndex = selectedIndex + 1;
        }

        return allScrollOptions.slice(startIndex, endIndex + 1).map((scroll, idx) => {
            const actualIndex = startIndex + idx;
            const isSelected = actualIndex === selectedIndex;

            return {
                ...scroll,
                index: actualIndex,
                isSelected,
                opacity: isSelected ? 1 : 0.6,
                scale: isSelected ? 1 : 0.9
            };
        });
    };

    if (isLoadingScrolls) {
        return (
            <div className="relative w-full h-44 rounded-box overflow-hidden bg-base-100">
                {/* Top gradient */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-base-100 z-10 pointer-events-none" />

                {/* Navigation up skeleton */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 p-1 rounded-full">
                    <div className="skeleton w-4 h-4 rounded" />
                </div>

                {/* Scroll items skeleton container */}
                <div className="py-8 px-4 h-full flex items-center">
                    <div className="space-y-1 w-full">
                        {/* Center item (selected) */}
                        <div className="flex items-center justify-center">
                            <div className="skeleton h-8 w-24 rounded-md"></div>
                        </div>

                        {/* Top item */}
                        <div className="flex items-center justify-center opacity-60 scale-90">
                            <div className="skeleton h-7 w-20 rounded-md"></div>
                        </div>

                        {/* Bottom item */}
                        <div className="flex items-center justify-center opacity-60 scale-90">
                            <div className="skeleton h-7 w-16 rounded-md"></div>
                        </div>
                    </div>
                </div>

                {/* Navigation down skeleton */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 p-1 rounded-full">
                    <div className="skeleton w-4 h-4 rounded" />
                </div>

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-transparent to-base-100 z-10 pointer-events-none" />
            </div>
        );
    }

    // Handle empty state when no scrolls exist
    if (allScrollOptions.length === 0) {
        return (
            <div className="relative w-full h-44 rounded-box overflow-hidden bg-base-100 flex items-center justify-center">
                <div className="text-center text-base-content/60">
                    <div className="text-sm font-medium mb-1">No Scrolls</div>
                    <div className="text-xs">Create your first scroll to get started</div>
                </div>
            </div>
        );
    }

    const visibleScrolls = getVisibleScrolls();
    const canScrollUp = selectedIndex > 0;
    const canScrollDown = selectedIndex < allScrollOptions.length - 1;

    return (
        <div className="relative w-full h-44 rounded-box overflow-hidden">
            {/* Top gradient */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-base-100 z-10 pointer-events-none" />

            {/* Navigation up */}
            <button
                onClick={navigateUp}
                disabled={!canScrollUp}
                className="absolute top-1 left-1/2 -translate-x-1/2 z-20 p-1 rounded-full hover:bg-base-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <ChevronUp className="w-4 h-4 text-base-content/60" />
            </button>

            {/* Scroll items container */}
            <div className="py-8 px-4 h-full flex items-center">
                <div className="space-y-1 w-full">
                    {visibleScrolls.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center justify-center transition-all duration-300 ease-out"
                            style={{
                                opacity: item.opacity,
                                transform: `scale(${item.scale})`
                            }}
                        >
                            <button
                                onClick={() => handleSelection(item.index)}
                                className={`text-center px-3 py-2 rounded-md transition-all duration-300 w-full max-w-[200px] ${item.isSelected
                                    ? 'bg-base-200/70 text-base-content font-medium'
                                    : 'text-base-content/60 hover:text-base-content hover:bg-base-300/50'
                                    }`}
                            >
                                <span className="text-sm block truncate">
                                    {item.name}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation down */}
            <button
                onClick={navigateDown}
                disabled={!canScrollDown}
                className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 p-1 rounded-full hover:bg-base-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <ChevronDown className="w-4 h-4 text-base-content/60" />
            </button>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-transparent to-base-100 z-10 pointer-events-none" />
        </div>
    );
};

export default ScrollSelector;