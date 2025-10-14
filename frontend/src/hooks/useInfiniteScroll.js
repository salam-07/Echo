import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for infinite scrolling using IntersectionObserver API
 * @param {Function} loadMore - Function to call when the sentinel element is visible
 * @param {boolean} hasMore - Whether there are more items to load
 * @param {boolean} isLoading - Whether currently loading items
 * @returns {React.RefObject} - Ref to attach to the sentinel element
 */
const useInfiniteScroll = (loadMore, hasMore, isLoading) => {
    const sentinelRef = useRef(null);
    const observerRef = useRef(null);

    const handleObserver = useCallback((entries) => {
        const target = entries[0];

        // If the sentinel is visible and we have more items and not currently loading
        if (target.isIntersecting && hasMore && !isLoading) {
            loadMore();
        }
    }, [loadMore, hasMore, isLoading]);

    useEffect(() => {
        // Create the IntersectionObserver
        const options = {
            root: null, // Use viewport as root
            rootMargin: '100px', // Start loading 100px before reaching the sentinel
            threshold: 0.1 // Trigger when 10% of the sentinel is visible
        };

        observerRef.current = new IntersectionObserver(handleObserver, options);

        // Observe the sentinel element
        const currentSentinel = sentinelRef.current;
        if (currentSentinel) {
            observerRef.current.observe(currentSentinel);
        }

        // Cleanup
        return () => {
            if (observerRef.current && currentSentinel) {
                observerRef.current.unobserve(currentSentinel);
            }
        };
    }, [handleObserver]);

    return sentinelRef;
};

export default useInfiniteScroll;
