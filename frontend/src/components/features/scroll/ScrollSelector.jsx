import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useScrollStore } from '../../../store/useScrollStore';

const ScrollSelector = () => {
    const { scrolls, selectedScroll, setSelectedScroll, getScrolls, isLoadingScrolls } = useScrollStore();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef(null);
    const wheelTimeoutRef = useRef(null);

    // Memoize feed scrolls to prevent unnecessary recalculations
    const allScrollOptions = useMemo(() =>
        scrolls.filter(scroll => scroll.type === 'feed'),
        [scrolls]
    );

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    // Sync selected index with selectedScroll
    useEffect(() => {
        if (!allScrollOptions.length) return;

        if (selectedScroll) {
            const index = allScrollOptions.findIndex(s => s._id === selectedScroll._id);
            if (index !== -1 && index !== selectedIndex) {
                setSelectedIndex(index);
            }
        } else {
            setSelectedIndex(0);
            setSelectedScroll(allScrollOptions[0]);
        }
    }, [selectedScroll?._id, allScrollOptions.length]);

    const handleSelection = useCallback((index) => {
        if (index === selectedIndex || isAnimating) return;
        setIsAnimating(true);
        setSelectedIndex(index);
        const scroll = allScrollOptions[index];
        if (scroll) {
            setSelectedScroll(scroll);
        }
        // Reset animation state after transition
        setTimeout(() => setIsAnimating(false), 150);
    }, [selectedIndex, allScrollOptions, setSelectedScroll, isAnimating]);

    const navigateUp = useCallback(() => {
        if (selectedIndex > 0) handleSelection(selectedIndex - 1);
    }, [selectedIndex, handleSelection]);

    const navigateDown = useCallback(() => {
        if (selectedIndex < allScrollOptions.length - 1) handleSelection(selectedIndex + 1);
    }, [selectedIndex, allScrollOptions.length, handleSelection]);

    // Debounced wheel handler for smooth scrolling
    const handleWheel = useCallback((e) => {
        e.preventDefault();

        if (wheelTimeoutRef.current) return;

        if (e.deltaY < 0) {
            navigateUp();
        } else if (e.deltaY > 0) {
            navigateDown();
        }

        wheelTimeoutRef.current = setTimeout(() => {
            wheelTimeoutRef.current = null;
        }, 100);
    }, [navigateUp, navigateDown]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (wheelTimeoutRef.current) {
                clearTimeout(wheelTimeoutRef.current);
            }
        };
    }, []);

    // Calculate visible items with position info
    const visibleScrolls = useMemo(() => {
        const total = allScrollOptions.length;
        if (total === 0) return [];

        const visibleCount = Math.min(5, total);
        const halfVisible = Math.floor(visibleCount / 2);

        let startIndex = Math.max(0, selectedIndex - halfVisible);
        let endIndex = Math.min(total - 1, startIndex + visibleCount - 1);

        if (endIndex - startIndex < visibleCount - 1) {
            startIndex = Math.max(0, endIndex - visibleCount + 1);
        }

        // Find which position in the visible list the selected item is
        const selectedVisiblePosition = selectedIndex - startIndex;

        return {
            items: allScrollOptions.slice(startIndex, endIndex + 1).map((scroll, idx) => {
                const actualIndex = startIndex + idx;
                const offset = actualIndex - selectedIndex;
                const isSelected = offset === 0;
                const absOffset = Math.abs(offset);

                // Subtle 3D wheel effect
                const rotateX = offset * -12;
                const scale = isSelected ? 1 : Math.max(0.88, 1 - absOffset * 0.06);
                const opacity = isSelected ? 1 : Math.max(0.35, 1 - absOffset * 0.3);

                return {
                    _id: scroll._id,
                    name: scroll.name,
                    index: actualIndex,
                    offset,
                    isSelected,
                    style: {
                        transform: `perspective(200px) rotateX(${rotateX}deg) scale(${scale})`,
                        opacity,
                    }
                };
            }),
            selectedVisiblePosition,
            visibleCount: endIndex - startIndex + 1
        };
    }, [allScrollOptions, selectedIndex]);

    if (isLoadingScrolls) {
        return (
            <div className="relative w-full py-3">
                <div className="flex flex-col items-center gap-1">
                    <div className="h-3 w-12 rounded-full bg-base-content/5 animate-pulse" />
                    <div className="h-5 w-20 rounded-full bg-base-content/10 animate-pulse" />
                    <div className="h-3 w-12 rounded-full bg-base-content/5 animate-pulse" />
                </div>
            </div>
        );
    }

    if (allScrollOptions.length === 0) {
        return (
            <div className="relative w-full py-4 text-center">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-base-content/30">No scrolls</p>
                    <p className="text-xs text-base-content/20">Create your first scroll</p>
                </div>
            </div>
        );
    }

    const canScrollUp = selectedIndex > 0;
    const canScrollDown = selectedIndex < allScrollOptions.length - 1;

    // Calculate highlight position based on where selected item appears in visible list
    const itemHeight = 32; // height of each item in pixels
    const highlightTop = visibleScrolls.selectedVisiblePosition * itemHeight;

    return (
        <div
            ref={containerRef}
            onWheel={handleWheel}
            className="relative w-full select-none"
        >
            {/* Navigation up */}
            <button
                onClick={navigateUp}
                disabled={!canScrollUp}
                className={`
                    w-full flex justify-center py-1
                    transition-all duration-150
                    ${canScrollUp
                        ? 'text-base-content/30 hover:text-base-content/60 cursor-pointer'
                        : 'text-base-content/10 cursor-default'
                    }
                `}
                aria-label="Previous scroll"
            >
                <ChevronUp className="w-3.5 h-3.5" strokeWidth={2} />
            </button>

            {/* Scroll items container */}
            <div className="relative">
                {/* Selection highlight band - positioned dynamically */}
                <div
                    className="absolute inset-x-1 h-8 rounded-md bg-base-content/[0.06] pointer-events-none transition-all duration-150 ease-out"
                    style={{ top: highlightTop }}
                />

                {/* Items */}
                <div className="relative flex flex-col">
                    {visibleScrolls.items.map((item) => (
                        <button
                            key={item._id}
                            onClick={() => handleSelection(item.index)}
                            className="cursor-pointer w-full h-8 px-2 flex items-center justify-center transition-all duration-150 ease-out focus:outline-none"
                            style={item.style}
                        >
                            <span
                                className={`
                                    truncate text-center transition-all duration-150
                                    ${item.isSelected
                                        ? 'text-base-content font-medium text-sm'
                                        : 'text-base-content/40 font-normal text-[13px]'
                                    }
                                `}
                            >
                                {item.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation down */}
            <button
                onClick={navigateDown}
                disabled={!canScrollDown}
                className={`
                    w-full flex justify-center py-1
                    transition-all duration-150
                    ${canScrollDown
                        ? 'text-base-content/30 hover:text-base-content/60 cursor-pointer'
                        : 'text-base-content/10 cursor-default'
                    }
                `}
                aria-label="Next scroll"
            >
                <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
        </div>
    );
};

export default ScrollSelector;