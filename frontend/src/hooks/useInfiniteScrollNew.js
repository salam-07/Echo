import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for infinite scrolling with pagination
 * @param {Function} fetchFunction - Function to fetch data (page, limit) => Promise<{items, hasMore}>
 * @param {Object} options - Configuration options
 * @param {number} options.limit - Items per page (default: 10)
 * @param {number} options.threshold - Pixels from bottom to trigger load (default: 100)
 * @param {Array} options.dependencies - Dependencies to reset pagination (default: [])
 * @returns {Object} { items, loading, hasMore, loadMore, reset, error }
 */
export const useInfiniteScroll = (fetchFunction, options = {}) => {
    const {
        limit = 10,
        threshold = 100,
        dependencies = [],
        enabled = true
    } = options;

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);

    // Refs to avoid stale closures
    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const loadingRef = useRef(false);

    // Update refs when state changes
    useEffect(() => {
        pageRef.current = page;
    }, [page]);

    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    // Load more function
    const loadMore = async (isReset = false) => {
        if (!enabled || (!hasMoreRef.current && !isReset) || loadingRef.current) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const currentPage = isReset ? 1 : pageRef.current;
            const result = await fetchFunction(currentPage, limit);

            const newItems = result.items || result.echos || [];
            const hasMoreItems = result.hasMore ?? (newItems.length === limit);

            if (isReset) {
                setItems(newItems);
                setPage(2);
                pageRef.current = 2;
            } else {
                setItems(prev => [...prev, ...newItems]);
                setPage(prev => prev + 1);
                pageRef.current = pageRef.current + 1;
            }

            setHasMore(hasMoreItems);
            hasMoreRef.current = hasMoreItems;
            setInitialLoad(false);
        } catch (err) {
            console.error('Error loading more items:', err);
            setError(err);
            setHasMore(false);
            hasMoreRef.current = false;
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    };

    // Reset function
    const reset = () => {
        setItems([]);
        setPage(1);
        setHasMore(true);
        setError(null);
        setInitialLoad(true);
        pageRef.current = 1;
        hasMoreRef.current = true;
        loadingRef.current = false;
    };

    // Initial load and dependency changes
    useEffect(() => {
        if (enabled) {
            reset();
            // Initial load
            setTimeout(() => {
                loadMore(true);
            }, 0);
        }
    }, [enabled, ...dependencies]);

    // Scroll event listener
    useEffect(() => {
        if (!enabled) return;

        const handleScroll = () => {
            if (!hasMoreRef.current || loadingRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

            if (scrollTop + clientHeight >= scrollHeight - threshold) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [enabled, threshold]);

    return {
        items,
        loading,
        hasMore,
        loadMore,
        reset,
        error,
        initialLoad
    };
};

export default useInfiniteScroll;