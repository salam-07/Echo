import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useScrollStore } from '../store/useScrollStore';

const ScrollSelector = () => {
    const { scrolls, selectedScroll, setSelectedScroll, getScrolls, isLoadingScrolls } = useScrollStore();

    // Filter only feed type scrolls
    const feedScrolls = scrolls.filter(scroll => scroll.type === 'feed');

    // Add "All Echos" as default option
    const allScrollOptions = [
        { _id: 'all', name: 'All Echos', type: 'feed' },
        ...feedScrolls
    ];

    const [selectedIndex, setSelectedIndex] = useState(0);

    // Load scrolls on mount
    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    // Update selected index when selected scroll changes
    useEffect(() => {
        if (selectedScroll) {
            const index = allScrollOptions.findIndex(s => s._id === selectedScroll._id);
            if (index !== -1) {
                setSelectedIndex(index);
            }
        } else {
            setSelectedIndex(0);
        }
    }, [selectedScroll]);

    const handleScrollChange = (index) => {
        setSelectedIndex(index);
        const scroll = allScrollOptions[index];

        if (scroll._id === 'all') {
            setSelectedScroll(null);
        } else {
            setSelectedScroll(scroll);
        }
    };

    const scrollUp = () => {
        if (selectedIndex > 0) {
            handleScrollChange(selectedIndex - 1);
        }
    };

    const scrollDown = () => {
        if (selectedIndex < allScrollOptions.length - 1) {
            handleScrollChange(selectedIndex + 1);
        }
    };

    const getVisibleItems = () => {
        const items = [];
        const start = Math.max(0, selectedIndex - 1);
        const end = Math.min(allScrollOptions.length - 1, selectedIndex + 1);

        for (let i = start; i <= end; i++) {
            const distance = Math.abs(i - selectedIndex);
            const opacity = distance === 0 ? 1 : distance === 1 ? 0.6 : 0.3;
            const scale = distance === 0 ? 1 : distance === 1 ? 0.85 : 0.7;

            items.push({
                ...allScrollOptions[i],
                index: i,
                distance,
                opacity,
                scale,
                isSelected: i === selectedIndex
            });
        }
        return items;
    };

    if (isLoadingScrolls) {
        return (
            <div className="w-full h-44 flex items-center justify-center">
                <p className="text-sm text-base-content/60">Loading...</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-44 rounded-box overflow-hidden">
            {/* Top shadow gradient */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-base-100 z-10 pointer-events-none"></div>

            {/* Top chevron */}
            <button
                onClick={scrollUp}
                disabled={selectedIndex === 0}
                className="absolute top-1 left-1/2 -translate-x-1/2 z-20 p-1 rounded-full hover:bg-base-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <ChevronUp className="w-4 h-4 text-base-content/60" />
            </button>

            {/* Scroll container */}
            <div className="py-8 px-4">
                <div className="space-y-1">
                    {getVisibleItems().map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center justify-center transition-all duration-300 ease-out"
                            style={{
                                opacity: item.opacity,
                                transform: `scale(${item.scale})`,
                            }}
                        >
                            <button
                                onClick={() => handleScrollChange(item.index)}
                                className={`
                                    text-center px-3 py-2 rounded-md transition-all duration-300 w-full max-w-[200px]
                                    ${item.isSelected
                                        ? 'bg-base-200/70 text-base-content font-medium'
                                        : 'text-base-content/60 hover:text-base-content hover:bg-base-300/50'
                                    }
                                `}
                            >
                                <span className="text-sm block truncate">
                                    {item.name}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom chevron */}
            <button
                onClick={scrollDown}
                disabled={selectedIndex === allScrollOptions.length - 1}
                className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 p-1 rounded-full hover:bg-base-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <ChevronDown className="w-4 h-4 text-base-content/60" />
            </button>

            {/* Bottom shadow gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-transparent to-base-100 z-10 pointer-events-none"></div>
        </div>
    );
};

export default ScrollSelector;