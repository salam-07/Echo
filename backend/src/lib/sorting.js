/**
 * Reusable sorting utilities for Echo app
 */

/**
 * Get date range based on timeframe
 * @param {string} timeframe - '1hour', '1day', '1week', '1month', '1year', or 'custom'
 * @param {Date} startDate - custom start date (optional)
 * @param {Date} endDate - custom end date (optional)
 * @returns {Object} - { startDate, endDate } or null for no date filtering
 */
export const getDateRange = (timeframe, startDate = null, endDate = null) => {
    if (timeframe === 'all') return null;

    const now = new Date();
    let start;

    switch (timeframe) {
        case '1hour':
            start = new Date(now.getTime() - (60 * 60 * 1000));
            break;
        case '1day':
            start = new Date(now.getTime() - (24 * 60 * 60 * 1000));
            break;
        case '1week':
            start = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            break;
        case '1month':
            start = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
            break;
        case '1year':
            start = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
            break;
        case 'custom':
            if (startDate && endDate) {
                return { startDate: new Date(startDate), endDate: new Date(endDate) };
            }
            return null;
        default:
            return null;
    }

    return { startDate: start, endDate: now };
};

/**
 * Get MongoDB sort object based on ordering preference
 * @param {string} orderBy - 'newest', 'oldest', or 'likes'
 * @returns {Object} - MongoDB sort object
 */
export const getSortObject = (orderBy) => {
    switch (orderBy) {
        case 'newest':
            return { createdAt: -1 };
        case 'oldest':
            return { createdAt: 1 };
        case 'likes':
            return { likedBy: -1, createdAt: -1 }; // sort by like count desc, then newest
        default:
            return { createdAt: -1 }; // default to newest
    }
};

/**
 * Build MongoDB query with date filtering
 * @param {Object} baseQuery - base query object
 * @param {string} timeframe - timeframe string
 * @param {Date} startDate - custom start date
 * @param {Date} endDate - custom end date
 * @returns {Object} - enhanced query object
 */
export const buildQueryWithTimeframe = (baseQuery, timeframe, startDate = null, endDate = null) => {
    const dateRange = getDateRange(timeframe, startDate, endDate);

    if (!dateRange) {
        return baseQuery;
    }

    return {
        ...baseQuery,
        createdAt: {
            $gte: dateRange.startDate,
            $lte: dateRange.endDate
        }
    };
};

/**
 * Complete sorting pipeline for echoes
 * @param {Object} baseQuery - base MongoDB query
 * @param {string} orderBy - 'newest', 'oldest', 'likes'
 * @param {string} timeframe - timeframe filter
 * @param {Date} startDate - custom start date
 * @param {Date} endDate - custom end date
 * @returns {Object} - { query, sort }
 */
export const getEchoSortingOptions = (baseQuery, orderBy = 'newest', timeframe = 'all', startDate = null, endDate = null) => {
    const query = buildQueryWithTimeframe(baseQuery, timeframe, startDate, endDate);
    const sort = getSortObject(orderBy);

    return { query, sort };
};