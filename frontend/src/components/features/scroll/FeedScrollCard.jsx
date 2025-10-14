import React from 'react';
import ScrollCard from './ScrollCard';

const FeedScrollCard = ({ scroll, compact = false }) => {
    return (
        <ScrollCard
            scroll={scroll}
            compact={compact}
            showIcon={false}
            showTags={true}
        />
    );
};

export default FeedScrollCard;