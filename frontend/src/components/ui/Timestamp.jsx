import React from 'react';

/** The relative age of a record, short enough to sit inside a line of apparatus. */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * A date, printed as apparatus. Tabular figures so a column of rows does not
 * ripple, and the full date is on the element itself — the abbreviation is for
 * scanning, not a replacement for the fact.
 */
const Timestamp = ({ date, className = 't-readout text-rule-strong' }) => {
    if (!date) return null;
    const full = new Date(date).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });

    return (
        <time dateTime={new Date(date).toISOString()} title={full} className={className}>
            {formatDate(date)}
        </time>
    );
};

export default Timestamp;
