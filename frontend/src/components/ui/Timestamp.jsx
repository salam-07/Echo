import React from 'react';

// Reusable date formatter utility
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
};

// Reusable timestamp component
const Timestamp = ({ date, className = 'text-xs text-base-content/50' }) => {
    return (
        <time className={className}>
            {formatDate(date)}
        </time>
    );
};

export default Timestamp;